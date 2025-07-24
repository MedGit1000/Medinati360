import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import apiService from "../../services/apiService";
import "./MyIncidents.css";

const MyIncidents = ({ onViewDetails }) => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadMyIncidents = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const myIncidents = await apiService.incidents.getMyIncidents();
      setIncidents(myIncidents);
    } catch (error) {
      console.error("Erreur lors du chargement de vos incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyIncidents();
  }, [user]);

  const getStatusBadge = (incident) => {
    if (incident.is_approved) {
      return (
        <div className="status-badge approved">
          <CheckCircle size={16} />
          <span>Approuvé</span>
        </div>
      );
    }
    if (incident.rejection_reason) {
      return (
        <div className="status-badge rejected">
          <XCircle size={16} />
          <span>Rejeté</span>
        </div>
      );
    }
    return (
      <div className="status-badge pending">
        <Clock size={16} />
        <span>En attente</span>
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

  return (
    <div className="my-incidents-page">
      <div className="page-header">
        <div>
          <h1>Mes signalements</h1>
          <p className="page-subtitle">
            Suivez l'état de vos incidents signalés
          </p>
        </div>
        <button
          className="btn-refresh"
          onClick={loadMyIncidents}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
          Actualiser
        </button>
      </div>

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

      <div className="my-incidents-list">
        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <h3>Aucun signalement à afficher</h3>
            <p>
              Vos signalements apparaîtront ici une fois que vous les aurez
              créés.
            </p>
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <div key={incident.id} className="my-incident-card">
              <div className="incident-card-header">
                <div className="incident-main-info">
                  <h3>{incident.title}</h3>
                </div>
                {getStatusBadge(incident)}
              </div>
              <div className="incident-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>
                    {new Date(incident.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="category-tag">
                    {incident.category?.name || "Sans catégorie"}
                  </span>
                </div>
              </div>
              <button
                className="btn-view-details"
                onClick={() => onViewDetails(incident)}
              >
                <Eye size={16} /> Voir les détails
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyIncidents;
