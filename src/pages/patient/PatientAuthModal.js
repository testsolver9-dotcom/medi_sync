// File: src/pages/patient/PatientAuthModal.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  sendOtp,
  verifyOtp,
  registerPatient,
  verifySignupOtp,
} from '../../services/mockApi';
import { useUserStore } from '../../store/user_store';

export default function PatientAuthModal() {
  const navigate = useNavigate();
  const setUser = useUserStore(s => s.setUser);

  // Tab: 0 = login, 1 = signup
  const [tab, setTab] = useState(0);
  // Step within flow
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Shared fields
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  // Signup fields
  const [signupData, setSignupData] = useState({
    name: '', age: '', sex: '', weight: '', height: '', allergies: '', chronic: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const validateSignupForm = () => {
    const errors = {};
    const { name, age, sex, weight, height } = signupData;
    
    if (!name.trim()) errors.name = "Name is required";
    if (!age || age < 1 || age > 120) errors.age = "Valid age is required";
    if (!sex.trim()) errors.sex = "Gender is required";
    if (!weight || weight < 1) errors.weight = "Valid weight is required";
    if (!height || height < 1) errors.height = "Valid height is required";
    if (!phone.trim()) errors.phone = "Phone number is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSend = async () => {
    if (!phone.trim()) {
      setOtpError('Please enter your phone number or patient ID');
      return;
    }
    setLoading(true);
    setOtpError('');
    try {
      await sendOtp(phone);
      setStep(2);
      setSuccessMessage('OTP sent successfully! Please check your phone.');
    } catch (error) {
      setOtpError('Could not send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginVerify = async () => {
    if (!otp.trim()) {
      setOtpError('Please enter the OTP');
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      const user = await verifyOtp(phone, otp);
      setUser(user);
      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (e) {
      setOtpError(e.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupStart = async () => {
    if (!validateSignupForm()) return;
    
    setLoading(true);
    setOtpError('');
    try {
      await registerPatient({ ...signupData, phone });
      setStep(2);
      setSuccessMessage('Registration initiated! OTP sent to your phone.');
    } catch (error) {
      setOtpError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupVerify = async () => {
    if (!otp.trim()) {
      setOtpError('Please enter the OTP');
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      const user = await verifySignupOtp(phone, otp);
      setUser(user);
      setSuccessMessage('Registration successful! Welcome to MediSync!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (e) {
      setOtpError(e.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setOtpError('');
    setSuccessMessage('');
    setFormErrors({});
    setOtp('');
    if (tab === 0) {
      setPhone('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Patient Portal</h2>
              <p className="text-blue-100">Secure access to your health records</p>
            </div>
            <Link to="/" className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
            {['Login', 'Sign Up'].map((label, i) => (
              <button
                key={i}
                onClick={() => { setTab(i); resetForm(); }}
                className={`flex-1 py-3 px-4 text-center rounded-lg font-semibold transition-all ${
                  tab === i
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2].map(s => (
              <div
                key={s}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-all ${
                  step === s
                    ? 'bg-blue-600 text-white shadow-lg'
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
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-center"
              >
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {otpError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-center"
              >
                {otpError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <AnimatePresence mode="wait">
            {tab === 0 ? (
              // LOGIN FLOW
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number or Patient ID
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your phone or patient ID"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    <button
                      onClick={handleLoginSend}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Sending OTP...</span>
                        </div>
                      ) : 'Send OTP'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-lg font-mono"
                      />
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        Demo OTP: 123456
                      </p>
                    </div>
                    <button
                      onClick={handleLoginVerify}
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
                  </div>
                )}
              </motion.div>
            ) : (
              // SIGNUP FLOW
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 ? (
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name *"
                        value={signupData.name}
                        onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          formErrors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.name && <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="number"
                          name="age"
                          placeholder="Age *"
                          value={signupData.age}
                          onChange={e => setSignupData({ ...signupData, age: e.target.value })}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            formErrors.age ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.age && <p className="text-red-600 text-xs mt-1">{formErrors.age}</p>}
                      </div>
                      <div>
                        <select
                          name="sex"
                          value={signupData.sex}
                          onChange={e => setSignupData({ ...signupData, sex: e.target.value })}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            formErrors.sex ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Gender *</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {formErrors.sex && <p className="text-red-600 text-xs mt-1">{formErrors.sex}</p>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="number"
                          name="weight"
                          placeholder="Weight (kg) *"
                          value={signupData.weight}
                          onChange={e => setSignupData({ ...signupData, weight: e.target.value })}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            formErrors.weight ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.weight && <p className="text-red-600 text-xs mt-1">{formErrors.weight}</p>}
                      </div>
                      <div>
                        <input
                          type="number"
                          name="height"
                          placeholder="Height (cm) *"
                          value={signupData.height}
                          onChange={e => setSignupData({ ...signupData, height: e.target.value })}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            formErrors.height ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.height && <p className="text-red-600 text-xs mt-1">{formErrors.height}</p>}
                      </div>
                    </div>
                    
                    <input
                      type="text"
                      name="allergies"
                      placeholder="Known Allergies (optional)"
                      value={signupData.allergies}
                      onChange={e => setSignupData({ ...signupData, allergies: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    
                    <input
                      type="text"
                      name="chronic"
                      placeholder="Chronic Conditions (optional)"
                      value={signupData.chronic}
                      onChange={e => setSignupData({ ...signupData, chronic: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    
                    <div>
                      <input
                        type="text"
                        placeholder="Phone Number *"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          formErrors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.phone && <p className="text-red-600 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                    
                    <button
                      onClick={handleSignupStart}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Registering...</span>
                        </div>
                      ) : 'Register'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-lg font-mono"
                      />
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        Demo OTP: 123456
                      </p>
                    </div>
                    <button
                      onClick={handleSignupVerify}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Verifying...</span>
                        </div>
                      ) : 'Complete Registration'}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Demo Note */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              <span className="font-semibold">Demo Mode:</span> Use OTP "123456" for authentication
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}