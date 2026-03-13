import os
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from app.models.user_model import UserRegister, UserLogin
from app.database import user_collection
from app.utils.auth_utils import hash_password, verify_password, create_access_token
from google.oauth2 import id_token
from google.auth.transport import requests

router = APIRouter()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

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
        "role": "user",
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

@router.post("/google-login")
async def google_login(data: dict):
    token = data.get("token")
    idinfo = id_token.verify_oauth2_token(
        token,
        requests.Request(),
        GOOGLE_CLIENT_ID
    )
    email = idinfo["email"]
    name = idinfo["name"]
    user = user_collection.find_one({"email": email})
    if not user:
        user = {
            "name": name,
            "email": email,
            "role": "user"
        }
        result = user_collection.insert_one(user)
        user_id = str(result.inserted_id)
    else:
        user_id = str(user["_id"])
    access_token = create_access_token({
        "user_id": user_id
    })
    return {"access_token": access_token}