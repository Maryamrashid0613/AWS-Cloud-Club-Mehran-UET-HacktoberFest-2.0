import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { X, Package, Minus, Plus, Calculator } from "lucide-react";

export default function InvoiceModal({ open, onClose, products = [], headers }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSave = async () => {
    if (!selectedProduct) {
      alert("Please select a product");
      return;
    }
    
    if (quantity < 1) {
      alert("Quantity must be at least 1");
      return;
    }
    
    if (quantity > selectedProduct.quantity) {
      alert(`Not enough stock. Only ${selectedProduct.quantity} items available`);
      return;
    }

    try {
      setSaving(true);
      await axios.post(
        "http://localhost:5000/api/sales",
        {
          productId: selectedProduct._id,
          quantitySold: quantity,
        },
        { headers: headers() }
      );
      setSaving(false);
      onClose(true);
    } catch (err) {
      console.error("Error creating sale:", err);
      setSaving(false);
      alert(err.response?.data?.message || "Failed to record sale");
    }
  };

  const totalAmount = selectedProduct ? selectedProduct.price * quantity : 0;
  const profit = selectedProduct ? (selectedProduct.price - selectedProduct.cost) * quantity : 0;
  const profitMargin = selectedProduct ? ((selectedProduct.price - selectedProduct.cost) / selectedProduct.price * 100).toFixed(1) : 0;

  const increaseQuantity = () => {
    if (selectedProduct && quantity < selectedProduct.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            Record New Sale
          </h2>
          <button 
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Select Product</label>
            <select
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              value={selectedProduct?._id || ""}
              onChange={(e) => {
                const prod = products.find((p) => p._id === e.target.value);
                setSelectedProduct(prod);
                setQuantity(1);
              }}
            >
              <option value="">-- Choose a product --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id} disabled={p.quantity === 0}>
                  {p.name} - Rs. {p.price} (Stock: {p.quantity})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <>
              {/* Quantity Control */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-center focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= selectedProduct.quantity}
                    className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Maximum: {selectedProduct.quantity} units available
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Unit Price:</span>
                  <span className="text-white">Rs. {selectedProduct.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Unit Cost:</span>
                  <span className="text-gray-300">Rs. {selectedProduct.cost}</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Total Amount:</span>
                    <span className="text-xl font-semibold text-emerald-400">Rs. {totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Estimated Profit:</span>
                    <div className="text-right">
                      <div className="text-green-400 font-semibold">Rs. {profit.toFixed(2)}</div>
                      <div className="text-gray-500">({profitMargin}% margin)</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-800">
          <button
            onClick={() => onClose(false)}
            disabled={saving}
            className="flex-1 px-4 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !selectedProduct}
            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Package className="w-4 h-4" />
                Record Sale
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}