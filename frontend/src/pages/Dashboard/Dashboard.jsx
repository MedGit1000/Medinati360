import React, { useState } from "react";
import { Plus } from "lucide-react";
import StatsCard from "../../components/StatsCard/StatsCard";
import IncidentCard from "../../components/IncidentCard/IncidentCard";
import IncidentForm from "../../components/IncidentForm/IncidentForm";
import "./Dashboard.css";

const Dashboard = ({ incidents, setIncidents }) => {
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  const stats = [
    {
      title: "Total Incidents",
      value: incidents.length,
      type: "total",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Critiques",
      value: incidents.filter((i) => i.status === "critical").length,
      type: "critical",
    },
    {
      title: "En cours",
      value: incidents.filter((i) => i.status === "open").length,
      type: "open",
    },
    {
      title: "Résolus",
      value: incidents.filter((i) => i.status === "resolved").length,
      type: "resolved",
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="page-title">Tableau de bord</h2>
        <button
          onClick={() => setShowIncidentForm(true)}
          className="btn-primary"
        >
          <Plus size={20} />
          <span>Nouvel incident</span>
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="recent-incidents">
        <div className="section-header">
          <h3 className="section-title">Incidents récents</h3>
        </div>
        <div className="incidents-list">
          {incidents.slice(0, 5).map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      </div>

      {showIncidentForm && (
        <IncidentForm
          onClose={() => setShowIncidentForm(false)}
          onSubmit={(newIncident) => {
            setIncidents([newIncident, ...incidents]);
            setShowIncidentForm(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
