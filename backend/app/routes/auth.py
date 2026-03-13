from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from app.models.user_model import UserRegister, UserLogin
from app.database import user_collection
from app.utils.auth_utils import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/register")
async def register(user: UserRegister):
    ex_user = user_collection.find_one({"email": user.email})
    if ex_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    h_pwd = hash_password(user.password)
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": h_pwd,
        "created_at": datetime.now(timezone.utc)
    }
    user_collection.insert_one(new_user)
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(user: UserLogin):
    db_user = user_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    pass_check = verify_password(user.password, db_user["password"])
    if not pass_check:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    token = create_access_token({"user_id": str(db_user["_id"])})
    return {"access_token": token, "token_type": "bearer"}