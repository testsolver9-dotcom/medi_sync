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

  // NEW Registration fields - completely replacing old ones
  // registration fields for patient
  // align with database schema: name, email, phone, gender, address, password
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Email validation helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation helper
  const isValidPassword = (password) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password);
  };

  // Phone validation helper
  const isValidPhone = (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateSignupForm = () => {
    const errors = {};
    // destructure fields from signupData
    const { name, email, phone, gender, address, password, confirmPassword } = signupData;
    
    // Name validation
    if (!name.trim()) {
      errors.name = "Name is required";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!email.trim()) {
      errors.email = "Email address is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!isValidPhone(phone)) {
      errors.phone = "Please enter a valid phone number (min 10 digits)";
    }


    // no date of birth in DB schema so no validation here

    // Gender validation
    if (!gender.trim()) {
      errors.gender = "Gender is required";
    }

    // Address validation
    if (!address.trim()) {
      errors.address = "Address is required";
    } else if (address.trim().length < 10) {
      errors.address = "Please enter a complete address (minimum 10 characters)";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (!isValidPassword(password)) {
      errors.password = "Password must be at least 8 characters with uppercase, lowercase, and number";
    }

    // Confirm Password validation
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
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
      await registerPatient(signupData);
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
      const user = await verifySignupOtp(signupData.phone, otp);
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

  const handleInputChange = (field, value) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
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
              // SIGNUP FLOW - COMPLETELY NEW FORM
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 ? (
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={signupData.name}
                        onChange={e => handleInputChange('name', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          formErrors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.name && <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>}
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={signupData.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          formErrors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.email && <p className="text-red-600 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={signupData.phone}
                        onChange={e => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          formErrors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.phone && <p className="text-red-600 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                    
                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                      <select
                        value={signupData.gender}
                        onChange={e => handleInputChange('gender', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          formErrors.gender ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {formErrors.gender && <p className="text-red-600 text-xs mt-1">{formErrors.gender}</p>}
                    </div>
                    
                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                      <textarea
                        placeholder="Enter your complete address (street, city, state, postal code)"
                        value={signupData.address}
                        onChange={e => handleInputChange('address', e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                          formErrors.address ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.address && <p className="text-red-600 text-xs mt-1">{formErrors.address}</p>}
                    </div>
                    
                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                      <input
                        type="password"
                        placeholder="Enter a strong password"
                        value={signupData.password}
                        onChange={e => handleInputChange('password', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          formErrors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.password && <p className="text-red-600 text-xs mt-1">{formErrors.password}</p>}
                      <p className="text-xs text-gray-500 mt-1">
                        Must be 8+ characters with uppercase, lowercase, and number
                      </p>
                    </div>
                    
                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        placeholder="Confirm your password"
                        value={signupData.confirmPassword}
                        onChange={e => handleInputChange('confirmPassword', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.confirmPassword && <p className="text-red-600 text-xs mt-1">{formErrors.confirmPassword}</p>}
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
