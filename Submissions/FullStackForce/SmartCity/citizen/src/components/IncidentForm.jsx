import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const IncidentForm = ({ onIncidentCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const { user } = useAuth(); // 👈 get current logged-in user

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in before reporting an incident.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/incident", {
        title,
        description,
        location,
        photoUrl,
        createdBy: user.id,
      });

      alert("Incident reported successfully!");
      onIncidentCreated(res.data.incident);

      // reset form
      setTitle("");
      setDescription("");
      setLocation("");
      setPhotoUrl("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to report incident.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow p-4 rounded space-y-4"
    >
      <h2 className="text-xl font-bold">Report New Incident</h2>
      <input
        type="text"
        placeholder="Title"
        className="border p-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        className="border p-2 w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Location"
        className="border p-2 w-full"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Photo URL"
        className="border p-2 w-full"
        value={photoUrl}
        onChange={(e) => setPhotoUrl(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default IncidentForm;
