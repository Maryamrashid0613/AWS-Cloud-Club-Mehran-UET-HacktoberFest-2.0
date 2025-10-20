import React, { useState, useEffect } from "react";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  CubeIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

 
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products")) || [];
    if (stored.length > 0) {
      setProducts(stored);
    } else {
     
      const defaultData = [
        {
          id: 1,
          name: "Cement Bag",
          sku: "CB001",
          category: "Construction",
          price: 950,
          quantity: 120,
        },
        {
          id: 2,
          name: "Steel Rod 8mm",
          sku: "SR008",
          category: "Metal Supply",
          price: 1250,
          quantity: 40,
        },
        {
          id: 3,
          name: "PVC Pipe 2-inch",
          sku: "PP002",
          category: "Plumbing",
          price: 650,
          quantity: 0,
        },
      ];
      setProducts(defaultData);
      localStorage.setItem("products", JSON.stringify(defaultData));
    }
  }, []);

  // 🗑️ Delete product
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      localStorage.setItem("products", JSON.stringify(updated));
    }
  };

  // ✏️ Edit product
  const handleEdit = (product) => {
    navigate("/admin-dashboard/add-product", { state: { editMode: true, product } });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-1">
            Product Management
          </h2>
          <p className="text-gray-500 text-sm">
            Manage, track, and organize your inventory products efficiently.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin-dashboard/add-product")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto justify-center"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex items-center bg-white shadow rounded-xl p-5 border border-gray-100">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <CubeIcon className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Total Products</p>
            <h3 className="text-xl font-semibold text-gray-800">{products.length}</h3>
          </div>
        </div>

        <div className="flex items-center bg-white shadow rounded-xl p-5 border border-gray-100">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <TagIcon className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Categories</p>
            <h3 className="text-xl font-semibold text-gray-800">
              {new Set(products.map((p) => p.category)).size}
            </h3>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white shadow rounded-xl border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">SKU</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Category</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Price (PKR)</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Quantity</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 font-medium text-gray-800 whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="px-6 py-3 text-gray-600 whitespace-nowrap">{item.sku}</td>
                  <td className="px-6 py-3 text-gray-600 whitespace-nowrap">{item.category}</td>
                  <td className="px-6 py-3 text-gray-600 whitespace-nowrap">
                    Rs. {item.price.toLocaleString()}
                  </td>
                  <td
                    className={`px-6 py-3 whitespace-nowrap ${
                      item.quantity === 0
                        ? "text-red-500 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {item.quantity}
                  </td>
                  <td className="px-6 py-3 text-center whitespace-nowrap">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        <span className="hidden sm:inline text-sm">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span className="hidden sm:inline text-sm">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
