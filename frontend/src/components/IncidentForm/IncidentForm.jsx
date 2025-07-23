// src/components/IncidentForm.jsx

import { useState } from "react";
import axios from "axios";

// Fonction pour récupérer le token depuis le localStorage
const getToken = () => {
  return localStorage.getItem("auth_token");
};

function IncidentForm({ onIncidentCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("34.02");
  const [longitude, setLongitude] = useState("-6.84");
  const [categoryId, setCategoryId] = useState("1");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const token = getToken();
    if (!token) {
      setError("Vous n'êtes pas authentifié. Veuillez vous connecter.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "/api/incidents",
        { title, description, latitude, longitude, category_id: categoryId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      alert("Incident créé avec succès !");
      onIncidentCreated(response.data);
      setTitle("");
      setDescription("");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Votre session a expiré. Veuillez vous reconnecter.");
      } else {
        setError("Une erreur est survenue. Vérifiez les champs.");
      }
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
