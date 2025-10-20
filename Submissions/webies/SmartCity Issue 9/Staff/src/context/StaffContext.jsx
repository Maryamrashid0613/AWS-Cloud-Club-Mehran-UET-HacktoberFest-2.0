// src/context/StaffContext.js
import React, { createContext, useContext, useState } from "react";

const StaffContext = createContext();

export const StaffProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("staff");
    return saved ? JSON.parse(saved) : null;
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem("staff");
  };
  const Api = import.meta.env.VITE_API;

  return (
    <StaffContext.Provider value={{ user, setUser, Api,logout }}>
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => useContext(StaffContext);
