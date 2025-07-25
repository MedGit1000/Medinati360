import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import apiService from "../../services/apiService";
// We reuse the ReportIncident component for editing, as it's a very similar form
import ReportIncident from "../../components/ReportIncident/ReportIncident";
import "./MyIncidents.css";

const MyIncidents = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // State for modals
  const [editingIncident, setEditingIncident] = useState(null);
  const [deletingIncident, setDeletingIncident] = useState(null);

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

  const handleEditSuccess = () => {
    setEditingIncident(null);
    loadMyIncidents(); // Refresh list after editing
  };

  const handleConfirmDelete = async () => {
    if (!deletingIncident) return;
    try {
      await apiService.incidents.delete(deletingIncident.id);
      setDeletingIncident(null);
      loadMyIncidents(); // Refresh list after deleting
    } catch (error) {
      alert("Erreur lors de la suppression: " + error.message);
    }
  };

  const getStatusBadge = (incident) => {
    if (incident.is_approved) {
      return (
        <div className="status-badge approved">
          <CheckCircle size={16} /> <span>Approuvé</span>
        </div>
      );
    }
    if (incident.rejection_reason) {
      return (
        <div className="status-badge rejected">
          <XCircle size={16} /> <span>Rejeté</span>
        </div>
      );
    }
    return (
      <div className="status-badge pending">
        <Clock size={16} /> <span>En attente</span>
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
            Suivez, modifiez ou supprimez vos incidents en attente.
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
            <p>Vos signalements apparaîtront ici.</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const isPending =
              !incident.is_approved && !incident.rejection_reason;
            return (
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
                      {new Date(incident.created_at).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="category-tag">
                      {incident.category?.name || "Sans catégorie"}
                    </span>
                  </div>
                </div>

                {isPending ? (
                  <div className="incident-actions">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => setEditingIncident(incident)}
                    >
                      <Edit size={16} /> Modifier
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => setDeletingIncident(incident)}
                    >
                      <Trash2 size={16} /> Supprimer
                    </button>
                  </div>
                ) : (
                  <p className="review-status-text">
                    Cet incident a été traité et ne peut plus être modifié.
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Edit Incident Modal */}
      {editingIncident && (
        <ReportIncident
          onClose={() => setEditingIncident(null)}
          onSuccess={handleEditSuccess}
          incidentToEdit={editingIncident} // Pass incident data to the form
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingIncident && (
        <div
          className="modal-overlay"
          onClick={() => setDeletingIncident(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Confirmer la Suppression</h2>
            <div className="modal-content">
              <p>
                Êtes-vous sûr de vouloir supprimer définitivement cet incident ?
              </p>
              <p>
                <strong>{deletingIncident.title}</strong>
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeletingIncident(null)}
              >
                Annuler
              </button>
              <button
                className="btn-confirm-reject"
                onClick={handleConfirmDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIncidents;
