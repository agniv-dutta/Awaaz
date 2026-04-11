import uuid
import enum
from datetime import datetime
from sqlalchemy import Float, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from .base import BaseModel

class DispatchStatus(str, enum.Enum):
    PENDING_ACCEPT = "PENDING_ACCEPT"
    ACCEPTED = "ACCEPTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    DECLINED = "DECLINED"

class Dispatch(BaseModel):
    __tablename__ = "dispatches"
    
    need_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("needs.id"))
    volunteer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("volunteers.id"))
    match_score: Mapped[float] = mapped_column(Float)
    status: Mapped[DispatchStatus] = mapped_column(default=DispatchStatus.PENDING_ACCEPT)
    volunteer_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    notified_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    responded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
