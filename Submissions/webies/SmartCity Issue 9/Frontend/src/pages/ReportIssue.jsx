import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
  Popup,
} from "react-leaflet";


const LocationPicker = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const MapCenterUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const Report = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "waste",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([30.3753, 69.3451]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePhotoChange = (e) => setPhotoFile(e.target.files[0]);

  const handleLocationSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (response.data.length === 0) {
        alert("Location not found.");
        return;
      }
      const { lat, lon } = response.data[0];
      setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
      setMapCenter([parseFloat(lat), parseFloat(lon)]);
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Failed to fetch location.");
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }
    setIsLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setMapCenter([latitude, longitude]);
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? "Permission denied. Enable location access."
            : "Unable to get location."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) return alert("Please select a location!");

    setIsSubmitting(true);
    const finalData = new FormData();
    finalData.append("title", formData.title);
    finalData.append("description", formData.description);
    finalData.append("category", formData.category);
    finalData.append("latitude", location.lat);
    finalData.append("longitude", location.lng);
    if (photoFile) finalData.append("photo", photoFile);

    try {
      await axios.post(
        `${import.meta.env.VITE_API}/api/report/incidentupload`,
        finalData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Incident reported successfully!");
      setFormData({ title: "", description: "", category: "waste" });
      setPhotoFile(null);
      setLocation(null);
    } catch (err) {
      console.error(err);
      alert("Error submitting incident.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
      <div className="w-full  bg-white shadow-xl  overflow-hidden h-screen border border-black">
        {/* Header Section */}
        <header className="bg-blue-600 text-white p-6 flex justify-between items-center w-full text-center">
          <h1 className="text-2xl font-bold w-full">Citizen Portal</h1>
          
        </header>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Left Side */}
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Overflowing Garbage Bin"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                rows={5}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Upload Photo (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full text-sm border border-gray-300 rounded-md p-2 cursor-pointer focus:ring-2 focus:ring-blue-500"
              />
              {photoFile && (
                <p className="mt-1 text-xs text-blue-700">
                  Selected: {photoFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Search Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by area or address"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleLocationSearch}
                  className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 transition"
                >
                  Search
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isLocating}
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-60"
            >
              {isLocating ? "Locating..." : "Use My Current Location"}
            </button>

            {locationError && (
              <p className="text-red-600 text-sm">{locationError}</p>
            )}

            <div className="h-64 border rounded-md overflow-hidden">
              <MapContainer
                center={mapCenter}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <LocationPicker setLocation={setLocation} />
                <MapCenterUpdater center={mapCenter} />
                {location && (
                  <Marker position={[location.lat, location.lng]} icon={customIcon}>
                    <Popup>Selected Location</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>

            {location && (
              <div className="text-sm text-blue-700 mt-2">
                📍 Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </div>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-700 text-white py-3 rounded-md hover:bg-blue-800 transition disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
       
      </div>
      
            
    
  );
};

export default Report;
