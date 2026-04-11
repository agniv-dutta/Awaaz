import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.volunteer import VolunteerCreate, VolunteerResponse, VolunteerUpdateLocation
from app.services.volunteer import create_volunteer, get_volunteer_by_user_id, update_volunteer_location

router = APIRouter(prefix="/volunteers", tags=["Volunteers"])

@router.post("/", response_model=VolunteerResponse)
async def register_volunteer(volunteer_in: VolunteerCreate, db: AsyncSession = Depends(get_db)):
    # Assuming authenticated user
    dummy_user_id = uuid.uuid4()
    return await create_volunteer(db, volunteer_in, dummy_user_id)

@router.put("/location", response_model=VolunteerResponse)
async def update_location(loc: VolunteerUpdateLocation, db: AsyncSession = Depends(get_db)):
    dummy_user_id = uuid.uuid4()
    volunteer = await get_volunteer_by_user_id(db, dummy_user_id)
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer profile not found")
    
    updated = await update_volunteer_location(db, volunteer.id, loc.lat, loc.lng)
    return updated
