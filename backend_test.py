#!/usr/bin/env python3
"""
Backend API Testing for MediSync Healthcare Platform
Tests the real FastAPI backend with Twilio OTP integration
"""

import requests
import sys
import json
import time
from datetime import datetime

class MediSyncAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
        # Test phone numbers from the request
        self.test_phones = {
            'existing_patient': '+917894561230',
            'new_patient': '+918888888888', 
            'existing_doctor': '+919876543210',
            'new_doctor': '+917777777777'
        }

    def log_test(self, name, status, details=""):
        """Log test results"""
        self.tests_run += 1
        if status == "PASS":
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "name": name,
            "status": status,
            "details": details
        })

    def make_request(self, method, endpoint, data=None):
        """Make HTTP request to API"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            
            return response
        except Exception as e:
            raise Exception(f"Request failed: {str(e)}")

    def test_health_endpoint(self):
        """Test health check endpoint"""
        try:
            response = self.make_request('GET', '/api/health')
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'healthy' and 'twilio_configured' in data:
                    self.log_test("Health Check", "PASS")
                    return True
                else:
                    self.log_test("Health Check", "FAIL", f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Health Check", "FAIL", f"Status code: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Health Check", "FAIL", str(e))
            return False

    def test_patient_login_otp_flow(self):
        """Test patient login OTP flow (send + verify)"""
        phone = self.test_phones['existing_patient']
        
        # Step 1: Send OTP
        try:
            response = self.make_request('POST', '/api/patient/send-otp', {'phone': phone})
            
            if response.status_code != 200:
                self.log_test("Patient Login - Send OTP", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                return False
            
            data = response.json()
            if not data.get('success'):
                self.log_test("Patient Login - Send OTP", "FAIL", f"API returned success=false: {data}")
                return False
            
            # Extract demo OTP from message if available
            demo_otp = None
            message = data.get('message', '')
            if 'Demo OTP:' in message:
                demo_otp = message.split('Demo OTP: ')[1].split(')')[0].strip()
            
            self.log_test("Patient Login - Send OTP", "PASS")
            
            # Step 2: Verify OTP
            if demo_otp:
                time.sleep(1)  # Brief delay
                verify_response = self.make_request('POST', '/api/patient/verify-otp', {
                    'phone': phone,
                    'otp': demo_otp
                })
                
                if verify_response.status_code == 200:
                    verify_data = verify_response.json()
                    if verify_data.get('success') and verify_data.get('user_data'):
                        self.log_test("Patient Login - Verify OTP", "PASS")
                        return True
                    else:
                        self.log_test("Patient Login - Verify OTP", "FAIL", f"Invalid verify response: {verify_data}")
                        return False
                else:
                    self.log_test("Patient Login - Verify OTP", "FAIL", f"Status: {verify_response.status_code}")
                    return False
            else:
                self.log_test("Patient Login - Verify OTP", "FAIL", "No demo OTP found in response")
                return False
                
        except Exception as e:
            self.log_test("Patient Login OTP Flow", "FAIL", str(e))
            return False

    def test_patient_registration_otp_flow(self):
        """Test patient registration OTP flow"""
        phone = self.test_phones['new_patient']
        
        registration_data = {
            'name': 'Test Patient',
            'email': 'test.patient@example.com',
            'phone': phone,
            'gender': 'Male',
            'address': '123 Test Street, Test City, Test State 12345',
            'password': 'TestPass123!'
        }
        
        try:
            # Step 1: Register patient
            response = self.make_request('POST', '/api/patient/register', registration_data)
            
            if response.status_code != 200:
                self.log_test("Patient Registration - Register", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                return False
            
            data = response.json()
            if not data.get('success'):
                self.log_test("Patient Registration - Register", "FAIL", f"Registration failed: {data}")
                return False
            
            # Extract demo OTP
            demo_otp = None
            message = data.get('message', '')
            if 'Demo OTP:' in message:
                demo_otp = message.split('Demo OTP: ')[1].split(')')[0].strip()
            
            self.log_test("Patient Registration - Register", "PASS")
            
            # Step 2: Verify registration OTP
            if demo_otp:
                time.sleep(1)
                verify_response = self.make_request('POST', '/api/patient/verify-register-otp', {
                    'phone': phone,
                    'otp': demo_otp
                })
                
                if verify_response.status_code == 200:
                    verify_data = verify_response.json()
                    if verify_data.get('success') and verify_data.get('user_data'):
                        self.log_test("Patient Registration - Verify OTP", "PASS")
                        return True
                    else:
                        self.log_test("Patient Registration - Verify OTP", "FAIL", f"Invalid verify response: {verify_data}")
                        return False
                else:
                    self.log_test("Patient Registration - Verify OTP", "FAIL", f"Status: {verify_response.status_code}")
                    return False
            else:
                self.log_test("Patient Registration - Verify OTP", "FAIL", "No demo OTP found")
                return False
                
        except Exception as e:
            self.log_test("Patient Registration OTP Flow", "FAIL", str(e))
            return False

    def test_doctor_login_otp_flow(self):
        """Test doctor login OTP flow"""
        phone = self.test_phones['existing_doctor']
        
        try:
            # Step 1: Send doctor OTP
            response = self.make_request('POST', '/api/doctor/send-otp', {'phone': phone})
            
            if response.status_code != 200:
                self.log_test("Doctor Login - Send OTP", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                return False
            
            data = response.json()
            if not data.get('success'):
                self.log_test("Doctor Login - Send OTP", "FAIL", f"Send OTP failed: {data}")
                return False
            
            # Extract demo OTP
            demo_otp = None
            message = data.get('message', '')
            if 'Demo OTP:' in message:
                demo_otp = message.split('Demo OTP: ')[1].split(')')[0].strip()
            
            self.log_test("Doctor Login - Send OTP", "PASS")
            
            # Step 2: Verify doctor OTP
            if demo_otp:
                time.sleep(1)
                verify_response = self.make_request('POST', '/api/doctor/verify-otp', {
                    'phone': phone,
                    'otp': demo_otp
                })
                
                if verify_response.status_code == 200:
                    verify_data = verify_response.json()
                    if verify_data.get('success') and verify_data.get('user_data'):
                        self.log_test("Doctor Login - Verify OTP", "PASS")
                        return True
                    else:
                        self.log_test("Doctor Login - Verify OTP", "FAIL", f"Invalid verify response: {verify_data}")
                        return False
                else:
                    self.log_test("Doctor Login - Verify OTP", "FAIL", f"Status: {verify_response.status_code}")
                    return False
            else:
                self.log_test("Doctor Login - Verify OTP", "FAIL", "No demo OTP found")
                return False
                
        except Exception as e:
            self.log_test("Doctor Login OTP Flow", "FAIL", str(e))
            return False

    def test_doctor_registration_otp_flow(self):
        """Test doctor registration OTP flow"""
        phone = self.test_phones['new_doctor']
        
        registration_data = {
            'name': 'Dr. Test Doctor',
            'email': 'test.doctor@example.com',
            'phone': phone,
            'specialization': 'General Medicine',
            'location': 'Mumbai',
            'password': 'TestDoc123!'
        }
        
        try:
            # Step 1: Register doctor
            response = self.make_request('POST', '/api/doctor/register', registration_data)
            
            if response.status_code != 200:
                self.log_test("Doctor Registration - Register", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                return False
            
            data = response.json()
            if not data.get('success'):
                self.log_test("Doctor Registration - Register", "FAIL", f"Registration failed: {data}")
                return False
            
            # Extract demo OTP
            demo_otp = None
            message = data.get('message', '')
            if 'Demo OTP:' in message:
                demo_otp = message.split('Demo OTP: ')[1].split(')')[0].strip()
            
            self.log_test("Doctor Registration - Register", "PASS")
            
            # Step 2: Verify registration OTP
            if demo_otp:
                time.sleep(1)
                verify_response = self.make_request('POST', '/api/doctor/verify-register-otp', {
                    'phone': phone,
                    'otp': demo_otp
                })
                
                if verify_response.status_code == 200:
                    verify_data = verify_response.json()
                    if verify_data.get('success') and verify_data.get('user_data'):
                        self.log_test("Doctor Registration - Verify OTP", "PASS")
                        return True
                    else:
                        self.log_test("Doctor Registration - Verify OTP", "FAIL", f"Invalid verify response: {verify_data}")
                        return False
                else:
                    self.log_test("Doctor Registration - Verify OTP", "FAIL", f"Status: {verify_response.status_code}")
                    return False
            else:
                self.log_test("Doctor Registration - Verify OTP", "FAIL", "No demo OTP found")
                return False
                
        except Exception as e:
            self.log_test("Doctor Registration OTP Flow", "FAIL", str(e))
            return False

    def test_invalid_otp_rejection(self):
        """Test that invalid OTPs are properly rejected"""
        phone = self.test_phones['existing_patient']
        
        try:
            # Try to verify with invalid OTP
            response = self.make_request('POST', '/api/patient/verify-otp', {
                'phone': phone,
                'otp': '000000'  # Invalid OTP
            })
            
            if response.status_code == 400:
                self.log_test("Invalid OTP Rejection", "PASS")
                return True
            else:
                self.log_test("Invalid OTP Rejection", "FAIL", f"Expected 400, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Invalid OTP Rejection", "FAIL", str(e))
            return False

    def test_phone_number_validation(self):
        """Test Indian phone number validation"""
        try:
            # Test invalid phone number
            response = self.make_request('POST', '/api/patient/send-otp', {'phone': '123'})
            
            if response.status_code == 422:  # Validation error
                self.log_test("Phone Number Validation", "PASS")
                return True
            else:
                self.log_test("Phone Number Validation", "FAIL", f"Expected 422, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Phone Number Validation", "FAIL", str(e))
            return False

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🔍 Starting MediSync Backend API Tests...")
        print("=" * 60)
        
        # Test health endpoint first
        if not self.test_health_endpoint():
            print("❌ Health check failed, stopping tests")
            return False
        
        # Test patient flows
        self.test_patient_login_otp_flow()
        self.test_patient_registration_otp_flow()
        
        # Test doctor flows
        self.test_doctor_login_otp_flow()
        self.test_doctor_registration_otp_flow()
        
        # Test error handling
        self.test_invalid_otp_rejection()
        self.test_phone_number_validation()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed < self.tests_run:
            print("\n🚨 FAILED TESTS:")
            for result in self.test_results:
                if result["status"] == "FAIL":
                    print(f"   • {result['name']}: {result['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = MediSyncAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n✅ All backend tests passed!")
        return 0
    else:
        print("\n❌ Some backend tests failed. Check issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())