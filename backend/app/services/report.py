import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.report import Report
from app.schemas.report import ReportCreate

async def create_report(db: AsyncSession, report_in: ReportCreate, user_id: uuid.UUID) -> Report:
    db_report = Report(
        source=report_in.source,
        raw_text=report_in.raw_text,
        ward_id=report_in.ward_id,
        submitted_by=user_id,
    )
    db.add(db_report)
    await db.commit()
    await db.refresh(db_report)
    return db_report

async def get_report(db: AsyncSession, report_id: uuid.UUID) -> Report | None:
    result = await db.execute(select(Report).filter(Report.id == report_id))
    return result.scalars().first()

async def get_reports(db: AsyncSession, ward_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> list[Report]:
    query = select(Report).offset(skip).limit(limit)
    if ward_id:
        query = query.filter(Report.ward_id == ward_id)
    result = await db.execute(query)
    return list(result.scalars().all())
