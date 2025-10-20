import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextApi } from '../components/ContextApi';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const uniformVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    filter: "blur(2px)"    
  },
  visible: { 
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [openActionId, setOpenActionId] = useState(null); 
  const { products, setProducts } = useContext(ContextApi);
  const navigate = useNavigate();

  // ✅ Filter products based on search term
  const filteredProducts = products.filter(product =>
    (product?.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.SKU?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ✅ Toggle single and all rows
  const toggleRowSelection = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows(prev =>
      prev.length === filteredProducts.length ? [] : filteredProducts.map(p => p._id)
    );
  };

  const handleEdit = (action, rowId) => {
    if (action === 'Edit') navigate(`/product/edit/${rowId}`);
  };

  const handleDelete = async (action, rowId) => {
    if (action === 'Delete') {
      const confirmDelete = window.confirm("Are you sure you want to delete this product?");
      if (!confirmDelete) return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${rowId}`, {
        method: "DELETE",
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        setProducts((prev) => prev.filter(p => p._id !== rowId));
        console.log("Product deleted successfully");
      } else {
        console.error('Failed to delete product:', res.status, res.statusText);
        const errorData = await res.json();
        console.error("Server error message:", errorData.msg);
      }
    } catch (err) {
      console.error("Network or other error:", err);
    }
    setOpenActionId(null);
  };

  // ✅ DOWNLOAD CSV
  const handleCSVDownload = () => {
    if (filteredProducts.length === 0) {
      alert("No products available to export!");
      return;
    }

    const headers = ["Product Name", "SKU", "Category", "Quantity", "Price"];
    const rows = filteredProducts.map(p => [
      p.productName,
      p.SKU,
      p.category,
      p.quantity,
      p.productPrice
    ]);

    const csvContent = [headers, ...rows]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Product_List.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  return (
    <motion.div
      className='p-6'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="w-full bg-white rounded-lg shadow-sm p-6"
        variants={uniformVariants}
      >
        <motion.div className="sm:p-4 " variants={uniformVariants}>
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={() => navigate('/product/add')} 
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base"
            >
              + Add Product
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm outline-none focus:ring-2 ring-purple-300"
                placeholder="Search products..."
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
             
              <button 
                onClick={handleCSVDownload}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded-md text-sm"
              >
                CSV
              </button>
            </div>
          </div>
        </motion.div>

        {/* ✅ Table Section */}
        <div className="bg-white shadow-md overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleAllRows}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">SKU</th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">Category</th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">Quantity</th>
                  <th className="px-3 py-4 text-left font-semibold text-gray-700">Price</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(product._id)}
                        onChange={() => toggleRowSelection(product._id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-3 py-4 text-sm font-medium text-gray-900">{product.productName}</td>
                    <td className="px-3 py-4 text-sm text-gray-600">{product.SKU}</td>
                    <td className="px-3 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-3 py-4 text-sm text-gray-600">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm font-medium text-gray-900">
                      ${parseFloat(product.productPrice).toLocaleString()}
                    </td>
                    <td className="px-3 py-4 relative">
                      <button
                        onClick={() => setOpenActionId(prev => (prev === product._id ? null : product._id))}
                        className="px-3 py-1 text-sm border border-purple-500 text-purple-500 rounded hover:bg-purple-50 transition-colors"
                      >
                        Action
                      </button>
                      {openActionId === product._id && (
                        <div className="absolute right-5 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-20">
                          <button
                            onClick={() => handleEdit('Edit', product._id)}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete('Delete', product._id)}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products found matching your search.
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductList;
