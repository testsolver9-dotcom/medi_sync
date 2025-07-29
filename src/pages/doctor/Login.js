// // // File: src/pages/doctor/Login.js
// // // import React, { useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import StepIndicator from "../../components/doctor/StepIndicator";
// // // import FancyButton from "../../components/FancyButton";
// // // import { sendDoctorOtp, verifyDoctorOtp } from "../../services/doctorApi";
// // // import { useDoctorStore } from "../../store/useDoctorStore";

// // // export default function DoctorLogin() {
// // //   const navigate = useNavigate();
// // //   const setDoctor = useDoctorStore((s) => s.setDoctor);

// // //   const [step, setStep] = useState(1);
// // //   const [doctorId, setDoctorId] = useState("");
// // //   const [otp, setOtp] = useState("");
// // //   const [loading, setLoading] = useState(false);

// // //   const handleNext = async () => {
// // //     setLoading(true);
// // //     try {
// // //       if (step === 1) {
// // //         await sendDoctorOtp(doctorId);
// // //         setStep(2);
// // //       } else {
// // //         const { doctor } = await verifyDoctorOtp(doctorId, otp);
// // //         setDoctor(doctor);
// // //         navigate("/doctor/location");
// // //       }
// // //     } catch {
// // //       // show error toast...
// // //       alert("Oops! Something went wrong.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center p-4">
// // //       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 relative overflow-hidden">
// // //         <StepIndicator current={step} />
// // //         <h1 className="text-3xl font-bold text-center text-gray-800">
// // //           {step === 1 ? "Doctor Login" : "Verify OTP"}
// // //         </h1>

// // //         {step === 1 ? (
// // //           <input
// // //             type="text"
// // //             placeholder="Enter Doctor ID"
// // //             value={doctorId}
// // //             onChange={(e) => setDoctorId(e.target.value)}
// // //             className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-teal-500 focus:ring-0 transition"
// // //           />
// // //         ) : (
// // //           <input
// // //             type="text"
// // //             placeholder="Enter 6-digit OTP"
// // //             value={otp}
// // //             onChange={(e) => setOtp(e.target.value)}
// // //             className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-teal-500 focus:ring-0 transition"
// // //           />
// // //         )}

// // //         <FancyButton loading={loading} onClick={handleNext}>
// // //           {step === 1 ? "Get OTP" : "Verify & Continue"}
// // //         </FancyButton>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // File: src/pages/doctor/Login.js

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { sendDoctorOtp, verifyDoctorOtp } from '../../services/doctorApi';
// import StepIndicator from '../../components/doctor/StepIndicator';

// export default function DoctorLogin() {
//   const navigate = useNavigate();

//   const [doctorId, setDoctorId] = useState('');
//   const [otp, setOtp] = useState('');
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const handleGetOtp = async () => {
//     if (!doctorId.trim()) {
//       alert('Please enter your Doctor ID');
//       return;
//     }
//     setLoading(true);
//     try {
//       await sendDoctorOtp(doctorId);
//       setStep(2);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to send OTP. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerify = async () => {
//     if (!otp.trim()) {
//       alert('Please enter the OTP you received');
//       return;
//     }
//     setLoading(true);
//     try {
//       await verifyDoctorOtp(doctorId, otp);
//       // **** NAVIGATE TO LOCATION SELECTION NEXT ****
//       navigate('/doctor/location');
//     } catch (err) {
//       console.error(err);
//       alert('Invalid OTP, please retry');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
//       <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
//         <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
//           MediSync
//         </h1>

//         {/* Steps: 1=ID, 2=OTP, 3=Done */}
//         <StepIndicator current={step} total={3} className="mb-8" />

//         {step === 1 ? (
//           <>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Doctor ID
//             </label>
//             <input
//               type="text"
//               value={doctorId}
//               onChange={e => setDoctorId(e.target.value)}
//               placeholder="Enter your Doctor ID"
//               className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 mb-4"
//             />
//             <button
//               onClick={handleGetOtp}
//               disabled={loading}
//               className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
//             >
//               {loading ? 'Sending OTP…' : 'Get OTP'}
//             </button>
//           </>
//         ) : (
//           <>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Enter OTP
//             </label>
//             <input
//               type="text"
//               value={otp}
//               onChange={e => setOtp(e.target.value)}
//               placeholder="6-digit code"
//               className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 mb-4"
//             />
//             <button
//               onClick={handleVerify}
//               disabled={loading}
//               className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
//             >
//               {loading ? 'Verifying…' : 'Verify & Continue'}
//             </button>
//             <p
//               className="mt-4 text-center text-sm text-gray-500 hover:underline cursor-pointer"
//               onClick={() => setStep(1)}
//             >
//               Back to ID
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
// File: src/pages/doctor/Login.js
// File: src/pages/doctor/Login.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendDoctorOtp, verifyDoctorOtp } from '../../services/doctorApi';
import { useDoctorStore } from '../../store/useDoctorStore';
import StepIndicator from '../../components/doctor/StepIndicator';

export default function DoctorLogin() {
  const navigate = useNavigate();
  const setDoctor = useDoctorStore(state => state.setDoctor);

  const [doctorId, setDoctorId] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const handleGetOtp = async () => {
    if (!doctorId.trim()) {
      alert('Please enter your Doctor ID');
      return;
    }
    setLoading(true);
    try {
      await sendDoctorOtp(doctorId);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp.trim()) {
      setOtpError('Please enter the OTP');
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      const { doctor } = await verifyDoctorOtp(doctorId, otp);
      setDoctor(doctor);
      navigate('/doctor/location');
    } catch (err) {
      setOtpError(err.message || 'Invalid OTP, please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          MediSync
        </h1>

        <StepIndicator current={step} total={3} className="mb-8" />

        {step === 1 ? (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor ID
            </label>
            <input
              type="text"
              value={doctorId}
              onChange={e => setDoctorId(e.target.value)}
              placeholder="e.g. D-123456"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 mb-4"
            />
            <button
              onClick={handleGetOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Sending OTP…' : 'Get OTP'}
            </button>
            <p className="mt-4 text-center text-sm">
              New here?{' '}
              <Link to="/doctor/register" className="text-green-600 underline">
                Register as Doctor
              </Link>
            </p>
          </>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="6-digit code"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 mb-4"
            />
            {otpError && <div className="text-red-600 text-sm mb-2">{otpError}</div>}
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Verifying…' : 'Verify & Continue'}
            </button>
            <p
              className="mt-4 text-center text-sm text-gray-500 hover:underline cursor-pointer"
              onClick={() => setStep(1)}
            >
              Back to ID
            </p>
          </>
        )}
      </div>
    </div>
  );
}

