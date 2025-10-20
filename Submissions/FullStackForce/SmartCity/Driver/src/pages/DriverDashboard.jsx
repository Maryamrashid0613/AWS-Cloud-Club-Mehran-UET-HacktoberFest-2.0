import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDriverAuth } from "../context/DriverAuthContext";
import { useNavigate } from "react-router-dom";

const DriverDashboard = () => {
  const { driver, logout } = useDriverAuth();
  const navigate = useNavigate();
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    if (!driver) {
      navigate("/");
      return;
    }

    const fetchShifts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/shift/staff/${driver._id}`
        );
        const updated = res.data.shifts.map((shift) => ({
          ...shift,
          status:
            shift.clockInTime && !shift.clockOutTime
              ? "In Progress"
              : shift.clockOutTime
              ? "Completed"
              : "Not Started",
        }));
        setShifts(updated);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };

    fetchShifts();
  }, [driver, navigate]);

  const handleClock = async (shiftId, action) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/shift/${shiftId}/time`,
        { action }
      );
      alert(res.data.message);

      // 🔄 Refresh updated shift
      const updated = await axios.get(
        `http://localhost:3000/api/shift/staff/${driver._id}`
      );
      const newShifts = updated.data.shifts.map((shift) => ({
        ...shift,
        status:
          shift.clockInTime && !shift.clockOutTime
            ? "In Progress"
            : shift.clockOutTime
            ? "Completed"
            : "Not Started",
      }));
      setShifts(newShifts);
    } catch (error) {
      console.error("Error updating shift:", error);
    }
  };

  if (!driver) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#0A1128]">
              Welcome, {driver.name}
            </h2>
            <p className="text-gray-600">{driver.email}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/driver/login");
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          Assigned Shifts
        </h3>

        {shifts.length === 0 ? (
          <p className="text-gray-500">No shifts assigned yet.</p>
        ) : (
          <div className="grid gap-4">
            {shifts.map((shift) => (
              <div
                key={shift._id}
                className="border p-4 rounded-xl shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-lg">
                    Incident: {shift.incidentId?.title || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {shift.incidentId?.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    Start: {new Date(shift.startTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    End: {new Date(shift.endTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-600 font-semibold">
                    Status: {shift.status}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {!shift.clockInTime && (
                    <button
                      onClick={() => handleClock(shift._id, "clockin")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Clock In
                    </button>
                  )}
                  {shift.clockInTime && !shift.clockOutTime && (
                    <button
                      onClick={() => handleClock(shift._id, "clockout")}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Clock Out
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
