import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { Api } = useAdmin();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${Api}/api/admin/summary`);
        if (res.data.success) {
          setSummary(res.data.data);
        }
      } catch (error) {
        alert("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-lg text-gray-600">
            Loading dashboard data...
          </span>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-red-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          No data available
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          We couldn't retrieve dashboard information at this time.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Define colors for incident statuses
  const statusColorsMap = {
    new: "#9ca3af", // gray
    verified: "#3b82f6", // blue
    in_progress: "#f59e0b", // amber
    resolved: "#10b981", // green
  };

  const statusTextColorsMap = {
    new: "text-gray-800",
    verified: "text-blue-800",
    in_progress: "text-amber-800",
    resolved: "text-green-800",
  };

  // Get statuses and colors in the order they appear
  const statusLabels = Object.keys(summary.incidentsByStatus).map((key) =>
    key.replaceAll("_", " ")
  );
  const statusRawKeys = Object.keys(summary.incidentsByStatus);

  // Prepare colors in same order as data
  const statusColors = statusRawKeys.map(
    (key) => statusColorsMap[key] || "#d1d5db" // fallback gray
  );

  const incidentStatusData = {
    labels: statusLabels,
    datasets: [
      {
        label: "Incidents by Status",
        data: Object.values(summary.incidentsByStatus),
        backgroundColor: statusColors,
        borderWidth: 0,
      },
    ],
  };

  const incidentCategoryData = {
    labels: Object.keys(summary.incidentsByCategory),
    datasets: [
      {
        label: "Incidents by Category",
        data: Object.values(summary.incidentsByCategory),
        backgroundColor: [
          "#f97316", // orange
          "#0ea5e9", // sky blue
          "#8b5cf6", // violet
          "#10b981", // emerald
          "#64748b", // slate
          "#ef4444", // red
          "#84cc16", // lime
        ],
        borderWidth: 0,
      },
    ],
  };

  const overviewData = {
    labels: ["Staff", "Users", "Active Shifts"],
    datasets: [
      {
        label: "Count",
        data: [summary.totalStaff, summary.totalUsers, summary.activeShifts],
        backgroundColor: ["#22d3ee", "#3b82f6", "#6366f1"],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back, here's your overview
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center text-sm text-gray-500">
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">
                  Total Incidents
                </h2>
                <p className="text-2xl font-semibold text-gray-900">
                  {summary.totalIncidents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">
                  Total Staff
                </h2>
                <p className="text-2xl font-semibold text-gray-900">
                  {summary.totalStaff}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">
                  Total Users
                </h2>
                <p className="text-2xl font-semibold text-gray-900">
                  {summary.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-amber-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">
                  Active Shifts
                </h2>
                <p className="text-2xl font-semibold text-gray-900">
                  {summary.activeShifts}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Incident Status
            </h2>
            <div className="h-80">
              <Pie data={incidentStatusData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              System Overview
            </h2>
            <div className="h-80">
              <Bar data={overviewData} options={barChartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Incidents by Category
            </h2>
            <div className="h-80">
              <Bar data={incidentCategoryData} options={barChartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Incidents Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Incidents
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-gray-200">
                  <th className="py-3 px-4 font-medium">Title</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">
                    Created At
                  </th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {summary.recentIncidents.map((incident) => (
                  <tr
                    key={incident._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {incident.title}
                      </div>
                      <div className="text-xs text-gray-500 md:hidden mt-1">
                        {new Date(incident.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          statusTextColorsMap[incident.status]
                        }`}
                        style={{
                          backgroundColor: `${
                            statusColorsMap[incident.status]
                          }20`,
                        }}
                      >
                        {incident.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 hidden md:table-cell">
                      {new Date(incident.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate(`/report/${incident._id}`)}
                        className="text-green-600 hover:text-green-800 font-medium text-sm p-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {summary.recentIncidents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No incidents found
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
