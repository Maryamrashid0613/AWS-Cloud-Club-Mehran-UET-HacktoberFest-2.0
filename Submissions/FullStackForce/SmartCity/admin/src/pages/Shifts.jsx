import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api"; // backend base URL

const Shifts = () => {
  const [staffList, setStaffList] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [form, setForm] = useState({
    staffId: "",
    incidentId: "",
    startTime: "",
    endTime: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStaff();
    fetchIncidents();
    fetchAllShifts();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API_URL}/staff`);
      setStaffList(res.data.staff || []);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  const fetchIncidents = async () => {
    try {
      const res = await axios.get(`${API_URL}/incident`);
      setIncidents(res.data.incidents || []);
    } catch (err) {
      console.error("Error fetching incidents:", err);
    }
  };

  const fetchAllShifts = async () => {
    try {
      const res = await axios.get(`${API_URL}/shift/all`);
      setShifts(res.data.shifts || []);
    } catch (err) {
      console.error("Error fetching shifts:", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAssignShift = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/shift/assign`, form);
      setMessage("✅ Shift Assigned Successfully!");
      setForm({ staffId: "", incidentId: "", startTime: "", endTime: "" });
      fetchAllShifts();
      setTimeout(() => setMessage(""), 2500);
    } catch (error) {
      console.error("Error assigning shift:", error);
      setMessage("❌ Error assigning shift");
    }
  };

  const handleDelete = async (shiftId) => {
    if (!window.confirm("Are you sure you want to delete this shift?")) return;
    try {
      await axios.delete(`${API_URL}/shift/${shiftId}`);
      fetchAllShifts();
    } catch (error) {
      console.error("Error deleting shift:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-[#0A1128]">
        Shift Management
      </h2>

      {/* Shift Assignment Form */}
      <form
        onSubmit={handleAssignShift}
        className="bg-white shadow-md rounded-xl p-6 grid grid-cols-2 gap-4 mb-8"
      >
        <select
          name="staffId"
          value={form.staffId}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Select Staff</option>
          {staffList.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.staffId})
            </option>
          ))}
        </select>

        <select
          name="incidentId"
          value={form.incidentId}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Select Incident</option>
          {incidents.map((i) => (
            <option key={i._id} value={i._id}>
              {i.title} ({i.location})
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="datetime-local"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="col-span-2 bg-[#0A1128] text-white py-2 rounded hover:bg-[#1B2550]"
        >
          Assign Shift
        </button>
      </form>

      {message && (
        <p className="text-center text-green-600 font-semibold">{message}</p>
      )}

      {/* Shifts Table */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-[#0A1128]">
          Assigned Shifts
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0A1128] text-white">
              <th className="p-2">Staff</th>
              <th>Incident</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {shifts.length > 0 ? (
              shifts.map((shift) => (
                <tr key={shift._id} className="border-t text-center">
                  <td className="p-2">{shift.staffId?.name || "—"}</td>
                  <td>
                    {shift.incidentId?.title || "—"} <br />
                    <span className="text-sm text-gray-500">
                      {shift.incidentId?.location}
                    </span>
                  </td>
                  <td>{new Date(shift.startTime).toLocaleString()}</td>
                  <td>{new Date(shift.endTime).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(shift._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No shifts assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shifts;
