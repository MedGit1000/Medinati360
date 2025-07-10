import React from "react";
import {
  AlertCircle,
  BarChart3,
  Clock,
  Users,
  TrendingUp,
  ArrowRight,
  Shield,
  Zap,
  Activity,
} from "lucide-react";
import "./Home.css";

const Home = ({ setActiveView, incidents }) => {
  // Calculer les statistiques
  const stats = {
    total: incidents.length,
    critical: incidents.filter((i) => i.status === "critical").length,
    resolved: incidents.filter((i) => i.status === "resolved").length,
    resolvedToday: incidents.filter((i) => {
      const today = new Date().toDateString();
      return (
        i.status === "resolved" && new Date(i.created).toDateString() === today
      );
    }).length,
  };

  const features = [
    {
      icon: <Shield className="feature-icon" />,
      title: "Surveillance 24/7",
      description:
        "Monitoring continu de vos systèmes avec alertes en temps réel",
    },
    {
      icon: <Zap className="feature-icon" />,
      title: "Réponse Rapide",
      description: "Temps de réponse moyen de moins de 5 minutes",
    },
    {
      icon: <Activity className="feature-icon" />,
      title: "Analyses Détaillées",
      description:
        "Tableaux de bord et rapports pour optimiser vos performances",
    },
  ];

  const quickActions = [
    {
      title: "Créer un incident",
      description: "Signaler un nouveau problème",
      icon: <AlertCircle />,
      color: "action-red",
      action: () => setActiveView("incidents"),
    },
    {
      title: "Voir le tableau de bord",
      description: "Analyser les performances",
      icon: <BarChart3 />,
      color: "action-blue",
      action: () => setActiveView("dashboard"),
    },
    {
      title: "Incidents en cours",
      description: `${stats.total - stats.resolved} incidents actifs`,
      icon: <Clock />,
      color: "action-yellow",
      action: () => setActiveView("incidents"),
    },
    {
      title: "Équipe",
      description: "Gérer les utilisateurs",
      icon: <Users />,
      color: "action-green",
      action: () => setActiveView("users"),
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Bienvenue dans votre
            <span className="hero-highlight">
              {" "}
              Centre de Gestion des Incidents
            </span>
          </h1>
          <p className="hero-subtitle">
            Surveillez, gérez et résolvez les incidents de votre infrastructure
            en temps réel
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">{stats.total}</div>
              <div className="hero-stat-label">Incidents totaux</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">{stats.critical}</div>
              <div className="hero-stat-label">Critiques</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">{stats.resolvedToday}</div>
              <div className="hero-stat-label">Résolus aujourd'hui</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">
                {stats.resolved > 0
                  ? Math.round((stats.resolved / stats.total) * 100)
                  : 0}
                %
              </div>
              <div className="hero-stat-label">Taux de résolution</div>
            </div>
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

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <h2 className="section-title">Actions rapides</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`quick-action-card ${action.color}`}
              onClick={action.action}
            >
              <div className="quick-action-icon">{action.icon}</div>
              <h3 className="quick-action-title">{action.title}</h3>
              <p className="quick-action-description">{action.description}</p>
              <ArrowRight className="quick-action-arrow" size={20} />
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">Pourquoi choisir notre plateforme ?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="activity-section">
        <h2 className="section-title">Activité récente</h2>
        <div className="activity-list">
          {incidents.slice(0, 3).map((incident, index) => (
            <div key={incident.id} className="activity-item">
              <div className="activity-time">
                {new Date(incident.created).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="activity-content">
                <div className="activity-title">{incident.title}</div>
                <div className="activity-meta">
                  Assigné à {incident.assignee || "Non assigné"} •{" "}
                  {incident.category}
                </div>
              </div>
              <div className={`activity-status status-${incident.status}`}>
                {incident.status === "critical"
                  ? "Critique"
                  : incident.status === "open"
                  ? "En cours"
                  : "Résolu"}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
