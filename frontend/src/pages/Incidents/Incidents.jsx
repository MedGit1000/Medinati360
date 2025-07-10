import React, { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import IncidentCard from "../../components/IncidentCard/IncidentCard";
import IncidentForm from "../../components/IncidentForm/IncidentForm";
import "./Incidents.css";

const Incidents = ({ incidents, setIncidents }) => {
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Filtrer les incidents
  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || incident.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || incident.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="incidents-page">
      <div className="page-header">
        <h2 className="page-title">Tous les incidents</h2>
        <button
          onClick={() => setShowIncidentForm(true)}
          className="btn-primary"
        >
          <Plus size={20} />
          <span>Nouvel incident</span>
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Rechercher un incident..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les statuts</option>
            <option value="critical">Critique</option>
            <option value="open">En cours</option>
            <option value="resolved">Résolu</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes les priorités</option>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>
        </div>
      </div>

      <div className="incidents-container">
        <div className="incidents-count">
          {filteredIncidents.length} incident
          {filteredIncidents.length > 1 ? "s" : ""} trouvé
          {filteredIncidents.length > 1 ? "s" : ""}
        </div>

        <div className="incidents-grid">
          {filteredIncidents.length > 0 ? (
            filteredIncidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onClick={() => console.log("Incident clicked:", incident.id)}
              />
            ))
          ) : (
            <div className="no-results">
              <p className="no-results-text">Aucun incident trouvé</p>
              <p className="no-results-subtext">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
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

export default Incidents;
