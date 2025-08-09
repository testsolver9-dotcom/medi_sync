"""
Authentication Service for MediSync Healthcare Platform
Handles user data management and authentication logic
"""

import time
import hashlib
from typing import Dict, Optional, Any
from models.request_models import PatientRegisterRequest, DoctorRegisterRequest

class AuthService:
    def __init__(self):
        """Initialize authentication service"""
        # In-memory storage for demo purposes
        # In production, use proper database
        
        # Registered users storage
        self.patients: Dict[str, Dict] = {}
        self.doctors: Dict[str, Dict] = {}
        
        # Temporary registration data (pending OTP verification)
        self.temp_patient_data: Dict[str, Dict] = {}
        self.temp_doctor_data: Dict[str, Dict] = {}
        
        # Mock existing users for testing
        self._initialize_mock_data()
        
        print("✅ Auth Service initialized")
    
    def _initialize_mock_data(self):
        """Initialize with some mock data for testing"""
        # Mock patient data
        self.patients["+917894561230"] = {
            "id": "patient999",
            "name": "Jane Doe",
            "email": "jane.doe@email.com",
            "phone": "+917894561230",
            "age": 29,
            "sex": "Female",
            "weight": "65 kg",
            "height": "170 cm",
            "allergies": "Penicillin, Peanuts",
            "chronic": "Mild Hypertension",
            "gender": "Female",
            "address": "123 Main St, Mumbai, Maharashtra 400001",
            "password_hash": self._hash_password("password123"),
            "created_at": time.time()
        }
        
        # Mock doctor data
        self.doctors["+919876543210"] = {
            "id": "doctor123",
            "name": "Dr. Jane Smith",
            "email": "dr.jane@medisync.com",
            "phone": "+919876543210",
            "specialization": "Cardiology",
            "location": "Mumbai",
            "password_hash": self._hash_password("doctor123"),
            "created_at": time.time()
        }
        
        print("📄 Mock data initialized")
    
    def _hash_password(self, password: str) -> str:
        """Hash password using SHA-256"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def _generate_user_id(self, prefix: str) -> str:
        """Generate unique user ID"""
        timestamp = str(int(time.time()))
        return f"{prefix}_{timestamp}"
    
    # Patient Authentication Methods
    async def get_patient_by_phone(self, phone: str) -> Optional[Dict[str, Any]]:
        """Get patient data by phone number"""
        patient = self.patients.get(phone)
        if patient:
            # Return safe data (no password hash)
            safe_data = patient.copy()
            safe_data.pop('password_hash', None)
            return safe_data
        return None
    
    async def validate_patient_registration(self, request: PatientRegisterRequest) -> bool:
        """Validate patient registration request"""
        # Check if phone number already exists
        if request.phone in self.patients:
            raise Exception("Phone number already registered")
        
        # Check if email already exists
        for patient in self.patients.values():
            if patient['email'] == request.email:
                raise Exception("Email address already registered")
        
        return True
    
    async def store_temp_patient_data(self, phone: str, data: Dict[str, Any]):
        """Store temporary patient registration data"""
        self.temp_patient_data[phone] = {
            **data,
            'timestamp': time.time()
        }
        print(f"📝 Stored temp patient data for {phone}")
    
    async def complete_patient_registration(self, phone: str) -> Dict[str, Any]:
        """Complete patient registration after OTP verification"""
        if phone not in self.temp_patient_data:
            raise Exception("Registration data not found. Please start registration again.")
        
        temp_data = self.temp_patient_data[phone]
        
        # Check if temp data is expired (30 minutes)
        if time.time() - temp_data['timestamp'] > 1800:
            del self.temp_patient_data[phone]
            raise Exception("Registration session expired. Please start again.")
        
        # Create patient record
        patient_id = self._generate_user_id("patient")
        patient_data = {
            "id": patient_id,
            "name": temp_data['name'],
            "email": temp_data['email'],
            "phone": temp_data['phone'],
            "gender": temp_data['gender'],
            "address": temp_data['address'],
            "password_hash": self._hash_password(temp_data['password']),
            "age": 25,  # Default for demo
            "sex": temp_data['gender'],
            "weight": "N/A",
            "height": "N/A",
            "allergies": "None",
            "chronic": "None",
            "created_at": time.time()
        }
        
        # Store patient
        self.patients[phone] = patient_data
        
        # Clean up temp data
        del self.temp_patient_data[phone]
        
        print(f"✅ Patient registration completed for {phone}")
        
        # Return safe data
        safe_data = patient_data.copy()
        safe_data.pop('password_hash', None)
        return safe_data
    
    # Doctor Authentication Methods
    async def get_doctor_by_phone(self, phone: str) -> Optional[Dict[str, Any]]:
        """Get doctor data by phone number"""
        doctor = self.doctors.get(phone)
        if doctor:
            # Return safe data (no password hash)
            safe_data = doctor.copy()
            safe_data.pop('password_hash', None)
            return safe_data
        return None
    
    async def get_doctor_by_id(self, doctor_id: str) -> Optional[Dict[str, Any]]:
        """Get doctor data by doctor ID"""
        for doctor in self.doctors.values():
            if doctor['id'] == doctor_id:
                safe_data = doctor.copy()
                safe_data.pop('password_hash', None)
                return safe_data
        return None
    
    async def validate_doctor_registration(self, request: DoctorRegisterRequest) -> bool:
        """Validate doctor registration request"""
        # Check if phone number already exists
        if request.phone in self.doctors:
            raise Exception("Phone number already registered")
        
        # Check if email already exists
        for doctor in self.doctors.values():
            if doctor['email'] == request.email:
                raise Exception("Email address already registered")
        
        return True
    
    async def store_temp_doctor_data(self, phone: str, data: Dict[str, Any]):
        """Store temporary doctor registration data"""
        self.temp_doctor_data[phone] = {
            **data,
            'timestamp': time.time()
        }
        print(f"📝 Stored temp doctor data for {phone}")
    
    async def complete_doctor_registration(self, phone: str) -> Dict[str, Any]:
        """Complete doctor registration after OTP verification"""
        if phone not in self.temp_doctor_data:
            raise Exception("Registration data not found. Please start registration again.")
        
        temp_data = self.temp_doctor_data[phone]
        
        # Check if temp data is expired (30 minutes)
        if time.time() - temp_data['timestamp'] > 1800:
            del self.temp_doctor_data[phone]
            raise Exception("Registration session expired. Please start again.")
        
        # Create doctor record
        doctor_id = self._generate_user_id("doctor")
        doctor_data = {
            "id": doctor_id,
            "name": temp_data['name'],
            "email": temp_data['email'],
            "phone": temp_data['phone'],
            "specialization": temp_data['specialization'],
            "location": temp_data['location'],
            "password_hash": self._hash_password(temp_data['password']),
            "created_at": time.time()
        }
        
        # Store doctor
        self.doctors[phone] = doctor_data
        
        # Clean up temp data
        del self.temp_doctor_data[phone]
        
        print(f"✅ Doctor registration completed for {phone}")
        
        # Return safe data
        safe_data = doctor_data.copy()
        safe_data.pop('password_hash', None)
        return safe_data
    
    # Utility methods
    def get_stats(self) -> Dict[str, int]:
        """Get service statistics"""
        return {
            "total_patients": len(self.patients),
            "total_doctors": len(self.doctors),
            "pending_patient_registrations": len(self.temp_patient_data),
            "pending_doctor_registrations": len(self.temp_doctor_data)
        }