import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out bg-white shadow-lg w-64`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          <button
            className="md:hidden text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col mt-6 space-y-2 px-4">
          <Link
            to="/admin/dashboard"
            className="text-gray-700 font-medium hover:bg-gray-200 px-3 py-2 rounded-lg"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/staff"
            className="text-gray-700 font-medium hover:bg-gray-200 px-3 py-2 rounded-lg"
          >
            Staff
          </Link>
          <Link
            to="/admin/shifts"
            className="text-gray-700 font-medium hover:bg-gray-200 px-3 py-2 rounded-lg"
          >
            Shifts
          </Link>
          <Link
            to="/admin/incidents"
            className="text-gray-700 font-medium hover:bg-gray-200 px-3 py-2 rounded-lg"
          >
            Incidents
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full px-4 py-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <button
            className="md:hidden text-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            Welcome, {admin?.name || "Admin"}
          </h1>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
