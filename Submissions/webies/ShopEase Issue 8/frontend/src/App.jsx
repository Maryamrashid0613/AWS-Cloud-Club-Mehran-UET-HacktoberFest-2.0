import { ContextProvider } from "./components/ContextApi";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";

import Home from "./components/Home";
import Cashier from "./components/Cashier";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AddProduct from "./subCoponents/AddProduct";
import ProductList from "./subCoponents/ProductList";
import SaleList from "./subCoponents/SaleList";
import AddSale from "./subCoponents/AddSale";
import Sale from "./subCoponents/Sale";
import EditProduct from './subCoponents/EditProduct';
import EditSale from "./subCoponents/EditSale";

import { ToastContainer } from "react-toastify";
import { useState } from "react";

function App() {
  const [isAuthenticated] = useState(() =>
    localStorage.getItem("token") ? true : false
  );

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ children }) => {
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
  };

  return (
    <ContextProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Dashboard & private routes */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
            <Route path="dashboard" element={<Home />} />
            <Route path="product/add" element={<AddProduct />} />
            <Route path="product/edit/:id" element={<EditProduct />} />
            <Route path="product/list" element={<ProductList />} />
            <Route path="return/sale" element={<Sale />} />
          </Route>

          {/* Cashier & its nested routes */}
          <Route path="/cashier" element={<PrivateRoute><Cashier /></PrivateRoute>}>
            <Route path="sale/list" element={<SaleList />} />
            <Route path="sale/add" element={<AddSale />} />
            <Route path="sale/edit/:id" element={<EditSale />} />
          </Route>
        </Routes>
      </Router>
    </ContextProvider>
  );
}

export default App;
