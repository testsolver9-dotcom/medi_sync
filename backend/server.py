"""
MediSync Healthcare Platform - FastAPI Backend Server
Handles OTP verification using Twilio for patient and doctor authentication
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from dotenv import load_dotenv
import os

from services.otp_service import OTPService
from services.auth_service import AuthService
from models.request_models import (
    SendOTPRequest, VerifyOTPRequest, PatientRegisterRequest, 
    DoctorRegisterRequest, PatientLoginRequest, DoctorLoginRequest
)
from models.response_models import (
    SendOTPResponse, VerifyOTPResponse, RegisterResponse, 
    LoginResponse, ErrorResponse
)

# Load environment variables
load_dotenv()

# Initialize services
otp_service = OTPService()
auth_service = AuthService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    print("🚀 MediSync Backend Server starting...")
    print("📱 Twilio SMS service initialized")
    yield
    print("🔄 MediSync Backend Server shutting down...")

# Create FastAPI app
app = FastAPI(
    title="MediSync Healthcare API",
    description="Backend API for patient and doctor authentication with OTP verification",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "MediSync Healthcare API", "status": "running"}

@app.get("/api/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "service": "MediSync Healthcare API",
        "version": "1.0.0",
        "twilio_configured": bool(os.getenv("TWILIO_ACCOUNT_SID")),
        "otp_service": "active"
    }

# Patient Authentication Endpoints
@app.post("/api/patient/send-otp", response_model=SendOTPResponse)
async def send_patient_otp(request: SendOTPRequest):
    """Send OTP for patient login"""
    try:
        result = await otp_service.send_otp(request.phone, "patient_login")
        response_data = {
            "success": True,
            "message": "OTP sent successfully to your phone",
            "expires_in": 300  # 5 minutes
        }
        # For demo phone numbers, include the OTP in response
        if result.get('demo_otp'):
            response_data["message"] += f" (Demo OTP: {result['demo_otp']})"
        return response_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/patient/verify-otp", response_model=VerifyOTPResponse)
async def verify_patient_otp(request: VerifyOTPRequest):
    """Verify OTP for patient login"""
    try:
        is_valid = await otp_service.verify_otp(request.phone, request.otp, "patient_login")
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
        # Get patient data (mock for now)
        patient_data = await auth_service.get_patient_by_phone(request.phone)
        
        return VerifyOTPResponse(
            success=True,
            message="OTP verified successfully",
            user_data=patient_data
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/patient/register", response_model=RegisterResponse)
async def register_patient(request: PatientRegisterRequest):
    """Register new patient and send OTP"""
    try:
        # Validate registration data
        await auth_service.validate_patient_registration(request)
        
        # Send OTP for registration verification
        result = await otp_service.send_otp(request.phone, "patient_register")
        
        # Store registration data temporarily
        await auth_service.store_temp_patient_data(request.phone, request.dict())
        
        response_data = {
            "success": True,
            "message": "Registration initiated. OTP sent to your phone for verification.",
            "expires_in": 300
        }
        # For demo phone numbers, include the OTP in response
        if result.get('demo_otp'):
            response_data["message"] += f" (Demo OTP: {result['demo_otp']})"
        return response_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/patient/verify-register-otp", response_model=VerifyOTPResponse)
async def verify_patient_register_otp(request: VerifyOTPRequest):
    """Verify OTP for patient registration"""
    try:
        is_valid = await otp_service.verify_otp(request.phone, request.otp, "patient_register")
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
        # Get temporary registration data and create patient
        patient_data = await auth_service.complete_patient_registration(request.phone)
        
        return VerifyOTPResponse(
            success=True,
            message="Registration completed successfully",
            user_data=patient_data
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Doctor Authentication Endpoints
@app.post("/api/doctor/send-otp", response_model=SendOTPResponse)
async def send_doctor_otp(request: SendOTPRequest):
    """Send OTP for doctor login"""
    try:
        result = await otp_service.send_otp(request.phone, "doctor_login")
        return SendOTPResponse(
            success=True,
            message="OTP sent successfully to your registered phone",
            expires_in=300
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/doctor/verify-otp", response_model=VerifyOTPResponse)
async def verify_doctor_otp(request: VerifyOTPRequest):
    """Verify OTP for doctor login"""
    try:
        is_valid = await otp_service.verify_otp(request.phone, request.otp, "doctor_login")
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
        # Get doctor data
        doctor_data = await auth_service.get_doctor_by_phone(request.phone)
        
        return VerifyOTPResponse(
            success=True,
            message="Login successful",
            user_data=doctor_data
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/doctor/register", response_model=RegisterResponse)
async def register_doctor(request: DoctorRegisterRequest):
    """Register new doctor and send OTP"""
    try:
        # Validate registration data
        await auth_service.validate_doctor_registration(request)
        
        # Send OTP for registration verification
        result = await otp_service.send_otp(request.phone, "doctor_register")
        
        # Store registration data temporarily
        await auth_service.store_temp_doctor_data(request.phone, request.dict())
        
        return RegisterResponse(
            success=True,
            message="Registration initiated. OTP sent to your phone for verification.",
            expires_in=300
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/doctor/verify-register-otp", response_model=VerifyOTPResponse)
async def verify_doctor_register_otp(request: VerifyOTPRequest):
    """Verify OTP for doctor registration"""
    try:
        is_valid = await otp_service.verify_otp(request.phone, request.otp, "doctor_register")
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
        # Get temporary registration data and create doctor
        doctor_data = await auth_service.complete_doctor_registration(request.phone)
        
        return VerifyOTPResponse(
            success=True,
            message="Doctor registration completed successfully",
            user_data=doctor_data
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)