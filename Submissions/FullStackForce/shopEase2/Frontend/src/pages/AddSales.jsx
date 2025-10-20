import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddSales = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
  });

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
   
    const availableProducts = storedProducts.filter(p => p.quantity > 0);
    setProducts(availableProducts);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = products.find(p => p.id.toString() === formData.productId);
    if (!product) return alert("Please select a valid product");

    if (parseInt(formData.quantity) > product.quantity) {
      return alert("Not enough stock available");
    }

   
    const storedSales = JSON.parse(localStorage.getItem("cashierSales")) || [];
    const newSale = {
      id: Date.now(),
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      quantity: parseInt(formData.quantity),
    };
    storedSales.push(newSale);
    localStorage.setItem("cashierSales", JSON.stringify(storedSales));

    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    const updatedProducts = allProducts.map(p => 
      p.id === product.id ? { ...p, quantity: p.quantity - newSale.quantity } : p
    );
    localStorage.setItem("products", JSON.stringify(updatedProducts));

  
    navigate("/cashier/sales");
  };

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Add Sale</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 space-y-4 border border-gray-100">
        <div>
          <label className="block text-gray-700 mb-1">Select Product</label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="">-- Select Product --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (Stock: {p.quantity})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            max={formData.quantity}
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Sale
        </button>
      </form>
    </div>
  );
};

export default AddSales;
