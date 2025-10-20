import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import AdminLogin from "./pages/AdminLogin";
import Staff from "./pages/Staff";
import Shifts from "./pages/Shifts";
import Incidents from "./pages/Incidents";

// Layout

import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./pages/AdminLayout";

function ProtectedRoute({ children }) {
  const { admin } = useAuth();
  return admin ? children : <Navigate to="/admin/login" />;
}

function AppRoutes() {
  const { admin } = useAuth();

  return (
    <Routes>
      {/* Admin Login Route */}
      <Route
        path="/admin/login"
        element={admin ? <Navigate to="/admin/dashboard" /> : <AdminLogin />}
      />

      {/* Protected Admin Routes with Sidebar Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="staff" element={<Staff />} />
        <Route path="shifts" element={<Shifts />} />
        <Route path="incidents" element={<Incidents />} />
      </Route>

      {/* Redirect all other routes to login */}
      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
