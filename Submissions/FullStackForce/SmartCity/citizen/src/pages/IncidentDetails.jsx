import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const statusSteps = ["new", "pending", "collected", "skipped"];

const IncidentDetails = () => {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/incident/${id}`);
        setIncident(res.data.incident);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!incident)
    return <p className="text-center mt-10">Incident not found.</p>;

  // Determine progress position
  const currentStepIndex = statusSteps.indexOf(incident.status);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <Link
        to="/"
        className="text-blue-600 hover:underline text-sm inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-3">{incident.title}</h1>
      <p className="text-gray-700 mb-2">{incident.description}</p>
      <p className="text-sm text-gray-500 mb-4">📍 {incident.location}</p>

      {incident.photoUrl && (
        <img
          src={incident.photoUrl}
          alt={incident.title}
          className="w-full max-h-80 object-cover rounded mb-6"
        />
      )}

      {/* Progress Tracker */}
      <div className="mb-6">
        <h2 className="font-semibold mb-3">Status Progress</h2>
        <div className="flex items-center justify-between relative">
          {statusSteps.map((step, index) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  index <= currentStepIndex
                    ? "bg-green-500 border-green-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-sm mt-2 ${
                  index <= currentStepIndex
                    ? "text-green-600 font-medium"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
              {index < statusSteps.length - 1 && (
                <div
                  className={`absolute top-4 left-[12.5%] w-[75%] h-1 ${
                    index < currentStepIndex ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Reported on {new Date(incident.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default IncidentDetails;
