import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.need import NeedCreate, NeedResponse
from app.services.need import create_need, get_needs

router = APIRouter(prefix="/needs", tags=["Needs"])

@router.post("/", response_model=NeedResponse)
async def add_need(need_in: NeedCreate, db: AsyncSession = Depends(get_db)):
    return await create_need(db, need_in)

@router.get("/", response_model=list[NeedResponse])
async def list_needs(ward_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await get_needs(db, ward_id, skip, limit)
