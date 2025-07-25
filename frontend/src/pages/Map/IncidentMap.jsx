import React, { useState, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Info, X, Home } from "lucide-react";

// Import necessary CSS
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./IncidentMap.css";

// --- (Keep all your helper functions and sub-components exactly as they are) ---
// getCategoryConfig, getStatusConfig, createModernMarker, ModernPopup, etc.
// ... (no changes needed for these parts)
const getCategoryConfig = (categoryName = "") => {
  const configs = {
    // Infrastructure et Voirie
    Voirie: { icon: "🛣️", color: "#8B5CF6", name: "Voirie" },
    Trottoirs: { icon: "🚶‍♀️", color: "#06B6D4", name: "Trottoirs" },
    Éclairage: { icon: "💡", color: "#F59E0B", name: "Éclairage" },
    Signalisation: { icon: "🚦", color: "#DC2626", name: "Signalisation" },
    Mobilier: { icon: "🏦", color: "#6B7280", name: "Mobilier Urbain" },

    // Environnement et Salubrité
    Déchets: { icon: "🗑️", color: "#EF4444", name: "Déchets" },
    "Espaces Verts": { icon: "🌳", color: "#10B981", name: "Espaces Verts" },
    Pollution: { icon: "💨", color: "#F97316", name: "Pollution et Nuisances" }, // Updated
    Animaux: { icon: "🐕", color: "#92400E", name: "Animaux Errants" },

    // Services Publics & Réseaux
    Eau: { icon: "💧", color: "#3B82F6", name: "Eau et Assainissement" },
    Transport: { icon: "🚎", color: "#EC4899", name: "Transport Public" },
    Électrique: { icon: "⚡", color: "#FBBF24", name: "Panne Électrique" }, // New
    Internet: { icon: "📶", color: "#38BDF8", name: "Panne Réseau" }, // New
    Guichet: { icon: "🏧", color: "#22C55E", name: "GAB en Panne" }, // New
    Postaux: { icon: "📮", color: "#E11D48", name: "Services Postaux" }, // New

    // Constructions & Sécurité
    Bâtiments: { icon: "🏗️", color: "#7C3AED", name: "Constructions" },
    Stationnement: { icon: "🅿️", color: "#475569", name: "Stationnement" }, // New
    Vandalisme: { icon: "🎨", color: "#D946EF", name: "Vandalisme" }, // New
  };
  for (const [key, config] of Object.entries(configs)) {
    if (categoryName.includes(key)) return config;
  }
  return { icon: "📋", color: "#6B7280", name: "Autre" };
};

const getStatusConfig = (status = "Reçu") => {
  const statusConfigs = {
    Résolu: { color: "#10B981", icon: "✅" },
    "En cours": { color: "#F59E0B", icon: "⏳" },
    Reçu: { color: "#3B82F6", icon: "🆕" },
  };
  return statusConfigs[status] || statusConfigs["Reçu"];
};

const createModernMarker = (incident, isSelected = false) => {
  const categoryConfig = getCategoryConfig(incident.category?.name);
  const statusConfig = getStatusConfig(incident.status);
  const size = isSelected ? 52 : 42;
  const style = `
    --marker-size: ${size}px;
    --category-color: ${categoryConfig.color};
    --status-color: ${statusConfig.color};
    font-size: ${isSelected ? "22px" : "18px"};
    z-index: ${isSelected ? 1000 : "auto"};
    transform: ${isSelected ? "scale(1.15)" : "scale(1)"};
  `;
  const markerHtml = `<div class="modern-marker" style="${style}">${categoryConfig.icon}<div class="modern-marker-status">${statusConfig.icon}</div></div>`;
  return L.divIcon({
    html: markerHtml,
    className: "modern-marker-wrapper",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const ModernPopup = ({ incident, onViewDetails, onClose }) => {
  const categoryConfig = getCategoryConfig(incident.category?.name);
  const statusConfig = getStatusConfig(incident.status);
  const popupStyle = {
    "--category-color": categoryConfig.color,
    "--status-color": statusConfig.color,
  };
  return (
    <div className="modern-popup-container" style={popupStyle}>
      <div className="modern-popup-header">
        <button onClick={onClose} className="modern-popup-close-btn">
          <X size={16} />
        </button>
        <div className="modern-popup-header-content">
          <div className="modern-popup-icon-wrapper">{categoryConfig.icon}</div>
          <div>
            <h3 className="modern-popup-title">{incident.title}</h3>
            <div className="modern-popup-category">{categoryConfig.name}</div>
          </div>
        </div>
      </div>
      <div className="modern-popup-body">
        <p className="modern-popup-description">
          {incident.description.length > 120
            ? incident.description.substring(0, 120) + "..."
            : incident.description}
        </p>
        <button
          onClick={() => onViewDetails && onViewDetails(incident)}
          className="modern-popup-details-btn"
        >
          <Info size={16} /> Voir les détails
        </button>
      </div>
    </div>
  );
};

const MapController = ({ selectedIncident }) => {
  const map = useMap();
  React.useEffect(() => {
    if (
      selectedIncident &&
      selectedIncident.latitude &&
      selectedIncident.longitude
    ) {
      const { latitude, longitude } = selectedIncident;
      map.flyTo([latitude, longitude], 16, { animate: true, duration: 1.5 });
    }
  }, [selectedIncident, map]);
  return null;
};

const ResetViewControl = ({ initialPosition }) => {
  const map = useMap();
  const resetView = () => {
    map.flyTo(initialPosition, 13, { animate: true, duration: 1.5 });
  };
  return (
    <div className="leaflet-control leaflet-bar reset-view-control">
      <a onClick={resetView} title="Reset View">
        <Home size={16} />
      </a>
    </div>
  );
};

// --- MAIN MAP COMPONENT ---

const IncidentMap = ({ incidents = [], onViewDetails }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const initialPosition = [34.0375, -6.8361]; // Center of Salé
  const mapRef = useRef();

  const filteredIncidents = useMemo(() => {
    return incidents.filter(
      (incident) =>
        incident.latitude &&
        incident.longitude &&
        !isNaN(parseFloat(incident.latitude)) &&
        !isNaN(parseFloat(incident.longitude))
    );
  }, [incidents]);

  // The access token from your Jawg example
  const jawgAccessToken =
    "vGb8Gys89JlZwsZpZzyFind8wdUugDcC16RsZWo5VFgqU5fhzO9RL1xwRkOPcowX";
  // The Style ID from your Jawg example URL
  const jawgStyleId = "53c8f749-adbb-466a-a22d-a135f553f6fb";

  return (
    <div className="map-wrapper">
      <MapContainer
        center={initialPosition}
        zoom={14} // A bit closer to see Salé details
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        ref={mapRef}
      >
        <LayersControl position="topright">
          {/***************************************************************/}
          {/* START OF CHANGES: Here is your new custom style           */}
          {/***************************************************************/}
          <LayersControl.BaseLayer checked name="Style Personnalisé">
            <TileLayer
              url={`https://tile.jawg.io/${jawgStyleId}/{z}/{x}/{y}.png?access-token=${jawgAccessToken}`}
              attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          {/***************************************************************/}
          {/* END OF CHANGES                                            */}
          {/***************************************************************/}

          <LayersControl.BaseLayer name="Moderne">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap &copy; CARTO"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; Esri &mdash; i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Sombre">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap &copy; CARTO"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <MapController selectedIncident={selectedIncident} />
        <ResetViewControl initialPosition={initialPosition} />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={(cluster) => {
            const count = cluster.getChildCount();
            return L.divIcon({
              html: `<div><span>${count}</span></div>`,
              className: "marker-cluster-custom",
              iconSize: L.point(40, 40, true),
            });
          }}
        >
          {filteredIncidents.map((incident) => (
            <Marker
              key={incident.id}
              position={[
                parseFloat(incident.latitude),
                parseFloat(incident.longitude),
              ]}
              icon={createModernMarker(
                incident,
                selectedIncident?.id === incident.id
              )}
              eventHandlers={{
                click: () => setSelectedIncident(incident),
              }}
            >
              <Popup
                maxWidth={400}
                className="modern-popup"
                closeButton={false}
                autoClose={false}
                closeOnClick={false}
              >
                <ModernPopup
                  incident={incident}
                  onViewDetails={onViewDetails}
                  onClose={() => setSelectedIncident(null)}
                />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default IncidentMap;
