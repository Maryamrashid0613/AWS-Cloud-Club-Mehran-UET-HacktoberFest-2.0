import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

const CashierDashboard = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem("cashierInvoices")) || [];
    setInvoices(storedInvoices);
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Cashier Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">View and manage invoices created by the cashier.</p>
        </div>
        <button
          onClick={() => navigate("/cashier/add-invoice")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Create Invoice
        </button>
      </div>

      <div className="bg-white shadow rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Invoice ID</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Product Name</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">SKU</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Category</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Price</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Quantity</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6 italic">
                  No invoices created yet.
                </td>
              </tr>
            ) : (
              invoices.flatMap((invoice) =>
                invoice.items.map((item, idx) => (
                  <tr key={`${invoice.id}-${idx}`} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{invoice.id}</td>
                    <td className="px-4 py-3 text-gray-700">{item.name}</td>
                    <td className="px-4 py-3 text-gray-700">{item.sku}</td>
                    <td className="px-4 py-3 text-gray-700">{item.category}</td>
                    <td className="px-4 py-3 text-gray-700">Rs. {item.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                    <td className="px-4 py-3 text-gray-800 font-semibold">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashierDashboard;
