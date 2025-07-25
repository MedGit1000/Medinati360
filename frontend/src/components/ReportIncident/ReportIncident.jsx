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
  Trash2,
} from "lucide-react";
import apiService from "../../services/apiService";
import LocationPicker from "../LocationPicker/LocationPicker";
import "./ReportIncident.css";

const ReportIncident = ({ onClose, onSuccess, incidentToEdit = null }) => {
  const isEditMode = Boolean(incidentToEdit);
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);

  // Location method is only for creation mode
  const [locationMethod, setLocationMethod] = useState(null);

  // Safely get the base URL for storage to prevent crashes
  const storageBaseUrl = (
    import.meta.env.VITE_API_URL ?? "http://localhost:8000/api"
  ).replace("/api", "");

  const [photoPreview, setPhotoPreview] = useState(
    incidentToEdit?.photo_path
      ? `${storageBaseUrl}/storage/${incidentToEdit.photo_path}`
      : null
  );

  const [formData, setFormData] = useState({
    title: incidentToEdit?.title || "",
    description: incidentToEdit?.description || "",
    category_id: incidentToEdit?.category_id || "",
    latitude: incidentToEdit?.latitude || null,
    longitude: incidentToEdit?.longitude || null,
    address: "", // Address will be fetched if needed
    photo: null,
  });

  useEffect(() => {
    // Fetch categories when the component mounts
    apiService.incidents
      .getCategories()
      .then(setCategories)
      .catch((err) => {
        console.error("Failed to load categories", err);
        setError("Impossible de charger les catégories.");
      });
  }, []);

  // Set location and fetch address (for creation mode)
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

  // Get location from browser GPS (for creation mode)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("La photo ne doit pas dépasser 5MB.");
        return;
      }
      setFormData({ ...formData, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const removePhoto = () => {
    setFormData({ ...formData, photo: null });
    setPhotoPreview(null);
    const fileInput = document.getElementById("photo-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.category_id) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (!isEditMode && (!formData.latitude || !formData.longitude)) {
      setError("Veuillez sélectionner une localisation.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      if (isEditMode) {
        // Prepare payload for update, only sending changed fields
        const updatePayload = {
          title: formData.title,
          description: formData.description,
          category_id: formData.category_id,
        };
        // Only include the photo if a new one was selected
        if (formData.photo) {
          updatePayload.photo = formData.photo;
        }
        await apiService.incidents.update(incidentToEdit.id, updatePayload);
      } else {
        // Create a new incident with all form data
        await apiService.incidents.create(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        onSuccess(); // Callback to refresh the list
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la soumission.");
    } finally {
      setLoading(false);
    }
  };

  // Reset location state to go back to the choice screen
  const resetLocation = () => {
    setLocationMethod(null);
    setFormData((prev) => ({
      ...prev,
      latitude: null,
      longitude: null,
      address: "",
    }));
  };

  // Renders the main form fields (title, description, etc.)
  const renderFormFields = () => (
    <>
      {isEditMode && formData.latitude && (
        <div className="form-group">
          <label className="form-label">Localisation (non modifiable)</label>
          <p className="location-address-display">
            Lat: {parseFloat(formData.latitude).toFixed(5)}, Lng:{" "}
            {parseFloat(formData.longitude).toFixed(5)}
          </p>
        </div>
      )}
      <div className="form-group">
        <label className="form-label">
          Titre <span className="required">*</span>
        </label>
        <input
          type="text"
          name="title"
          className="form-input"
          placeholder="Ex: Nid-de-poule dangereux"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label className="form-label">
          Description <span className="required">*</span>
        </label>
        <textarea
          name="description"
          className="form-textarea"
          rows={4}
          placeholder="Donnez plus de détails..."
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label className="form-label">
          Catégorie <span className="required">*</span>
        </label>
        <select
          name="category_id"
          className="form-select"
          value={formData.category_id}
          onChange={handleChange}
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
        <label className="form-label">Photo</label>
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
                : isEditMode
                ? "Changer la photo"
                : "Ajouter une photo"}
            </span>
            <span className="upload-hint">PNG, JPG, GIF jusqu'à 5MB</span>
          </label>
        </div>
        {photoPreview && (
          <div className="photo-preview">
            <img src={photoPreview} alt="Aperçu" className="preview-image" />
            <button
              onClick={removePhoto}
              className="remove-photo"
              title="Remove photo"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      {error && (
        <div className="error-message">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
        {loading ? (
          <Loader className="animate-spin" size={20} />
        ) : (
          <CheckCircle size={20} />
        )}
        {loading
          ? "Enregistrement..."
          : isEditMode
          ? "Enregistrer les Modifications"
          : "Envoyer le Signalement"}
      </button>
    </>
  );

  // Renders the initial location choice UI (for creation mode only)
  const renderLocationPicker = () => (
    <>
      <div className="form-group">
        <label className="form-label">
          Comment voulez-vous localiser l'incident ?{" "}
          <span className="required">*</span>
        </label>
        <div
          className="location-choice-buttons"
          style={{ display: "flex", gap: "10px", flexDirection: "column" }}
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
      {locationMethod === "map" && (
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
    </>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditMode ? "Modifier l'Incident" : "Signaler un Incident"}
          </h2>
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
                {isEditMode
                  ? "Modifications Enregistrées !"
                  : "Signalement Envoyé !"}
              </h3>
              <p
                style={{
                  textAlign: "center",
                  color: "var(--text-secondary)",
                  marginTop: "8px",
                }}
              >
                Merci pour votre contribution.
              </p>
            </div>
          ) : (
            <div className="step-content">
              {/* If creating, show location picker until location is set. If editing, show form fields directly. */}
              {isEditMode || formData.latitude
                ? renderFormFields()
                : renderLocationPicker()}

              {/* Add a back button for create mode if a location has been selected */}
              {!isEditMode && formData.latitude && (
                <button
                  onClick={resetLocation}
                  className="btn-back"
                  style={{
                    position: "static",
                    width: "100%",
                    marginTop: "12px",
                  }}
                >
                  <ArrowLeft size={16} /> Changer la localisation
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;
