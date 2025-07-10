import React from "react";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  User,
} from "lucide-react";
import "./IncidentCard.css";

const IncidentCard = ({ incident, onClick }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "critical":
        return <XCircle className="status-icon critical" />;
      case "open":
        return <AlertTriangle className="status-icon warning" />;
      case "resolved":
        return <CheckCircle className="status-icon success" />;
      default:
        return <AlertTriangle className="status-icon" />;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "priority-medium";
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "high":
        return "Haute";
      case "medium":
        return "Moyenne";
      case "low":
        return "Basse";
      default:
        return priority;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="incident-card" onClick={onClick}>
      <div className="incident-card-header">
        <div className="incident-status">
          {getStatusIcon(incident.status)}
          <div className="incident-info">
            <h4 className="incident-title">{incident.title}</h4>
            <p className="incident-description">{incident.description}</p>
          </div>
        </div>
        <span
          className={`priority-badge ${getPriorityClass(incident.priority)}`}
        >
          {getPriorityLabel(incident.priority)}
        </span>
      </div>

      <div className="incident-meta">
        <div className="meta-item">
          <Calendar size={14} />
          <span>{formatDate(incident.created)}</span>
        </div>
        <div className="meta-item">
          <User size={14} />
          <span>{incident.assignee || "Non assigné"}</span>
        </div>
        <div className="meta-item">
          <span className="category-tag">{incident.category}</span>
        </div>
      </div>
    </div>
  );
};

export default IncidentCard;
