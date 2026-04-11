import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Mapped, mapped_column, declared_attr
from sqlalchemy import DateTime
from app.core.database import Base
from sqlalchemy.dialects.postgresql import UUID

class BaseModel(Base):
    __abstract__ = True
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
