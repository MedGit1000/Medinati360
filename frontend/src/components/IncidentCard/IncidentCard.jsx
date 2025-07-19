import React from "react";
import {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Calendar,
  User,
  MapPin,
} from "lucide-react";
import "./IncidentCard.css";

const IncidentCard = ({ incident, onClick }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Reçu":
        return <AlertCircle className="status-icon new" />;
      case "En cours":
        return <AlertTriangle className="status-icon progress" />;
      case "Résolu":
        return <CheckCircle className="status-icon resolved" />;
      default:
        return <AlertTriangle className="status-icon" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Reçu":
        return "status-new";
      case "En cours":
        return "status-progress";
      case "Résolu":
        return "status-resolved";
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date invalide";

    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="incident-card" onClick={onClick}>
      <div className="incident-card-header">
        <div className="incident-status">
          {getStatusIcon(incident.status)}
          <div className="incident-info">
            <h4 className="incident-title">{incident.title}</h4>
            <p className="incident-description">
              {incident.description.length > 100
                ? incident.description.substring(0, 100) + "..."
                : incident.description}
            </p>
          </div>
        </div>
        <span className={`status-badge ${getStatusClass(incident.status)}`}>
          {incident.status}
        </span>
      </div>

      <div className="incident-meta">
        <div className="meta-item">
          <Calendar size={14} />
          <span>
            {formatDate(incident.created_at)}
            {incident.created_at && ` à ${formatTime(incident.created_at)}`}
          </span>
        </div>
        <div className="meta-item">
          <User size={14} />
          <span>{incident.user?.name || "Utilisateur inconnu"}</span>
        </div>
        {incident.category && (
          <div className="meta-item">
            <span className="category-tag">
              {incident.category.name || "Sans catégorie"}
            </span>
          </div>
        )}
        {incident.latitude && incident.longitude && (
          <div className="meta-item">
            <MapPin size={14} />
            <span>Localisé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentCard;
