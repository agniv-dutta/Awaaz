from sqlalchemy import String, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column
from .base import BaseModel

class Ward(BaseModel):
    __tablename__ = "wards"
    
    name: Mapped[str] = mapped_column(String)
    district: Mapped[str] = mapped_column(String)
    state: Mapped[str] = mapped_column(String)
    polygon: Mapped[dict] = mapped_column(JSON)
    population: Mapped[int] = mapped_column(Integer)
