import React, { useState } from "react";

const DriverPortal = () => {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      zone: "North Zone",
      address: "Street 12, Block A",
      status: "Pending",
      proof: null,
    },
    {
      id: 2,
      zone: "East Zone",
      address: "Main Avenue, Sector 9",
      status: "Collected",
      proof: null,
    },
    {
      id: 3,
      zone: "South Zone",
      address: "Park Road, Area 5",
      status: "Skipped",
      proof: null,
    },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setRoutes((prev) =>
      prev.map((route) =>
        route.id === id ? { ...route, status: newStatus } : route
      )
    );
  };

  const handleProofUpload = (id, file) => {
    setRoutes((prev) =>
      prev.map((route) =>
        route.id === id ? { ...route, proof: file.name } : route
      )
    );
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8 text-gray-800">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Driver Portal
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-white shadow-lg rounded-2xl p-5 "
          >
            <h2 className="text-xl font-semibold text-blue-700">
              {route.zone}
            </h2>
            <p className="text-gray-600 mb-2">{route.address}</p>

            <div className="mb-3">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  route.status === "Collected"
                    ? "bg-green-100 text-green-700"
                    : route.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {route.status}
              </span>
            </div>

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => handleStatusChange(route.id, "Collected")}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Collected
              </button>
              <button
                onClick={() => handleStatusChange(route.id, "Pending")}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Pending
              </button>
              <button
                onClick={() => handleStatusChange(route.id, "Skipped")}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Skipped
              </button>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Upload Proof:
              </label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm border border-gray-300 rounded-lg p-1"
                onChange={(e) =>
                  handleProofUpload(route.id, e.target.files[0])
                }
              />
              {route.proof && (
                <p className="text-sm text-blue-600 mt-2">
                  Uploaded: {route.proof}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverPortal;
