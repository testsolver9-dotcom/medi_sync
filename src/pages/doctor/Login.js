// File: src/pages/doctor/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { sendDoctorOtp, verifyDoctorOtp } from "../../services/realApi";
import { useDoctorStore } from "../../store/useDoctorStore";

export default function DoctorLogin() {
  const navigate = useNavigate();
  const setDoctor = useDoctorStore(s => s.setDoctor);
  
  const [step, setStep] = useState(1);
  const [doctorId, setDoctorId] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async () => {
    if (!doctorId.trim()) {
      setError("Please enter your Doctor ID");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      await sendDoctorOtp(doctorId);
      setStep(2);
      setSuccess("OTP sent successfully to your registered phone!");
    } catch (err) {
      setError("Failed to send OTP. Please check your Doctor ID.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const response = await verifyDoctorOtp(doctorId, otp);
      setDoctor(response.doctor);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/doctor/location"), 1000);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Doctor Portal</h1>
          <p className="text-teal-100">Secure access to patient records</p>
        </div>

        <div className="p-8">
          {/* Step Indicator */}
          <div className="flex justify-center space-x-2 mb-8">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-all ${
                  step === s
                    ? 'bg-teal-600 text-white shadow-lg'
                    : step > s
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
            ))}
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg text-center"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1: Doctor ID */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. D-123456"
                  value={doctorId}
                  onChange={e => setDoctorId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending OTP...</span>
                  </div>
                ) : 'Get OTP'}
              </button>
            </motion.div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="6-digit OTP (Demo: 123456)"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-center text-lg font-mono"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Demo OTP: 123456
                </p>
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Verifying...</span>
                  </div>
                ) : 'Verify & Login'}
              </button>
            </motion.div>
          )}

          {/* Registration Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              New doctor?{" "}
              <Link to="/doctor/register" className="text-teal-600 hover:text-teal-700 font-semibold">
                Register here
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
              ← Back to Home
            </Link>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-xs text-teal-700 text-center">
              <span className="font-semibold">Demo Mode:</span> Use any Doctor ID and OTP "123456"
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}