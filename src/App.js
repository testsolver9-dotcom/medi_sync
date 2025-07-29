// File: src/App.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Shared
import Home from './pages/home_page_ui';

// Patient-side
import PatientAuthModal from './pages/patient/PatientAuthModal';
import PatientDashboard from './pages/patient/PatientDashboard';
import Records         from './pages/patient/Records';
import Reports         from './pages/patient/Reports';
import AccessLogs      from './pages/patient/AccessLogs';
import AIChatPatient   from './pages/patient/AIChat';
import EmergencyPatient from './pages/patient/Emergency';
import FancyButtonDemo from './pages/fancybutton_demo';
import PathLabAuth from './pages/pathlab_auth';

// Doctor-side
import DoctorRegister    from './pages/doctor/Register';
import DoctorLogin       from './pages/doctor/Login';
import LocationSelection from './pages/doctor/LocationSelection';
import PatientAccess     from './pages/doctor/PatientAccess';
import DoctorDashboard   from './pages/doctor/Dashboard';
import NewRecord         from './pages/doctor/NewRecord';
import ViewRecord        from './pages/doctor/ViewRecord';
import AccessHistory     from './pages/doctor/AccessHistory';

// Auth guard
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<Home />} />

      {/* Patient Auth */}
      <Route path="/login" element={<PatientAuthModal />} />

      {/* Patient-protected flows */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/records"
        element={
          <ProtectedRoute>
            <Records />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/access-logs"
        element={
          <ProtectedRoute>
            <AccessLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-chat"
        element={
          <ProtectedRoute>
            <AIChatPatient />
          </ProtectedRoute>
        }
      />
      <Route
        path="/emergency"
        element={
          <ProtectedRoute>
            <EmergencyPatient />
          </ProtectedRoute>
        }
      />

      {/* FancyButton Demo */}
      <Route path="/fancybutton-demo" element={<FancyButtonDemo />} />

      {/* PathLab Auth */}
      <Route path="/pathlab-auth" element={<PathLabAuth />} />

      {/* Doctor flows */}
      <Route path="/doctor/register" element={<DoctorRegister />} />
      <Route path="/doctor/login"    element={<DoctorLogin />} />
      <Route
        path="/doctor/location"
        element={
          <ProtectedRoute role="doctor">
            <LocationSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/access"
        element={
          <ProtectedRoute role="doctor">
            <PatientAccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/records/new"
        element={
          <ProtectedRoute role="doctor">
            <NewRecord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/records/:recordId"
        element={
          <ProtectedRoute role="doctor">
            <ViewRecord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/history"
        element={
          <ProtectedRoute role="doctor">
            <AccessHistory />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
