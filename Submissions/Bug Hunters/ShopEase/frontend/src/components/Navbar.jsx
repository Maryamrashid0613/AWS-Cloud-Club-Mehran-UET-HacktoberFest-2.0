import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Store,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, loading } = useContext(AuthContext);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                ShopEase
              </span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const navigationItems = [
    ...(user?.user?.role === "admin"
      ? [
          { path: "/dashboard", label: "Dashboard" },
          { path: "/products", label: "Products" },
          { path: "/reports", label: "Reports" },
        ]
      : []),
    ...(user ? [{ path: "/sales", label: "Sales" }] : []),
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const NavLink = ({ href, label }) => {
    const isActive = location.pathname === href;
    return (
      <button
        onClick={() => handleNavigation(href)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
          isActive
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            : "text-gray-300 hover:text-white hover:bg-gray-800/50"
        }`}
      >
        {label}
      </button>
    );
  };

  const UserMenu = ({ mobile = false }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (mobile) {
      return (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer"
          >
            <User className="w-5 h-5" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-700">
                <div className="text-white font-medium">{user.user.name}</div>
                <div className="text-emerald-400 text-sm">{user.user.role}</div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <User className="w-4 h-4" />
          <span className="font-medium">{user.user.name}</span>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">
            {user.user.role}
          </span>
        </div>
        <button
          onClick={logout}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20 cursor-pointer"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                ShopEase
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.path}
                      href={item.path}
                      label={item.label}
                    />
                  ))}
                  <UserMenu />
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="text-gray-300 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-800/50 cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              {user && <UserMenu mobile />}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-gray-900 border-t border-gray-700 py-4 z-40">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`px-4 py-3 rounded-lg font-medium text-left transition-colors cursor-pointer ${
                    location.pathname === item.path
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {!user && (
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      setAuthOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-left font-medium cursor-pointer"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to offset fixed nav */}
      <div className="h-16"></div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
