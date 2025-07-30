#!/usr/bin/env python3
"""
Backend API Testing for MediSync Healthcare Platform
Tests the mock API services used by the React frontend
"""

import requests
import sys
import json
from datetime import datetime

class MediSyncAPITester:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

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

    def test_frontend_accessibility(self):
        """Test if the frontend is accessible"""
        try:
            response = requests.get(self.base_url, timeout=10)
            if response.status_code == 200 and "MediSync" in response.text:
                self.log_test("Frontend Accessibility", "PASS")
                return True
            else:
                self.log_test("Frontend Accessibility", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Frontend Accessibility", "FAIL", str(e))
            return False

    def test_mock_api_structure(self):
        """Test if mock API files are properly structured"""
        try:
            # Check if mock API files exist and are readable
            with open('/app/src/services/mockApi.js', 'r') as f:
                mock_api_content = f.read()
            
            with open('/app/src/services/doctorApi.js', 'r') as f:
                doctor_api_content = f.read()
            
            # Check for critical functions
            critical_functions = [
                'verifyOtp', 'verifySignupOtp', 'fetchPatientRecords', 
                'fetchPathReports', 'uploadRecord', 'askAI', 'getHospitals'
            ]
            
            missing_functions = []
            for func in critical_functions:
                if func not in mock_api_content:
                    missing_functions.append(func)
            
            if missing_functions:
                self.log_test("Mock API Structure", "FAIL", f"Missing functions: {missing_functions}")
                return False
            else:
                self.log_test("Mock API Structure", "PASS")
                return True
                
        except Exception as e:
            self.log_test("Mock API Structure", "FAIL", str(e))
            return False

    def test_otp_validation_logic(self):
        """Test OTP validation logic from mock API"""
        try:
            # Read the mock API file to check OTP validation
            with open('/app/src/services/mockApi.js', 'r') as f:
                content = f.read()
            
            # Check if OTP validation is properly implemented
            if "otp !== '123456'" in content:
                # This indicates that only 123456 is accepted - this is the security bug!
                self.log_test("OTP Validation Logic", "FAIL", 
                             "SECURITY BUG: Only hardcoded OTP '123456' is accepted. Invalid OTPs should be rejected.")
                return False
            else:
                self.log_test("OTP Validation Logic", "PASS")
                return True
                
        except Exception as e:
            self.log_test("OTP Validation Logic", "FAIL", str(e))
            return False

    def test_data_availability(self):
        """Test if mock data is available for testing"""
        try:
            with open('/app/src/services/mockApi.js', 'r') as f:
                content = f.read()
            
            # Check for mock data arrays
            required_data = ['_records', '_reports', '_logs']
            missing_data = []
            
            for data in required_data:
                if data not in content:
                    missing_data.append(data)
            
            if missing_data:
                self.log_test("Mock Data Availability", "FAIL", f"Missing data: {missing_data}")
                return False
            else:
                self.log_test("Mock Data Availability", "PASS")
                return True
                
        except Exception as e:
            self.log_test("Mock Data Availability", "FAIL", str(e))
            return False

    def test_doctor_api_functions(self):
        """Test doctor API functions"""
        try:
            with open('/app/src/services/doctorApi.js', 'r') as f:
                content = f.read()
            
            # Check for critical doctor functions
            doctor_functions = [
                'verifyDoctorOtp', 'verifyDoctorSignupOtp', 'registerDoctor',
                'requestPatientConsent', 'fetchRecords', 'saveRecord'
            ]
            
            missing_functions = []
            for func in doctor_functions:
                if func not in content:
                    missing_functions.append(func)
            
            if missing_functions:
                self.log_test("Doctor API Functions", "FAIL", f"Missing functions: {missing_functions}")
                return False
            else:
                self.log_test("Doctor API Functions", "PASS")
                return True
                
        except Exception as e:
            self.log_test("Doctor API Functions", "FAIL", str(e))
            return False

    def test_hospital_data_structure(self):
        """Test hospital data structure for emergency support"""
        try:
            with open('/app/src/services/mockApi.js', 'r') as f:
                content = f.read()
            
            # Check if getHospitals function returns proper structure
            if 'getHospitals' in content and 'name:' in content and 'address:' in content:
                self.log_test("Hospital Data Structure", "PASS")
                return True
            else:
                self.log_test("Hospital Data Structure", "FAIL", "Hospital data structure incomplete")
                return False
                
        except Exception as e:
            self.log_test("Hospital Data Structure", "FAIL", str(e))
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🔍 Starting MediSync Backend API Tests...")
        print("=" * 50)
        
        # Test frontend accessibility first
        if not self.test_frontend_accessibility():
            print("❌ Frontend not accessible, stopping tests")
            return False
        
        # Test mock API structure
        self.test_mock_api_structure()
        
        # Test OTP validation logic (critical security test)
        self.test_otp_validation_logic()
        
        # Test data availability
        self.test_data_availability()
        
        # Test doctor API functions
        self.test_doctor_api_functions()
        
        # Test hospital data structure
        self.test_hospital_data_structure()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed < self.tests_run:
            print("\n🚨 CRITICAL ISSUES FOUND:")
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