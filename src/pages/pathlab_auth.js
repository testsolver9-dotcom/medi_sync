import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function PathLabAuth() {
  const [tab, setTab] = useState(0); // 0 = login, 1 = register
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    labId: '',
    password: '',
    name: '',
    email: '',
    regNo: '',
    phone: '',
    address: '',
    city: '',
    licenseNo: ''
  });
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateLoginForm = () => {
    const errors = {};
    if (!form.labId.trim()) errors.labId = "Lab ID is required";
    if (!form.password.trim()) errors.password = "Password is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Lab name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.regNo.trim()) errors.regNo = "Registration number is required";
    if (!form.phone.trim()) errors.phone = "Phone number is required";
    if (!form.address.trim()) errors.address = "Address is required";
    if (!form.city.trim()) errors.city = "City is required";
    if (!form.licenseNo.trim()) errors.licenseNo = "License number is required";
    if (!form.password.trim()) errors.password = "Password is required";
    
    // Email validation
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = e => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    
    setLoading(true);
    setMessage("");
    setTimeout(() => {
      setLoading(false);
      setMessage("Login successful! Welcome to PathLab Portal (Demo Mode)");
    }, 1000);
  };

  const handleRegister = e => {
    e.preventDefault();
    if (!validateRegisterForm()) return;
    
    setLoading(true);
    setMessage("");
    setTimeout(() => {
      setLoading(false);
      setMessage("Registration successful! Your account is under review (Demo Mode)");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">PathLab Portal</h1>
          <p className="text-orange-100">Manage laboratory reports and test results</p>
        </div>

        <div className="p-8">
          {/* Tabs */}
          <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
            {["Login", "Register"].map((label, i) => (
              <button
                key={i}
                onClick={() => { 
                  setTab(i); 
                  setMessage(""); 
                  setFormErrors({});
                  setForm({
                    labId: '',
                    password: '',
                    name: '',
                    email: '',
                    regNo: '',
                    phone: '',
                    address: '',
                    city: '',
                    licenseNo: ''
                  });
                }}
                className={`flex-1 py-3 px-4 text-center rounded-lg font-semibold transition-all ${
                  tab === i 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Success/Error Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-4 rounded-lg text-center font-semibold ${
                  message.includes('successful') 
                    ? 'bg-green-100 border border-green-300 text-green-700' 
                    : 'bg-red-100 border border-red-300 text-red-700'
                }`}
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {tab === 0 ? (
              // LOGIN TAB
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin} 
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lab ID
                  </label>
                  <input
                    name="labId"
                    value={form.labId}
                    onChange={handleChange}
                    placeholder="e.g. LAB-12345"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                      formErrors.labId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.labId && <p className="text-red-600 text-xs mt-1">{formErrors.labId}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                      formErrors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.password && <p className="text-red-600 text-xs mt-1">{formErrors.password}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Logging in...</span>
                    </div>
                  ) : 'Login to Portal'}
                </button>
              </motion.form>
            ) : (
              // REGISTER TAB
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRegister} 
                className="space-y-6"
              >
                {/* Lab Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Laboratory Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Laboratory Name *"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                          formErrors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.name && <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email Address *"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                          formErrors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.email && <p className="text-red-600 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone Number *"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                          formErrors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.phone && <p className="text-red-600 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                    <div>
                      <input
                        name="regNo"
                        value={form.regNo}
                        onChange={handleChange}
                        placeholder="Registration No. *"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                          formErrors.regNo ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.regNo && <p className="text-red-600 text-xs mt-1">{formErrors.regNo}</p>}
                    </div>
                    <div>
                      <input
                        name="licenseNo"
                        value={form.licenseNo}
                        onChange={handleChange}
                        placeholder="License Number *"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                          formErrors.licenseNo ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.licenseNo && <p className="text-red-600 text-xs mt-1">{formErrors.licenseNo}</p>}
                    </div>
                    <div>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="City *"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                          formErrors.city ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.city && <p className="text-red-600 text-xs mt-1">{formErrors.city}</p>}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Complete Address *"
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none ${
                        formErrors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.address && <p className="text-red-600 text-xs mt-1">{formErrors.address}</p>}
                  </div>
                </div>

                {/* Account Setup */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Setup</h3>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create Password *"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                      formErrors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.password && <p className="text-red-600 text-xs mt-1">{formErrors.password}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Registering...</span>
                    </div>
                  ) : 'Register Laboratory'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
              ← Back to Home
            </Link>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-xs text-orange-700 text-center">
              <span className="font-semibold">Demo Mode:</span> This is a demonstration of the PathLab portal interface
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}