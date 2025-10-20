import React, { useState, useEffect } from "react";
import { CheckCircleIcon, XMarkIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

const dummyInvoices = [
  {
    id: "INV-001",
    cashierName: "Ali Khan",
    status: "Pending",
    items: [
      { name: "Product A", sku: "SKU001", category: "Category 1", price: 1200, quantity: 2 },
      { name: "Product B", sku: "SKU002", category: "Category 2", price: 800, quantity: 1 },
    ],
  },
  {
    id: "INV-002",
    cashierName: "Sara Malik",
    status: "Pending",
    items: [
      { name: "Product C", sku: "SKU003", category: "Category 1", price: 500, quantity: 3 },
    ],
  },
];

const CashierInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [viewInvoice, setViewInvoice] = useState(null);

  
  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem("cashierInvoices"));
    if (storedInvoices && storedInvoices.length > 0) {
      setInvoices(storedInvoices);
    } else {
      
      const dummyWithTotal = dummyInvoices.map(inv => ({
        ...inv,
        total: inv.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }));
      setInvoices(dummyWithTotal);
      localStorage.setItem("cashierInvoices", JSON.stringify(dummyWithTotal));
    }
  }, []);

  
  const handleAccept = (id) => {
    const updated = invoices.map(inv =>
      inv.id === id ? { ...inv, status: "Accepted" } : inv
    );
    setInvoices(updated);
    localStorage.setItem("cashierInvoices", JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    const updated = invoices.filter(inv => inv.id !== id);
    setInvoices(updated);
    localStorage.setItem("cashierInvoices", JSON.stringify(updated));
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-semibold text-gray-800">Cashier Invoices</h2>
      <p className="text-gray-500">Accept or reject invoices submitted by Cashiers.</p>

      <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse text-sm sm:text-base">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-600">Invoice ID</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Cashier</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Total</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 font-semibold text-gray-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-6 italic">
                  No invoices available.
                </td>
              </tr>
            ) : (
              invoices.map(inv => (
                <tr key={inv.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">{inv.id}</td>
                  <td className="px-6 py-3 text-gray-600">{inv.cashierName}</td>
                  <td className="px-6 py-3 text-gray-600">Rs. {(inv.total || 0).toLocaleString()}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inv.status === "Accepted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => setViewInvoice(inv)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                    >
                      <EyeIcon className="h-4 w-4" /> View
                    </button>
                    {inv.status !== "Accepted" && (
                      <button
                        onClick={() => handleAccept(inv.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {viewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-md p-6 relative">
            <button
              onClick={() => setViewInvoice(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-semibold mb-4">Invoice Details</h3>
            <p><strong>Invoice ID:</strong> {viewInvoice.id}</p>
            <p><strong>Cashier:</strong> {viewInvoice.cashierName}</p>
            <p><strong>Total Amount:</strong> Rs. {(viewInvoice.total || 0).toLocaleString()}</p>
            <div className="mt-3">
              <h4 className="font-semibold mb-2">Products:</h4>
              <ul className="space-y-1 text-gray-700">
                {viewInvoice.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} | SKU: {item.sku} | Qty: {item.quantity} | Rs. {item.price.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierInvoices;
