import uuid
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.dispatch import Dispatch, DispatchStatus
from app.schemas.dispatch import DispatchRespond

async def create_dispatch(db: AsyncSession, need_id: uuid.UUID, volunteer_id: uuid.UUID, match_score: float) -> Dispatch:
    db_dispatch = Dispatch(
        need_id=str(need_id),
        volunteer_id=str(volunteer_id),
        match_score=match_score,
        notified_at=datetime.now(timezone.utc)
    )
    db.add(db_dispatch)
    await db.commit()
    await db.refresh(db_dispatch)
    return db_dispatch

async def get_dispatch(db: AsyncSession, dispatch_id: uuid.UUID) -> Dispatch | None:
    result = await db.execute(select(Dispatch).filter(Dispatch.id == str(dispatch_id)))
    return result.scalars().first()

async def respond_to_dispatch(db: AsyncSession, dispatch_id: uuid.UUID, response: DispatchRespond) -> Dispatch | None:
    dispatch = await get_dispatch(db, dispatch_id)
    if dispatch and dispatch.status == DispatchStatus.PENDING_ACCEPT:
        dispatch.responded_at = datetime.now(timezone.utc)
        if response.action.lower() == "accept":
            dispatch.status = DispatchStatus.ACCEPTED
        else:
            dispatch.status = DispatchStatus.DECLINED
        dispatch.volunteer_notes = response.notes
        await db.commit()
        await db.refresh(dispatch)
    return dispatch
