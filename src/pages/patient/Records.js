import React, { useEffect, useState } from "react";
import SidebarNav from "../../components/SidebarNav";
import { fetchPatientRecords } from "../../services/mockApi";
import { useUserStore } from "../../store/user_store";
import { motion } from "framer-motion";

export default function Records() {
  const user = useUserStore((s) => s.user);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setLoading(true);
    fetchPatientRecords(user.id)
      .then((data) => setRecords(data))
      .catch(() => setError("Failed to load records. Please try again."))
      .finally(() => setLoading(false));
  }, [user]);

  const retryFetch = () => {
    setError("");
    setLoading(true);
    fetchPatientRecords(user.id)
      .then((data) => setRecords(data))
      .catch(() => setError("Failed to load records. Please try again."))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto p-8">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold mb-6"
        >
          My Medical Records
        </motion.h2>

        {error ? (
          <div className="mb-4 text-center">
            <p className="text-red-600 mb-2">{error}</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={retryFetch}>Retry</button>
          </div>
        ) : loading ? (
          <p>Loading…</p>
        ) : records.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full bg-white rounded-2xl shadow divide-y">
              <thead className="bg-gray-100">
                <tr>
                  {["Date", "Doctor", "View", "Download"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-gray-600 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {records.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-2">{r.date}</td>
                    <td className="px-4 py-2">{r.doctorName}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setSelectedRecord(r)}
                      >
                        👁 View
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <a
                        href={r.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        ⬇ Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for record details */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-gray-700"
                onClick={() => setSelectedRecord(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-4">Record Details</h3>
              <div className="space-y-2">
                <div><span className="font-semibold">Date:</span> {selectedRecord.date}</div>
                <div><span className="font-semibold">Doctor:</span> {selectedRecord.doctorName}</div>
                {/* Show details using new medical_record fields */}
                {selectedRecord.title && (
                  <div><span className="font-semibold">Title:</span> {selectedRecord.title}</div>
                )}
                {selectedRecord.description && (
                  <div><span className="font-semibold">Description:</span> {selectedRecord.description}</div>
                )}
                {selectedRecord.prescription && (
                  <div><span className="font-semibold">Prescription:</span> {selectedRecord.prescription}</div>
                )}
                {selectedRecord.tests_recommended && (
                  <div><span className="font-semibold">Tests Recommended:</span> {selectedRecord.tests_recommended}</div>
                )}
                {selectedRecord.notes && (
                  <div><span className="font-semibold">Notes:</span> {selectedRecord.notes}</div>
                )}
                <div><span className="font-semibold">File:</span> <a href={selectedRecord.fileUrl} target="_blank" rel="noreferrer" className="text-green-600 underline">Download</a></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
