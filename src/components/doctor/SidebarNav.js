import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDoctorStore } from "../../store/useDoctorStore";

export default function SidebarNav() {
  const navigate = useNavigate();
  const logout = () => {
    useDoctorStore.getState().setDoctor(null);
    navigate("/doctor/login");
  };

  const links = [
    { to: "/doctor/dashboard", label: "Dashboard" },
    { to: "/doctor/records/new", label: "New Record" },
    { to: "/doctor/history", label: "Access History" },
  ];

  return (
    <div className="w-64 bg-white shadow h-full flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-teal-700">MediSync</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive ? "bg-teal-600 text-white" : "hover:bg-gray-100"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        className="m-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
