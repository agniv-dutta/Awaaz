import asyncio
import uuid
import sys
from pathlib import Path

from sqlalchemy import select

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.database import AsyncSessionLocal
from app.models.need import NeedCategory, NeedUrgency
from app.models.report import ReportSource
from app.models.user import RoleEnum
from app.models.volunteer import SkillEnum
from app.models.ward import Ward
from app.schemas.auth import UserCreate
from app.schemas.need import NeedCreate
from app.schemas.report import ReportCreate
from app.schemas.volunteer import VolunteerCreate
from app.services.auth import create_user
from app.services.dispatch import create_dispatch
from app.services.need import create_need
from app.services.report import create_report
from app.services.volunteer import create_volunteer


async def seed_db() -> None:
    async with AsyncSessionLocal() as session:
        existing_ward = await session.execute(select(Ward).limit(1))
        if existing_ward.scalar_one_or_none():
            print("Database already seeded.")
            return

        print("Seeding wards...")
        ward1 = Ward(
            name="Ward 1",
            district="Central",
            state="State A",
            polygon={"type": "Polygon", "coordinates": [[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]]},
            population=10000,
        )
        ward2 = Ward(
            name="Ward 2",
            district="North",
            state="State A",
            polygon={"type": "Polygon", "coordinates": [[[1, 1], [1, 2], [2, 2], [2, 1], [1, 1]]]},
            population=8500,
        )
        session.add_all([ward1, ward2])
        await session.commit()
        await session.refresh(ward1)
        await session.refresh(ward2)

        print("Seeding users...")
        # Demo accounts for Awaaz
        coordinator = await create_user(
            session,
            UserCreate(
                email="coordinator@awaaz.dev",
                name="NGO Coordinator",
                phone="9876543210",
                role=RoleEnum.ngo_coordinator,
                password="awaaz123",
                ward_id=uuid.UUID(ward1.id),
            ),
        )
        volunteer_user = await create_user(
            session,
            UserCreate(
                email="volunteer@awaaz.dev",
                name="Field Volunteer",
                phone="9876543211",
                role=RoleEnum.volunteer,
                password="awaaz123",
                ward_id=uuid.UUID(ward1.id),
            ),
        )
        admin = await create_user(
            session,
            UserCreate(
                email="admin@awaaz.dev",
                name="System Admin",
                phone="9876543212",
                role=RoleEnum.admin,
                password="awaaz123",
                ward_id=uuid.UUID(ward1.id),
            ),
        )

        print("Seeding volunteer profile...")
        volunteer = await create_volunteer(
            session,
            VolunteerCreate(
                languages=["Hindi", "English"],
                availability_schedule={"mon": ["09:00-17:00"], "tue": ["09:00-17:00"]},
                max_radius_km=5.0,
                home_ward_id=uuid.UUID(ward1.id),
                skills=[SkillEnum.MEDICAL, SkillEnum.LOGISTICS],
            ),
            uuid.UUID(volunteer_user.id),
        )

        print("Seeding report, need, and dispatch...")
        report = await create_report(
            session,
            ReportCreate(
                source=ReportSource.DIRECT_ENTRY,
                raw_text="Need medical supplies and food support",
                ward_id=uuid.UUID(ward1.id),
            ),
            uuid.UUID(admin.id),
        )
        need = await create_need(
            session,
            NeedCreate(
                category=NeedCategory.MEDICAL,
                description="Urgent medical supplies required",
                ward_id=uuid.UUID(ward1.id),
                location_lat=0.5,
                location_lng=0.5,
                urgency=NeedUrgency.HIGH,
            ),
        )
        await create_dispatch(session, uuid.UUID(need.id), uuid.UUID(volunteer.id), 0.92)

        print(f"Seeding complete. Report={report.id}, Need={need.id}")


if __name__ == "__main__":
    asyncio.run(seed_db())
