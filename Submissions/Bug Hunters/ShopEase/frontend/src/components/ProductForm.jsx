// src/components/ProductForm.jsx
import React, { useState, useEffect } from "react";

export default function ProductForm({ onSubmit, initial = null, submitLabel = "Save" }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    cost: "",
    quantity: ""
  });

  useEffect(() => {
    if (initial) setForm({ ...initial, price: initial.price?.toString(), cost: initial.cost?.toString(), quantity: initial.quantity?.toString() });
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic validation
    if (!form.name || !form.price || !form.quantity) return alert("Name, price and quantity required");
    onSubmit({
      name: form.name,
      sku: form.sku,
      category: form.category,
      price: Number(form.price),
      cost: Number(form.cost || 0),
      quantity: Number(form.quantity)
    });
    setForm({ name: "", sku: "", category: "", price: "", cost: "", quantity: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-xl space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <input className="p-2 rounded bg-gray-700" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="p-2 rounded bg-gray-700" placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
        <input className="p-2 rounded bg-gray-700" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <input className="p-2 rounded bg-gray-700" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        <input className="p-2 rounded bg-gray-700" placeholder="Cost (for profit calc)" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
        <input className="p-2 rounded bg-gray-700" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-emerald-500 rounded">{submitLabel}</button>
      </div>
    </form>
  );
}
