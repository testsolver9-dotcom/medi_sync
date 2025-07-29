// File: src/pages/doctor/PatientAccess.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../../components/doctor/StepIndicator";
import FancyButton from "../../components/FancyButton";
import { requestPatientConsent } from "../../services/doctorApi";
import { useDoctorStore } from "../../store/useDoctorStore";

export default function PatientAccess() {
  const navigate = useNavigate();
  const setPatient = useDoctorStore((s) => s.setPatient);
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [consentStatus, setConsentStatus] = useState("");

  const onRequest = async () => {
    setLoading(true);
    setConsentStatus("");
    try {
      const { patient } = await requestPatientConsent(patientId);
      setPatient(patient);
      setConsentStatus("Consent granted by patient. Access allowed.");
      setTimeout(() => {
        navigate("/doctor/dashboard");
      }, 1200);
    } catch (e) {
      setConsentStatus("Consent request failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <StepIndicator current={3} />
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Consent Required
        </h2>
        <p className="text-center text-gray-600">
          Enter the patient’s ID to request OTP consent.
        </p>

        {/* Consent status message */}
        {consentStatus && (
          <div className={`text-center font-semibold mb-2 ${consentStatus.includes('granted') ? 'text-green-600' : 'text-red-600'}`}>{consentStatus}</div>
        )}

        <input
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Patient ID"
          className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-teal-500 transition"
        />

        <FancyButton loading={loading} onClick={onRequest}>
          {loading ? "Waiting for Patient…" : "Request Consent"}
        </FancyButton>
      </div>
    </div>
  );
}
