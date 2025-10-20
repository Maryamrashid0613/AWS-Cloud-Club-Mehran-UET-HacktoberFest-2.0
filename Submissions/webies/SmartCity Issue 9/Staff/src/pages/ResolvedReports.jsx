import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStaff } from "../context/StaffContext";
import LoadingSpinner from "../components/LoadingSpinner";

const ResolvedReports = () => {
  const { user, Api } = useStaff();
  const [resolvedShifts, setResolvedShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResolvedShifts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${Api}/api/shift/get`);
        const filtered = res.data.filter(
          (shift) =>
            shift.assignedTo?._id === user?._id && shift.status === "resolved"
        );
       
        setResolvedShifts(filtered);
      } catch (err) {
        console.error("Error fetching resolved shifts:", err);
        setError("Failed to load resolved incidents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchResolvedShifts();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-4">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-500">
            Please log in to view your resolved incidents.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <LoadingSpinner text="Loading resolved incidents..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-4">
          <div className="text-6xl mb-4 text-red-500">❌</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <span className="text-2xl text-green-600">✅</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Resolved Incidents
              </h2>
              <p className="text-gray-500">
                All incidents that have been successfully resolved
              </p>
            </div>
          </div>

          {resolvedShifts.length > 0 ? (
            <div
              className={`grid grid-cols-1 ${
                resolvedShifts.length === 1
                  ? "md:grid-cols-1 max-w-6xl mx-auto"
                  : "md:grid-cols-2"
              } gap-6`}
            >
              {resolvedShifts.map((shift) => (
                <div
                  key={shift._id}
                  className="bg-white border-l-4 border-green-500 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 capitalize line-clamp-2">
                      {shift.incident?.title || "Untitled Incident"}
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                      Resolved
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <p className="text-sm text-gray-600 capitalize">
                      <span className="font-medium text-gray-800">
                        Category:
                      </span>{" "}
                      {shift.incident?.category || "N/A"}
                    </p>

                    {shift.incident?.description && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-800">
                          Description:
                        </span>{" "}
                        <span className="line-clamp-2">
                          {shift.incident.description}
                        </span>
                      </p>
                    )}

                    {shift.resolvedAt && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-800">
                          Resolved on:
                        </span>{" "}
                        {new Date(shift.resolvedAt).toLocaleDateString()}
                      </p>
                    )}

                    {shift.clockOutLocation && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-800">
                          Closed at location:
                        </span>{" "}
                        {shift.clockOutLocation.lat.toFixed(4)},{" "}
                        {shift.clockOutLocation.lng.toFixed(4)}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-xs text-black">
                      Reported:{" "}
                      <div className="flex text-xs text-gray-500">
                        Started:{" "}
                        {shift?.startTime
                          ? new Date(shift?.startTime).toLocaleString()
                          : "N/A"}
                      </div>
                      <div className="flex text-xs text-gray-500">
                        Ended:{" "}
                        {shift?.endTime
                          ? new Date(shift?.endTime).toLocaleString()
                          : "N/A"}
                      </div>
                    </span>

                    {shift.incident?.photoUrl && (
                      <a
                        href={shift.incident.photoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 极0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        View Photo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No resolved incidents
              </h3>
              <p className="text-gray-500">
                You haven't resolved any incidents yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResolvedReports;
