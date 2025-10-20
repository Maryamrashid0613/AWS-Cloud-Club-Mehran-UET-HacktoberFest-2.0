import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import InvoiceModal from "../components/InvoiceModal";
import { motion } from "framer-motion";
import { Download, Calendar, TrendingUp, Package, DollarSign, ShoppingCart, ArrowUpRight, Users } from "lucide-react";

export default function Sales() {
  const { user, authHeaders } = useAuth();
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, sRes] = await Promise.all([
        axios.get("http://localhost:5000/api/products", { headers: authHeaders() }),
        axios.get("http://localhost:5000/api/sales", { headers: authHeaders() }),
      ]);
      setProducts(pRes.data);
      setSales(sRes.data);
    } catch (err) {
      console.error("Fetch data error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
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

  // Calculate metrics with proper profit calculation
  const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);
  const totalTransactions = sales.length;
  const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

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
      title: "Total Transactions",
      value: totalTransactions,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      title: "Avg. Order Value",
      value: `Rs. ${avgTransactionValue.toFixed(2)}`,
      icon: <Package className="w-6 h-6" />,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20"
    }
  ];

  return (
    <div className="min-h-screen pt-10 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Sales Management</h1>
            <p className="text-gray-400 mt-2">Record sales, create invoices and view comprehensive reports</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {user && (
              <>
                <button 
                  onClick={() => setInvoiceOpen(true)} 
                  className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
                >
                  <ShoppingCart className="w-4 h-4" />
                  New Sale
                </button>
                <button 
                  onClick={exportToCSV}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
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

        {/* Sales History */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Sales History</h3>
            </div>
            <span className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
              {sales.length} transactions
            </span>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="text-gray-400 mt-3">Loading sales data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-750 border-b border-gray-700">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-300">Product</th>
                    <th className="text-left p-4 font-semibold text-gray-300">Date & Time</th>
                    <th className="text-left p-4 font-semibold text-gray-300">Qty</th>
                    <th className="text-left p-4 font-semibold text-gray-300">Unit Price</th>
                    <th className="text-left p-4 font-semibold text-gray-300">Total Amount</th>
                    <th className="text-left p-4 font-semibold text-gray-300">Profit</th>
                    <th className="text-left p-4 font-semibold text-gray-300">Cashier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-3">
                          <ShoppingCart className="w-12 h-12 text-gray-600" />
                          <div>
                            <div className="text-lg font-medium text-gray-300">No sales recorded yet</div>
                            <p className="text-gray-500">Start by creating your first sale!</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sales.map((s) => {
                      const unitPrice = s.totalAmount / s.quantitySold;
                      const profitMargin = ((s.profit || 0) / s.totalAmount * 100).toFixed(1);
                      
                      return (
                        <tr key={s._id} className="hover:bg-gray-750 transition-colors">
                          <td className="p-4">
                            <div className="font-medium text-white">{s.productId?.name ?? "Unknown"}</div>
                            {s.productId?.sku && (
                              <div className="text-xs text-gray-400 font-mono">SKU: {s.productId.sku}</div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-white">{new Date(s.createdAt).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(s.createdAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="p-4 text-gray-300">{s.quantitySold}</td>
                          <td className="p-4 text-gray-300">Rs. {unitPrice.toFixed(2)}</td>
                          <td className="p-4">
                            <div className="font-semibold text-emerald-400">
                              Rs. {s.totalAmount?.toFixed(2)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-green-400">
                              Rs. {s.profit?.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {profitMargin}% margin
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-300">{s.cashier?.name || 'System'}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <InvoiceModal
          open={invoiceOpen}
          onClose={(saved) => { 
            setInvoiceOpen(false); 
            if (saved) fetchData(); 
          }}
          products={products}
          headers={authHeaders}
        />
      </div>
    </div>
  );
}