import React from "react";
import {
  X,
  XCircle,
  Calendar,
  User,
  Tag,
  MapPin,
  Camera,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./IncidentDetail.css";

// This is a common fix for a known issue with Leaflet's default icon in React projects.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const IncidentDetail = ({ incident, onClose }) => {
  if (!incident) return null;

  const position = [incident.latitude, incident.longitude];

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusInfo = (incident) => {
    if (incident.is_approved) {
      return { text: "Approuvé", className: "approved", Icon: CheckCircle };
    }
    if (incident.rejection_reason) {
      return { text: "Rejeté", className: "rejected", Icon: XCircle };
    }
    return { text: "En attente", className: "pending", Icon: Clock };
  };

  const statusInfo = getStatusInfo(incident);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="incident-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-header-content">
            <div className={`status-icon-wrapper ${statusInfo.className}`}>
              <statusInfo.Icon size={24} />
            </div>
            <div>
              <h2 className="modal-title">{incident.title}</h2>
              <p className="modal-subtitle">
                {incident.category?.name || "Non classé"}
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <p className="detail-description">{incident.description}</p>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <User size={16} /> <strong>Signalé par:</strong>{" "}
              {incident.user?.name || "Anonyme"}
            </div>
            <div className="detail-item">
              <Calendar size={16} /> <strong>Date:</strong>{" "}
              {formatDate(incident.created_at)}
            </div>
          </div>

          {incident.rejection_reason && (
            <div className="detail-section">
              <div className="rejection-callout">
                <AlertTriangle size={20} />
                <div>
                  <strong>Raison du Rejet:</strong>
                  <p>{incident.rejection_reason}</p>
                </div>
              </div>
            </div>
          )}

          {incident.photo_path && (
            <div className="detail-section">
              <h4>
                <Camera size={18} /> Photo
              </h4>
              <div className="photo-container">
                <img
                  src={`http://localhost:8000/storage/${incident.photo_path}`}
                  alt="Photo de l'incident"
                  className="detail-photo"
                />
              </div>
            </div>
          )}

          <div className="detail-section">
            <h4>
              <MapPin size={18} /> Localisation
            </h4>
            <div className="detail-map-container">
              <MapContainer
                center={position}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: "250px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position}>
                  <Popup>{incident.title}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetail;
