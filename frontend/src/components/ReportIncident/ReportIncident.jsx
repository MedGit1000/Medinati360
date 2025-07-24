// frontend/src/components/ReportIncident/ReportIncident.jsx

import React, { useState, useEffect } from "react";
import {
  X,
  Camera,
  MapPin,
  Navigation,
  CheckCircle,
  Upload,
  Loader,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import apiService from "../../services/apiService";
import LocationPicker from "../LocationPicker/LocationPicker";
import "./ReportIncident.css";

const ReportIncident = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locationMethod, setLocationMethod] = useState(null); // 'gps', 'map', or null

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    latitude: null,
    longitude: null,
    address: "",
    photo: null,
  });

  useEffect(() => {
    // Fetch categories from your API
    apiService.incidents
      .getCategories()
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  // Function to set location and fetch address
  const setLocation = async (lat, lng) => {
    setIsLocating(true);
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: "Recherche de l'adresse...",
    }));
    try {
      const fetchedAddress =
        await apiService.incidents.getAddressFromCoordinates({ lat, lng });
      setFormData((prev) => ({ ...prev, address: fetchedAddress }));
    } catch {
      setFormData((prev) => ({ ...prev, address: "Adresse non trouvée" }));
    } finally {
      setIsLocating(false);
    }
  };

  // Handler for the "Use My Current Location" button
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setError(
          "Impossible d'obtenir votre position. Veuillez l'autoriser ou la sélectionner sur la carte."
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePhotoChange = (e) => {
    // ... (this function remains the same as before)
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("La photo ne doit pas dépasser 5MB.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner une image valide.");
        return;
      }
      setFormData({ ...formData, photo: file });
      setError("");
    }
  };

  const handleSubmit = async () => {
    // ... (this function remains the same as before)
    if (!formData.latitude || !formData.longitude) {
      setError("Veuillez d'abord sélectionner une localisation sur la carte.");
      return;
    }
    if (!formData.title || !formData.description || !formData.category_id) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await apiService.incidents.create(formData);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la soumission.");
    } finally {
      setLoading(false);
    }
  };

  // Function to reset location and go back to the choice screen
  const resetLocation = () => {
    setLocationMethod(null);
    setFormData((prev) => ({
      ...prev,
      latitude: null,
      longitude: null,
      address: "",
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Signaler un Incident</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          {success ? (
            <div
              className="success-message"
              style={{
                padding: "40px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CheckCircle size={48} style={{ marginBottom: "20px" }} />
              <h3 style={{ textAlign: "center", fontSize: "18px" }}>
                Signalement Envoyé !
              </h3>
              <p
                style={{
                  textAlign: "center",
                  color: "var(--text-secondary)",
                  marginTop: "8px",
                }}
              >
                Merci pour votre contribution. Votre signalement sera examiné.
              </p>
            </div>
          ) : (
            <>
              {/* === Step 1: Location Choice === */}
              {!formData.latitude && (
                <div className="form-group">
                  <label className="form-label">
                    Comment voulez-vous localiser l'incident ?{" "}
                    <span className="required">*</span>
                  </label>
                  <div
                    className="location-choice-buttons"
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexDirection: "column",
                    }}
                  >
                    <button
                      className="btn-location-choice"
                      onClick={handleGetCurrentLocation}
                      disabled={isLocating}
                    >
                      {isLocating ? (
                        <Loader className="animate-spin" size={20} />
                      ) : (
                        <Navigation size={20} />
                      )}
                      <span>Utiliser ma position actuelle</span>
                    </button>
                    <button
                      className="btn-location-choice"
                      onClick={() => setLocationMethod("map")}
                    >
                      <MapPin size={20} />
                      <span>Choisir sur la carte</span>
                    </button>
                  </div>
                </div>
              )}

              {locationMethod === "map" && !formData.latitude && (
                <div className="form-group">
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      marginBottom: "12px",
                    }}
                  >
                    Cliquez sur la carte pour placer un marqueur.
                  </p>
                  <LocationPicker onLocationSelect={setLocation} />
                  <button
                    onClick={() => setLocationMethod(null)}
                    className="btn-back"
                    style={{ position: "static", marginTop: "10px" }}
                  >
                    <ArrowLeft size={16} /> Retour
                  </button>
                </div>
              )}

              {/* === Step 2: Form Details (shows after location is set) === */}
              {formData.latitude && (
                <div className="step-content">
                  <div className="form-group">
                    <label className="form-label">
                      Localisation Sélectionnée
                    </label>
                    <p className="location-address-display">
                      {formData.address}
                    </p>
                    <button
                      onClick={resetLocation}
                      className="link-button"
                      style={{ fontSize: "13px" }}
                    >
                      Changer la localisation
                    </button>
                  </div>

                  {/* The rest of the form is the same */}
                  <div className="form-group">
                    <label className="form-label">
                      Titre <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Nid-de-poule dangereux"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Description <span className="required">*</span>
                    </label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="Donnez plus de détails..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Catégorie <span className="required">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.category_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Photo (Optionnel)</label>
                    <div className="photo-upload-area">
                      <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden-input"
                      />
                      <label htmlFor="photo-upload" className="upload-label">
                        <Upload size={24} />
                        <span>
                          {formData.photo
                            ? formData.photo.name
                            : "Ajouter une photo"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {error && (
                    <div className="error-message">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <button
                    className="btn-submit"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader className="animate-spin" size={20} />
                    ) : (
                      <CheckCircle size={20} />
                    )}
                    {loading ? "Envoi en cours..." : "Envoyer le Signalement"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;
