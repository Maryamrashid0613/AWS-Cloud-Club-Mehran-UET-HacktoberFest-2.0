import React, { createContext, useContext, useState, useEffect } from "react";
import dataService from "../services/dataService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const user = dataService.getUserByEmail(email);
    if (user && user.password === password) {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const register = (userData) => {
    // Check if user already exists
    const existingUser = dataService.getUserByEmail(userData.email);
    if (existingUser) {
      return { success: false, message: "User already exists with this email" };
    }

    // Create new user using data service
    const newUser = dataService.createUser(userData);

    if (userData.role !== "instructor") {
      setCurrentUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
    }

    return {
      success: true,
      user: newUser,
      message:
        userData.role === "instructor"
          ? "Registration successful! Your account is pending approval."
          : "Registration successful!",
    };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const updateUserProfile = (updatedData) => {
    if (currentUser) {
      const updatedUser = dataService.updateUser(currentUser.id, updatedData);
      if (updatedUser) {
        setCurrentUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      }
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUserProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
