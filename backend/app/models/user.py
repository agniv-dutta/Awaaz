import uuid
import enum
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import BaseModel

class RoleEnum(str, enum.Enum):
    admin = "admin"
    ngo_coordinator = "ngo_coordinator"
    volunteer = "volunteer"
    field_worker = "field_worker"

class User(BaseModel):
    __tablename__ = "users"
    
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    name: Mapped[str] = mapped_column(String)
    phone: Mapped[str] = mapped_column(String)
    role: Mapped[RoleEnum] = mapped_column()
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    ward_id: Mapped[str | None] = mapped_column(ForeignKey("wards.id"), nullable=True)
