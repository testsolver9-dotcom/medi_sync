// File: src/pages/doctor/LocationSelection.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../../components/doctor/StepIndicator";
import FancyButton from "../../components/FancyButton";
import { useDoctorStore } from "../../store/useDoctorStore";

const LOCS = [
  { id: "hospital", label: "Hospital", desc: "Hospital-based practice" },
  { id: "clinic",  label: "Home Clinic", desc: "Private clinic practice" },
];

export default function LocationSelection() {
  const navigate = useNavigate();
  const setLocation = useDoctorStore((s) => s.setLocation);
  const [selected, setSelected] = useState(null);

  const next = () => {
    setLocation(selected);
    navigate("/doctor/access");
  };

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <StepIndicator current={2} />
        <h2 className="text-2xl font-semibold text-gray-800">
          Select Practice Location
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {LOCS.map((loc) => (
            <div
              key={loc.id}
              onClick={() => setSelected(loc.id)}
              className={`cursor-pointer border-2 rounded-lg p-4 flex items-center space-x-4 transition 
                ${selected === loc.id 
                  ? "border-teal-600 bg-teal-50 shadow-lg" 
                  : "border-gray-200 hover:border-teal-400"}`}
            >
              <div className="p-2 bg-gray-100 rounded-full">
                {/* insert proper Heroicon */}
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d={loc.id==="hospital" 
                    ? "M3 7h18M5 7v11h14V7" 
                    : "M4 12l8-8 8 8v7H4v-7Z"} 
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">{loc.label}</p>
                <p className="text-sm text-gray-500">{loc.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <FancyButton
          disabled={!selected}
          onClick={next}
        >
          Continue
        </FancyButton>
      </div>
    </div>
  );
}
