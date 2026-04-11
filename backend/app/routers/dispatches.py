import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.dispatch import DispatchRespond, DispatchResponse
from app.services.dispatch import respond_to_dispatch

router = APIRouter(prefix="/dispatches", tags=["Dispatches"])

@router.post("/{dispatch_id}/respond", response_model=DispatchResponse)
async def respond_dispatch(dispatch_id: uuid.UUID, response: DispatchRespond, db: AsyncSession = Depends(get_db)):
    dispatch = await respond_to_dispatch(db, dispatch_id, response)
    if not dispatch:
        raise HTTPException(status_code=400, detail="Invalid dispatch or already responded")
    return dispatch
