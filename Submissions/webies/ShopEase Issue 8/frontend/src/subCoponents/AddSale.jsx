import React, { useContext, useState } from "react";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ContextApi } from "../components/ContextApi";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const uniformVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(2px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};


const AddSale = () => {
  const { products } = useContext(ContextApi);

  const [formData, setFormData] = useState({
    customerName: "",
    paymentMethod: "Cash",
    totalDiscount: 0,
  });

  const [productSearch, setProductSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [productDiscounts, setProductDiscounts] = useState({});
  const [notification, setNotification] = useState({ message: "", type: "" });



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["totalDiscount"];
    const processedValue = numericFields.includes(name) ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const addProduct = (product) => {
    if (!selectedProducts.find((p) => p._id === product._id)) {
      setSelectedProducts((prev) => [...prev, product]);
      setQuantities((prev) => ({ ...prev, [product._id]: 1 }));
      setProductDiscounts((prev) => ({ ...prev, [product._id]: 0 }));
    }
  };

  const removeProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((product) => product._id !== id));
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[id];
      return newQuantities;
    });
    setProductDiscounts((prev) => {
      const newDiscounts = { ...prev };
      delete newDiscounts[id];
      return newDiscounts;
    });
  };

  const updateQuantity = (id, newQuantity) => {
    setQuantities((prev) => ({ ...prev, [id]: newQuantity }));
  };

  const updateDiscount = (id, newDiscount) => {
    setProductDiscounts((prev) => ({ ...prev, [id]: Number(newDiscount) }));
  };

  // Calculations
  const calculateSubtotal = (product) => {
    const quantity = quantities[product._id] || 0;
    const price = product.productPrice || 0;
    const discount = productDiscounts[product._id] || 0;
    return (price - discount) * quantity;
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, product) => sum + calculateSubtotal(product), 0);
  };

  const calculateTotalDiscount = () => {
    return selectedProducts.reduce((sum, product) => {
      const qty = quantities[product._id] || 0;
      const discount = productDiscounts[product._id] || 0;
      return sum + discount * qty;
    }, 0);
  };

  const calculateGrandTotal = () => {
    return calculateTotal() - formData.totalDiscount;
  };

  const calculateItems = () => selectedProducts.length;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName) {
      setNotification({ message: "Please enter the customer name.", type: "error" });
      return;
    }
    if (selectedProducts.length === 0) {
      setNotification({ message: "Please add at least one product.", type: "error" });
      return;
    }

    try {
      const saleData = {
        products: selectedProducts.map((p) => ({
          product: p._id,
          quantity: quantities[p._id],
          priceAtSale: p.productPrice,
          discount: productDiscounts[p._id],
          total: calculateSubtotal(p),
        })),
        customerName: formData.customerName,
        paymentMethod: formData.paymentMethod,
        subTotal: calculateTotal(),
        totalDiscount: formData.totalDiscount + calculateTotalDiscount(),
        grandTotal: calculateGrandTotal(),
      };

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });

      const data = await res.json();
      if (res.ok) {
        setNotification({ message: "Sale added successfully!", type: "success" });
        setFormData({ customerName: "", paymentMethod: "Cash", totalDiscount: 0 });
        setSelectedProducts([]);
        setQuantities({});
        setProductDiscounts({});
      } else {
        throw new Error(data.message || "Failed to submit sale.");
      }
    } catch (err) {
      setNotification({ message: err.message || "An error occurred.", type: "error" });
    }

    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };



  return (
    <motion.div
      className="p-4 sm:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="max-w-7xl mx-auto p-4 sm:p-6 rounded-lg shadow-md bg-white"
        variants={uniformVariants}
      >
        <h1 className="text-xl sm:text-2xl font-semibold mb-4">Add Sale</h1>
        <p className="mb-4 text-sm text-gray-600">
          The field labels marked with * are required input fields.
        </p>

      

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Customer and Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-medium" htmlFor="customerName">
                Customer Name *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="paymentMethod">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Online">Online</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="totalDiscount">
                Additional Discount
              </label>
              <input
                type="number"
                id="totalDiscount"
                name="totalDiscount"
                value={formData.totalDiscount}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Product Search */}
          <div>
            <label className="block mb-1 font-medium">Select Product</label>
            <div className="flex items-center border border-gray-300 rounded-md bg-gray-50">
              <div className="px-3 py-2 border-r">
                <div className="w-6 h-6 bg-gray-300"></div>
              </div>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Please type product code or name..."
                className="w-full px-3 py-2 text-sm bg-transparent focus:outline-none"
              />
            </div>

            {productSearch && (
              <div className="mt-2 border border-gray-300 rounded-md max-h-48 overflow-y-auto">
                {products
                  ?.filter((p) =>
                    (p?.productName?.toLowerCase() || "").includes(productSearch.toLowerCase()) ||
                    (p?.SKU?.toLowerCase() || "").includes(productSearch.toLowerCase())
                  )
                  .map((product) => (
                    <div
                      key={product._id}
                      onClick={() => {
                        addProduct(product);
                        setProductSearch("");
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      {product.productName} ({product.SKU})
                    </div>
                  ))}

              </div>
            )}
          </div>

          {/* Product Table */}
          <div>
            <h3 className="text-sm font-medium mb-2">Order Table *</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="text-left bg-gray-100 border-b border-gray-300">
                    <th className="py-2 px-2 border border-gray-300">Name</th>
                    <th className="px-2 border border-gray-300">Code</th>
                    <th className="px-2 border border-gray-300">Quantity</th>
                    <th className="px-2 border border-gray-300">Price</th>
                    <th className="px-2 border border-gray-300">Discount</th>
                    <th className="px-2 border border-gray-300">Total</th>
                    <th className="px-2 border border-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.length > 0 ? (
                    selectedProducts.map((product) => (
                      <tr key={product._id}>
                        <td className="px-4 py-3">{product.productName}</td>
                        <td className="px-4 py-3">{product.SKU}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={quantities[product._id] || 1}
                            onChange={(e) =>
                              updateQuantity(product._id, parseInt(e.target.value))
                            }
                            className="w-20 p-1 border rounded"
                          />
                        </td>
                        <td className="px-4 py-3">{product.productPrice}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            value={productDiscounts[product._id] || 0}
                            onChange={(e) =>
                              updateDiscount(product._id, e.target.value)
                            }
                            className="w-20 p-1 border rounded"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {calculateSubtotal(product).toFixed(2)}
                        </td>
                        <td className="px-2">
                          <div
                            onClick={() => removeProduct(product._id)}
                            className="flex gap-1 py-1 justify-center rounded items-center bg-red-400 cursor-pointer"
                          >
                            <button type="button">Delete</button>
                            <span>
                              <Trash2 className="w-4 h-4" />
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-gray-500">
                        No products selected.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-gray-100 border-t border-gray-300 text-center">
                    <td colSpan="2" className="px-2 py-2 border border-gray-300 text-left">
                      Total
                    </td>
                    <td className="px-2 border border-gray-300">
                      {selectedProducts.reduce(
                        (sum, p) => sum + (quantities[p._id] || 0),
                        0
                      )}
                    </td>
                    <td colSpan="2" className="px-2 border border-gray-300">
                      -
                    </td>
                    <td className="px-2 border border-gray-300">
                      {calculateTotal().toFixed(2)}
                    </td>
                    <td className="px-2 border border-gray-300"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-100 p-4 rounded-md mt-6 border border-gray-300">
            <h3 className="text-lg font-semibold mb-2">Sale Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <div className="col-span-1 text-gray-700">Items</div>
              <div className="col-span-1 text-right font-bold">
                {calculateItems()}
              </div>

              <div className="col-span-1 text-gray-700">Sub Total</div>
              <div className="col-span-1 text-right font-bold">
                {calculateTotal().toFixed(2)}
              </div>

              <div className="col-span-1 text-gray-700">Total Discount</div>
              <div className="col-span-1 text-right font-bold">
                {(
                  formData.totalDiscount + calculateTotalDiscount()
                ).toFixed(2)}
              </div>

              <div className="col-span-2 border-t border-gray-400 my-2"></div>

              <div className="col-span-1 text-gray-900 text-lg">Grand Total</div>
              <div className="col-span-1 text-right text-lg font-bold text-purple-600">
                {calculateGrandTotal().toFixed(2)}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddSale;
