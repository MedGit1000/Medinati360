import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect se lance une seule fois au chargement du composant
  useEffect(() => {
    // On définit une fonction asynchrone pour récupérer les données
    const fetchIncidents = async () => {
      try {
        const response = await axios.get("/api/incidents");
        setIncidents(response.data); // On met les données dans le state
      } catch (error) {
        console.error("Erreur lors de la récupération des incidents:", error);
      } finally {
        setLoading(false); // On arrête le chargement
      }
    };

    fetchIncidents();
  }, []); // Le tableau vide [] signifie que l'effet ne se relance pas

  if (loading) {
    return <p>Chargement des incidents...</p>;
  }

  return (
    <div>
      <h1>Liste des Incidents</h1>
      <ul>
        {incidents.map((incident) => (
          <li key={incident.id}>
            {incident.title} - <i>signalé par {incident.user.name}</i>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
