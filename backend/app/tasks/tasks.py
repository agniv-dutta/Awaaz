import asyncio
import uuid
from datetime import datetime, timezone, timedelta
from celery.utils.log import get_task_logger
from app.core.celery_app import celery_app
from app.core.database import AsyncSessionLocal
from app.models.report import Report, ReportStatus
from app.models.need import Need, NeedStatus
from app.models.dispatch import Dispatch, DispatchStatus
from app.models.volunteer import Volunteer
from sqlalchemy import select

logger = get_task_logger(__name__)

async def _process_report_async(report_id: str):
    async with AsyncSessionLocal() as session:
        try:
            report_uuid = uuid.UUID(report_id)
            report = (await session.execute(select(Report).filter(Report.id == report_uuid))).scalars().first()
            if report and report.status == ReportStatus.PENDING:
                # Stub Keyword extraction
                report.parsed_needs = {"extracted": ["medical", "food"]}
                report.status = ReportStatus.PROCESSED
                await session.commit()
                logger.info(f"Processed report {report_id}")
        except Exception as e:
            logger.error(f"Error processing report {report_id}: {e}")

@celery_app.task(name="report_processor")
def process_report(report_id: str):
    asyncio.run(_process_report_async(report_id))

async def _aggregate_needs_async():
    async with AsyncSessionLocal() as session:
        logger.info("Running need aggregator stub")
        # In actual implementation: use PostGIS ST_DWithin to group reports within 500m
        # and create/update a Need object based on groups of Reports.
        pass

@celery_app.task(name="need_aggregator")
def run_need_aggregator():
    asyncio.run(_aggregate_needs_async())

async def _dispatch_reminder_async():
    async with AsyncSessionLocal() as session:
        logger.info("Running dispatch reminder")
        five_mins_ago = datetime.now(timezone.utc) - timedelta(minutes=5)
        # Assuming we would decline dispatches that have been pending for over 5 minutes
        query = select(Dispatch).filter(
            Dispatch.status == DispatchStatus.PENDING_ACCEPT,
            Dispatch.notified_at <= five_mins_ago
        )
        stale_dispatches = (await session.execute(query)).scalars().all()
        for d in stale_dispatches:
            d.status = DispatchStatus.DECLINED
            d.volunteer_notes = "System auto-declined due to timeout"
        if stale_dispatches:
            await session.commit()
            logger.info(f"Auto-declined {len(stale_dispatches)} stale dispatches")

@celery_app.task(name="dispatch_reminder")
def run_dispatch_reminder():
    asyncio.run(_dispatch_reminder_async())

async def _reliability_updater_async():
    async with AsyncSessionLocal() as session:
        logger.info("Running reliability updater")
        # Simple score calculation: adjust based on decline rate vs completion rate
        vols = (await session.execute(select(Volunteer).filter(Volunteer.is_active == True))).scalars().all()
        for vol in vols:
            # Example: completed tasks vs total assignments
            dispatches = (await session.execute(
                select(Dispatch).filter(Dispatch.volunteer_id == vol.id)
            )).scalars().all()
            
            if not dispatches:
                continue
                
            completed = sum(1 for d in dispatches if d.status == DispatchStatus.COMPLETED)
            total = len(dispatches)
            
            # Simple reliability mapping (0.0 to 1.0)
            score = max(0.1, min(1.0, completed / total)) 
            vol.reliability_score = score
            
        await session.commit()

@celery_app.task(name="reliability_updater")
def run_reliability_updater():
    asyncio.run(_reliability_updater_async())
