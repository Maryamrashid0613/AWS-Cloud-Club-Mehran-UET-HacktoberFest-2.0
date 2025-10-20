import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStaff } from "../context/StaffContext";

const Navbar = () => {
  const { user, logout } = useStaff();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);


  const handleLogout = () => {
    // Fallback logout if context logout doesn't work
    try {
      logout();
    } catch (error) {
      console.error("Error with context logout:", error);
      // Manual logout as fallback
      localStorage.removeItem("staff");
      window.location.reload(); // Force refresh to clear state
    }
    navigate("/");
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Generate user initials for profile avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get a color based on user's name for the avatar background
  const getAvatarColor = () => {
    if (!user || !user.name) return "bg-green-600";

    const colors = [
      "bg-green-600",
      "bg-blue-600",
      "bg-purple-600",
      "bg-red-600",
      "bg-yellow-600",
      "bg-pink-600",
      "bg-indigo-600",
    ];

    const charSum = user.name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <span className="font-bold text-gray-800 text-xl">
              <img src="logoct.png" className="h-16 " alt="CivicTrack Logo" />
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center justify-center space-x-4 flex-1 mx-8">
            {user && (
              <>
                <Link
                  to="/reportsprofile"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/reportsprofile")
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    My Incidents
                  </span>
                </Link>
                <Link
                  to="/resolvedreports"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/resolvedreports")
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resolved Reports
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Desktop Navigation - Right */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              /* Profile Dropdown */
              <div
                className="relative"
                ref={profileDropdownRef}
              >
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  aria-expanded={isProfileDropdownOpen}
                >
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div
                      className={`${getAvatarColor()} rounded-full h-8 w-8 flex items-center justify-center text-white font-semibold text-sm`}
                    >
                      {getUserInitials()}
                    </div>
                  )}
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role || "Staff Member"}
                    </p>
                  </div>
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200 divide-y divide-gray-100">
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email || `${user.name.toLowerCase().replace(/\s+/g, '.')}@civictrack.com`}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="group w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                      >
                        <svg
                          className="h-4 w-4 mr-2 text-gray-500 group-hover:text-gray-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
         ""
            )}
          </div>

          {/* Mobile menu button - Only show if user is logged in */}
          {user && (
            <div className="md:hidden flex items-center">
              <div className="mr-2 relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div
                      className={`${getAvatarColor()} rounded-full h-8 w-8 flex items-center justify-center text-white font-semibold text-xs`}
                    >
                      {getUserInitials()}
                    </div>
                  )}
                </button>

              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-colors"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && user && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/reportsprofile"
                className={`group flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/reportsprofile")
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a极2 2 0 01-2 2z" />
                </svg>
                My Incidents
              </Link>
              <Link
                to="/resolvedreports"
                className={`group flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/resolvedreports")
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 极12l2 2 4-4m6 2a9 9 0 11-18 极0 9 9 0 0118 0z" />
                </svg>
                Resolved Reports
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center px-3极 py-2">
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover border border-gray-200 mr-3"
                    />
                  ) : (
                    <div
                      className={`${getAvatarColor()} rounded-full h-10 w-10 flex items-center justify-center text-white font-semibold mr-3`}
                    >
                      {getUserInitials()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.role || "Staff Member"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="group w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="h-5 w-5 mr-3 text-gray-500 group-hover:text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;