import React, { createContext, useContext, useState } from "react";

const DriverAuthContext = createContext();

export const DriverAuthProvider = ({ children }) => {
  const [driver, setDriver] = useState(null);

  const login = (driverData) => setDriver(driverData);
  const logout = () => setDriver(null);

  return (
    <DriverAuthContext.Provider value={{ driver, login, logout }}>
      {children}
    </DriverAuthContext.Provider>
  );
};

export const useDriverAuth = () => useContext(DriverAuthContext);
