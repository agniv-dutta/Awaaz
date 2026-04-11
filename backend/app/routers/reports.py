import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.report import ReportCreate, ReportResponse
from app.services.report import create_report, get_report, get_reports
from app.tasks.tasks import process_report

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/", response_model=ReportResponse)
async def submit_report(report_in: ReportCreate, db: AsyncSession = Depends(get_db)):
    # Assuming user is authenticated and we have their ID. Stubbing for now.
    dummy_user_id = uuid.uuid4() 
    report = await create_report(db, report_in, dummy_user_id)
    # Trigger background task
    process_report.delay(str(report.id))
    return report

@router.get("/{report_id}", response_model=ReportResponse)
async def get_report_by_id(report_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    report = await get_report(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.get("/", response_model=list[ReportResponse])
async def list_reports(ward_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await get_reports(db, ward_id, skip, limit)
