// File: src/pages/doctor/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  registerDoctor,
  verifyDoctorSignupOtp,
} from '../../services/doctorApi';
import { useDoctorStore } from '../../store/useDoctorStore';
import StepIndicator from '../../components/doctor/StepIndicator';

export default function DoctorRegister() {
  const navigate = useNavigate();
  const setDoctor = useDoctorStore(s => s.setDoctor);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    nmcNumber: '',
    phone: '',
    acceptTerms: false,
  });
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState("");

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const startSignup = async () => {
    const { name, email, nmcNumber, phone, acceptTerms } = form;
    if (!name || !email || !nmcNumber || !phone || !acceptTerms) {
      return alert('Fill all fields and accept terms');
    }
    setLoading(true);
    try {
      await registerDoctor({ name, email, nmcNumber, phone });
      setStep(2);
    } catch {
      alert('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const verifySignup = async () => {
    if (!otp.trim()) {
      setOtpError('Enter OTP');
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      const { doctor } = await verifyDoctorSignupOtp(form.nmcNumber, otp);
      setDoctor(doctor);
      navigate('/doctor/location');
    } catch (e) {
      setOtpError(e.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          Doctor Registration
        </h1>

        <StepIndicator current={step} total={2} className="mb-8" />

        {step === 1 ? (
          <>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full mb-3 px-4 py-2 border rounded"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              type="email"
              className="w-full mb-3 px-4 py-2 border rounded"
            />
            <input
              name="nmcNumber"
              value={form.nmcNumber}
              onChange={handleChange}
              placeholder="NMC Registration No."
              className="w-full mb-3 px-4 py-2 border rounded"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full mb-3 px-4 py-2 border rounded"
            />
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={form.acceptTerms}
                onChange={handleChange}
                className="mr-2"
              />
              I accept the <a href="/terms" className="underline">Terms & Conditions</a>
            </label>
            <button
              onClick={startSignup}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Registering…' : 'Register'}
            </button>
          </>
        ) : (
          <>
            <input
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full mb-4 px-4 py-2 border rounded"
            />
            {otpError && <div className="text-red-600 text-sm mb-2">{otpError}</div>}
            <button
              onClick={verifySignup}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Verifying…' : 'Verify & Continue'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
