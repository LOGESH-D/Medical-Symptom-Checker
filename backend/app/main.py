from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, symptom, reports

load_dotenv()

app = FastAPI(title="Medical Symptom Checker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(symptom.router, prefix="/symptom", tags=["Symptom Analysis"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])


@app.get("/")
async def home():
    return {"message": "Welcome to the Medical Symptom Checker API!"}