import React, { useEffect, useState } from "react";
import SidebarNav from "../../components/SidebarNav";
import { fetchPathReports } from "../../services/mockApi";
import { useUserStore } from "../../store/user_store";
import { motion } from "framer-motion";

export default function Reports() {
  const user = useUserStore((s) => s.user);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setLoading(true);
    fetchPathReports(user.id)
      .then((data) => setReports(data))
      .catch(() => setError("Failed to load reports. Please try again."))
      .finally(() => setLoading(false));
  }, [user]);

  const retryFetch = () => {
    setError("");
    setLoading(true);
    fetchPathReports(user.id)
      .then((data) => setReports(data))
      .catch(() => setError("Failed to load reports. Please try again."))
      .finally(() => setLoading(false));
  };

  const openSummary = (report) => {
    setSelectedReport(report);
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
          My Pathology Reports
        </motion.h2>

        {error ? (
          <div className="mb-4 text-center">
            <p className="text-red-600 mb-2">{error}</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={retryFetch}>Retry</button>
          </div>
        ) : loading ? (
          <p>Loading…</p>
        ) : reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full bg-white rounded-2xl shadow divide-y">
              <thead className="bg-gray-100">
                <tr>
                  {["Date", "Lab Name", "Summary", "Download"].map((h) => (
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
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-2">{r.date}</td>
                    <td className="px-4 py-2">{r.labName}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openSummary(r)}
                        className="text-blue-600 hover:underline"
                      >
                        📝 View Summary
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

        {/* Modal for report summary */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-gray-700"
                onClick={() => setSelectedReport(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-4">Report Summary</h3>
              <div className="space-y-2">
                <div><span className="font-semibold">Date:</span> {selectedReport.date}</div>
                <div><span className="font-semibold">Lab Name:</span> {selectedReport.labName}</div>
                <div><span className="font-semibold">Summary:</span> {selectedReport.summary}</div>
                <div><span className="font-semibold">File:</span> <a href={selectedReport.fileUrl} target="_blank" rel="noreferrer" className="text-green-600 underline">Download</a></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
