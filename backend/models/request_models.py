"""
Request models for MediSync Healthcare API
"""

from pydantic import BaseModel, validator
from typing import Optional
import re

class SendOTPRequest(BaseModel):
    phone: str
    
    @validator('phone')
    def validate_phone(cls, v):
        # Indian phone number validation
        if not v:
            raise ValueError('Phone number is required')
        
        # Remove all non-digits
        digits_only = re.sub(r'\D', '', v)
        
        # Check for Indian mobile number patterns
        if len(digits_only) == 10 and digits_only.startswith(('6', '7', '8', '9')):
            return f"+91{digits_only}"
        elif len(digits_only) == 12 and digits_only.startswith('91'):
            return f"+{digits_only}"
        elif len(digits_only) == 13 and digits_only.startswith('+91'):
            return digits_only
        else:
            raise ValueError('Invalid Indian phone number format')

class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str
    
    @validator('phone')
    def validate_phone(cls, v):
        # Same validation as SendOTPRequest
        if not v:
            raise ValueError('Phone number is required')
        
        digits_only = re.sub(r'\D', '', v)
        
        if len(digits_only) == 10 and digits_only.startswith(('6', '7', '8', '9')):
            return f"+91{digits_only}"
        elif len(digits_only) == 12 and digits_only.startswith('91'):
            return f"+{digits_only}"
        elif len(digits_only) == 13 and digits_only.startswith('+91'):
            return digits_only
        else:
            raise ValueError('Invalid Indian phone number format')
    
    @validator('otp')
    def validate_otp(cls, v):
        if not v or len(v) != 6 or not v.isdigit():
            raise ValueError('OTP must be 6 digits')
        return v

class PatientLoginRequest(BaseModel):
    phone: str
    
    @validator('phone')
    def validate_phone(cls, v):
        if not v:
            raise ValueError('Phone number is required')
        
        digits_only = re.sub(r'\D', '', v)
        
        if len(digits_only) == 10 and digits_only.startswith(('6', '7', '8', '9')):
            return f"+91{digits_only}"
        elif len(digits_only) == 12 and digits_only.startswith('91'):
            return f"+{digits_only}"
        elif len(digits_only) == 13 and digits_only.startswith('+91'):
            return digits_only
        else:
            raise ValueError('Invalid Indian phone number format')

class PatientRegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    gender: str
    address: str
    password: str
    
    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters')
        return v.strip()
    
    @validator('email')
    def validate_email(cls, v):
        email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_pattern, v):
            raise ValueError('Invalid email format')
        return v.lower()
    
    @validator('phone')
    def validate_phone(cls, v):
        if not v:
            raise ValueError('Phone number is required')
        
        digits_only = re.sub(r'\D', '', v)
        
        if len(digits_only) == 10 and digits_only.startswith(('6', '7', '8', '9')):
            return f"+91{digits_only}"
        elif len(digits_only) == 12 and digits_only.startswith('91'):
            return f"+{digits_only}"
        elif len(digits_only) == 13 and digits_only.startswith('+91'):
            return digits_only
        else:
            raise ValueError('Invalid Indian phone number format')
    
    @validator('gender')
    def validate_gender(cls, v):
        if v not in ['Male', 'Female', 'Other']:
            raise ValueError('Gender must be Male, Female, or Other')
        return v
    
    @validator('address')
    def validate_address(cls, v):
        if not v or len(v.strip()) < 10:
            raise ValueError('Address must be at least 10 characters')
        return v.strip()
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v

class DoctorLoginRequest(BaseModel):
    doctor_id: str
    
    @validator('doctor_id')
    def validate_doctor_id(cls, v):
        if not v:
            raise ValueError('Doctor ID is required')
        return v.strip()

class DoctorRegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    specialization: str
    location: str
    password: str
    
    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters')
        return v.strip()
    
    @validator('email')
    def validate_email(cls, v):
        email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_pattern, v):
            raise ValueError('Invalid email format')
        return v.lower()
    
    @validator('phone')
    def validate_phone(cls, v):
        if not v:
            raise ValueError('Phone number is required')
        
        digits_only = re.sub(r'\D', '', v)
        
        if len(digits_only) == 10 and digits_only.startswith(('6', '7', '8', '9')):
            return f"+91{digits_only}"
        elif len(digits_only) == 12 and digits_only.startswith('91'):
            return f"+{digits_only}"
        elif len(digits_only) == 13 and digits_only.startswith('+91'):
            return digits_only
        else:
            raise ValueError('Invalid Indian phone number format')
    
    @validator('specialization')
    def validate_specialization(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Specialization is required')
        return v.strip()
    
    @validator('location')
    def validate_location(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Location is required')
        return v.strip()
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v