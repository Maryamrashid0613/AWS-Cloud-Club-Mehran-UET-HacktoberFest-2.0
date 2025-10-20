import React from "react";
import { Link } from "react-router-dom";

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  collected: "bg-green-100 text-green-800",
  skipped: "bg-red-100 text-red-800",
};

const IncidentList = ({ incidents }) => {
  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-bold">Your Reported Incidents</h2>
      {incidents.length === 0 ? (
        <p>No incidents reported yet.</p>
      ) : (
        incidents.map((inc) => (
          <Link
            to={`/incident/${inc._id}`}
            key={inc._id}
            className="block border p-4 rounded shadow bg-white hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{inc.title}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[inc.status]
                }`}
              >
                {inc.status}
              </span>
            </div>
            <p className="text-gray-700 mt-1">{inc.description}</p>
            <p className="text-sm text-gray-500">📍 {inc.location}</p>
            {inc.photoUrl && (
              <img
                src={inc.photoUrl}
                alt={inc.title}
                className="mt-2 w-40 h-40 object-cover rounded"
              />
            )}
          </Link>
        ))
      )}
    </div>
  );
};

export default IncidentList;
