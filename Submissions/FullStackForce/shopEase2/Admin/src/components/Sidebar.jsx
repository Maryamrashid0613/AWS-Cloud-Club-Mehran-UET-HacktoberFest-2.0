import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserPlusIcon,
  CubeIcon,
  TruckIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <HomeIcon className="h-5 w-5" /> },
    
    {
      name: "Products",
      path: "/admin-dashboard/products",
      icon: <CubeIcon className="h-5 w-5" />,
    },
    {
      name: "Cashier Invoices",
      path: "/admin-dashboard/cashierinvoices",
      icon: <TruckIcon className="h-5 w-5" />,
    },
    {
      name: "Reports",
      path: "/admin-dashboard/reports",
      icon: <ChartBarIcon className="h-5 w-5" />,
    },
  ];

  return (
    <>
      
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
       
        <div className="flex items-center justify-center py-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">Inventory Pro</h1>
        </div>

        <nav className="mt-6 space-y-1 px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-100"
                } flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        
        <div className="absolute bottom-0 w-full border-t border-gray-200 p-4 text-sm text-gray-500 text-center">
          © 2025 Inventory System
        </div>
      </div>

     
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
