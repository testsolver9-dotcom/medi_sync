import React, { useEffect } from "react";
import { motion } from "framer-motion";
import SidebarNav from "../../components/doctor/SidebarNav";
import { fetchAccessHistory } from "../../services/doctorApi";
import { useDoctorStore } from "../../store/useDoctorStore";

export default function AccessHistory() {
  const { doctor, accessHistory, setAccessHistory } = useDoctorStore();

  useEffect(() => {
    if (doctor) {
      fetchAccessHistory(doctor.id).then((res) => {
        setAccessHistory(res.history);
      });
    }
  }, [doctor, setAccessHistory]);

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Access History
        </h2>
        {accessHistory.length === 0 ? (
          <p className="text-gray-500">No history available.</p>
        ) : (
          <div className="space-y-4">
            {accessHistory.map((h, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-2 sm:space-y-0 transition"
              >
                <div className="text-gray-600 text-sm">
                  {h.time}
                </div>
                <div className="flex-1 px-4">
                  <p>
                    <span className="font-semibold">Patient ID:</span>{" "}
                    {h.patientId}
                  </p>
                  <p>
                    <span className="font-semibold">Action:</span>{" "}
                    {h.action}
                  </p>
                </div>
                <div className="font-medium text-teal-600">
                  {h.location}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
