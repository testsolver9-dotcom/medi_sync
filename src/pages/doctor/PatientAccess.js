// File: src/pages/doctor/PatientAccess.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../../components/doctor/StepIndicator";
import FancyButton from "../../components/FancyButton";
import { requestPatientConsent } from "../../services/doctorApi";
import { useDoctorStore } from "../../store/useDoctorStore";
import { motion, AnimatePresence } from "framer-motion";

export default function PatientAccess() {
  const navigate = useNavigate();
  const setPatient = useDoctorStore((s) => s.setPatient);
  
  // Enhanced state management for OTP workflow
  const [patientId, setPatientId] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Request Access, 2: Enter OTP
  const [consentStatus, setConsentStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Step 1: Request patient access and send OTP
  const handleRequestAccess = async () => {
    if (!patientId.trim()) {
      setErrorMessage("Please enter a valid Patient ID");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setConsentStatus("");
    
    try {
      // Simulate API call to request patient consent
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // In real implementation, this would send OTP to patient's phone
      setConsentStatus("OTP sent to patient's registered phone number");
      setSuccessMessage("OTP has been sent to the patient. Please ask the patient for the 6-digit code.");
      setStep(2);
      
    } catch (error) {
      setErrorMessage("Failed to send OTP to patient. Please check the Patient ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and grant access
  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setErrorMessage("Please enter the OTP received by the patient");
      return;
    }

    if (otp !== "123456") {
      setErrorMessage("Invalid OTP. Please ask the patient for the correct code.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    
    try {
      // Simulate API call to verify OTP and get patient data
      const { patient } = await requestPatientConsent(patientId);
      setPatient(patient);
      
      setSuccessMessage("✅ OTP verified successfully! Access granted to patient records.");
      setConsentStatus("Access granted - you can now view patient records");
      
      // Redirect to dashboard after successful verification
      setTimeout(() => {
        navigate("/doctor/dashboard");
      }, 2000);
      
    } catch (error) {
      setErrorMessage("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form to step 1
  const handleBack = () => {
    setStep(1);
    setOtp("");
    setErrorMessage("");
    setSuccessMessage("");
    setConsentStatus("");
  };

  // Resend OTP functionality
  const handleResendOTP = async () => {
    setLoading(true);
    setErrorMessage("");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage("OTP has been resent to the patient's phone.");
    } catch (error) {
      setErrorMessage("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <StepIndicator current={3} />
        
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Patient Consent Required
          </h2>
          <p className="text-gray-600">
            {step === 1 
              ? "Enter the patient's ID to request OTP-based consent for accessing their medical records."
              : "Enter the OTP that was sent to the patient's registered phone number."
            }
          </p>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-green-100 border border-green-300 text-green-700 rounded-xl text-center"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl text-center"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {consentStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl text-center font-medium border ${
                consentStatus.includes('granted') || consentStatus.includes('sent')
                  ? 'bg-blue-100 border-blue-300 text-blue-700' 
                  : 'bg-yellow-100 border-yellow-300 text-yellow-700'
              }`}
            >
              {consentStatus}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Indicator */}
        <div className="flex justify-center space-x-4 mb-6">
          <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              1
            </div>
            <span className="text-sm font-medium">Request Access</span>
          </div>
          
          <div className={`w-12 h-px bg-gray-300 self-center ${step >= 2 ? 'bg-blue-600' : ''}`}></div>
          
          <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
            <span className="text-sm font-medium">Verify OTP</span>
          </div>
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient ID
                </label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter Patient ID (e.g., patient999)"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Demo Patient ID: patient999
                </p>
              </div>

              <FancyButton 
                loading={loading} 
                onClick={handleRequestAccess}
                className="w-full"
              >
                {loading ? "Sending OTP to Patient..." : "Request Patient Consent"}
              </FancyButton>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP from Patient
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-colors text-center text-lg font-mono tracking-wider"
                />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Demo OTP: 123456
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleBack}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                
                <FancyButton 
                  loading={loading} 
                  onClick={handleVerifyOTP}
                  className="flex-1"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </FancyButton>
              </div>

              <button
                onClick={handleResendOTP}
                disabled={loading}
                className="w-full text-teal-600 hover:text-teal-700 font-medium text-sm py-2 disabled:opacity-50"
              >
                Resend OTP
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Enter the patient's ID to request access</li>
            <li>2. System sends a 6-digit OTP to patient's phone</li>
            <li>3. Ask the patient for the OTP and enter it</li>
            <li>4. Upon verification, you'll gain access to patient records</li>
          </ol>
        </div>
      </div>
    </div>
  );
}