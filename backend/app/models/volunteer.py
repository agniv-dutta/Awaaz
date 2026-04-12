import uuid
import enum
from sqlalchemy import Float, Boolean, Integer, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import BaseModel

class SkillEnum(str, enum.Enum):
    MEDICAL = "MEDICAL"
    LEGAL = "LEGAL"
    TEACHING = "TEACHING"
    COOKING = "COOKING"
    LOGISTICS = "LOGISTICS"
    TRANSLATION = "TRANSLATION"
    COUNSELING = "COUNSELING"
    TECH = "TECH"

class Volunteer(BaseModel):
    __tablename__ = "volunteers"
    
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), unique=True)
    skills: Mapped[list[str]] = mapped_column(JSON)
    languages: Mapped[list[str]] = mapped_column(JSON)
    availability_schedule: Mapped[dict] = mapped_column(JSON)
    current_lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    current_lng: Mapped[float | None] = mapped_column(Float, nullable=True)
    max_radius_km: Mapped[float] = mapped_column(Float, default=5.0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    completed_tasks: Mapped[int] = mapped_column(Integer, default=0)
    reliability_score: Mapped[float] = mapped_column(Float, default=1.0)
    home_ward_id: Mapped[str] = mapped_column(ForeignKey("wards.id"))
