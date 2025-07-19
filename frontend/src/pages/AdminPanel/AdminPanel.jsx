import React, { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  RefreshCw,
} from "lucide-react";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [stats, setStats] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

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
        console.log(`Loaded ${filter} incidents:`, data.length);
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
      const token = localStorage.getItem("auth_token");

      // FIX: Ensure proper URL format with / between api and incidents
      const url = `http://localhost:8000/api/incidents/${id}/approve`;
      console.log("Approving incident at URL:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // Send empty body for POST request
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Approval successful:", result);

        // Show success message
        const successDiv = document.createElement("div");
        successDiv.className = "success-toast";
        successDiv.textContent = "✓ Incident approuvé avec succès";
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);

        // Reload data
        loadIncidents();
        loadStats();
        setSelectedIncident(null);
      } else {
        const error = await response.json();
        console.error("Approval failed:", error);
        alert(error.message || "Erreur lors de l'approbation");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion: " + error.message);
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) {
      alert("Veuillez indiquer une raison de rejet");
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");

      // FIX: Ensure proper URL format with / between api and incidents
      const url = `http://localhost:8000/api/incidents/${id}/reject`;
      console.log("Rejecting incident at URL:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Rejection successful:", result);

        // Show success message
        const successDiv = document.createElement("div");
        successDiv.className = "success-toast";
        successDiv.textContent = "✓ Incident rejeté";
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);

        // Reload data
        loadIncidents();
        loadStats();
        setSelectedIncident(null);
        setRejectionReason("");
      } else {
        const error = await response.json();
        console.error("Rejection failed:", error);
        alert(error.message || "Erreur lors du rejet");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion: " + error.message);
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

      {/* Stats Cards */}
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

      {/* Filter Tabs */}
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

      {/* Incidents List */}
      <div className="incidents-list">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Chargement des incidents...</p>
          </div>
        ) : incidents.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <p>
              Aucun incident{" "}
              {filter === "pending"
                ? "en attente"
                : filter === "approved"
                ? "approuvé"
                : filter === "rejected"
                ? "rejeté"
                : ""}
            </p>
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

              {/* Location info if available */}
              {incident.latitude && incident.longitude && (
                <div className="incident-location">
                  <strong>Localisation:</strong> {incident.latitude.toFixed(6)},{" "}
                  {incident.longitude.toFixed(6)}
                </div>
              )}

              {/* Status info */}
              {incident.status && (
                <div className="incident-status">
                  <strong>Statut de traitement:</strong>
                  <span
                    className={`treatment-status ${incident.status
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    {incident.status}
                  </span>
                </div>
              )}

              {/* Action buttons for pending incidents */}
              {!incident.is_approved && !incident.rejection_reason && (
                <div className="action-buttons">
                  <button
                    className="btn-approve"
                    onClick={() => handleApprove(incident.id)}
                  >
                    <CheckCircle size={16} />
                    Approuver
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => setSelectedIncident(incident)}
                  >
                    <XCircle size={16} />
                    Rejeter
                  </button>
                </div>
              )}

              {/* Rejection info */}
              {incident.rejection_reason && (
                <div className="rejection-info">
                  <strong>Raison du rejet:</strong> {incident.rejection_reason}
                  {incident.approved_by && incident.approved_at && (
                    <div className="rejection-meta">
                      Rejeté par {incident.approvedBy?.name} le{" "}
                      {new Date(incident.approved_at).toLocaleDateString(
                        "fr-FR"
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Approval info */}
              {incident.is_approved &&
                incident.approved_by &&
                incident.approved_at && (
                  <div className="approval-info">
                    Approuvé par {incident.approvedBy?.name} le{" "}
                    {new Date(incident.approved_at).toLocaleDateString("fr-FR")}
                  </div>
                )}
            </div>
          ))
        )}
      </div>

      {/* Rejection Modal */}
      {selectedIncident && (
        <div
          className="modal-overlay"
          onClick={() => {
            setSelectedIncident(null);
            setRejectionReason("");
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Rejeter l'incident</h2>
            <div className="modal-content">
              <p>
                <strong>Titre:</strong> {selectedIncident.title}
              </p>
              <p>
                <strong>Description:</strong> {selectedIncident.description}
              </p>
              <div className="form-group">
                <label>Raison du rejet:</label>
                <textarea
                  placeholder="Indiquez la raison du rejet..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setSelectedIncident(null);
                  setRejectionReason("");
                }}
              >
                Annuler
              </button>
              <button
                className="btn-confirm-reject"
                onClick={() => handleReject(selectedIncident.id)}
                disabled={!rejectionReason.trim()}
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
