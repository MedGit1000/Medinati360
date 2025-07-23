import React, { useState, useEffect } from "react";
import {
  X,
  Camera,
  MapPin,
  AlertCircle,
  Upload,
  Info,
  Loader,
  CheckCircle,
} from "lucide-react";
import apiService from "../../services/apiService";
import "./ReportIncident.css";

const ReportIncident = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    latitude: null,
    longitude: null,
    address: "", // Pour l'affichage
    photo: null,
  });

  // Charger les catégories depuis l'API
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/categories", {
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        // Use default categories if API fails
        setCategories([
          { id: 1, name: "Voirie & Circulation", icon: "🚗" },
          { id: 2, name: "Propreté & Environnement", icon: "🧹" },
          { id: 3, name: "Éclairage Public", icon: "💡" },
          { id: 4, name: "Espaces Verts & Parcs", icon: "🌳" },
          { id: 5, name: "Sécurité & Ordre Public", icon: "👮" },
          { id: 6, name: "Services & Infrastructures", icon: "💧" },
        ]);
      }
    } catch (err) {
      console.error("Erreur chargement catégories:", err);
      // Use default categories
      setCategories([
        { id: 1, name: "Voirie & Circulation", icon: "🚗" },
        { id: 2, name: "Propreté & Environnement", icon: "🧹" },
        { id: 3, name: "Éclairage Public", icon: "💡" },
        { id: 4, name: "Espaces Verts & Parcs", icon: "🌳" },
        { id: 5, name: "Sécurité & Ordre Public", icon: "👮" },
        { id: 6, name: "Services & Infrastructures", icon: "💧" },
      ]);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: `Lat: ${position.coords.latitude.toFixed(
            6
          )}, Lng: ${position.coords.longitude.toFixed(6)}`,
        }));
        setLoading(false);
        setError("");
      },
      (error) => {
        let errorMessage = "Impossible d'obtenir votre position.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Vous avez refusé l'accès à votre position. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Information de localisation non disponible.";
            break;
          case error.TIMEOUT:
            errorMessage = "La demande de localisation a expiré.";
            break;
        }

        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("La photo ne doit pas dépasser 5MB");
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner une image valide");
        return;
      }

      setFormData({
        ...formData,
        photo: file,
      });
      setError("");
    }
  };

  // const handleSubmit = async () => {
  //   console.log("Submitting form with data:", formData);
  //   setLoading(true);
  //   setError("");

  //   try {
  //     // Vérifier l'authentification
  //     if (!apiService.auth.isAuthenticated()) {
  //       setError("Vous devez être connecté pour signaler un incident");
  //       setLoading(false);
  //       return;
  //     }

  //     // Validation
  //     if (!formData.title || !formData.description || !formData.category_id) {
  //       setError("Veuillez remplir tous les champs obligatoires");
  //       setLoading(false);
  //       return;
  //     }

  //     if (!formData.latitude || !formData.longitude) {
  //       setError("Veuillez indiquer la localisation de l'incident");
  //       setLoading(false);
  //       return;
  //     }

  //     console.log("Sending to API...");

  //     // Créer l'incident
  //     const response = await apiService.incidents.create(formData);
  //     console.log("API Response:", response);

  //     // Afficher le message de succès
  //     setSuccess(true);

  //     // Attendre un peu avant de fermer pour montrer le message de succès
  //     setTimeout(() => {
  //       if (response.incident) {
  //         onSuccess(response.incident);
  //       } else {
  //         onSuccess(response);
  //       }
  //       onClose();
  //     }, 2000);
  //   } catch (err) {
  //     console.error("Erreur création incident:", err);
  //     setError(err.message || "Erreur lors de la création de l'incident");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // PASTE THIS NEW FUNCTION IN ITS PLACE
  // In ReportIncident.jsx, replace the whole handleSubmit function with this one:
  const handleSubmit = async () => {
    // 1. Perform validation
    if (!formData.title || !formData.description || !formData.category_id) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      setError("Veuillez indiquer la localisation de l'incident.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 2. Call the API. We don't need the response variable, which fixes the error.
      await apiService.incidents.create(formData);

      // 3. On success, update the UI and call the parent's success handler
      setSuccess(true);
      setLoading(false); // Stop the spinner

      // 4. After 2 seconds, the parent component will close the modal
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      // 5. If anything fails, show the error
      console.error("Incident creation failed:", err);
      setError(err.message || "Une erreur est survenue lors de la soumission.");
      setLoading(false); // Stop the spinner on failure
    }
  };

  const renderStep1 = () => (
    <div className="step-content">
      <h3 className="step-title">Informations de base</h3>

      <div className="form-group">
        <label className="form-label">
          Titre <span className="required">*</span>
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="Ex: Trou dangereux sur l'avenue Mohammed V"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          maxLength={255}
        />
        <span className="char-count">{formData.title.length}/255</span>
      </div>

      <div className="form-group">
        <label className="form-label">
          Description <span className="required">*</span>
        </label>
        <textarea
          className="form-textarea"
          rows={4}
          placeholder="Décrivez précisément le problème..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
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
            setFormData({ ...formData, category_id: e.target.value })
          }
        >
          <option value="">Sélectionnez une catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
      </div>

      <button
        className="btn-next"
        onClick={() => setStep(2)}
        disabled={
          !formData.title || !formData.description || !formData.category_id
        }
      >
        Continuer
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content">
      <h3 className="step-title">Localisation et photo</h3>

      <div className="form-group">
        <label className="form-label">
          Localisation <span className="required">*</span>
        </label>
        <div className="location-input-group">
          <input
            type="text"
            className="form-input"
            placeholder="Cliquez sur le bouton pour obtenir votre position"
            value={formData.address}
            readOnly
          />
          <button
            className="btn-location"
            onClick={handleGetLocation}
            title="Utiliser ma position actuelle"
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <MapPin size={20} />
            )}
          </button>
        </div>
        {formData.latitude && formData.longitude && (
          <p className="location-status success">
            <CheckCircle size={16} /> Position GPS enregistrée
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Photo (optionnel)</label>
        <div className="photo-upload-area">
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden-input"
          />
          <label htmlFor="photo-upload" className="upload-label">
            <Camera size={32} />
            <span>Ajouter une photo</span>
            <span className="upload-hint">
              Cliquez pour sélectionner (max 5MB)
            </span>
          </label>
        </div>
        {formData.photo && (
          <div className="photo-preview">
            <img
              src={URL.createObjectURL(formData.photo)}
              alt="Aperçu"
              className="preview-image"
            />
            <button
              className="remove-photo"
              onClick={() => setFormData({ ...formData, photo: null })}
              title="Supprimer la photo"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          <CheckCircle size={16} />
          Incident créé avec succès ! Il sera visible après approbation.
        </div>
      )}

      <div className="info-message">
        <Info size={16} />
        <span>
          Votre signalement sera examiné par un administrateur avant d'être
          publié.
        </span>
      </div>

      <button
        className="btn-submit"
        onClick={handleSubmit}
        disabled={
          loading || success || !formData.latitude || !formData.longitude
        }
      >
        {loading ? (
          <>
            <Loader className="animate-spin" size={20} />
            Envoi en cours...
          </>
        ) : success ? (
          <>
            <CheckCircle size={20} />
            Incident envoyé !
          </>
        ) : (
          "Envoyer le signalement"
        )}
      </button>
    </div>
  );
  console.log("DEBUG BUTTON STATE:", {
    loading: loading,
    success: success,
    hasLatitude: !!formData.latitude,
    hasLongitude: !!formData.longitude,
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Signaler un incident</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(step / 2) * 100}%` }}
          ></div>
        </div>

        <div className="modal-body">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </div>

        {step > 1 && !success && (
          <button className="btn-back" onClick={() => setStep(step - 1)}>
            ← Retour
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportIncident;
