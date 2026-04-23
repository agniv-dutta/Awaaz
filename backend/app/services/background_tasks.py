import uuid
from datetime import datetime, timedelta, timezone
import logging

from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.models.dispatch import Dispatch, DispatchStatus
from app.models.need import Need, NeedStatus, NeedCategory, NeedUrgency
from app.models.report import Report, ReportStatus
from app.models.volunteer import Volunteer
from app.services.matcher import get_top_matches
from app.services.ocr_service import extract_needs_with_groq

logger = logging.getLogger(__name__)


async def report_processor(report_id: str) -> None:
    async with AsyncSessionLocal() as session:
        try:
            report_uuid = uuid.UUID(report_id)
            report = (await session.execute(select(Report).filter(Report.id == str(report_uuid)))).scalars().first()
            if report and report.status == ReportStatus.PENDING:
                parsed = await extract_needs_with_groq(report.raw_text or "")
                report.parsed_needs = parsed

                category_raw = str(parsed.get("category", "OTHER")).upper()
                urgency_raw = str(parsed.get("urgency", "MEDIUM")).upper()
                summary = str(parsed.get("summary", report.raw_text or "Parsed from OCR"))

                valid_categories = {item.value for item in NeedCategory}
                valid_urgencies = {item.value for item in NeedUrgency}

                category = NeedCategory(category_raw if category_raw in valid_categories else "OTHER")
                urgency = NeedUrgency(urgency_raw if urgency_raw in valid_urgencies else "MEDIUM")

                urgency_scores = {
                    NeedUrgency.CRITICAL: 100.0,
                    NeedUrgency.HIGH: 75.0,
                    NeedUrgency.MEDIUM: 50.0,
                    NeedUrgency.LOW: 25.0,
                }

                need = Need(
                    category=category,
                    urgency=urgency,
                    urgency_score=urgency_scores[urgency],
                    report_count=1,
                    description=summary,
                    ward_id=report.ward_id,
                    status=NeedStatus.OPEN,
                )
                session.add(need)
                report.status = ReportStatus.PROCESSED
                await session.commit()
                logger.info("Processed report %s", report_id)
        except Exception:
            logger.exception("Error processing report %s", report_id)


async def create_dispatches_for_need(need_id: str) -> None:
    async with AsyncSessionLocal() as session:
        try:
            matches = await get_top_matches(session, uuid.UUID(need_id))
            if not matches:
                logger.info("No volunteer matches found for need %s", need_id)
                return

            for volunteer, score in matches:
                dispatch = Dispatch(
                    need_id=need_id,
                    volunteer_id=volunteer.id,
                    match_score=score,
                    status=DispatchStatus.PENDING_ACCEPT,
                    notified_at=datetime.now(timezone.utc),
                )
                session.add(dispatch)

            await session.commit()
            logger.info("Created %s dispatches for need %s", len(matches), need_id)
        except Exception:
            logger.exception("Error creating dispatches for need %s", need_id)


async def need_aggregator() -> None:
    async with AsyncSessionLocal() as session:
        try:
            logger.info("Running need aggregator stub")
            open_needs = (await session.execute(select(Need).filter(Need.status == NeedStatus.OPEN))).scalars().all()
            if open_needs:
                logger.info("Found %s open needs for aggregation", len(open_needs))
        except Exception:
            logger.exception("Error in need aggregator")


async def dispatch_reminder() -> None:
    async with AsyncSessionLocal() as session:
        try:
            stale_cutoff = datetime.now(timezone.utc) - timedelta(minutes=5)
            query = select(Dispatch).filter(
                Dispatch.status == DispatchStatus.PENDING_ACCEPT,
                Dispatch.notified_at <= stale_cutoff,
            )
            stale_dispatches = (await session.execute(query)).scalars().all()
            for dispatch in stale_dispatches:
                dispatch.status = DispatchStatus.DECLINED
                dispatch.volunteer_notes = "System auto-declined due to timeout"
            if stale_dispatches:
                await session.commit()
                logger.info("Auto-declined %s stale dispatches", len(stale_dispatches))
        except Exception:
            logger.exception("Error running dispatch reminder")


async def reliability_updater() -> None:
    async with AsyncSessionLocal() as session:
        try:
            volunteers = (await session.execute(select(Volunteer).filter(Volunteer.is_active == True))).scalars().all()
            for volunteer in volunteers:
                dispatches = (await session.execute(select(Dispatch).filter(Dispatch.volunteer_id == volunteer.id))).scalars().all()
                if not dispatches:
                    continue

                completed = sum(1 for dispatch in dispatches if dispatch.status == DispatchStatus.COMPLETED)
                total = len(dispatches)
                volunteer.reliability_score = max(0.1, min(1.0, completed / total))

            await session.commit()
            logger.info("Updated reliability scores for %s volunteers", len(volunteers))
        except Exception:
            logger.exception("Error updating reliability scores")