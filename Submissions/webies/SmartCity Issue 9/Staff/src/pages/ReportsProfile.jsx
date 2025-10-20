import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useStaff } from "../context/StaffContext";
import { Link } from "react-router-dom";

// Fix Leaflet icon issue
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Custom marker icons
const incidentIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const clockInIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const clockOutIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Fix default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const statusConfig = {
  new: {
    label: "New",
    color: "bg-gray-500",
    textColor: "text-white",
  },
  verified: {
    label: "Verified",
    color: "bg-blue-500",
    textColor: "text-white",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-yellow-500",
    textColor: "text-white",
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-500",
    textColor: "text-white",
  },
  assigned: {
    label: "Assigned",
    color: "bg-purple-500",
    textColor: "text-white",
  },
};

const ReportsProfile = () => {
  const { user, Api } = useStaff();
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchShifts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${Api}/api/shift/get`);
      const assignedShifts = res.data.filter(
        (shift) =>
          shift.assignedTo?._id === user?._id && shift.status !== "resolved"
      );
      
      setShifts(assignedShifts);
    } catch (err) {
      console.error("Error fetching shifts:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      fetchShifts();
    }
  }, [user, fetchShifts]);

  const handleStatusChange = async (shift) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setUpdating(true);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true,
        });
      });

      const { latitude, longitude } = position.coords;
      let nextStatus = shift.status;

      if (shift.status === "assigned") {
        nextStatus = "in_progress";
      } else if (shift.status === "in_progress") {
        nextStatus = "resolved";
      } else {
        return;
      }

      await axios.put(`${Api}/api/shift/update/${shift._id}`, {
        status: nextStatus,
        lat: latitude,
        lng: longitude,
        ...(nextStatus === "in_progress"
          ? { clockInLocation: { lat: latitude, lng: longitude } }
          : {}),
        ...(nextStatus === "resolved"
          ? { clockOutLocation: { lat: latitude, lng: longitude } }
          : {}),
      });

      // Update local state
      const updatedShifts = shifts.map((s) =>
        s._id === shift._id
          ? {
              ...s,
              status: nextStatus,
              incident: { ...s.incident, status: nextStatus },
              ...(nextStatus === "in_progress"
                ? { clockInLocation: { lat: latitude, lng: longitude } }
                : {}),
              ...(nextStatus === "resolved"
                ? { clockOutLocation: { lat: latitude, lng: longitude } }
                : {}),
            }
          : s
      );

      setShifts(updatedShifts);
      setSelectedShift((prev) =>
        prev && prev._id === shift._id
          ? {
              ...prev,
              status: nextStatus,
              incident: { ...prev.incident, status: nextStatus },
              ...(nextStatus === "in_progress"
                ? { clockInLocation: { lat: latitude, lng: longitude } }
                : {}),
              ...(nextStatus === "resolved"
                ? { clockOutLocation: { lat: latitude, lng: longitude } }
                : {}),
            }
          : prev
      );
    } catch (error) {
      console.error("Error updating shift:", error);
      alert(error.message || "Failed to update shift status.");
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-500">
            Please log in to view your assigned incidents.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-700">Loading your incidents...</p>
        </div>
      </div>
    );
  }

  const filteredShifts = shifts.filter((shift) => shift.incident);
  const shiftCount = filteredShifts.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Incidents
            </h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
          </div>
          <Link
            to="/resolvedreports"
            className="inline-flex items-center px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
          >
            View Resolved Reports
          </Link>
        </div>

        {!selectedShift ? (
          <>
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <span className="text-2xl text-green-600">📋</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    My Assigned Incidents
                  </h2>
                  <p className="text-gray-500">
                    Active incidents requiring your attention
                  </p>
                </div>
              </div>

              {shiftCount > 0 ? (
                <div
                  className={`grid grid-cols-1 ${
                    shiftCount === 1
                      ? "md:grid-cols-1 max-w-6xl mx-auto"
                      : "md:grid-cols-2"
                  } gap-5`}
                >
                  {filteredShifts.map((shift) => {
                    const statusInfo =
                      statusConfig[shift.incident.status] || statusConfig.new;
                    return (
                      <div
                        key={shift._id}
                        className="bg-white border-l-4 border-green-500 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-800 capitalize line-clamp-1">
                            {shift.incident.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.textColor}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 capitalize">
                          <span className="font-medium">Category:</span>{" "}
                          {shift.incident.category}
                        </p>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <span className="text-xs text-gray-500">
                            Reported:{" "}
                            {new Date(
                              shift?.startTime
                            ).toLocaleString()}
                          </span>
                          <button
                            onClick={() => setSelectedShift(shift)}
                            className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition-colors w-full sm:w-auto"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📭</div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No incidents assigned
                  </h3>
                  <p className="text-gray-500">
                    You don't have any active incidents at the moment.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <button
                onClick={() => setSelectedShift(null)}
                className="inline-flex items-center text-green-600 hover:text-green-800 font-medium transition-colors"
              >
                <span className="mr-2">←</span>
                Back to all reports
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 capitalize">
                    {selectedShift.incident.title}
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center mt-2 gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusConfig[selectedShift.incident.status]?.color
                      } ${
                        statusConfig[selectedShift.incident.status]?.textColor
                      }`}
                    >
                      {statusConfig[selectedShift.incident.status]?.label}
                    </span>
                    <span className="text-sm text-gray-500">
                      Reported:{" "}
                      {new Date(
                        selectedShift.incident.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleStatusChange(selectedShift)}
                  disabled={selectedShift.status === "resolved" || updating}
                  className={`px-6 py-3 rounded-lg font-medium text-white mt-4 md:mt-0 transition-all ${
                    updating
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:shadow-md"
                  } ${
                    selectedShift.status === "resolved"
                      ? "bg-gray-500 cursor-not-allowed"
                      : selectedShift.status === "in_progress"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                >
                  {updating ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Processing...
                    </span>
                  ) : selectedShift.status === "resolved" ? (
                    "Resolved"
                  ) : selectedShift.status === "in_progress" ? (
                    "Mark as Resolved"
                  ) : (
                    "Start Investigation"
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="bg-green-100 text-green-800 p-2 rounded-md mr-3">
                        📋
                      </span>
                      Incident Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="block text-sm font-medium text-gray-500">
                          Category
                        </span>
                        <span className="text-gray-800 capitalize">
                          {selectedShift.incident.category}
                        </span>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500">
                          Description
                        </span>
                        <p className="text-gray-800">
                          {selectedShift.incident.description}
                        </p>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500">
                          Location
                        </span>
                        <span className="text-gray-800">
                          {selectedShift.incident.latitude.toFixed(4)},{" "}
                          {selectedShift.incident.longitude.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedShift.clockInLocation && (
                    <div className="bg-blue-50 p-5 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="bg-blue-100 text-blue-800 p-2 rounded-md mr-3">
                          🕒
                        </span>
                        Clock-In Details
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <span className="block text-sm font-medium text-gray-500">
                            Time
                          </span>
                          <span className="text-gray-800">
                            {new Date(selectedShift.updatedAt).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-500">
                            Location
                          </span>
                          <span className="text-gray-800">
                            {selectedShift.clockInLocation.lat.toFixed(4)},{" "}
                            {selectedShift.clockInLocation.lng.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {selectedShift.incident.photoUrl && (
                    <div className="bg-gray-50 p-5 rounded-xl mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="bg-green-100 text-green-800 p-2 rounded-md mr-3">
                          📸
                        </span>
                        Incident Photo
                      </h3>
                      <div className="rounded-lg overflow-hidden shadow-md">
                        <img
                          src={selectedShift.incident.photoUrl}
                          alt="Incident"
                          className="w-full h-64 object-cover"
                        />
                      </div>
                      <a
                        href={selectedShift.incident.photoUrl}
                        download={`report_${selectedShift.incident._id}.jpg`}
                        className="inline-flex items-center mt-3 text-green-600 hover:text-green-800 font-medium"
                      >
                        <span className="mr-2">⬇️</span>
                        Download Image
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-green-100 text-green-800 p-2 rounded-md mr-3">
                    🗺️
                  </span>
                  Location Map
                </h3>
                <div className="h-96 rounded-lg overflow-hidden shadow-md">
                  <MapContainer
                    center={[
                      selectedShift.incident.latitude,
                      selectedShift.incident.longitude,
                    ]}
                    zoom={15}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[
                        selectedShift.incident.latitude,
                        selectedShift.incident.longitude,
                      ]}
                      icon={incidentIcon}
                    >
                      <Popup>Incident Location</Popup>
                    </Marker>

                    {selectedShift.clockInLocation && (
                      <Marker
                        position={[
                          selectedShift.clockInLocation.lat,
                          selectedShift.clockInLocation.lng,
                        ]}
                        icon={clockInIcon}
                      >
                        <Popup>Clock-In Location</Popup>
                      </Marker>
                    )}

                    {selectedShift.clockOutLocation && (
                      <Marker
                        position={[
                          selectedShift.clockOutLocation.lat,
                          selectedShift.clockOutLocation.lng,
                        ]}
                        icon={clockOutIcon}
                      >
                        <Popup>Clock-Out Location</Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsProfile;
