// File: src/pages/doctor/Dashboard.js
import React, { useEffect, useState } from "react";
import { fetchRecords } from "../../services/doctorApi";
import { useDoctorStore } from "../../store/useDoctorStore";
import SidebarNav from "../../components/doctor/SidebarNav";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FancyButton from "../../components/FancyButton";
export default function DoctorDashboard() {
  const { doctor, patient, location, records, setRecords } = useDoctorStore();
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    fetchRecords(doctor.id, patient.id)
      .then((res) => setRecords(res.records))
      .catch(() => setError("Failed to load patient records. Please try again."));
  }, [doctor, patient, setRecords]);

  const retryFetch = () => {
    setError("");
    fetchRecords(doctor.id, patient.id)
      .then((res) => setRecords(res.records))
      .catch(() => setError("Failed to load patient records. Please try again."));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto p-8">
        {/* Patient & location banner */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h1 className="text-2xl font-bold">{patient.name}’s Records</h1>
          <p className="text-gray-500">Location: {location}</p>
        </div>

        {/* Upload CTA */}
        <Link to="/doctor/records/new" className="mb-6 inline-block">
          <FancyButton>+ New Consultation</FancyButton>
        </Link>

        {error ? (
          <div className="mb-4 text-center">
            <p className="text-red-600 mb-2">{error}</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={retryFetch}>Retry</button>
          </div>
        ) : (
          <>
            {/* Records Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {records.map((r) => (
                <motion.div
                  key={r.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl shadow p-6 cursor-pointer"
                >
                  <p className="font-semibold">{r.date}</p>
                  <p className="text-gray-700 mt-2">{r.symptoms}</p>
                  <Link
                    to={`/doctor/records/${r.id}`}
                    className="mt-4 inline-block text-teal-600 underline"
                  >
                    View Details
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
