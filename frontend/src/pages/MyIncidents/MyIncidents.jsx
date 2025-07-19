import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Calendar,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import apiService from "../../services/apiService";
import "./MyIncidents.css";

const MyIncidents = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user) {
      loadMyIncidents();
    }
  }, [user]);

  const loadMyIncidents = async () => {
    try {
      setLoading(true);
      // Get all incidents and filter by current user
      const allIncidents = await apiService.incidents.getAll();
      const myIncidents = allIncidents.filter(
        (incident) => incident.user_id === user.id
      );
      setIncidents(myIncidents);
    } catch (error) {
      console.error("Erreur lors du chargement des incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (incident) => {
    if (incident.is_approved) {
      return (
        <div className="status-badge approved">
          <CheckCircle size={16} />
          <span>Approuvé</span>
        </div>
      );
    } else if (incident.rejection_reason) {
      return (
        <div className="status-badge rejected">
          <XCircle size={16} />
          <span>Rejeté</span>
        </div>
      );
    } else {
      return (
        <div className="status-badge pending">
          <Clock size={16} />
          <span>En attente d'approbation</span>
        </div>
      );
    }
  };

  const getIncidentStatus = (incident) => {
    return (
      <div
        className={`incident-status ${incident.status
          .toLowerCase()
          .replace(" ", "-")}`}
      >
        {incident.status}
      </div>
    );
  };

  const filteredIncidents = incidents.filter((incident) => {
    if (filter === "all") return true;
    if (filter === "pending")
      return !incident.is_approved && !incident.rejection_reason;
    if (filter === "approved") return incident.is_approved;
    if (filter === "rejected") return !!incident.rejection_reason;
    return true;
  });

  const stats = {
    total: incidents.length,
    pending: incidents.filter((i) => !i.is_approved && !i.rejection_reason)
      .length,
    approved: incidents.filter((i) => i.is_approved).length,
    rejected: incidents.filter((i) => !!i.rejection_reason).length,
  };

  if (!user) {
    return (
      <div className="auth-required">
        <AlertCircle size={48} />
        <h3>Connexion requise</h3>
        <p>Veuillez vous connecter pour voir vos incidents signalés.</p>
      </div>
    );
  }

  return (
    <div className="my-incidents-page">
      <div className="page-header">
        <div>
          <h1>Mes signalements</h1>
          <p className="page-subtitle">
            Suivez l'état de vos incidents signalés
          </p>
        </div>
        <button className="btn-refresh" onClick={loadMyIncidents}>
          <RefreshCw size={20} />
          Actualiser
        </button>
      </div>

      {/* Statistiques */}
      <div className="my-stats-grid">
        <div className="my-stat-card">
          <div className="stat-icon total">
            <AlertCircle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total signalé</div>
          </div>
        </div>
        <div className="my-stat-card">
          <div className="stat-icon pending">
            <Clock />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">En attente</div>
          </div>
        </div>
        <div className="my-stat-card">
          <div className="stat-icon approved">
            <CheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.approved}</div>
            <div className="stat-label">Approuvés</div>
          </div>
        </div>
        <div className="my-stat-card">
          <div className="stat-icon rejected">
            <XCircle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.rejected}</div>
            <div className="stat-label">Rejetés</div>
          </div>
        </div>
      </div>

      {/* Message d'information */}
      {stats.pending > 0 && (
        <div className="info-banner">
          <AlertCircle size={20} />
          <p>
            Vous avez {stats.pending} signalement{stats.pending > 1 ? "s" : ""}{" "}
            en attente d'approbation. Nos administrateurs examinent chaque
            signalement dans les plus brefs délais.
          </p>
        </div>
      )}

      {/* Filtres */}
      <div className="filter-tabs">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Tous ({stats.total})
        </button>
        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          En attente ({stats.pending})
        </button>
        <button
          className={filter === "approved" ? "active" : ""}
          onClick={() => setFilter("approved")}
        >
          Approuvés ({stats.approved})
        </button>
        <button
          className={filter === "rejected" ? "active" : ""}
          onClick={() => setFilter("rejected")}
        >
          Rejetés ({stats.rejected})
        </button>
      </div>

      {/* Liste des incidents */}
      <div className="my-incidents-list">
        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Chargement de vos signalements...</p>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <h3>Aucun signalement trouvé</h3>
            <p>
              {filter === "all"
                ? "Vous n'avez pas encore signalé d'incident."
                : `Aucun signalement ${
                    filter === "pending"
                      ? "en attente"
                      : filter === "approved"
                      ? "approuvé"
                      : "rejeté"
                  }.`}
            </p>
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <div key={incident.id} className="my-incident-card">
              <div className="incident-card-header">
                <div className="incident-main-info">
                  <h3>{incident.title}</h3>
                  <p className="incident-description">
                    {incident.description.length > 150
                      ? incident.description.substring(0, 150) + "..."
                      : incident.description}
                  </p>
                </div>
                {getStatusBadge(incident)}
              </div>

              <div className="incident-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>
                    {new Date(incident.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="category-tag">
                    {incident.category?.name || "Sans catégorie"}
                  </span>
                </div>
                {incident.is_approved && getIncidentStatus(incident)}
              </div>

              {incident.rejection_reason && (
                <div className="rejection-reason">
                  <strong>Raison du rejet:</strong> {incident.rejection_reason}
                </div>
              )}

              <button
                className="btn-view-details"
                onClick={() => setSelectedIncident(incident)}
              >
                <Eye size={16} />
                Voir les détails
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal de détails */}
      {selectedIncident && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedIncident(null)}
        >
          <div
            className="incident-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Détails du signalement</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedIncident(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {getStatusBadge(selectedIncident)}

              <div className="detail-section">
                <h3>{selectedIncident.title}</h3>
                <p>{selectedIncident.description}</p>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Date de signalement:</strong>
                  <span>
                    {new Date(selectedIncident.created_at).toLocaleString(
                      "fr-FR"
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Catégorie:</strong>
                  <span>
                    {selectedIncident.category?.name || "Non catégorisé"}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Statut actuel:</strong>
                  <span>{selectedIncident.status}</span>
                </div>
                <div className="detail-item">
                  <strong>Localisation:</strong>
                  <span>
                    <MapPin
                      size={16}
                      style={{ display: "inline", marginRight: "4px" }}
                    />
                    Lat: {selectedIncident.latitude?.toFixed(6)}, Lng:{" "}
                    {selectedIncident.longitude?.toFixed(6)}
                  </span>
                </div>
              </div>

              {selectedIncident.photo_path && (
                <div className="detail-photo">
                  <strong>Photo jointe:</strong>
                  <img
                    src={`http://localhost:8000/storage/${selectedIncident.photo_path}`}
                    alt="Photo de l'incident"
                  />
                </div>
              )}

              {selectedIncident.rejection_reason && (
                <div className="rejection-detail">
                  <strong>Raison du rejet:</strong>
                  <p>{selectedIncident.rejection_reason}</p>
                  <small>
                    Rejeté le{" "}
                    {new Date(selectedIncident.approved_at).toLocaleDateString(
                      "fr-FR"
                    )}
                  </small>
                </div>
              )}

              {selectedIncident.is_approved && (
                <div className="approval-detail">
                  <CheckCircle size={20} />
                  <p>
                    Votre signalement a été approuvé et est maintenant visible
                    publiquement.
                  </p>
                  <small>
                    Approuvé le{" "}
                    {new Date(selectedIncident.approved_at).toLocaleDateString(
                      "fr-FR"
                    )}
                  </small>
                </div>
              )}

              {!selectedIncident.is_approved &&
                !selectedIncident.rejection_reason && (
                  <div className="pending-detail">
                    <Clock size={20} />
                    <p>
                      Votre signalement est en cours d'examen par nos
                      administrateurs. Vous serez notifié dès qu'une décision
                      sera prise.
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIncidents;
