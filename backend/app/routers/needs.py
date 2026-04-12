import uuid
from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.need import NeedCreate, NeedResponse
from app.services.need import create_need, get_needs
from app.services.background_tasks import create_dispatches_for_need

router = APIRouter(prefix="/needs", tags=["Needs"])

@router.post("/", response_model=NeedResponse)
async def add_need(need_in: NeedCreate, db: AsyncSession = Depends(get_db)):
    return await create_need(db, need_in)


@router.post("/{need_id}/dispatch")
async def dispatch_need(need_id: uuid.UUID, background_tasks: BackgroundTasks):
    background_tasks.add_task(create_dispatches_for_need, str(need_id))
    return {"detail": "Dispatch creation scheduled"}

@router.get("/", response_model=list[NeedResponse])
async def list_needs(ward_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await get_needs(db, ward_id, skip, limit)
