import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import AddProduct from "./pages/AddProduct";
import CashierInvoices from "./pages/CashierInvoices";

const App = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">   
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin-dashboard/products" element={<Products />} />
            <Route path="/admin-dashboard/add-product" element={<AddProduct />} />
            <Route path="/admin-dashboard/cashierinvoices" element={<CashierInvoices />} />
            <Route path="/admin-dashboard/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
