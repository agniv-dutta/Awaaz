import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.report import ReportSource, ReportStatus

class ReportBase(BaseModel):
    source: ReportSource
    raw_text: str
    ward_id: uuid.UUID

class ReportCreate(ReportBase):
    pass

class ReportResponse(ReportBase):
    id: uuid.UUID
    submitted_by: uuid.UUID
    status: ReportStatus
    parsed_needs: dict | None = None
    attachments: list[str] | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
