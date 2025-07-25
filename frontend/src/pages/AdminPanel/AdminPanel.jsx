import React, { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Edit,
  Trash2,
} from "lucide-react";
import apiService from "../../services/apiService";
import ReportIncident from "../../components/ReportIncident/ReportIncident"; // Import the form modal
import "./AdminPanel.css";

const AdminPanel = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [rejectionReason, setRejectionReason] = useState("");
  const [stats, setStats] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // State for modals
  const [rejectingIncident, setRejectingIncident] = useState(null);
  const [editingIncident, setEditingIncident] = useState(null);
  const [deletingIncident, setDeletingIncident] = useState(null);

  useEffect(() => {
    loadIncidents();
    loadStats();
  }, [filter]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `http://localhost:8000/api/incidents?approval_status=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIncidents(data);
      } else {
        console.error("API Error:", response.status, response.statusText);
        alert("Erreur lors du chargement des incidents");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const requests = ["all", "pending", "approved", "rejected"].map(
        (status) =>
          fetch(
            `http://localhost:8000/api/incidents?approval_status=${status}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          ).then((res) => res.json())
      );

      const [all, pending, approved, rejected] = await Promise.all(requests);

      setStats({
        all: all.length,
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length,
      });
    } catch (error) {
      console.error("Erreur loading stats:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiService.incidents.approve(id);
      loadIncidents();
      loadStats();
    } catch (error) {
      console.error("Approval failed:", error);
      alert(error.message || "Erreur lors de l'approbation");
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) {
      alert("Veuillez indiquer une raison de rejet");
      return;
    }
    try {
      await apiService.incidents.reject(id, rejectionReason);
      loadIncidents();
      loadStats();
      setRejectingIncident(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Rejection failed:", error);
      alert(error.message || "Erreur lors du rejet");
    }
  };

  const handleEditSuccess = () => {
    setEditingIncident(null);
    loadIncidents();
    loadStats();
  };

  const handleConfirmDelete = async () => {
    if (!deletingIncident) return;
    try {
      await apiService.incidents.delete(deletingIncident.id);
      setDeletingIncident(null);
      loadIncidents();
      loadStats();
    } catch (error) {
      alert("Erreur lors de la suppression: " + error.message);
    }
  };

  const getStatusClass = (incident) => {
    if (incident.is_approved) return "approved";
    if (incident.rejection_reason) return "rejected";
    return "pending";
  };

  const getStatusText = (incident) => {
    if (incident.is_approved) return "Approuvé";
    if (incident.rejection_reason) return "Rejeté";
    return "En attente";
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>
          <Shield size={32} style={{ marginRight: "12px" }} />
          Panneau d'Administration
        </h1>
        <button
          className="btn-refresh"
          onClick={() => {
            loadIncidents();
            loadStats();
          }}
          disabled={loading}
        >
          <RefreshCw size={20} className={loading ? "spinning" : ""} />
          Actualiser
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card pending">
          <Clock size={32} />
          <div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">En attente</div>
          </div>
        </div>
        <div className="stat-card approved">
          <CheckCircle size={32} />
          <div>
            <div className="stat-value">{stats.approved}</div>
            <div className="stat-label">Approuvés</div>
          </div>
        </div>
        <div className="stat-card rejected">
          <XCircle size={32} />
          <div>
            <div className="stat-value">{stats.rejected}</div>
            <div className="stat-label">Rejetés</div>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
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
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Tous ({stats.all})
        </button>
      </div>

      <div className="incidents-list">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Chargement des incidents...</p>
          </div>
        ) : incidents.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <p>Aucun incident à afficher dans cette catégorie.</p>
          </div>
        ) : (
          incidents.map((incident) => (
            <div key={incident.id} className="incident-card-admin">
              <div className="incident-header">
                <h3>{incident.title}</h3>
                <span className={`status-badge ${getStatusClass(incident)}`}>
                  {getStatusText(incident)}
                </span>
              </div>
              <p className="incident-description">{incident.description}</p>
              <div className="incident-meta">
                <span>
                  <strong>Par:</strong>{" "}
                  {incident.user?.name || "Utilisateur inconnu"}
                </span>
                <span>
                  <strong>Catégorie:</strong>{" "}
                  {incident.category?.name || "Non catégorisé"}
                </span>
                <span>
                  <strong>Date:</strong>{" "}
                  {new Date(incident.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Action buttons for pending incidents */}
              {!incident.is_approved && !incident.rejection_reason && (
                <div className="action-buttons">
                  <button
                    className="btn-approve"
                    onClick={() => handleApprove(incident.id)}
                  >
                    <CheckCircle size={16} /> Approuver
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => setRejectingIncident(incident)}
                  >
                    <XCircle size={16} /> Rejeter
                  </button>
                </div>
              )}

              {/* Admin management buttons */}
              <div className="action-buttons admin-actions">
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

              {incident.rejection_reason && (
                <div className="rejection-info">
                  <strong>Raison du rejet:</strong> {incident.rejection_reason}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Rejection Modal */}
      {rejectingIncident && (
        <div
          className="modal-overlay"
          onClick={() => {
            setRejectingIncident(null);
            setRejectionReason("");
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Rejeter l'incident</h2>
            <p>
              <strong>Titre:</strong> {rejectingIncident.title}
            </p>
            <textarea
              placeholder="Indiquez la raison du rejet..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              autoFocus
            />
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setRejectingIncident(null);
                  setRejectionReason("");
                }}
              >
                Annuler
              </button>
              <button
                className="btn-confirm-reject"
                onClick={() => handleReject(rejectingIncident.id)}
                disabled={!rejectionReason.trim()}
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Incident Modal */}
      {editingIncident && (
        <ReportIncident
          onClose={() => setEditingIncident(null)}
          onSuccess={handleEditSuccess}
          incidentToEdit={editingIncident}
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
            <p>
              Êtes-vous sûr de vouloir supprimer définitivement l'incident
              suivant ? Cette action est irréversible.
            </p>
            <p>
              <strong>{deletingIncident.title}</strong>
            </p>
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

export default AdminPanel;
