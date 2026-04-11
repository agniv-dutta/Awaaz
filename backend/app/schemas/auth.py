import uuid
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.user import RoleEnum

class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone: str
    role: RoleEnum
    ward_id: uuid.UUID | None = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: uuid.UUID
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: str | None = None
    exp: int | None = None
