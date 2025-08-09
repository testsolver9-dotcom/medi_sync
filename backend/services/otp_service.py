"""
OTP Service for MediSync Healthcare Platform
Handles OTP generation, SMS sending via Twilio, and verification
"""

import os
import random
import time
from typing import Dict, Optional, Tuple
from twilio.rest import Client
from twilio.base.exceptions import TwilioException

class OTPService:
    def __init__(self):
        """Initialize OTP service with Twilio client"""
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.twilio_phone = os.getenv('TWILIO_PHONE_NUMBER')
        
        if not all([self.account_sid, self.auth_token, self.twilio_phone]):
            raise ValueError("Twilio credentials not properly configured")
        
        self.client = Client(self.account_sid, self.auth_token)
        
        # In-memory OTP storage: {phone_number: {otp, timestamp, type}}
        self.otp_store: Dict[str, Dict] = {}
        
        # OTP expiry time in seconds (5 minutes)
        self.otp_expiry = 300
        
        print("✅ OTP Service initialized with Twilio")
    
    def generate_otp(self) -> str:
        """Generate a random 6-digit OTP"""
        return str(random.randint(100000, 999999))
    
    def normalize_phone(self, phone: str) -> str:
        """Normalize phone number to standard format"""
        # Remove all non-digits
        digits_only = ''.join(filter(str.isdigit, phone))
        
        # Handle Indian phone numbers
        if len(digits_only) == 10 and digits_only.startswith(('6', '7', '8', '9')):
            return f"+91{digits_only}"
        elif len(digits_only) == 12 and digits_only.startswith('91'):
            return f"+{digits_only}"
        else:
            return phone
    
    async def send_otp(self, phone: str, otp_type: str) -> Dict[str, any]:
        """
        Send OTP via SMS using Twilio
        
        Args:
            phone: Phone number to send OTP to
            otp_type: Type of OTP (patient_login, patient_register, doctor_login, doctor_register)
        
        Returns:
            Dictionary with success status and message
        """
        try:
            # Clean up expired OTPs first
            self._cleanup_expired_otps()
            
            # Normalize phone number
            normalized_phone = self.normalize_phone(phone)
            
            # Rate limiting check (max 3 OTPs per phone per hour)
            if self._is_rate_limited(normalized_phone):
                raise Exception("Too many OTP requests. Please try again later.")
            
            # Generate OTP
            otp = self.generate_otp()
            current_time = time.time()
            
            # Create SMS message based on type
            message_templates = {
                'patient_login': f"Your MediSync patient login OTP is: {otp}. Valid for 5 minutes. Do not share this code.",
                'patient_register': f"Your MediSync patient registration OTP is: {otp}. Valid for 5 minutes. Welcome to MediSync!",
                'doctor_login': f"Your MediSync doctor portal login OTP is: {otp}. Valid for 5 minutes. Keep it confidential.",
                'doctor_register': f"Your MediSync doctor registration OTP is: {otp}. Valid for 5 minutes. Welcome to MediSync Healthcare!"
            }
            
            message_body = message_templates.get(otp_type, f"Your MediSync OTP is: {otp}. Valid for 5 minutes.")
            
            # Send SMS via Twilio
            message = self.client.messages.create(
                body=message_body,
                from_=self.twilio_phone,
                to=normalized_phone
            )
            
            # Store OTP in memory
            self.otp_store[normalized_phone] = {
                'otp': otp,
                'timestamp': current_time,
                'type': otp_type,
                'attempts': 0,
                'twilio_sid': message.sid
            }
            
            print(f"📱 OTP sent to {normalized_phone} (Type: {otp_type}, SID: {message.sid})")
            
            return {
                'success': True,
                'message': 'OTP sent successfully',
                'phone': normalized_phone,
                'expires_in': self.otp_expiry
            }
            
        except TwilioException as e:
            print(f"❌ Twilio Error: {str(e)}")
            raise Exception(f"Failed to send SMS: {str(e)}")
        except Exception as e:
            print(f"❌ OTP Service Error: {str(e)}")
            raise Exception(f"OTP service error: {str(e)}")
    
    async def verify_otp(self, phone: str, otp: str, otp_type: str) -> bool:
        """
        Verify OTP for given phone number and type
        
        Args:
            phone: Phone number to verify
            otp: OTP to verify
            otp_type: Expected OTP type
        
        Returns:
            True if OTP is valid, False otherwise
        """
        try:
            # Clean up expired OTPs first
            self._cleanup_expired_otps()
            
            # Normalize phone number
            normalized_phone = self.normalize_phone(phone)
            
            # Check if OTP exists for this phone
            if normalized_phone not in self.otp_store:
                print(f"❌ No OTP found for {normalized_phone}")
                return False
            
            stored_data = self.otp_store[normalized_phone]
            
            # Check if OTP has expired
            current_time = time.time()
            if current_time - stored_data['timestamp'] > self.otp_expiry:
                print(f"❌ OTP expired for {normalized_phone}")
                del self.otp_store[normalized_phone]
                return False
            
            # Check if OTP type matches
            if stored_data['type'] != otp_type:
                print(f"❌ OTP type mismatch for {normalized_phone}")
                return False
            
            # Check attempt limit (max 3 attempts)
            if stored_data['attempts'] >= 3:
                print(f"❌ Too many attempts for {normalized_phone}")
                del self.otp_store[normalized_phone]
                return False
            
            # Verify OTP
            if stored_data['otp'] == otp:
                print(f"✅ OTP verified successfully for {normalized_phone}")
                # Remove OTP after successful verification
                del self.otp_store[normalized_phone]
                return True
            else:
                # Increment attempt count
                stored_data['attempts'] += 1
                print(f"❌ Invalid OTP for {normalized_phone} (Attempt: {stored_data['attempts']})")
                return False
                
        except Exception as e:
            print(f"❌ OTP Verification Error: {str(e)}")
            return False
    
    def _cleanup_expired_otps(self):
        """Remove expired OTPs from memory"""
        current_time = time.time()
        expired_phones = []
        
        for phone, data in self.otp_store.items():
            if current_time - data['timestamp'] > self.otp_expiry:
                expired_phones.append(phone)
        
        for phone in expired_phones:
            del self.otp_store[phone]
            print(f"🗑️ Cleaned up expired OTP for {phone}")
    
    def _is_rate_limited(self, phone: str) -> bool:
        """Check if phone number is rate limited"""
        # For demo purposes, allow unlimited OTPs
        # In production, implement proper rate limiting
        return False
    
    def get_otp_status(self, phone: str) -> Optional[Dict]:
        """Get current OTP status for a phone number (for debugging)"""
        normalized_phone = self.normalize_phone(phone)
        return self.otp_store.get(normalized_phone)
    
    def get_active_otps_count(self) -> int:
        """Get count of active OTPs (for monitoring)"""
        self._cleanup_expired_otps()
        return len(self.otp_store)