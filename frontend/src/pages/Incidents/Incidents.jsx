import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import IncidentCard from "../../components/IncidentCard/IncidentCard";
import "./Incidents.css";

const Incidents = ({ incidents, onViewDetails, loading, error }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [
    ...new Set(incidents.map((i) => i.category?.name).filter(Boolean)),
  ];

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || incident.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || incident.category?.name === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="incidents-page">
      <div className="page-header">
        <h2 className="page-title">Tous les incidents</h2>
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
            <option value="Reçu">Nouveaux</option>
            <option value="En cours">En cours</option>
            <option value="Résolu">Résolus</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="incidents-container">
        <div className="incidents-count">
          {filteredIncidents.length} résultat
          {filteredIncidents.length !== 1 ? "s" : ""}
        </div>
        <div className="incidents-grid">
          {loading ? (
            <p>Chargement...</p>
          ) : error ? (
            <p>{error}</p>
          ) : filteredIncidents.length > 0 ? (
            filteredIncidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onClick={() => onViewDetails(incident)}
              />
            ))
          ) : (
            <div className="no-results">
              <p className="no-results-text">Aucun incident trouvé</p>
              <p className="no-results-subtext">
                Essayez de modifier vos critères de recherche.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Incidents;
