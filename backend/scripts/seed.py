import asyncio
import uuid
import random
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.models.ward import Ward
from app.services.auth import create_user
from app.schemas.auth import UserCreate
from app.models.user import RoleEnum

async def seed_db():
    async with AsyncSessionLocal() as session:
        print("Seeding Wards...")
        ward1_id = uuid.uuid4()
        ward2_id = uuid.uuid4()
        session.add_all([
            Ward(id=ward1_id, name="Ward 1", polygon_wkt="POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))"),
            Ward(id=ward2_id, name="Ward 2", polygon_wkt="POLYGON((1 1, 1 2, 2 2, 2 1, 1 1))"),
        ])
        await session.commit()
        
        print("Seeding Users...")
        admin = UserCreate(email="admin@awaaz.local", name="Admin", phone="111", role=RoleEnum.admin, password="password", ward_id=ward1_id)
        await create_user(session, admin)
        
        vol1 = UserCreate(email="vol1@awaaz.local", name="Vol 1", phone="222", role=RoleEnum.volunteer, password="password", ward_id=ward1_id)
        await create_user(session, vol1)
        
        print("Seeding complete.")

if __name__ == "__main__":
    asyncio.run(seed_db())
