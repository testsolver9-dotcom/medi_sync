import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import SidebarNav from "../../components/doctor/SidebarNav";
import { useDoctorStore } from "../../store/useDoctorStore";

export default function ViewRecord() {
  const { recordId } = useParams();
  const record = useDoctorStore((s) =>
    s.records.find((r) => r.id === recordId)
  );

  if (!record) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SidebarNav />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Record not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <main className="flex-1 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800">
            Consultation Details
          </h2>

          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-semibold">Date:</span> {record.date}
            </p>
            <p>
              <span className="font-semibold">Patient:</span>{" "}
              {record.patientName || record.patientId}
            </p>
            <p>
              <span className="font-semibold">Doctor:</span>{" "}
              {record.doctorName}
            </p>
            <p>
              <span className="font-semibold">Location:</span>{" "}
              {record.location}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">Symptoms</h3>
              <p className="mt-2 text-gray-700">{record.symptoms}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Diagnosis</h3>
              <p className="mt-2 text-gray-700">{record.diagnosis}</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
