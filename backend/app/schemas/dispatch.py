import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.dispatch import DispatchStatus

class DispatchBase(BaseModel):
    need_id: uuid.UUID
    volunteer_id: uuid.UUID

class DispatchResponse(DispatchBase):
    id: uuid.UUID
    match_score: float
    status: DispatchStatus
    volunteer_notes: str | None = None
    notified_at: datetime
    responded_at: datetime | None = None
    completed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DispatchRespond(BaseModel):
    action: str # "accept" or "decline"
    notes: str | None = None
