import React, { useState, useContext, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { ContextApi } from "../components/ContextApi";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const EditSale = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    paymentMethod: "Cash",
    subTotal: 0,
    totalDiscount: 0,
    grandTotal: 0,
  });

  const { id } = useParams();
  const { products } = useContext(ContextApi);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sales/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setFormData({
            customerName: data.customerName,
            paymentMethod: data.paymentMethod,
            subTotal: data.subTotal,
            totalDiscount: data.totalDiscount,
            grandTotal: data.grandTotal,
          });

          const formattedProducts = data.products.map((p) => ({
            ...p.product,
            quantity: p.quantity,
            priceAtSale: p.priceAtSale,
            discount: p.discount,
          }));
          setSelectedProducts(formattedProducts);
        })
        .catch((err) => console.error("Error fetching sale data:", err));
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addProduct = (product) => {
    if (!selectedProducts.find((p) => p._id === product._id)) {
      setSelectedProducts((prev) => [
        ...prev,
        { ...product, quantity: 1, discount: 0 },
      ]);
    }
  };

  const removeProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const updateQuantity = (id, qty) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, quantity: qty } : p))
    );
  };

  const updateDiscount = (id, disc) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, discount: disc } : p))
    );
  };

  const calculateSubtotal = (p) =>
    (p.priceAtSale || p.productPrice || 0) * (p.quantity || 0) -
    (p.discount || 0);

  const calculateSubTotal = () =>
    selectedProducts.reduce((sum, p) => sum + calculateSubtotal(p), 0);

  const calculateGrandTotal = () =>
    calculateSubTotal() - formData.totalDiscount;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const saleData = {
      customerName: formData.customerName,
      paymentMethod: formData.paymentMethod,
      subTotal: calculateSubTotal(),
      totalDiscount: Number(formData.totalDiscount) || 0,
      grandTotal: calculateGrandTotal(),
      products: selectedProducts.map((p) => ({
        product: p._id,
        quantity: p.quantity,
        priceAtSale: p.priceAtSale || p.productPrice,
        discount: p.discount || 0,
        total: calculateSubtotal(p),
      })),
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sales/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      alert("Sale updated successfully!");
      navigate("/sale/list");
    } catch (err) {
      console.error("Error updating sale:", err);
      alert("Failed to update sale!");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        className="max-w-7xl mx-auto p-4 sm:p-6 rounded-lg shadow-md bg-white border border-gray-200"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Edit Sale</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Customer & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Customer Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Online">Online</option>
              </select>
            </div>
          </div>

          {/* Product Search */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Add Product
            </label>
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            {productSearch && (
              <div className="border border-gray-200 mt-2 max-h-40 overflow-y-auto rounded-md bg-white shadow-sm">
                {products
                  ?.filter(
                    (p) =>
                      p.productName
                        ?.toLowerCase()
                        .includes(productSearch.toLowerCase()) ||
                      p.SKU?.toLowerCase().includes(productSearch.toLowerCase())
                  )
                  .map((product) => (
                    <div
                      key={product._id}
                      onClick={() => {
                        addProduct(product);
                        setProductSearch("");
                      }}
                      className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    >
                      {product.productName} ({product.SKU})
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border border-gray-200 rounded-md">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 border border-gray-200">Product</th>
                  <th className="px-3 py-2 border border-gray-200">Quantity</th>
                  <th className="px-3 py-2 border border-gray-200">Price</th>
                  <th className="px-3 py-2 border border-gray-200">Discount</th>
                  <th className="px-3 py-2 border border-gray-200">Total</th>
                  <th className="px-3 py-2 border border-gray-200">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.length > 0 ? (
                  selectedProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-2 py-2">
                        {p.productName}
                      </td>
                      <td className="border border-gray-200 px-2 py-2">
                        <input
                          type="number"
                          value={p.quantity || 1}
                          onChange={(e) =>
                            updateQuantity(p._id, Number(e.target.value))
                          }
                          className="w-16 border border-gray-300 rounded p-1"
                        />
                      </td>
                      <td className="border border-gray-200 px-2 py-2">
                        {p.priceAtSale || p.productPrice}
                      </td>
                      <td className="border border-gray-200 px-2 py-2">
                        <input
                          type="number"
                          value={p.discount || 0}
                          onChange={(e) =>
                            updateDiscount(p._id, Number(e.target.value))
                          }
                          className="w-16 border border-gray-300 rounded p-1"
                        />
                      </td>
                      <td className="border border-gray-200 px-2 py-2">
                        {calculateSubtotal(p).toFixed(2)}
                      </td>
                      <td className="border border-gray-200 px-2 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeProduct(p._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-3 text-gray-400 border border-gray-200"
                    >
                      No products selected
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Summary</h3>
            <p className="text-gray-700">
              Subtotal: <strong>{calculateSubTotal().toFixed(2)}</strong>
            </p>
            <div className="flex items-center mt-2">
              <label className="mr-2 font-medium text-gray-700">
                Total Discount:
              </label>
              <input
                type="number"
                name="totalDiscount"
                value={formData.totalDiscount}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-1 w-24 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <p className="mt-2 text-lg font-bold text-purple-600">
              Grand Total: {calculateGrandTotal().toFixed(2)}
            </p>
          </div>

          {/* Submit */}
          <div className="mt-6">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
            >
              Update Sale
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditSale;
