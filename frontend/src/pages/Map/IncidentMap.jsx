import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./IncidentMap.css"; // Import the new CSS file

// We keep the icon fix for the default icon, just in case
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Helper function to create custom emoji icons
const getCategoryDivIcon = (incident) => {
  const categoryName = incident.category?.name || "";
  let icon;

  if (categoryName.includes("Voirie")) icon = "🛣️";
  else if (categoryName.includes("Trottoirs")) icon = "🚶‍♀️";
  else if (categoryName.includes("Éclairage")) icon = "💡";
  else if (categoryName.includes("Déchets")) icon = "🗑️";
  else if (categoryName.includes("Espaces Verts")) icon = "🌳";
  else if (categoryName.includes("Nuisances")) icon = "🔊";
  else if (categoryName.includes("Eau")) icon = "💧";
  else if (categoryName.includes("Mobilier")) icon = "🏦";
  else if (categoryName.includes("Transport")) icon = "🚎";
  else if (categoryName.includes("Signalisation")) icon = "🚦";
  else if (categoryName.includes("Animaux")) icon = "🐕";
  else if (categoryName.includes("Bâtiments")) icon = "🏗️";
  else icon = "📋";

  let statusClass = "status-new";
  if (incident.status === "Résolu") statusClass = "status-resolved";
  if (incident.status === "En cours") statusClass = "status-in-progress";

  return L.divIcon({
    html: `<span class="emoji-marker ${statusClass}">${icon}</span>`,
    className: "leaflet-div-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -40], // Point from which the popup should open relative to the iconAnchor
  });
};

const IncidentMap = ({ incidents, onViewDetails }) => {
  const initialPosition = [34.020882, -6.84165]; // Centered on Rabat

  const incidentsWithLocation = incidents.filter(
    (incident) => incident.latitude && incident.longitude
  );

  return (
    <div
      className="map-container"
      style={{
        height: "calc(100vh - 110px)",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={initialPosition}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Style Professionnel (Clair)">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Vue Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Style Standard">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {incidentsWithLocation.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.latitude, incident.longitude]}
            icon={getCategoryDivIcon(incident)}
            eventHandlers={{
              click: () => {
                onViewDetails(incident);
              },
            }}
          >
            <Popup>
              <strong>{incident.title}</strong>
              <p>{incident.category?.name || "Sans catégorie"}</p>
              <small>Cliquez pour voir les détails</small>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default IncidentMap;
