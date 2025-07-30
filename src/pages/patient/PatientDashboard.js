import React, { useEffect, useState } from "react";
import SidebarNav from "../../components/SidebarNav";
import { useUserStore } from "../../store/user_store";
import FancyButton from "../../components/FancyButton";
import { fetchPatientRecords, fetchPathReports, fetchAccessLogs } from "../../services/mockApi";
import ChatWidget from "../../components/ChatWidget";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function PatientDashboard() {
  const user = useUserStore((s) => s.user);
  const [records, setRecords] = useState([]);
  const [reports, setReports] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRecords: 0,
    totalReports: 0,
    totalAccess: 0,
    lastVisit: null
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [recordsData, reportsData, logsData] = await Promise.all([
          fetchPatientRecords(user.id),
          fetchPathReports(user.id),
          fetchAccessLogs(user.id)
        ]);
        
        setRecords(recordsData);
        setReports(reportsData);
        setLogs(logsData);
        
        setStats({
          totalRecords: recordsData.length,
          totalReports: reportsData.length,
          totalAccess: logsData.length,
          lastVisit: recordsData.length > 0 ? recordsData[0].date : null
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const quickStats = [
    { label: "Medical Records", value: stats.totalRecords, color: "blue", icon: "📋" },
    { label: "Lab Reports", value: stats.totalReports, color: "green", icon: "🧪" },
    { label: "Access Logs", value: stats.totalAccess, color: "purple", icon: "👁️" },
    { label: "Last Visit", value: stats.lastVisit || "No visits", color: "orange", icon: "📅" }
  ];

  const quickActions = [
    { label: "View Records", path: "/records", icon: "📋", color: "blue" },
    { label: "Lab Reports", path: "/reports", icon: "🧪", color: "green" },
    { label: "AI Health Chat", path: "/ai-chat", icon: "🤖", color: "purple" },
    { label: "Emergency Support", path: "/emergency", icon: "🚨", color: "red" }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl shadow-lg p-8 text-white"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-blue-100">Your health dashboard is ready. Here's your overview:</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Patient Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { label: "Full Name", value: user.name, icon: "👤" },
              { label: "Age", value: `${user.age} years`, icon: "🎂" },
              { label: "Gender", value: user.sex, icon: "⚕️" },
              { label: "Weight", value: user.weight, icon: "⚖️" },
              { label: "Height", value: user.height, icon: "📏" },
              { label: "Blood Type", value: "O+", icon: "🩸" },
              { label: "Allergies", value: user.allergies || "None reported", icon: "⚠️" },
              { label: "Chronic Conditions", value: user.chronic || "None reported", icon: "💊" }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{item.icon}</span>
                  <h4 className="text-gray-600 text-sm font-medium">{item.label}</h4>
                </div>
                <p className="text-gray-800 font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {action.label}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recent Activity</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.slice(0, 5).map((log, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-800">{log.action}</p>
                      <p className="text-sm text-gray-600">by {log.by}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{log.time}</span>
                </div>
              ))}
              {logs.length > 5 && (
                <Link to="/access-logs" className="block text-center text-blue-600 hover:text-blue-700 font-medium">
                  View all activity →
                </Link>
              )}
            </div>
          )}
        </motion.div>

        {/* Health Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl shadow-lg p-8 text-white"
        >
          <h2 className="text-2xl font-semibold mb-4">💡 Today's Health Tip</h2>
          <p className="text-green-100 text-lg">
            Stay hydrated! Aim for 8 glasses of water daily to maintain optimal health and support your body's natural functions.
          </p>
        </motion.div>
      </main>
      <ChatWidget />
    </div>
  );
}