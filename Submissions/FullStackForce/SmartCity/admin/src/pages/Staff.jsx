import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/staff"; // 🔧 your backend route

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    staffId: "",
    phone: "",
    address: "",
  });
  const [editingStaff, setEditingStaff] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all staff
  const fetchStaff = async () => {
    try {
      const res = await axios.get(API_URL);
      setStaffList(res.data.staff || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle create or update staff
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await axios.put(`${API_URL}/${editingStaff._id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ name: "", email: "", staffId: "", phone: "", address: "" });
      setEditingStaff(null);
      setShowForm(false);
      fetchStaff();
    } catch (error) {
      console.error("Error saving staff:", error);
      alert(error.response?.data?.message || "Error saving staff");
    }
  };

  // Handle edit
  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setFormData(staff);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?"))
      return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setStaffList((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Staff Management
        </h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingStaff(null);
            setFormData({
              name: "",
              email: "",
              staffId: "",
              phone: "",
              address: "",
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Staff
        </button>
      </div>

      {/* Staff Table */}
      {loading ? (
        <p className="text-gray-500">Loading staff...</p>
      ) : staffList.length === 0 ? (
        <p className="text-gray-500">No staff members found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Staff ID</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((s, index) => (
                <tr key={s._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {s.name}
                  </td>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">{s.staffId}</td>
                  <td className="px-4 py-3">{s.phone}</td>
                  <td className="px-4 py-3">{s.address}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
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

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingStaff ? "Edit Staff" : "Add New Staff"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="text"
                name="staffId"
                placeholder="Staff ID"
                value={formData.staffId}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-md"
              />

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingStaff ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
