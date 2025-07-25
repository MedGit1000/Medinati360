import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AlertCircle, Clock, CheckCircle, Activity, Plus } from "lucide-react";
import StatsCard from "../../components/StatsCard/StatsCard"; // We'll reuse the stats card
import "./Dashboard.css"; // We will create this new CSS file

const Dashboard = ({ incidents, loading, error }) => {
  // --- DATA PROCESSING ---

  // Calculate main statistics
  const stats = {
    total: incidents.length,
    new: incidents.filter((i) => i.status === "Reçu").length,
    inProgress: incidents.filter((i) => i.status === "En cours").length,
    resolved: incidents.filter((i) => i.status === "Résolu").length,
  };

  // Process data for the bar chart
  const getChartData = () => {
    if (!incidents || incidents.length === 0) return [];

    const categoryCounts = incidents.reduce((acc, incident) => {
      const categoryName = incident.category?.name || "Non classé";
      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categoryCounts).map(([name, count]) => ({
      name: name.split(" ")[0].replace("&", ""), // Shorten name for chart label
      "Nombre d'incidents": count,
    }));
  };

  const chartData = getChartData();
  const recentIncidents = incidents.slice(0, 5);

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <div className="dashboard-loading">Chargement du tableau de bord...</div>
    );
  }

  if (error) {
    return <div className="dashboard-error">Erreur: {error}</div>;
  }

  return (
    <div className="dashboard-v2">
      <div className="dashboard-header">
        <h1 className="page-title">Tableau de Bord</h1>
        {/* <button onClick={onReportClick} className="btn-primary-solid">
          <Plus size={20} />
          Signaler un Incident
        </button> */}
      </div>

      {/* --- STATS CARDS --- */}
      <div className="stats-grid-v2">
        <StatsCard
          title="Total des Incidents"
          value={stats.total}
          type="total"
        />
        <StatsCard title="Nouveaux Signalements" value={stats.new} type="new" />
        <StatsCard
          title="En Cours de Traitement"
          value={stats.inProgress}
          type="progress"
        />
        <StatsCard
          title="Incidents Résolus"
          value={stats.resolved}
          type="resolved"
        />
      </div>

      {/* --- MAIN CONTENT GRID (CHART & RECENT ACTIVITY) --- */}
      <div className="dashboard-main-grid">
        <div className="chart-container">
          <h2 className="section-title">Incidents par Catégorie</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-color)"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                contentStyle={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                  borderRadius: "8px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "14px" }} />
              <Bar
                dataKey="Nombre d'incidents"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="recent-activity-container">
          <h2 className="section-title">Activité Récente</h2>
          <div className="activity-feed">
            {recentIncidents.length > 0 ? (
              recentIncidents.map((incident) => (
                <div key={incident.id} className="activity-item-v2">
                  <div className="activity-icon">
                    {incident.status === "Résolu" ? (
                      <CheckCircle size={20} />
                    ) : (
                      <AlertCircle size={20} />
                    )}
                  </div>
                  <div className="activity-info">
                    <p className="activity-title">{incident.title}</p>
                    <p className="activity-meta">
                      Par {incident.user?.name || "Anonyme"} •{" "}
                      {new Date(incident.created_at).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                  </div>
                  <div
                    className={`activity-status-tag ${incident.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {incident.status}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-activity-info">Aucune activité récente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
