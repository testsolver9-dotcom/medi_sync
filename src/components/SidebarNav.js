// shared sidebar nav (used in both doctor & patient dashboards)
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function SidebarNav() {
  const [open, setOpen] = useState(false);
  // Detect if user is a patient (no doctor role prop, or use context/store if available)
  // For now, always show Emergency Support link (can refine if needed)
  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow border"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open sidebar"
      >
        <span className="material-icons">menu</span>
      </button>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Sidebar */}
      <nav
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r shadow-lg z-50 transform transition-transform duration-200 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"} md:block`}
      >
        <div className="p-6 font-bold text-xl">MediSync</div>
        <ul className="space-y-2">
          <li>
            <NavLink to="/dashboard" className="block px-6 py-2 hover:bg-gray-100" onClick={() => setOpen(false)}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/records" className="block px-6 py-2 hover:bg-gray-100" onClick={() => setOpen(false)}>
              My Records
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" className="block px-6 py-2 hover:bg-gray-100" onClick={() => setOpen(false)}>
              Path Reports
            </NavLink>
          </li>
          <li>
            <NavLink to="/access-logs" className="block px-6 py-2 hover:bg-gray-100" onClick={() => setOpen(false)}>
              Access Logs
            </NavLink>
          </li>
          {/* Emergency Support link for patients */}
          <li>
            <NavLink to="/emergency" className="block px-6 py-2 hover:bg-red-100 text-red-600 font-semibold" onClick={() => setOpen(false)}>
              🚨 Emergency Support
            </NavLink>
          </li>
          <li>
            <NavLink to="/" className="block px-6 py-2 hover:bg-gray-100" onClick={() => setOpen(false)}>
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
