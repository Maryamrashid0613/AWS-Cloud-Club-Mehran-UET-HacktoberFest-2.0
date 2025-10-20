import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/incident"; // ⚙️ your backend route

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch all incidents
  const fetchIncidents = async () => {
    try {
      const res = await axios.get(API_URL);
      setIncidents(res.data.incidents || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      setLoading(false);
    }
  };

  // Update incident status
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await axios.put(`${API_URL}/${id}/status`, { status: newStatus });
      await fetchIncidents();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete an incident
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this incident?"))
      return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setIncidents((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting incident:", error);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading incidents...</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Reported Incidents
      </h2>

      {incidents.length === 0 ? (
        <p className="text-gray-500">No incidents reported yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Reported By</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident, index) => (
                <tr
                  key={incident._id}
                  className="border-b hover:bg-gray-50 transition-all"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {incident.title}
                  </td>
                  <td className="px-4 py-3 truncate max-w-xs">
                    {incident.description}
                  </td>
                  <td className="px-4 py-3">{incident.location}</td>
                  <td className="px-4 py-3">
                    {incident.createdBy
                      ? `${incident.createdBy.username} (${incident.createdBy.email})`
                      : "Unknown"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={incident.status || "Pending"}
                      onChange={(e) =>
                        handleStatusUpdate(incident._id, e.target.value)
                      }
                      disabled={updatingId === incident._id}
                      className="border rounded-md px-2 py-1 bg-gray-50"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {incident.photoUrl ? (
                      <img
                        src={incident.photoUrl}
                        alt={incident.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      "No Photo"
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(incident._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Incidents;
