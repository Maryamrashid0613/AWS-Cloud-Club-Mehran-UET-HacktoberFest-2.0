import React from "react";
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  TruckIcon,
  DocumentArrowDownIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const Reports = () => {
  // Dummy chart data
  const salesData = [
    { month: "Jan", sales: 12000, expenses: 4000 },
    { month: "Feb", sales: 18000, expenses: 6000 },
    { month: "Mar", sales: 24000, expenses: 9000 },
    { month: "Apr", sales: 22000, expenses: 8500 },
    { month: "May", sales: 28000, expenses: 11000 },
    { month: "Jun", sales: 30000, expenses: 12000 },
  ];

  const transactions = [
    { id: 1, date: "2025-10-01", type: "Purchase", supplier: "Prime Builders Co.", amount: 5000 },
    { id: 2, date: "2025-10-05", type: "Sale", supplier: "MegaCement", amount: 8000 },
    { id: 3, date: "2025-10-10", type: "Expense", supplier: "Utility Bill", amount: 2000 },
    { id: 4, date: "2025-10-12", type: "Purchase", supplier: "SteelCore Pvt Ltd", amount: 9000 },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-800">Reports & Analytics</h2>
          <p className="text-gray-500 text-sm">
            Get a complete overview of your business performance and activity.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            <DocumentArrowDownIcon className="h-5 w-5" />
            Export Excel
          </button>
          <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
            <DocumentArrowDownIcon className="h-5 w-5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-xl p-5 border border-gray-100 flex items-center">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <ArrowTrendingUpIcon className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Total Sales</p>
            <h3 className="text-xl font-semibold text-gray-800">$120,000</h3>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border border-gray-100 flex items-center">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
            <CurrencyDollarIcon className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Total Expenses</p>
            <h3 className="text-xl font-semibold text-gray-800">$48,000</h3>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border border-gray-100 flex items-center">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <BanknotesIcon className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Net Profit</p>
            <h3 className="text-xl font-semibold text-gray-800">$72,000</h3>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border border-gray-100 flex items-center">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <TruckIcon className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Top Supplier</p>
            <h3 className="text-xl font-semibold text-gray-800">SteelCore Pvt Ltd</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-white shadow rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white shadow rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Growth Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" />
              <Bar dataKey="expenses" fill="#facc15" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
