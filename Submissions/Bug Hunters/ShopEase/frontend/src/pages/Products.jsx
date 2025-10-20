import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Search, Filter, X, Package, Tag, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";

export default function Products() {
  const { authHeaders } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ 
    name: "", 
    sku: "", 
    category: "", 
    price: "", 
    cost: "", 
    quantity: "" 
  });
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: authHeaders(),
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setAlert("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.name || !form.sku || !form.price || !form.cost || !form.quantity) {
        setAlert("Please fill all required fields");
        return;
      }

      if (parseFloat(form.price) < parseFloat(form.cost)) {
        setAlert("Price cannot be less than cost");
        return;
      }

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          {
            ...form,
            price: parseFloat(form.price),
            cost: parseFloat(form.cost),
            quantity: parseInt(form.quantity)
          },
          { headers: authHeaders() }
        );
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/products", 
          {
            ...form,
            price: parseFloat(form.price),
            cost: parseFloat(form.cost),
            quantity: parseInt(form.quantity)
          }, 
          { headers: authHeaders() }
        );
      }
      
      setForm({ name: "", sku: "", category: "", price: "", cost: "", quantity: "" });
      setAlert("");
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      setAlert(err.response?.data?.message || "Error saving product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: authHeaders(),
      });
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setAlert("Error deleting product");
    }
  };

  const handleEdit = (prod) => {
    setForm({
      name: prod.name,
      sku: prod.sku,
      category: prod.category || "",
      price: prod.price.toString(),
      cost: prod.cost.toString(),
      quantity: prod.quantity.toString()
    });
    setEditingId(prod._id);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setForm({ name: "", sku: "", category: "", price: "", cost: "", quantity: "" });
    setEditingId(null);
    setAlert("");
    setShowForm(false);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const lowStock = products.filter((p) => p.quantity < 5);
    if (lowStock.length) {
      setAlert(`⚠️ ${lowStock.length} products are low in stock!`);
    } else {
      setAlert("");
    }
  }, [products]);

  // Calculate product statistics
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.quantity < 5).length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: <Package className="w-6 h-6" />,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    },
    {
      title: "Low Stock",
      value: lowStockCount,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20"
    },
    {
      title: "Out of Stock",
      value: outOfStockCount,
      icon: <X className="w-6 h-6" />,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20"
    },
    {
      title: "Total Value",
      value: `Rs. ${totalValue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    }
  ];

  return (
    <div className="min-h-screen pt-10 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Product Management</h1>
            <p className="text-gray-400 mt-2">Manage your inventory and track stock levels in real-time</p>
          </div>
          
          <div className="flex gap-3">
            {editingId && (
              <button
                onClick={cancelEdit}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 hover:text-white transition-all duration-300"
              >
                Cancel Edit
              </button>
            )}
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              {showForm ? "Close Form" : "Add Product"}
            </button>
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

        {alert && (
          <div className={`p-4 rounded-xl mb-6 border ${
            alert.includes("⚠️") 
              ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {alert}
            </div>
          </div>
        )}

        {/* Product Form */}
        {showForm && (
          <motion.div 
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">
                {editingId ? "Edit Product" : "Add New Product"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Product Name *</label>
                <input
                  className="w-full p-3 bg-gray-750 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">SKU *</label>
                <input
                  className="w-full p-3 bg-gray-750 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="Enter SKU"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Category</label>
                <input
                  className="w-full p-3 bg-gray-750 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="Enter category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Price (Rs.) *</label>
                <input
                  className="w-full p-3 bg-gray-750 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Cost (Rs.) *</label>
                <input
                  className="w-full p-3 bg-gray-750 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: e.target.value })}
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Quantity *</label>
                <input
                  className="w-full p-3 bg-gray-750 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  type="number"
                  placeholder="0"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  min="0"
                  required
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-750 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {editingId ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Search and Filters */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-750 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
            <button className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-750 hover:text-white transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="text-gray-400 mt-3">Loading products...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-750 border-b border-gray-700">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-300">Product</th>
                      <th className="text-left p-4 font-semibold text-gray-300">SKU</th>
                      <th className="text-left p-4 font-semibold text-gray-300">Category</th>
                      <th className="text-left p-4 font-semibold text-gray-300">Cost</th>
                      <th className="text-left p-4 font-semibold text-gray-300">Price</th>
                      <th className="text-left p-4 font-semibold text-gray-300">Margin</th>
                      <th className="text-left p-4 font-semibold text-gray-300">Quantity</th>
                      <th className="text-left p-4 font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredProducts.map((p) => {
                      const profitMargin = ((p.price - p.cost) / p.price * 100).toFixed(1);
                      return (
                        <tr key={p._id} className="hover:bg-gray-750 transition-colors">
                          <td className="p-4">
                            <div className="font-medium text-white">{p.name}</div>
                          </td>
                          <td className="p-4 text-gray-400 font-mono">{p.sku}</td>
                          <td className="p-4">
                            {p.category ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
                                {p.category}
                              </span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          <td className="p-4 text-gray-300">Rs. {p.cost?.toFixed(2)}</td>
                          <td className="p-4 text-white font-semibold">Rs. {p.price?.toFixed(2)}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                              profitMargin >= 50 
                                ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                : profitMargin >= 25 
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}>
                              {profitMargin}%
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                              p.quantity < 5 
                                ? "bg-red-500/10 text-red-400 border-red-500/20" 
                                : p.quantity < 10 
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                                : "bg-green-500/10 text-green-400 border-green-500/20"
                            }`}>
                              {p.quantity}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(p)}
                                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors border border-transparent hover:border-blue-500/20"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(p._id)}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2 text-lg">No products found</div>
                  <p className="text-gray-500">
                    {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first product"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}