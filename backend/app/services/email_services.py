import random
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
)

def generate_otp():
    return str(random.randint(100000, 999999))


async def send_otp_email(email, otp):
    message = MessageSchema(
        subject="Email Verification OTP",
        recipients=[email],
        body=f"Your verification OTP is: {otp}",
        subtype="plain"
    )
    fm = FastMail(conf)
    await fm.send_message(message)