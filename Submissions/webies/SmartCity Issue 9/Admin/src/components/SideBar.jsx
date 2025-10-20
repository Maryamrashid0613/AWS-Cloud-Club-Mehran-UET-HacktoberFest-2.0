import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Clock,
  Users,
  LogOut,
  Menu,
  X,
  UserCheck2Icon,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const navItems = [
  { path: "/", label: "Dashboard", icon: <UserCheck2Icon size={20} /> },
  { path: "/staff", label: "Staff", icon: <User size={20} /> },
  { path: "/shift", label: "Shift", icon: <Clock size={20} /> },
  { path: "/users", label: "Reports", icon: <Users size={20} /> },
];

export default function Sidebar() {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePath, setActivePath] = useState(location.pathname);

  // Update active path when location changes
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-200 text-gray-800 p-4 flex justify-between items-center shadow-md border-b">
        <div className="flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="mr-4 p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="h-8 flex items-center">
            <img
              src="/logoct[1].png"
              alt="EcoTracker Logo"
              className="h-full w-auto object-contain"
            />
          </div>
        </div>
        {admin && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white overflow-hidden mr-2 shadow-sm">
              {admin.profileImage ? (
                <img
                  src={admin.profileImage}
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-green-200 text-green-800 font-semibold text-sm">
                  {admin.username
                    ? admin.username.charAt(0).toUpperCase()
                    : "A"}
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Backdrop for mobile menu */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar for all screen sizes */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 flex flex-col justify-between bg-white min-h-screen shadow-xl transform transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:relative
          ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Collapse toggle button - Desktop only */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 hidden lg:flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Brand section with logo */}
          <div className="p-5 border-b border-gray-400 flex items-center justify-center">
            <div
              className={`flex flex-col items-center ${
                isCollapsed ? "justify-center" : "justify-start w-full"
              }`}
            >
              <div className="h-12 flex items-center mb-2">
                <img
                  src="/logoct[1].png"
                  alt="EcoTracker Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Navigation items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-3 py-3 transition-all duration-200 group relative
                  ${
                    isActive
                      ? "bg-green-50 text-green-700 font-semibold border-l-4 border-green-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                  ${isCollapsed ? "justify-center" : ""}`
                }
              >
                <div className="flex-shrink-0">
                  {React.cloneElement(item.icon, {
                    size: 20,
                    className:
                      isCollapsed && activePath === item.path
                        ? "text-green-600"
                        : "",
                  })}
                </div>
                {!isCollapsed && (
                  <span className="ml-3 transition-opacity duration-200">
                    {item.label}
                  </span>
                )}

                {/* Active indicator for collapsed state */}
                {isCollapsed && activePath === item.path && (
                  <div className="absolute left-0 w-1 h-6 bg-green-600 rounded-r-md"></div>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User section */}
        {admin && (
          <div
            className={`p-4 border-t border-gray-100 text-gray-700 ${
              isCollapsed ? "text-center" : ""
            }`}
          >
            {!isCollapsed ? (
              <>
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-white overflow-hidden mr-3 flex-shrink-0 shadow-sm">
                    {admin.profileImage ? (
                      <img
                        src={admin.profileImage}
                        alt="Admin"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-200 text-green-800 font-semibold">
                        {admin.username
                          ? admin.username.charAt(0).toUpperCase()
                          : "A"}
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-medium truncate text-gray-800">
                      {admin.username || "Admin"}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {admin.email || "admin@ecotracker.com"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 border border-white overflow-hidden mb-2 flex items-center justify-center shadow-sm">
                  {admin.profileImage ? (
                    <img
                      src={admin.profileImage}
                      alt="Admin"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-green-800">
                      {admin.username
                        ? admin.username.charAt(0).toUpperCase()
                        : "A"}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Add padding for mobile header */}
      <div className="lg:hidden h-16"></div>
    </>
  );
}
