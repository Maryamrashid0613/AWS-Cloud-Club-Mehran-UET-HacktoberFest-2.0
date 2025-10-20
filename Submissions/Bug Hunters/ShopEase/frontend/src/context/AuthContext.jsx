import React, { createContext, useEffect, useState, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("shopease_auth");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (error) {
        console.error("Error parsing auth data:", error);
        localStorage.removeItem("shopease_auth");
      }
    }
    setLoading(false);
  }, []);

  const saveUser = (data) => {
    localStorage.setItem("shopease_auth", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("shopease_auth");
    setUser(null);
  };

  const authHeaders = () => {
    if (!user?.token) return {};
    return { Authorization: `Bearer ${user.token}` };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      saveUser, 
      logout, 
      authHeaders, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}