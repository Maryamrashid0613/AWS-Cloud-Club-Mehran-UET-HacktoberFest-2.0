import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaArrowLeft,
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { useAdmin } from "../context/AdminContext";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icon
const reportIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DetailReports = () => {
  const { Api } = useAdmin();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Api}/api/report/getreport/${id}`);
      if (response.status === 200) {
        setReport(response.data.reports);
      }
    } catch (error) {
      console.error("Error fetching report", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setVerifying(true);
      const response = await axios.post(`${Api}/api/report/change/${id}`);
      if (response.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.error("Error verifying report", error);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-600">Loading report details...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Report Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested report could not be loaded.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-green-600 hover:text-green-800 font-medium flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const hasValidCoordinates =
    typeof report.latitude === "number" &&
    typeof report.longitude === "number" &&
    !isNaN(report.latitude) &&
    !isNaN(report.longitude);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-green-600 hover:text-green-800 transition-colors font-medium mb-4"
          >
            <FaArrowLeft className="mr-2" /> Back to Reports
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Report Details</h1>
          <p className="text-gray-600 mt-2">
            Complete information for this incident report
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Status header bar */}
          <div
            className={`px-6 py-4 ${
              report.status?.toLowerCase() === "new"
                ? "bg-gray-600"
                : report.status?.toLowerCase() === "verified"
                ? "bg-blue-600"
                : "bg-green-600"
            } text-white`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <span className="text-lg font-semibold">
                Status: {report.status}
              </span>
              <span className="text-sm mt-1 sm:mt-0">
                Reported on {formatDate(report.createdAt)}
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Report Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaInfoCircle className="text-green-600 mr-2" />
                  Incident Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Title</h4>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {report.title}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Description
                    </h4>
                    <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                      {report.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 flex items-center">
                        <FaUser className="text-gray-400 mr-2" />
                        Reported By
                      </h4>
                      <p className="text-gray-700 mt-1">
                        {report.createdBy?.username || "Anonymous"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        Date Reported
                      </h4>
                      <p className="text-gray-700 mt-1">
                        {formatDate(report.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {report.status?.toLowerCase() === "new" && (
                  <button
                    onClick={handleVerify}
                    disabled={verifying}
                    className={`flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 ${
                      verifying ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    <FaCheckCircle className="text-lg" />
                    {verifying ? "Verifying..." : "Verify Report"}
                  </button>
                )}

                {report.status?.toLowerCase() === "verified" && (
                  <button
                    onClick={() => navigate(`/create-shift/${report._id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300"
                  >
                    Create Shift Assignment
                  </button>
                )}

                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition duration-300"
                >
                  Back to Reports
                </button>
              </div>
            </div>

            {/* Media and Map Section */}
            <div className="space-y-6">
              {/* Photo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Incident Photo
                </h3>
                {report.photoUrl ? (
                  <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
                    <img
                      src={report.photoUrl}
                      alt={`Report: ${report.title}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-100 text-gray-400 rounded-lg shadow-inner border border-gray-200">
                    <FaExclamationTriangle className="text-2xl mb-2" />
                    <p>No image provided</p>
                  </div>
                )}
              </div>

              {/* Map */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FaMapMarkerAlt className="text-green-600 mr-2" />
                  Incident Location
                </h3>
                {hasValidCoordinates ? (
                  <div className="rounded-lg overflow-hidden shadow-md border border-gray-200 h-64">
                    <MapContainer
                      center={[report.latitude, report.longitude]}
                      zoom={15}
                      scrollWheelZoom={true}
                      className="w-full h-full"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker
                        position={[report.latitude, report.longitude]}
                        icon={reportIcon}
                      >
                        <Popup>
                          <div className="font-semibold">{report.title}</div>
                          <div className="text-sm">
                            {report.description.substring(0, 100)}...
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center bg-gray-100 text-gray-400 rounded-lg shadow-inner border border-gray-200">
                    <FaExclamationTriangle className="text-2xl mb-2" />
                    <p>Location data not available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailReports;
