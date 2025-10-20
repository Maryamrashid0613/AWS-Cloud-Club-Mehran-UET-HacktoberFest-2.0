import React, { useState } from "react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("zones");

  const tabs = [
    { id: "zones", label: "Collection Zones" },
    { id: "vehicles", label: "Vehicles" },
    { id: "staff", label: "Staff" },
    { id: "tasks", label: "Daily Tasks" },
  ];

  // Sample data
  const [zones, setZones] = useState([
    { _id: 1, name: "Hyderabad" },
    { _id: 2, name: "Karachi" },
    { _id: 3, name: "Latifabad" },
    { _id: 4, name: "Qasimabad" },
  ]);

  const [vehicles, setVehicles] = useState([
    { _id: 1, number: "Corolla", status: "Available" },
    { _id: 2, number: "Civic", status: "On Route" },
    { _id: 3, number: "Sonata", status: "Available" },
  ]);

  const [staff, setStaff] = useState([
    { _id: 1, name: "Ali Khan", role: "Driver" },
    { _id: 2, name: "Hassan Ahmed", role: "Driver" },
    { _id: 3, name: "Sara Khan", role: "Driver" },
  ]);

  const [tasks, setTasks] = useState([
    { _id: 1, driver: "Ali Khan", zone: "Hyderabad", status: "In Progress" },
    { _id: 2, driver: "Hassan Ahmed", zone: "Karachi", status: "Pending" },
  ]);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition">
          Logout
        </button>
      </header>

      {/* Tabs */}
      <nav className="flex justify-center gap-4 mt-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6">
        {/* ZONES */}
        {activeTab === "zones" && (
          <div className="bg-white rounded-xl shadow p-6 max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Manage Collection Zones
            </h2>
            <p className="text-gray-600 mb-4">
              Add, edit, or remove collection zones for efficient waste
              management.
            </p>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter zone name"
                className="border border-gray-300 rounded-lg px-4 py-2 flex-grow focus:ring focus:ring-blue-100 outline-none"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Add Zone
              </button>
            </div>

            <ul className="mt-6 space-y-2">
              {zones.map((zone) => (
                <li
                  key={zone._id}
                  className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100"
                >
                  <span>{zone.name}</span>
                  <button className="text-red-500 hover:text-red-700 font-medium">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* VEHICLES */}
        {activeTab === "vehicles" && (
          <div className="bg-white rounded-xl shadow p-6 max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Manage Vehicles
            </h2>
            <p className="text-gray-600 mb-4">
              Add and assign garbage trucks or service vehicles.
            </p>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Vehicle number"
                className="border border-gray-300 rounded-lg px-4 py-2 flex-grow focus:ring focus:ring-blue-100 outline-none"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Add Vehicle
              </button>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="bg-blue-50 border border-blue-100 p-4 rounded-lg"
                >
                  <h3 className="font-semibold text-blue-800">
                    {vehicle.number}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Status: {vehicle.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAFF */}
        {activeTab === "staff" && (
          <div className="bg-white rounded-xl shadow p-6 max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Manage Staff
            </h2>
            <p className="text-gray-600 mb-4">
              Add or assign collection staff and drivers.
            </p>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Staff name"
                className="border border-gray-300 rounded-lg px-4 py-2 flex-grow focus:ring focus:ring-blue-100 outline-none"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Add Staff
              </button>
            </div>

            <ul className="mt-6 space-y-2">
              {staff.map((member) => (
                <li
                  key={member._id}
                  className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100"
                >
                  <span>
                    {member.name} - {member.role}
                  </span>
                  <button className="text-red-500 hover:text-red-700 font-medium">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* TASKS */}
        {activeTab === "tasks" && (
          <div className="bg-white rounded-xl shadow p-6 max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Assign Daily Tasks
            </h2>
            <p className="text-gray-600 mb-4">
              Assign collection routes to available drivers.
            </p>

            <div className="flex flex-col md:flex-row gap-4">
              <select className="border border-gray-300 rounded-lg px-4 py-2 flex-grow focus:ring focus:ring-blue-100 outline-none">
                <option>Select Driver</option>
                {staff.map((s) => (
                  <option key={s._id}>{s.name}</option>
                ))}
              </select>

              <select className="border border-gray-300 rounded-lg px-4 py-2 flex-grow focus:ring focus:ring-blue-100 outline-none">
                <option>Select Zone</option>
                {zones.map((z) => (
                  <option key={z._id}>{z.name}</option>
                ))}
              </select>

              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Assign Task
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Today's Assigned Tasks
              </h3>
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task._id}
                    className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100"
                  >
                    <span>
                      {task.driver} → {task.zone}
                    </span>
                    <span className="text-sm text-gray-600">{task.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 bg-blue-600 text-white">
        © 2025 SmartCity Waste Management
      </footer>
    </div>
  );
};

export default AdminDashboard;
