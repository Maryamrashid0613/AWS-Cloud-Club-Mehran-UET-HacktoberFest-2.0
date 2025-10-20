import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import CitizenDashboard from "./pages/CitizenDashboard";
import IncidentDetails from "./pages/IncidentDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes (redirect to dashboard if logged in) */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Private Routes (redirect to login if not logged in) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <CitizenDashboard />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/incident/:id"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <IncidentDetails />
            </>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
