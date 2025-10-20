import React from "react";
import { Routes, Route } from "react-router-dom";
import CashierSidebar from "./components/CashierSidebar";
import CashierDashboard from "./pages/CashierDashboard";
import AddInvoice from "./pages/AddInvoices";
import CashierSales from "./pages/CashierSales";
import AddSales from "./pages/AddSales";


const App = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <CashierSidebar />
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<CashierDashboard />} />
            <Route path="/cashier/add-invoice" element={<AddInvoice />} />
            <Route path="/cashier/sales" element={<CashierSales />} />
            <Route path="/cashier/add-sales" element={<AddSales />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
