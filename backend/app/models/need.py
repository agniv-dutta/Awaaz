import uuid
import enum
from sqlalchemy import String, Text, Float, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import BaseModel

class NeedCategory(str, enum.Enum):
    FOOD = "FOOD"
    MEDICAL = "MEDICAL"
    SHELTER = "SHELTER"
    EDUCATION = "EDUCATION"
    LEGAL = "LEGAL"
    MENTAL_HEALTH = "MENTAL_HEALTH"
    ELDERLY_CARE = "ELDERLY_CARE"
    DISABILITY = "DISABILITY"
    OTHER = "OTHER"

class NeedUrgency(str, enum.Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class NeedStatus(str, enum.Enum):
    OPEN = "OPEN"
    ASSIGNED = "ASSIGNED"
    FULFILLED = "FULFILLED"
    CLOSED = "CLOSED"

class Need(BaseModel):
    __tablename__ = "needs"
    
    category: Mapped[NeedCategory] = mapped_column()
    urgency: Mapped[NeedUrgency] = mapped_column()
    urgency_score: Mapped[float] = mapped_column(Float)
    report_count: Mapped[int] = mapped_column(Integer, default=1)
    description: Mapped[str] = mapped_column(Text)
    ward_id: Mapped[str] = mapped_column(ForeignKey("wards.id"))
    location_lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    location_lng: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[NeedStatus] = mapped_column(default=NeedStatus.OPEN)
