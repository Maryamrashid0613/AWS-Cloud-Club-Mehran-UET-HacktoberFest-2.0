import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";

const CashierSales = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [viewSale, setViewSale] = useState(null); // Currently viewed sale

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(storedProducts);

    const storedSales = JSON.parse(localStorage.getItem("cashierSales")) || [];
    setSales(storedSales);
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-1">Sales</h2>
          <p className="text-gray-500 text-sm">
            Track daily sales and manage inventory availability.
          </p>
        </div>
        <button
          onClick={() => navigate("/cashier/add-sales")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add Sale
        </button>
      </div>

      {/* Sales Table */}
      <div className="bg-white shadow rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm sm:text-base">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-600">Product</th>
              <th className="px-6 py-3 font-semibold text-gray-600">SKU</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Category</th>
              <th className="px-6 py-3 font-semibold text-gray-600 text-right">Price</th>
              <th className="px-6 py-3 font-semibold text-gray-600 text-right">Quantity Sold</th>
              <th className="px-6 py-3 font-semibold text-gray-600 text-right">Total</th>
              <th className="px-6 py-3 font-semibold text-gray-600 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6 italic">
                  No sales yet. Add a sale to track revenue.
                </td>
              </tr>
            ) : (
              sales.map((s, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-800 whitespace-nowrap">{s.name}</td>
                  <td className="px-6 py-3 text-gray-600 whitespace-nowrap">{s.sku}</td>
                  <td className="px-6 py-3 text-gray-600 whitespace-nowrap">{s.category}</td>
                  <td className="px-6 py-3 text-gray-600 text-right whitespace-nowrap">Rs. {s.price.toLocaleString()}</td>
                  <td className="px-6 py-3 text-gray-600 text-right whitespace-nowrap">{s.quantity}</td>
                  <td className="px-6 py-3 text-gray-800 text-right font-medium whitespace-nowrap">
                    Rs. {(s.price * s.quantity).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => setViewSale(s)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                    >
                      <EyeIcon className="h-4 w-4 inline mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing sale details */}
      {viewSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-md p-6 relative">
            <button
              onClick={() => setViewSale(null)}
              className="absolute top-3 right-3 text-red-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-semibold mb-4">Sale Details</h3>
            <p><strong>Product:</strong> {viewSale.name}</p>
            <p><strong>SKU:</strong> {viewSale.sku}</p>
            <p><strong>Category:</strong> {viewSale.category}</p>
            <p><strong>Price:</strong> Rs. {viewSale.price.toLocaleString()}</p>
            <p><strong>Quantity Sold:</strong> {viewSale.quantity}</p>
            <p><strong>Total:</strong> Rs. {(viewSale.price * viewSale.quantity).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierSales;
