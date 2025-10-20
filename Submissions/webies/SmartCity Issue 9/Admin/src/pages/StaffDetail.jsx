import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAdmin } from "../context/AdminContext";

const StaffDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const { Api } = useAdmin();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`${Api}/api/staff/getstaff/${id}`);
        setStaff(res.data.staff);
      } catch (err) {
        console.error("Error fetching staff details", err.message);
      }
    };
    fetchStaff();
  }, [id]);

  if (!staff)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg animate-pulse">
          Loading staff details...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-3xl">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={staff.photo || "https://via.placeholder.com/150"}
            alt="Staff"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-emerald-600 shadow-md"
          />
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-emerald-800">
              {staff.name}
            </h2>
            <p className="text-gray-600 mt-2">{staff.email}</p>
            <p className="text-gray-600">{staff.phone}</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-50 rounded-xl p-4 shadow-sm border border-emerald-100">
            <p className="text-sm text-gray-500">Staff ID</p>
            <p className="font-semibold text-emerald-700">{staff.staffId}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 shadow-sm border border-emerald-100">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-semibold text-emerald-700">{staff.address}</p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-10 flex justify-center md:justify-end">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-full hover:bg-emerald-700 transition-all shadow-md"
          >
            <span className="text-lg">←</span>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;
