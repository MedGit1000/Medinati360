import React from "react";
import {
  AlertCircle,
  BarChart3,
  Map,
  FileText,
  ArrowRight,
  Shield,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import "./Home.css";

// A small, reusable component for the stat cards
const StatCard = ({ value, label, icon, colorClass }) => (
  <div className="home-stat-card">
    <div className={`stat-icon-wrapper ${colorClass}`}>{icon}</div>
    <div className="stat-text">
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  </div>
);

const Home = ({ setActiveView, incidents, onReportClick }) => {
  const { user } = useAuth();

  // Calculate statistics from the incidents prop
  const stats = {
    total: incidents.length,
    pending: incidents.filter((i) => !i.is_approved && !i.rejection_reason)
      .length,
    resolved: incidents.filter((i) => i.status === "Résolu").length,
    inProgress: incidents.filter((i) => i.status === "En cours").length,
  };

  // Format the current date for the header
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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

  return (
    <div className="home-page-v2">
      {/* === HERO SECTION === */}
      <section className="home-hero">
        <div className="hero-text">
          <p className="hero-date">{currentDate}</p>
          <h1 className="hero-title">Bonjour, {user?.name || "Citoyen"}!</h1>
          <p className="hero-subtitle">
            Ensemble, améliorons notre communauté. Que souhaitez-vous faire
            aujourd'hui ?
          </p>
          <div className="hero-cta-buttons">
            <button className="btn-primary-solid" onClick={onReportClick}>
              <AlertCircle size={20} />
              Signaler un Incident
            </button>

            <button
              className="btn-secondary-outline"
              onClick={() => setActiveView("map")}
            >
              <Map size={20} />
              Voir la Carte
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-animation">
            <div className="pulse-circle pulse-1"></div>
            <div className="pulse-circle pulse-2"></div>
            <div className="pulse-circle pulse-3"></div>
            <div className="center-icon">
              <Shield size={48} />
            </div>
          </div>
        </div>
      </section>

      {/* === STATS GRID === */}
      <section className="home-stats-grid">
        <StatCard
          value={stats.total}
          label="Signalements Totaux"
          icon={<BarChart3 size={24} />}
          colorClass="bg-blue"
        />
        <StatCard
          value={stats.pending}
          label="En Attente"
          icon={<Clock size={24} />}
          colorClass="bg-yellow"
        />
        <StatCard
          value={stats.inProgress}
          label="En Cours"
          icon={<Users size={24} />}
          colorClass="bg-orange"
        />
        <StatCard
          value={stats.resolved}
          label="Résolus"
          icon={<CheckCircle size={24} />}
          colorClass="bg-green"
        />
      </section>

      {/* === QUICK ACTIONS & RECENT ACTIVITY === */}
      <section className="home-main-content">
        <div className="quick-actions-container">
          <h2 className="section-title">Accès Rapide</h2>
          <div className="actions-list">
            <button
              className="action-item"
              onClick={() => setActiveView("my-incidents")}
            >
              <div className="action-icon-wrapper">
                <FileText size={20} />
              </div>
              <div className="action-text">
                <p className="action-title">Mes Signalements</p>
                <p className="action-description">
                  Voir l'historique de vos contributions
                </p>
              </div>
              <ArrowRight className="action-arrow" size={20} />
            </button>
            <button
              className="action-item"
              onClick={() => setActiveView("dashboard")}
            >
              <div className="action-icon-wrapper">
                <BarChart3 size={20} />
              </div>
              <div className="action-text">
                <p className="action-title">Tableau de Bord</p>
                <p className="action-description">
                  Analyser les statistiques globales
                </p>
              </div>
              <ArrowRight className="action-arrow" size={20} />
            </button>
            <button
              className="action-item"
              onClick={() => setActiveView("incidents")}
            >
              <div className="action-icon-wrapper">
                <AlertCircle size={20} />
              </div>
              <div className="action-text">
                <p className="action-title">Tous les Incidents</p>
                <p className="action-description">
                  Explorer les signalements publics
                </p>
              </div>
              <ArrowRight className="action-arrow" size={20} />
            </button>
          </div>
        </div>
        <div className="recent-activity-container">
          <h2 className="section-title">Activité Récente</h2>
          <div className="activity-list">
            {incidents.length > 0 ? (
              incidents.slice(0, 4).map((incident) => (
                <div key={incident.id} className="activity-item">
                  <div
                    className={`activity-icon-wrapper ${getStatusClass(
                      incident.status
                    )}`}
                  >
                    {incident.status === "Résolu" ? (
                      <CheckCircle size={20} />
                    ) : (
                      <AlertCircle size={20} />
                    )}
                  </div>
                  <div className="activity-details">
                    <p className="activity-title">{incident.title}</p>
                    <p className="activity-meta">
                      Par {incident.user?.name || "Anonyme"} •{" "}
                      {incident.category?.name}
                    </p>
                  </div>
                  <p className="activity-time">
                    {new Date(incident.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>
              ))
            ) : (
              <div className="no-activity-message">
                <p>Aucune activité récente à afficher.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
