import React, { useEffect, useState } from "react";

import IncidentForm from "../components/IncidentForm";
import IncidentList from "../components/IncidentList";
import axios from "axios";

const CitizenDashboard = () => {
  const [incidents, setIncidents] = useState([]);

  const fetchIncidents = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/incident");
      setIncidents(res.data.incidents);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleNewIncident = (incident) => {
    setIncidents([incident, ...incidents]);
  };

  return (
    <div className="p-4">
      <IncidentForm onIncidentCreated={handleNewIncident} />
      <IncidentList incidents={incidents} />
    </div>
  );
};

export default CitizenDashboard;
