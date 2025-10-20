import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  BarChart3,
  PieChart,
  ArrowUpRight,
  FileText,
  Target
} from "lucide-react";

export default function Reports() {
  const { authHeaders } = useAuth();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    period: 'daily',
    startDate: '',
    endDate: ''
  });

  const fetchReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.period === 'custom' && filters.startDate && filters.endDate) {
        params.append('period', 'custom');
        params.append('startDate', filters.startDate);
        params.append('endDate', filters.endDate);
      } else {
        params.append('period', filters.period);
      }

      const res = await axios.get(`http://localhost:5000/api/sales/report?${params}`, {
        headers: authHeaders()
      });
      
      setReportData(res.data);
    } catch (err) {
      console.error("Error fetching report:", err);
      alert("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const exportToCSV = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/sales/export/csv", {
        headers: authHeaders(),
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export CSV");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const generateReport = (e) => {
    e.preventDefault();
    fetchReport();
  };

  const getPeriodLabel = () => {
    switch(filters.period) {
      case 'daily': return 'Today';
      case 'weekly': return 'Last 7 Days';
      case 'monthly': return 'This Month';
      case 'custom': return 'Custom Period';
      default: return 'Today';
    }
  };

  const stats = reportData ? [
    {
      title: "Total Revenue",
      value: `Rs. ${reportData.totalSales.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      change: "+12.5%"
    },
    {
      title: "Total Profit",
      value: `Rs. ${Math.round(reportData.totalProfit).toLocaleString()}`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      change: "+8.2%"
    },
    {
      title: "Total Cost",
      value: `Rs. ${Math.round(reportData.totalCost).toLocaleString()}`,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      title: "Transactions",
      value: reportData.totalTransactions,
      icon: <BarChart3 className="w-6 h-6" />,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20"
    }
  ] : [];

  return (
    <div className="min-h-screen pt-10 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics & Reports</h1>
            <p className="text-gray-400 mt-2">Comprehensive sales analytics and business insights</p>
          </div>

          <button 
            onClick={exportToCSV}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <motion.div 
          className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Report Period</h3>
          </div>
          
          <form onSubmit={generateReport} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Time Period</label>
              <select
                value={filters.period}
                onChange={(e) => handleFilterChange('period', e.target.value)}
                className="w-full p-3 bg-gray-750 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              >
                <option value="daily">Today</option>
                <option value="weekly">Last 7 Days</option>
                <option value="monthly">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {filters.period === 'custom' && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full p-3 bg-gray-750 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full p-3 bg-gray-750 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </>
            )}

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="text-gray-400 mt-4 text-lg">Generating comprehensive report...</p>
          </div>
        ) : reportData ? (
          <>
            {/* Report Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {getPeriodLabel()} Report
                </h2>
                <p className="text-gray-400">
                  {filters.period === 'custom' && filters.startDate && filters.endDate 
                    ? `${new Date(filters.startDate).toLocaleDateString()} - ${new Date(filters.endDate).toLocaleDateString()}`
                    : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 text-sm font-medium">Report Generated</div>
                <div className="text-gray-400 text-sm">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 hover:scale-105"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-2">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                      {stat.change && (
                        <div className="flex items-center gap-1 text-sm text-emerald-400">
                          <ArrowUpRight className="w-4 h-4" />
                          {stat.change}
                        </div>
                      )}
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.borderColor} border`}>
                      <div className={stat.color}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Analytics Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Top Selling Products */}
              <motion.div 
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <PieChart className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Top Selling Products</h3>
                </div>
                <div className="space-y-4">
                  {reportData.topProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No sales data available for this period</p>
                    </div>
                  ) : (
                    reportData.topProducts.map((product, index) => (
                      <div key={product.name} className="flex justify-between items-center p-4 bg-gray-750 rounded-xl hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center text-sm font-medium text-white">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-white">{product.name}</div>
                            <div className="text-sm text-gray-400">Best Seller</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-400 font-semibold">
                            {product.quantity} sold
                          </div>
                          <div className="text-xs text-gray-400">units</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Profit Summary */}
              <motion.div 
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Profit Analysis</h3>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-750 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-400">
                        {((reportData.totalProfit / reportData.totalSales) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Profit Margin</div>
                    </div>
                    <div className="bg-gray-750 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {reportData.totalTransactions}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Total Orders</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                      <span className="text-gray-300">Gross Revenue:</span>
                      <span className="text-green-400 font-semibold">
                        Rs. {reportData.totalSales.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                      <span className="text-gray-300">Total Cost:</span>
                      <span className="text-purple-400 font-semibold">
                        Rs. {Math.round(reportData.totalCost).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-white font-semibold text-lg">Net Profit:</span>
                      <span className="text-emerald-400 font-bold text-xl">
                        Rs. {Math.round(reportData.totalProfit).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Performance Indicator */}
                  <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">Positive Performance</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">
                      Your business is performing well with a healthy profit margin of {((reportData.totalProfit / reportData.totalSales) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BarChart3 className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Report Data</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Generate your first sales report to view comprehensive analytics and business insights.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}