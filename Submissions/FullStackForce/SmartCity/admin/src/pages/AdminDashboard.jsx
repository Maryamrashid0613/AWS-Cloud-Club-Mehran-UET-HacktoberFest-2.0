import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const COLORS = ["#0A1128", "#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8"];

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    incidents: [],
    staff: [],
    shifts: [],
  });

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        const backendURL = "http://localhost:3000"; // ✅ your backend URL

        const [incRes, staffRes, shiftRes] = await Promise.all([
          axios.get(`${backendURL}/api/incident`),
          axios.get(`${backendURL}/api/staff`),
          axios.get(`${backendURL}/api/shift/all`),
        ]);

        setStats({
          incidents: incRes.data.incidents || [],
          staff: staffRes.data.staff || [],
          shifts: shiftRes.data.shifts || [],
        });
      } catch (error) {
        console.error("❌ Error loading dashboard data:", error);
      }
    };

    fetchData();
  }, [admin, navigate]);

  if (!admin) return null;

  // ✅ Graph data
  const incidentData = [
    { name: "Pending", value: stats.incidents.filter(i => i.status === "Pending").length },
    { name: "Resolved", value: stats.incidents.filter(i => i.status === "Resolved").length },
  ];

  const staffShifts = stats.staff.map((s) => ({
    name: s.name,
    shifts: stats.shifts.filter((shift) => shift.staffId?._id === s._id).length,
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
            <p className="text-gray-600">Welcome back, {admin.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-lg p-6 rounded-2xl text-center">
            <h3 className="text-gray-600">Total Incidents</h3>
            <p className="text-2xl font-bold text-[#0A1128]">
              {stats.incidents.length}
            </p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-2xl text-center">
            <h3 className="text-gray-600">Total Staff</h3>
            <p className="text-2xl font-bold text-[#0A1128]">
              {stats.staff.length}
            </p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-2xl text-center">
            <h3 className="text-gray-600">Total Shifts</h3>
            <p className="text-2xl font-bold text-[#0A1128]">
              {stats.shifts.length}
            </p>
          </div>
        </div>

        {/* Graphs */}
        <div className="grid grid-cols-2 gap-8">
          {/* Incident Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Incident Status Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incidentData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {incidentData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Staff vs Shifts Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Shifts Assigned to Staff
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={staffShifts}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="shifts" fill="#0A1128" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
