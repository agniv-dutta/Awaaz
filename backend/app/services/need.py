import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.need import Need
from app.schemas.need import NeedCreate

def compute_urgency_score(urgency: str) -> float:
    # Basic mapping, should ideally be something more robust
    mapping = {
        "CRITICAL": 100.0,
        "HIGH": 75.0,
        "MEDIUM": 50.0,
        "LOW": 25.0
    }
    return mapping.get(urgency, 10.0)

async def create_need(db: AsyncSession, need_in: NeedCreate) -> Need:
    score = compute_urgency_score(need_in.urgency.value)
    
    db_need = Need(
        category=need_in.category,
        urgency=need_in.urgency,
        urgency_score=score,
        description=need_in.description,
        ward_id=str(need_in.ward_id),
        location_lat=need_in.location_lat,
        location_lng=need_in.location_lng,
    )
    db.add(db_need)
    await db.commit()
    await db.refresh(db_need)
    return db_need

async def get_need(db: AsyncSession, need_id: uuid.UUID) -> Need | None:
    result = await db.execute(select(Need).filter(Need.id == str(need_id)))
    return result.scalars().first()

async def get_needs(db: AsyncSession, ward_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> list[Need]:
    query = select(Need).order_by(Need.urgency_score.desc()).offset(skip).limit(limit)
    if ward_id:
        query = query.filter(Need.ward_id == str(ward_id))
    result = await db.execute(query)
    return list(result.scalars().all())
