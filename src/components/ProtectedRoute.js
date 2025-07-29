// File: src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../store/user_store';
import { useDoctorStore } from '../store/useDoctorStore';

export default function ProtectedRoute({ children, role }) {
  if (role === 'doctor') {
    const doctor = useDoctorStore(state => state.doctor);
    if (!doctor) {
      // if not logged in as doctor, send to doctor login
      return <Navigate to="/doctor/login" replace />;
    }
    return children;
  } else {
    // default to patient guard
    const user = useUserStore(state => state.user);
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }
}
