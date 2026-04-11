from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.schemas.auth import UserCreate, UserResponse, Token
from app.services.auth import create_user, get_user_by_email

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(db, user_in.email)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return await create_user(db, user_in)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "refresh_token": "dummy", "token_type": "bearer"}
