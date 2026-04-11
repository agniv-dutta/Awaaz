import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.volunteer import SkillEnum

class VolunteerBase(BaseModel):
    languages: list[str]
    availability_schedule: dict
    max_radius_km: float = 5.0
    home_ward_id: uuid.UUID

class VolunteerCreate(VolunteerBase):
    skills: list[SkillEnum]

class VolunteerUpdateLocation(BaseModel):
    lat: float
    lng: float

class VolunteerResponse(VolunteerBase):
    id: uuid.UUID
    user_id: uuid.UUID
    skills: list[SkillEnum]
    current_lat: float | None = None
    current_lng: float | None = None
    is_active: bool
    completed_tasks: int
    reliability_score: float
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
