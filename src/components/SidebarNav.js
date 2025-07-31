// shared sidebar nav (used in patient dashboards)
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useUserStore } from "../store/user_store";
import { motion, AnimatePresence } from "framer-motion";

export default function SidebarNav() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const user = useUserStore(s => s.user);
  const logout = useUserStore(s => s.logout);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { 
      to: "/dashboard", 
      label: "Dashboard", 
      icon: "🏠", 
      description: "Overview & Stats" 
    },
    { 
      to: "/records", 
      label: "Medical Records", 
      icon: "📋", 
      description: "Consultation History" 
    },
    { 
      to: "/reports", 
      label: "Lab Reports", 
      icon: "🧪", 
      description: "Pathology Results" 
    },
    { 
      to: "/access-logs", 
      label: "Access Logs", 
      icon: "👁️", 
      description: "Privacy & Transparency" 
    },
    { 
      to: "/ai-chat", 
      label: "AI Health Chat", 
      icon: "🤖", 
      description: "Symptom Checker" 
    },
    { 
      to: "/emergency", 
      label: "Emergency Support", 
      icon: "🚨", 
      description: "Find Nearby Hospitals",
      className: "text-red-600 font-semibold hover:bg-red-50"
    }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-3 rounded-xl shadow-lg border"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {open && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav
        initial={false}
        animate={{ 
          x: isMobile ? (open ? 0 : "-100%") : 0 
        }}
        className={`fixed md:static top-0 left-0 h-full w-80 bg-white border-r shadow-xl z-50 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">MediSync</h1>
              <p className="text-blue-100 text-sm">Patient Portal</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600">Patient ID: {user.id}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 border border-blue-200 text-blue-700"
                        : item.className || "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  <span className="text-2xl mr-4">{item.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs opacity-75">{item.description}</p>
                  </div>
                  <svg 
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="w-full flex items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            © 2024 MediSync - Secure Healthcare Platform
          </p>
        </div>
      </motion.nav>
    </>
  );
}