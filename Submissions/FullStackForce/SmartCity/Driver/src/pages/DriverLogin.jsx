import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDriverAuth } from "../context/DriverAuthContext";

const DriverLogin = () => {
  const [staffId, setStaffId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useDriverAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/users/driver/login",
        {
          staffId,
          email,
        }
      );

      if (res.data.success) {
        login(res.data.staff);
        navigate("/driver/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid Staff ID or Email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Driver Login
        </h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Staff ID"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#0A1128] text-white py-2 rounded hover:bg-blue-900"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default DriverLogin;
