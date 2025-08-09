"""
Response models for MediSync Healthcare API
"""

from pydantic import BaseModel
from typing import Optional, Dict, Any

class SendOTPResponse(BaseModel):
    success: bool
    message: str
    expires_in: int  # seconds

class VerifyOTPResponse(BaseModel):
    success: bool
    message: str
    user_data: Optional[Dict[str, Any]] = None

class RegisterResponse(BaseModel):
    success: bool
    message: str
    expires_in: int  # seconds

class LoginResponse(BaseModel):
    success: bool
    message: str
    user_data: Dict[str, Any]

class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: Optional[str] = None