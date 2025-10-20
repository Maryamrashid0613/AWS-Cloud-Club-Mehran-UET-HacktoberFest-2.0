import React, { useContext, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ContextApi } from "../components/ContextApi";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const uniformVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(2px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const SaleList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);
  const navigate = useNavigate();

  const { sales, setSales } = useContext(ContextApi);

  // 🔍 Filter sales based on customer name or product name
  const filteredSales = sales?.filter((sale) => {
    const customer = sale?.customerName?.toLowerCase?.() || "";
    const productNames = sale?.products
      ?.map((p) => p?.product?.productName?.toLowerCase?.() || "")
      .join(" ");
    return (
      customer.includes(searchTerm.toLowerCase()) ||
      productNames.includes(searchTerm.toLowerCase())
    );
  });

  // ✅ Toggle row selection
  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  // ✅ Toggle all rows
  const toggleAllRows = () => {
    setSelectedRows((prev) =>
      prev.length === filteredSales.length ? [] : filteredSales.map((s) => s._id)
    );
  };

  // ✅ Edit sale
  const handleEdit = (rowId) => {
    navigate(`/sale/edit/${rowId}`);
  };

  // ✅ Delete sale
  const handleDelete = async (rowId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sale?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/sales/${rowId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        setSales((prev) => prev.filter((p) => p._id !== rowId));
        console.log("Sale deleted");
      } else {
        console.log("Failed to delete sale");
      }
    } catch (err) {
      console.error(err);
    }
    setOpenActionId(null);
  };

  // ✅ CSV Download Function
  const handleCSVDownload = () => {
    if (filteredSales.length === 0) {
      alert("No sales available to export!");
      return;
    }

    const headers = [
      "Date",
      "Customer",
      "Products",
      "Payment Method",
      "Subtotal",
      "Discount",
      "Grand Total",
    ];

    const rows = filteredSales.map((sale) => [
      new Date(sale.createdAt).toLocaleDateString(),
      sale.customerName,
      sale.products
        .map((p) => `${p.product?.productName} (${p.quantity}x$${p.priceAtSale})`)
        .join("; "),
      sale.paymentMethod,
      sale.subTotal,
      sale.totalDiscount || 0,
      sale.grandTotal,
    ]);

    const csvContent = [headers, ...rows]
      .map((e) => e.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Sales_List.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-full bg-white rounded-lg shadow-sm p-6"
        variants={uniformVariants}
      >
        {/* Header Controls */}
        <div className="sm:p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/sale/add")}
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base"
            >
              + Add Sale
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm outline-none focus:ring-2 ring-purple-300"
                placeholder="Search by customer or product..."
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
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === filteredSales.length &&
                        filteredSales.length > 0
                      }
                      onChange={toggleAllRows}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Date</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Customer</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Products</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Payment Method</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Subtotal</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Discount</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Grand Total</th>
                  <th className="px-3 py-4 font-semibold text-gray-700 text-left">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => (
                    <tr key={sale._id} className="hover:bg-gray-50">
                      <td className="px-3 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(sale._id)}
                          onChange={() => toggleRowSelection(sale._id)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-3 py-4 text-sm">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-4 text-sm font-medium text-gray-800">
                        {sale.customerName}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-600">
                        {sale.products.map((p, index) => (
                          <div key={index}>
                            {p.product?.productName} ({p.quantity} × ${p.priceAtSale})
                          </div>
                        ))}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-700">
                        {sale.paymentMethod}
                      </td>
                      <td className="px-3 py-4 text-sm">${sale.subTotal}</td>
                      <td className="px-3 py-4 text-sm text-rose-500">
                        -${sale.totalDiscount || 0}
                      </td>
                      <td className="px-3 py-4 text-sm font-semibold text-gray-900">
                        ${sale.grandTotal}
                      </td>
                      <td className="px-3 py-4 relative">
                        <button
                          onClick={() =>
                            setOpenActionId((prev) =>
                              prev === sale._id ? null : sale._id
                            )
                          }
                          className="px-3 w-22 flex items-center py-1 text-sm border border-purple-500 text-purple-500 rounded hover:bg-purple-50 transition-colors"
                        >
                          Action <ChevronDown className="w-4 h-4 inline ml-1" />
                        </button>
                        {openActionId === sale._id && (
                          <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-20">
                            <button
                              onClick={() => handleEdit(sale._id)}
                              className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(sale._id)}
                              className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center text-gray-500 py-6 text-sm"
                    >
                      No sales found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SaleList;
