import React, { useEffect, useState } from "react";
import SidebarNav from "../../components/SidebarNav";
import { fetchAccessLogs } from "../../services/mockApi";
import { useUserStore } from "../../store/user_store";
import { motion } from "framer-motion";

export default function AccessLogs() {
  const user = useUserStore((s) => s.user);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccessLogs(user.id)
      .then((data) => setLogs(data))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto p-8">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold mb-6"
        >
          My Access Logs
        </motion.h2>

        {loading ? (
          <p>Loading…</p>
        ) : logs.length === 0 ? (
          <p>No access history available.</p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full bg-white rounded-2xl shadow divide-y">
              <thead className="bg-gray-100">
                <tr>
                  {["Date-Time", "Action", "Accessed By"].map((h) => (
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
                {logs.map((l, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2">{l.time}</td>
                    <td className="px-4 py-2">{l.action}</td>
                    <td className="px-4 py-2">{l.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
