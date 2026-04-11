import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.need import NeedCategory, NeedUrgency, NeedStatus

class NeedBase(BaseModel):
    category: NeedCategory
    description: str
    ward_id: uuid.UUID
    location_lat: float | None = None
    location_lng: float | None = None

class NeedCreate(NeedBase):
    urgency: NeedUrgency

class NeedResponse(NeedBase):
    id: uuid.UUID
    urgency: NeedUrgency
    urgency_score: float
    report_count: int
    status: NeedStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
