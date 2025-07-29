// File: src/pages/patient/PatientAuthModal.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Shared fields
  const [phone, setPhone] = useState('');
  const [otp, setOtp]     = useState('');

  // Signup fields
  const [signupData, setSignupData] = useState({
    name: '', age: '', sex: '', weight: '', height: '', allergies: '', chronic: ''
  });

  const handleLoginSend = async () => {
    if (!phone.trim()) return alert('Enter your phone or ID');
    setLoading(true);
    try {
      await sendOtp(phone);
      setStep(2);
    } catch {
      alert('Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginVerify = async () => {
    setLoading(true);
    setOtpError("");
    try {
      const user = await verifyOtp(phone, otp);
      setUser(user);
      navigate('/dashboard');
    } catch (e) {
      setOtpError(e.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupStart = async () => {
    const { name, age, sex, weight, height } = signupData;
    if (!name || !age || !sex || !weight || !height)
      return alert('Fill all required fields');
    setLoading(true);
    try {
      await registerPatient({ ...signupData, phone });
      setStep(2);
    } catch {
      alert('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupVerify = async () => {
    setLoading(true);
    setOtpError("");
    try {
      const user = await verifySignupOtp(phone, otp);
      setUser(user);
      navigate('/dashboard');
    } catch (e) {
      setOtpError(e.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        {/* Tabs */}
        <div className="flex mb-6">
          {['Login', 'Sign Up'].map((label, i) => (
            <button
              key={i}
              onClick={() => { setTab(i); setStep(1); }}
              className={`flex-1 py-2 text-center rounded-t-lg ${
                tab === i
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center space-x-2 mb-6">
          {[1,2].map(s => (
            <div
              key={s}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                step === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Body */}
        {tab === 0 ? (
          // ------- LOGIN FLOW -------
          step === 1 ? (
            <>
              <input
                type="text"
                placeholder="Phone or Patient ID"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full mb-4 px-4 py-2 border rounded"
              />
              <button
                onClick={handleLoginSend}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {loading ? 'Sending…' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full mb-4 px-4 py-2 border rounded"
              />
              {otpError && <div className="text-red-600 text-sm mb-2">{otpError}</div>}
              <button
                onClick={handleLoginVerify}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                {loading ? 'Verifying…' : 'Verify OTP'}
              </button>
            </>
          )
        ) : (
          // ------- SIGNUP FLOW -------
          step === 1 ? (
            <>
              <input
                type="text" name="name" placeholder="Full Name"
                value={signupData.name}
                onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                className="w-full mb-2 px-4 py-2 border rounded"
              />
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="number" name="age" placeholder="Age"
                  value={signupData.age}
                  onChange={e => setSignupData({ ...signupData, age: e.target.value })}
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="text" name="sex" placeholder="Sex"
                  value={signupData.sex}
                  onChange={e => setSignupData({ ...signupData, sex: e.target.value })}
                  className="px-4 py-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="number" name="weight" placeholder="Weight (kg)"
                  value={signupData.weight}
                  onChange={e => setSignupData({ ...signupData, weight: e.target.value })}
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="number" name="height" placeholder="Height (cm)"
                  value={signupData.height}
                  onChange={e => setSignupData({ ...signupData, height: e.target.value })}
                  className="px-4 py-2 border rounded"
                />
              </div>
              <input
                type="text" name="allergies" placeholder="Allergies (opt.)"
                value={signupData.allergies}
                onChange={e => setSignupData({ ...signupData, allergies: e.target.value })}
                className="w-full mb-2 px-4 py-2 border rounded"
              />
              <input
                type="text" name="chronic" placeholder="Chronic Illness (opt.)"
                value={signupData.chronic}
                onChange={e => setSignupData({ ...signupData, chronic: e.target.value })}
                className="w-full mb-2 px-4 py-2 border rounded"
              />
              <input
                type="text" placeholder="Phone Number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full mb-4 px-4 py-2 border rounded"
              />
              <button
                onClick={handleSignupStart}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {loading ? 'Registering…' : 'Register'}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full mb-4 px-4 py-2 border rounded"
              />
              {otpError && <div className="text-red-600 text-sm mb-2">{otpError}</div>}
              <button
                onClick={handleSignupVerify}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                {loading ? 'Verifying…' : 'Verify OTP'}
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
}
