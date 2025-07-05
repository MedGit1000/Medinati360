// src/App.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import IncidentForm from "./components/IncidentForm";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cette fonction récupère la liste initiale des incidents
  const fetchIncidents = async () => {
    try {
      const response = await axios.get("/api/incidents");
      setIncidents(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Se lance une seule fois au chargement
  useEffect(() => {
    fetchIncidents();
  }, []);

  // Cette fonction est appelée par le formulaire quand un nouvel incident est créé
  // Elle ajoute le nouvel incident au début de la liste existante
  const handleIncidentCreated = (newIncident) => {
    setIncidents((prevIncidents) => [newIncident, ...prevIncidents]);
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* On passe la fonction en props au composant formulaire */}
      <IncidentForm onIncidentCreated={handleIncidentCreated} />
      <hr style={{ margin: "20px 0" }} />
      <h1>Liste des Incidents</h1>
      <ul>
        {incidents.map((incident) => (
          <li key={incident.id}>
            <strong>{incident.title}</strong> -{" "}
            <i>signalé par {incident.user.name}</i>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
