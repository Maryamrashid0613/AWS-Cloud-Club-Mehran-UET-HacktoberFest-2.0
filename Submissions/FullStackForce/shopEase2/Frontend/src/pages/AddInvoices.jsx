import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddInvoice = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cashierName: "",
    name: "",
    sku: "",
    category: "Construction",
    price: "",
    quantity: "",
  });

  const categories = ["Construction", "Metal Supply", "Plumbing", "Electrical"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.cashierName.trim()) {
      alert("Cashier Name is required!");
      return;
    }

    const storedInvoices = JSON.parse(localStorage.getItem("cashierInvoices")) || [];
    const newInvoice = {
      id: `INV-${Date.now()}`,
      cashierName: formData.cashierName,
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    storedInvoices.push(newInvoice);
    localStorage.setItem("cashierInvoices", JSON.stringify(storedInvoices));
    navigate("/cashier"); // redirect to dashboard
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">Create Invoice</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl border border-gray-100 p-6 space-y-4">
        
        <div>
          <label className="block text-gray-600 mb-1">Cashier Name</label>
          <input
            type="text"
            name="cashierName"
            value={formData.cashierName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Price (PKR)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min={1}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Invoice
        </button>
      </form>
    </div>
  );
};

export default AddInvoice;
