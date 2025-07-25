import React from "react";
import { Clock, Eye } from "lucide-react";
import "./IncidentCard.css";

const IncidentCard = ({ incident, onClick }) => {
  // Safety check to prevent crashes if incident data is missing
  if (!incident) {
    return null;
  }

  // Helper to determine the color classes for the status badge
  const getStatusColor = (status) => {
    switch (status) {
      case "Reçu":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700";
      case "En cours":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700";
      case "Résolu":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
    }
  };

  // UPDATED: Helper to get a representative emoji for each new category
  const getCategoryIcon = (categoryName = "") => {
    if (categoryName.includes("Voirie")) return "🛣️";
    if (categoryName.includes("Trottoirs")) return "🚶‍♀️";
    if (categoryName.includes("Éclairage")) return "💡";
    if (categoryName.includes("Déchets")) return "🗑️";
    if (categoryName.includes("Espaces Verts")) return "🌳";
    if (categoryName.includes("Nuisances")) return "🔊";
    if (categoryName.includes("Eau")) return "💧";
    if (categoryName.includes("Mobilier")) return "🏦";
    if (categoryName.includes("Transport")) return "🚎";
    if (categoryName.includes("Signalisation")) return "🚦";
    if (categoryName.includes("Animaux")) return "🐕";
    if (categoryName.includes("Bâtiments")) return "🏗️";
    return "📋"; // Default icon
  };

  return (
    <div
      className="group bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
      onClick={onClick}
    >
      <div className="p-5 flex-grow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="text-3xl bg-gray-100 dark:bg-gray-700 w-12 h-12 flex items-center justify-center rounded-lg">
              {getCategoryIcon(incident.category?.name)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                {incident.title}
              </h3>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
              incident.status
            )}`}
          >
            {incident.status}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {incident.description}
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
        <div className="flex items-center gap-1.5">
          <Clock size={12} />
          <span>
            {new Date(incident.created_at).toLocaleDateString("fr-FR")}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Eye size={12} />
          <span>Voir détails</span>
        </div>
      </div>
    </div>
  );
};

export default IncidentCard;
