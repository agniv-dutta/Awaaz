from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.schemas.auth import UserCreate, UserResponse, Token
from app.services.auth import create_user, get_user_by_email, get_user_by_id
from app.dependencies import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=dict)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    logger.info("REGISTER ATTEMPT: %s", user_in.email)
    user = await get_user_by_email(db, user_in.email)
    if user:
        logger.warning("EMAIL ALREADY REGISTERED: %s", user_in.email)
        raise HTTPException(status_code=400, detail="Email already registered")
    
    created_user = await create_user(db, user_in)
    logger.info("USER CREATED SUCCESSFULLY: %s", created_user.email)
    
    access_token = create_access_token(data={"sub": str(created_user.id)})
    logger.info("TOKEN GENERATED FOR USER: %s", created_user.email)
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": str(created_user.id),
            "email": created_user.email,
            "name": created_user.name,
            "role": created_user.role.value,
            "phone": created_user.phone,
            "is_active": created_user.is_active,
            "ward_id": str(created_user.ward_id) if created_user.ward_id else None
        }
    }

@router.post("/login", response_model=dict)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    logger.info("LOGIN ATTEMPT: %s", form_data.username)
    user = await get_user_by_email(db, form_data.username)
    logger.info("USER FOUND: %s", user is not None)
    
    if not user:
        logger.warning("USER NOT FOUND: %s", form_data.username)
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    password_valid = verify_password(form_data.password, user.hashed_password)
    logger.info("PASSWORD VALID: %s", password_valid)
    
    if not password_valid:
        logger.warning("INVALID PASSWORD FOR USER: %s", form_data.username)
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": str(user.id)})
    logger.info("TOKEN GENERATED FOR USER: %s", user.email)
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "role": user.role.value,
            "phone": user.phone,
            "is_active": user.is_active,
            "ward_id": str(user.ward_id) if user.ward_id else None
        }
    }

@router.get("/me", response_model=dict)
async def get_current_user_info(current_user = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "name": current_user.name,
        "role": current_user.role.value,
        "phone": current_user.phone,
        "is_active": current_user.is_active,
        "ward_id": str(current_user.ward_id) if current_user.ward_id else None
    }
