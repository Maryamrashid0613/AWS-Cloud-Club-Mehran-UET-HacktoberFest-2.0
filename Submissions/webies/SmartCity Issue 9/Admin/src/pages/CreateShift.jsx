import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAdmin } from "../context/AdminContext";

export default function CreateShift() {
  const { Api } = useAdmin();
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { incidentId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    assignedTo: "",
    startTime: "",
    endTime: "",
  });

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${Api}/api/staff/get`);
        setStaff(res.data.staff);
      } catch (error) {
        console.error("Failed to fetch staff", error.message);
        setMessage("Failed to load staff data");
        setMessageType("error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.assignedTo) {
      newErrors.assignedTo = "Please select a staff member";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);

      if (end <= start) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      assignedTo: formData.assignedTo,
      incident: incidentId,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    try {
      setIsLoading(true);
      const res = await axios.post(`${Api}/api/shift/create`, payload);
      if (res.status === 201 || res.status === 200) {
        setMessage("Shift created successfully!");
        setMessageType("success");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.error ||
        "Failed to create shift. Please try again.";
      setMessage(errMsg);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const formatDateForInput = (date) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  const getMinEndTime = () => {
    if (!formData.startTime) return "";
    const minEndTime = new Date(formData.startTime);
    minEndTime.setMinutes(minEndTime.getMinutes() + 30);
    return formatDateForInput(minEndTime);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Create New Shift
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center ${
                messageType === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {messageType === "success" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Assigned Staff */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Assign To <span className="text-red-500">*</span>
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                  errors.assignedTo ? "border-red-500" : "border-gray-300"
                } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}`}
              >
                <option value="" disabled>
                  {isLoading ? "Loading staff..." : "Select Staff Member"}
                </option>
                {staff.map((person) => (
                  <option key={person._id} value={person._id}>
                    {person.name}
                  </option>
                ))}
              </select>
              {errors.assignedTo && (
                <p className="mt-1 text-sm text-red-500">{errors.assignedTo}</p>
              )}
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                  errors.startTime ? "border-red-500" : "border-gray-300"
                } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
              )}
            </div>

            {/* End Time */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                disabled={isLoading || !formData.startTime}
                min={getMinEndTime()}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                  errors.endTime ? "border-red-500" : "border-gray-300"
                } ${
                  isLoading || !formData.startTime
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Shift...
                  </>
                ) : (
                  "Create Shift"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
