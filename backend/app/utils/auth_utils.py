import os
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

ALGORITHM = "HS256"
security = HTTPBearer()
SECRET = os.getenv("JWT_SECRET")

def hash_password(password: str):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())

def verify_password(password: str, hashed_password: bytes):
    return bcrypt.checkpw(password.encode(), hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("JWT_SECRET"), algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token=Depends(security)):
    try:
        payload = jwt.decode(
            token.credentials,
            SECRET,
            algorithms=[ALGORITHM]
        )
        user_id = payload.get("user_id")
        return user_id
    except:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )