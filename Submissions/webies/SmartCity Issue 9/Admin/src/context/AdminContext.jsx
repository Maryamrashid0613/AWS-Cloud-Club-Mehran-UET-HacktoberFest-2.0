import React, { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

const STORAGE_KEY = "ecoTrackerAdmin";

export function AdminProvider({ children }) {
  const Api = import.meta.env.VITE_API;

  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem(STORAGE_KEY);
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });

  useEffect(() => {
    if (admin) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [admin]);

  // login function will be implemented in your Login component/file and
  // should call setAdmin after successful login

  const logout = () => {
    setAdmin(null);
  };

  const value = {
    admin,
    setAdmin,
    logout,
    isLoggedIn: !!admin,
    Api,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
