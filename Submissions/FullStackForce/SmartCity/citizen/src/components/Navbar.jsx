import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-800 text-white p-4 flex justify-between">
      <h1 className="font-bold text-xl">Citizen Dashboard</h1>
      <div>
        <Link to="/" className="mr-4 hover:underline">
          Home
        </Link>
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
