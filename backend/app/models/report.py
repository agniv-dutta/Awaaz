import uuid
import enum
from sqlalchemy import String, Text, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column
from .base import BaseModel

class ReportSource(str, enum.Enum):
    PAPER_SURVEY = "PAPER_SURVEY"
    FIELD_REPORT = "FIELD_REPORT"
    WHATSAPP = "WHATSAPP"
    DIRECT_ENTRY = "DIRECT_ENTRY"
    OCR_UPLOAD = "OCR_UPLOAD"

class ReportStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSED = "PROCESSED"
    FLAGGED = "FLAGGED"

class Report(BaseModel):
    __tablename__ = "reports"
    
    source: Mapped[ReportSource] = mapped_column()
    raw_text: Mapped[str] = mapped_column(Text)
    parsed_needs: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    ward_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("wards.id"))
    submitted_by: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    status: Mapped[ReportStatus] = mapped_column(default=ReportStatus.PENDING)
    attachments: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
