import React, { useState } from 'react';
import { Trash2, MapPin, Camera, TrendingUp, Users, Truck, Calendar, Clock, CheckCircle, AlertCircle, Upload, Eye, Edit2, BarChart3, Bell, Home } from 'lucide-react';

const SmartCity = () => {
  const [activeRole, setActiveRole] = useState('citizen');
  
  const [zones, setZones] = useState([
    { id: 1, name: "Haunted Hills Zone A", status: "Collected", driver: "Rohan Sharma", time: "9:30 AM", vehicles: 3 },
    { id: 2, name: "Spooky Streets Zone B", status: "Pending", driver: "Priya Patel", time: "10:45 AM", vehicles: 2 },
    { id: 3, name: "Ghostly Gardens Zone C", status: "In Progress", driver: "Amit Kumar", time: "11:00 AM", vehicles: 4 }
  ]);

  const [complaints, setComplaints] = useState([
    { id: 1, location: "MG Road, Sector 12", status: "Resolved", date: "2 hours ago", citizen: "Sneha R." },
    { id: 2, location: "Park Street, Block C", status: "Pending", date: "5 hours ago", citizen: "Rajesh M." },
    { id: 3, location: "Lake View, Zone 3", status: "In Progress", date: "1 day ago", citizen: "Anita S." }
  ]);

  const [driverRoutes, setDriverRoutes] = useState([
    { id: 1, zone: "Pumpkin Patch Area 1", status: "Pending", houses: 45, time: "8:00 AM" },
    { id: 2, zone: "Candy Corn Lane", status: "Pending", houses: 32, time: "10:00 AM" },
    { id: 3, zone: "Witch's Way Colony", status: "Pending", houses: 28, time: "12:00 PM" }
  ]);

  const stats = {
    admin: { zones: 12, vehicles: 8, staff: 24, pending: 3 },
    driver: { assigned: 3, completed: 0, pending: 3, skipped: 0 },
    citizen: { reported: 2, resolved: 1, pending: 1, response: "2-4 hrs" }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      Collected: "bg-green-100 text-green-700 border-green-300",
      Resolved: "bg-green-100 text-green-700 border-green-300",
      Pending: "bg-orange-100 text-orange-700 border-orange-300",
      "In Progress": "bg-yellow-100 text-yellow-700 border-yellow-300",
      Skipped: "bg-yellow-100 text-yellow-700 border-yellow-300"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${colors[status] || colors.Pending}`}>
        {status}
      </span>
    );
  };

  const AdminView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Collection Zones", value: stats.admin.zones, icon: MapPin, emoji: "🎃" },
          { label: "Active Vehicles", value: stats.admin.vehicles, icon: Truck, emoji: "🚛" },
          { label: "Staff Members", value: stats.admin.staff, icon: Users, emoji: "👻" },
          { label: "Pending Areas", value: stats.admin.pending, icon: AlertCircle, emoji: "🕷️" }
        ].map((stat, i) => (
          <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border-4 border-orange-400 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-8 h-8 text-yellow-600" />
              <span className="text-3xl">{stat.emoji}</span>
            </div>
            <div className="text-3xl font-yellow text-orange-600">{stat.value}</div>
            <div className="text-gray-700 text-sm mt-1 font-bold">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border-4 border-yellow-400 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-yellow text-yellow-700 flex items-center gap-2">
            🕸️ Kachra Collection Zones
          </h2>
          <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full text-white font-bold hover:shadow-lg transition-all flex items-center gap-2 border-2 border-orange-700">
            <MapPin className="w-5 h-5" />
            Add New Zone
          </button>
        </div>

        <div className="space-y-3">
          {zones.map(zone => (
            <div key={zone.id} className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-5 border-2 border-orange-300 hover:border-yellow-400 transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🎃</span>
                    <h3 className="text-lg font-bold text-gray-800">{zone.name}</h3>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span>Driver: {zone.driver}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Time: {zone.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={zone.status} />
                  <button className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-xl text-yellow-600 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-orange-100 hover:bg-orange-200 rounded-xl text-orange-600 transition-colors">
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border-4 border-orange-400 p-6 shadow-xl">
        <h2 className="text-2xl font-yellow text-orange-600 mb-4 flex items-center gap-2">
          📊 Spooky Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Today's Collection", value: "89%", color: "green" },
            { label: "Complaints Resolved", value: "92%", color: "yellow" },
            { label: "Active Trucks", value: "6/8", color: "orange" }
          ].map((item, i) => (
            <div key={i} className={`bg-${item.color}-100 rounded-2xl p-4 border-2 border-${item.color}-300`}>
              <div className="text-gray-600 text-sm font-semibold">{item.label}</div>
              <div className={`text-3xl font-yellow text-${item.color}-600 mt-2`}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DriverView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Assigned Routes", value: stats.driver.assigned, icon: MapPin, emoji: "🗺️" },
          { label: "Completed", value: stats.driver.completed, icon: CheckCircle, emoji: "✅" },
          { label: "Pending", value: stats.driver.pending, icon: Clock, emoji: "⏰" },
          { label: "Skipped", value: stats.driver.skipped, icon: AlertCircle, emoji: "⚠️" }
        ].map((stat, i) => (
          <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border-4 border-yellow-400 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-8 h-8 text-orange-600" />
              <span className="text-3xl">{stat.emoji}</span>
            </div>
            <div className="text-3xl font-yellow text-yellow-600">{stat.value}</div>
            <div className="text-gray-700 text-sm mt-1 font-bold">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border-4 border-orange-400 p-6 shadow-xl">
        <h2 className="text-2xl font-yellow text-orange-600 mb-6 flex items-center gap-2">
          🕷️ Today's Kachra Uthao Routes
        </h2>
        <div className="space-y-4">
          {driverRoutes.map(route => (
            <div key={route.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-5 border-2 border-yellow-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🎃</span>
                    <h3 className="text-lg font-bold text-gray-800">{route.zone}</h3>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      <span>{route.houses} Houses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Scheduled: {route.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <StatusBadge status={route.status} />
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-sm transition-all">
                      ✓ Collected
                    </button>
                    <button className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-full text-yellow-600 transition-colors">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border-4 border-yellow-400 p-6 shadow-xl">
        <h2 className="text-2xl font-yellow text-yellow-600 mb-4 flex items-center gap-2">
          📸 Upload Proof of Collection
        </h2>
        <div className="border-4 border-dashed border-orange-300 rounded-2xl p-8 text-center hover:border-yellow-400 transition-all cursor-pointer bg-orange-50/50">
          <Upload className="w-12 h-12 text-orange-500 mx-auto mb-3" />
          <p className="text-gray-700 font-bold">Click to upload photos 🎃</p>
          <p className="text-sm text-gray-500 mt-1">Support: JPG, PNG (Max 5MB)</p>
        </div>
      </div>
    </div>
  );

  const CitizenView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Complaints Filed", value: stats.citizen.reported, icon: AlertCircle, emoji: "📝" },
          { label: "Resolved", value: stats.citizen.resolved, icon: CheckCircle, emoji: "✅" },
          { label: "Pending", value: stats.citizen.pending, icon: Clock, emoji: "⏰" },
          { label: "Avg Response", value: stats.citizen.response, icon: TrendingUp, emoji: "⚡" }
        ].map((stat, i) => (
          <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border-4 border-orange-400 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-8 h-8 text-yellow-600" />
              <span className="text-3xl">{stat.emoji}</span>
            </div>
            <div className="text-3xl font-yellow text-orange-600">{stat.value}</div>
            <div className="text-gray-700 text-sm mt-1 font-bold">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border-4 border-yellow-400 p-6 shadow-xl">
        <h2 className="text-2xl font-yellow text-yellow-600 mb-6 flex items-center gap-2">
          🕷️ Report Uncollected Kachra
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              Location / Address
            </label>
            <input
              type="text"
              placeholder="Enter your spooky location..."
              className="w-full px-4 py-3 border-2 border-orange-300 rounded-2xl focus:border-yellow-500 focus:outline-none bg-white/80"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
              <Camera className="w-5 h-5 text-yellow-500" />
              Upload Photo
            </label>
            <div className="border-4 border-dashed border-yellow-300 rounded-2xl p-6 text-center hover:border-orange-400 transition-all cursor-pointer bg-yellow-50/50">
              <Camera className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
              <p className="text-gray-700 font-semibold">Click to add a haunting photo 👻</p>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Complaint Details</label>
            <textarea
              placeholder="Describe the kachra situation..."
              rows="4"
              className="w-full px-4 py-3 border-2 border-orange-300 rounded-2xl focus:border-yellow-500 focus:outline-none bg-white/80"
            ></textarea>
          </div>

          <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-yellow-600 text-white rounded-full font-yellow text-lg hover:shadow-lg transition-all border-4 border-orange-700">
            🎃 Submit Complaint
          </button>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border-4 border-orange-400 p-6 shadow-xl">
        <h2 className="text-2xl font-yellow text-orange-600 mb-6 flex items-center gap-2">
          📋 My Spooky Complaints
        </h2>
        <div className="space-y-3">
          {complaints.map(complaint => (
            <div key={complaint.id} className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 border-2 border-orange-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">📍</span>
                    <h3 className="font-bold text-gray-800">{complaint.location}</h3>
                  </div>
                  <p className="text-sm text-gray-600">Filed {complaint.date}</p>
                </div>
                <StatusBadge status={complaint.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-yellow-200 to-orange-300 relative overflow-hidden">
      {/* Cute Spider Web Background Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }}></div>

      {/* Floating Spiders */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>🕷️</div>
        <div className="absolute top-20 right-20 text-3xl animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}>🕸️</div>
        <div className="absolute bottom-20 left-32 text-4xl animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}>🎃</div>
        <div className="absolute top-1/3 right-10 text-3xl animate-bounce" style={{animationDelay: '0.5s', animationDuration: '4s'}}>👻</div>
        <div className="absolute bottom-32 right-1/4 text-4xl animate-bounce" style={{animationDelay: '1.5s', animationDuration: '3s'}}>🕷️</div>
      </div>

      <div className="border-b-4 border-orange-500 bg-gradient-to-r from-yellow-600 to-orange-500 backdrop-blur-lg sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-yellow-600 rounded-full flex items-center justify-center font-yellow text-2xl border-4 border-white shadow-lg">
                🎃
              </div>
              <div>
                <div className="text-2xl font-yellow text-white drop-shadow-lg">
                  SmartCity Kachra Uthao
                </div>
                <div className="text-xs text-orange-100 font-bold">by LappuCodes 🕷️ Halloween Edition</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex bg-white/90 rounded-full p-1 border-4 border-orange-400 shadow-lg">
                {['citizen', 'driver', 'admin'].map(role => (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={`px-4 sm:px-6 py-2 rounded-full font-yellow capitalize transition-all text-sm ${
                      activeRole === role
                        ? 'bg-gradient-to-r from-orange-500 to-yellow-600 text-white shadow-lg'
                        : 'text-gray-700 hover:text-orange-600'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-600 rounded-full flex items-center justify-center font-yellow cursor-pointer hover:shadow-lg transition-all text-white border-2 border-white">
                👤
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 relative z-10">
        {activeRole === 'citizen' && <CitizenView />}
        {activeRole === 'driver' && <DriverView />}
        {activeRole === 'admin' && <AdminView />}
      </div>

      <div className="border-t-4 border-yellow-500 bg-gradient-to-r from-orange-500 to-yellow-600 backdrop-blur-lg mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 text-center text-white">
          <div className="font-yellow text-lg mb-2">🎃 Made with spooky vibes by LappuCodes 🕷️</div>
          <div className="text-sm text-orange-100 font-semibold">Keep the city clean, even on Halloween! 👻 SmartCity © 2025</div>
        </div>
      </div>
    </div>
  );
};

export default SmartCity;

