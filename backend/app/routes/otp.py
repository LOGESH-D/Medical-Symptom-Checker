from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from app.database import otp_collection
from app.services.email_services import generate_otp, send_otp_email


router = APIRouter()

@router.post("/send-otp")
async def send_otp(email: str):
    otp = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=2)
    otp_collection.update_one(
        {"email": email},
        {
            "$set": {
                "email": email,
                "otp": otp,
                "expires_at": expires_at
            }
        },
        upsert=True
    )
    await send_otp_email(email, otp)
    return {"message": "OTP sent successfully"}

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

@router.post("/verify-otp")
def verify_otp(data: VerifyOTPRequest):
    record = otp_collection.find_one({"email": data.email})
    if not record:
        raise HTTPException(status_code=400, detail="OTP not found")
    if record["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    if record["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP expired")
    otp_collection.delete_one({"email": data.email})
    return {"message": "OTP verified successfully"}

@router.post("/resend-otp")
async def resend_otp(email: str):
    otp = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=2)
    otp_collection.update_one(
        {"email": email},
        {
            "$set": {
                "otp": otp,
                "expires_at": expires_at
            }
        }
    )
    await send_otp_email(email, otp)
    return {"message": "OTP resent successfully"}