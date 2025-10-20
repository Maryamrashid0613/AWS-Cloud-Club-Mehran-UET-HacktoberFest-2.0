import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SalesChart from "../components/SalesChart";
import { motion } from "framer-motion";
import { TrendingUp, Package, AlertTriangle, DollarSign, ArrowUpRight, Plus, Users, ShoppingBag } from "lucide-react";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, authHeaders } = useAuth();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [pRes, sRes] = await Promise.all([
          axios.get("http://localhost:5000/api/products", { headers: authHeaders() }),
          axios.get("http://localhost:5000/api/sales", { headers: authHeaders() }),
        ]);
        setProducts(pRes.data);
        setSales(sRes.data);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.quantity <= 10).length;
  const totalSalesCount = sales.length;

  const topProducts = [...sales].reduce((acc, s) => {
    const name = s.productId?.name || "Unknown";
    acc[name] = (acc[name] || 0) + (s.totalAmount || 0);
    return acc;
  }, {});
  
  const topList = Object.entries(topProducts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const lowStock = products.filter((p) => p.quantity <= 10);

  const stats = [
    {
      title: "Total Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      change: "+12.5%"
    },
    {
      title: "Total Profit",
      value: `Rs. ${Math.round(totalProfit).toLocaleString()}`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      change: "+8.2%"
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: <Package className="w-6 h-6" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      title: "Low Stock",
      value: lowStockCount,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: lowStockCount > 0 ? "text-red-400" : "text-gray-400",
      bgColor: lowStockCount > 0 ? "bg-red-500/10" : "bg-gray-500/10",
      borderColor: lowStockCount > 0 ? "border-red-500/20" : "border-gray-500/20"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
            <p className="text-gray-400 mt-2">Real-time business performance metrics and insights</p>
          </div>

          <div className="flex gap-3">
            {user?.user?.role === "admin" && (
              <button 
                onClick={() => navigate("/products")} 
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Manage Products
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 hover:scale-105 cursor-pointer"
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

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-white text-lg">Sales Overview</h3>
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Last 7 Days</span>
              </div>
            </div>
            <SalesChart data={sales} />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-white">Top Selling Products</h3>
              </div>
              <div className="space-y-4">
                {topList.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No sales data available</p>
                ) : (
                  topList.map(([name, revenue], index) => (
                    <div key={name} className="flex justify-between items-center p-3 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center text-sm font-medium text-white">
                          #{index + 1}
                        </div>
                        <span className="font-medium text-white text-sm">{name}</span>
                      </div>
                      <span className="text-emerald-400 font-semibold text-sm">
                        Rs. {Math.round(revenue).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="font-semibold text-white">Low Stock Alert</h3>
              </div>
              <div className="space-y-3">
                {lowStock.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">All products are well stocked</p>
                ) : (
                  lowStock.map(product => (
                    <div key={product._id} className="flex justify-between items-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg cursor-pointer">
                      <span className="text-sm font-medium text-white">{product.name}</span>
                      <span className="text-red-400 font-semibold text-sm">
                        {product.quantity} left
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}