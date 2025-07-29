import React, { useEffect, useState } from "react";
import SidebarNav from "../../components/SidebarNav";
import { useUserStore } from "../../store/user_store";
import FancyButton from "../../components/FancyButton";
import { fetchPatientRecords, fetchPathReports, fetchAccessLogs, uploadRecord, registerPatient, verifySignupOtp } from "../../services/mockApi";

import ChatWidget from "../../components/ChatWidget";
import { motion } from "framer-motion";

export default function PatientDashboard() {
  const user = useUserStore((s)=>s.user);
  const [records, setRecords] = useState([]);
  const [reports, setReports] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(()=>{
    fetchPatientRecords(user.id).then(setRecords);
    fetchPathReports(user.id).then(setReports);
    fetchAccessLogs(user.id).then(setLogs);
  },[user]);

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Top Info */}
        <motion.div
          initial={{ opacity:0,y:20 }}
          animate={{ opacity:1,y:0 }}
          transition={{ duration:0.3 }}
          className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[
            ["Name",user.name],
            ["Age",user.age],
            ["Sex",user.sex],
            ["Weight",user.weight],
            ["Height",user.height],
            ["Allergies",user.allergies||"—"],
            ["Chronic Illness",user.chronic||"—"]
          ].map(([lbl,val])=>(
            <div key={lbl} className="space-y-1">
              <h4 className="text-gray-500 text-sm">{lbl}</h4>
              <p className="text-gray-800 font-medium">{val}</p>
            </div>
          ))}
        </motion.div>

        {/* Medical Records */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Medical Records</h2>
          <FancyButton onClick={()=>uploadRecord(user.id)}>Upload Record (Not verified)</FancyButton>
          <div className="overflow-auto">
            <table className="min-w-full bg-white rounded-2xl shadow divide-y">
              <thead><tr className="bg-gray-100">
                {["Date","Doctor","View","Download"].map(h=>(
                  <th key={h} className="px-4 py-2 text-left text-gray-600">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y">
                {records.map(r=>(
                  <tr key={r.id}>
                    <td className="px-4 py-2">{r.date}</td>
                    <td className="px-4 py-2">{r.doctorName}</td>
                    <td className="px-4 py-2"><button className="text-blue-600 hover:underline">👁</button></td>
                    <td className="px-4 py-2"><button className="text-green-600 hover:underline">⬇</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Path Reports */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Pathology Reports</h2>
          <div className="overflow-auto">
            <table className="min-w-full bg-white rounded-2xl shadow divide-y">
              <thead><tr className="bg-gray-100">
                {["Date","Lab","Summary","Download"].map(h=>(
                  <th key={h} className="px-4 py-2 text-left text-gray-600">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y">
                {reports.map(r=>(
                  <tr key={r.id}>
                    <td className="px-4 py-2">{r.date}</td>
                    <td className="px-4 py-2">{r.labName}</td>
                    <td className="px-4 py-2">
                      <button className="text-blue-600 hover:underline" onClick={()=>alert(r.summary)}>📝</button>
                    </td>
                    <td className="px-4 py-2"><button className="text-green-600 hover:underline">⬇</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Access Logs */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Access Logs</h2>
          <div className="overflow-auto">
            <table className="min-w-full bg-white rounded-2xl shadow divide-y">
              <thead><tr className="bg-gray-100">
                {["Date-Time","Action","By"].map(h=>(
                  <th key={h} className="px-4 py-2 text-left text-gray-600">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y">
                {logs.map((l,i)=>(
                  <tr key={i}>
                    <td className="px-4 py-2">{l.time}</td>
                    <td className="px-4 py-2">{l.action}</td>
                    <td className="px-4 py-2">{l.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <ChatWidget />
    </div>
  );
}
