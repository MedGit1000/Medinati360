// src/components/IncidentForm.jsx

import { useState } from "react";
import axios from "axios";

// REMplacez par un token valide obtenu via Postman.
const API_TOKEN = "COPIEZ-COLLEZ-VOTRE-TOKEN-ICI";

function IncidentForm({ onIncidentCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("34.02");
  const [longitude, setLongitude] = useState("-6.84");
  const [categoryId, setCategoryId] = useState("1"); // On utilise des chaînes de caractères pour les inputs
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "/api/incidents",
        { title, description, latitude, longitude, category_id: categoryId },
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            Accept: "application/json",
          },
        }
      );

      alert("Incident créé avec succès !");
      onIncidentCreated(response.data);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Une erreur est survenue. Vérifiez les champs et votre token.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h2>Signaler un nouvel incident</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label>Titre:</label>
        <br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "300px" }}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>Description:</label>
        <br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ width: "300px", height: "80px" }}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>Catégorie:</label>
        <br />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="1">Voirie</option>
          <option value="2">Propreté</option>
          <option value="3">Éclairage Public</option>
          <option value="4">Espaces Verts</option>
        </select>
      </div>

      {/* Les champs Latitude et Longitude sont cachés pour l'instant, 
          on pourrait les remplir automatiquement avec le GPS du navigateur plus tard */}
      <input
        type="hidden"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
      />
      <input
        type="hidden"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        style={{ marginTop: "15px" }}
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer le signalement"}
      </button>
    </form>
  );
}

export default IncidentForm;
