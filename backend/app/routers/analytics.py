import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.analytics import AnalyticsSummary, HeatmapPoint
from app.services.analytics import get_analytics_summary, get_heatmap_data

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary", response_model=AnalyticsSummary)
async def summary(ward_id: uuid.UUID | None = None, db: AsyncSession = Depends(get_db)):
    return await get_analytics_summary(db, ward_id)

@router.get("/heatmap", response_model=list[HeatmapPoint])
async def heatmap(ward_id: uuid.UUID | None = None, db: AsyncSession = Depends(get_db)):
    return await get_heatmap_data(db, ward_id)
