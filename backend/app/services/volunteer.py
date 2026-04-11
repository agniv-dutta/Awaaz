import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.volunteer import Volunteer
from app.schemas.volunteer import VolunteerCreate

async def create_volunteer(db: AsyncSession, volunteer_in: VolunteerCreate, user_id: uuid.UUID) -> Volunteer:
    db_volunteer = Volunteer(
        user_id=user_id,
        skills=[skill.value for skill in volunteer_in.skills],
        languages=volunteer_in.languages,
        availability_schedule=volunteer_in.availability_schedule,
        max_radius_km=volunteer_in.max_radius_km,
        home_ward_id=volunteer_in.home_ward_id
    )
    db.add(db_volunteer)
    await db.commit()
    await db.refresh(db_volunteer)
    return db_volunteer

async def get_volunteer(db: AsyncSession, volunteer_id: uuid.UUID) -> Volunteer | None:
    result = await db.execute(select(Volunteer).filter(Volunteer.id == volunteer_id))
    return result.scalars().first()

async def get_volunteer_by_user_id(db: AsyncSession, user_id: uuid.UUID) -> Volunteer | None:
    result = await db.execute(select(Volunteer).filter(Volunteer.user_id == user_id))
    return result.scalars().first()

async def update_volunteer_location(db: AsyncSession, volunteer_id: uuid.UUID, lat: float, lng: float) -> Volunteer | None:
    volunteer = await get_volunteer(db, volunteer_id)
    if volunteer:
        volunteer.current_lat = lat
        volunteer.current_lng = lng
        await db.commit()
        await db.refresh(volunteer)
    return volunteer
