import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEye,
  FaArrowLeft,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaSearch,
  FaPhone,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAdmin } from "../context/AdminContext";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for map markers
const clockInIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const clockOutIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Shift = () => {
  const { Api } = useAdmin();
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const res = await axios.get(`${Api}/api/shift/get`);
      setShifts(res.data);
    } catch (err) {
      console.error("Failed to fetch shifts", err);
    } finally {
      setLoading(false);
    }
  };

  const renderMap = (coords, label, icon) =>
    coords?.lat && coords?.lng ? (
      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={15}
        style={{ height: "200px", borderRadius: "0.5rem" }}
        scrollWheelZoom={false}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coords.lat, coords.lng]} icon={icon}>
          <Popup>{label} Location</Popup>
        </Marker>
      </MapContainer>
    ) : (
      <div className="bg-gray-100 rounded-md p-4 text-center h-48 flex items-center justify-center">
        <p className="text-sm text-gray-500 italic">
          No {label} location recorded.
        </p>
      </div>
    );

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredShifts = shifts.filter((shift) => {
    return (
      shift.assignedTo?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shift.incident?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.assignedTo?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shift.assignedTo?.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Get current shifts for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentShifts = filteredShifts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredShifts.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-600">Loading shifts...</p>
        </div>
      </div>
    );
  }

  if (selectedShift) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedShift(null)}
            className="mb-6 flex items-center text-green-600 hover:text-green-800 transition-colors font-medium"
          >
            <FaArrowLeft className="mr-2" /> Back to Shifts
          </button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
              <h1 className="text-2xl font-bold">Shift Details</h1>
              <p className="opacity-90">
                Complete information for this assigned shift
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-green-50 p-5 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">
                    Shift Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <FaUser className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Employee</p>
                        <p className="font-medium">
                          {selectedShift.assignedTo?.name || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <FaExclamationTriangle className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Incident</p>
                        <p className="font-medium">
                          {selectedShift.incident?.title || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <FaClock className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            selectedShift.status
                          )}`}
                        >
                          {selectedShift.status || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <FaCalendarAlt className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium">
                          {formatDateTime(selectedShift.startTime)} -{" "}
                          {formatDateTime(selectedShift.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <FaMapMarkerAlt className="text-green-600 mr-2" />{" "}
                      Clock-In Location
                    </h4>
                    {renderMap(
                      selectedShift.clockInLocation,
                      "Clock-In",
                      clockInIcon
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <FaMapMarkerAlt className="text-red-600 mr-2" /> Clock-Out
                      Location
                    </h4>
                    {renderMap(
                      selectedShift.clockOutLocation,
                      "Clock-Out",
                      clockOutIcon
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-5 rounded-lg sticky top-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Employee Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-center mb-4">
                      <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-green-600 text-3xl" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium">
                        {selectedShift.assignedTo?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium flex items-center">
                        <FaEnvelope className="text-gray-400 mr-2" />
                        {selectedShift.assignedTo?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Shift Management
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage all assigned shifts
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by employee, incident, email, or phone..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Employee
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Incident
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Time
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End Time
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentShifts.map((shift) => (
                  <tr
                    key={shift._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <FaUser className="text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {shift.assignedTo?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {shift.assignedTo?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {shift.incident?.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {shift.incident?.type}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          shift.status
                        )}`}
                      >
                        {shift.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(shift.startTime)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(shift.endTime)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <button
                        onClick={() => setSelectedShift(shift)}
                        className="text-green-600 hover:text-green-900 transition-colors inline-flex items-center px-3 py-1 border border-green-300 rounded-md hover:bg-green-50"
                        title="View Details"
                      >
                        <FaEye className="mr-1" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
                {currentShifts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FaExclamationTriangle className="text-3xl mb-2 opacity-50" />
                        <p>No shifts found matching your criteria.</p>
                        {searchTerm && (
                          <button
                            onClick={() => {
                              setSearchTerm("");
                            }}
                            className="mt-2 text-green-600 hover:text-green-800 text-sm"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredShifts.length > itemsPerPage && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredShifts.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredShifts.length}</span>{" "}
                  results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                          currentPage === number
                            ? "z-10 bg-green-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        } border border-gray-300 rounded-md`}
                      >
                        {number}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shift;
