// frontend/src/pages/Map/IncidentMap.jsx

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const IncidentMap = ({ incidents }) => {
  const initialPosition = [34.020882, -6.84165]; // Centered on Rabat

  // Filter for incidents that have valid coordinates
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
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {incidentsWithLocation.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.latitude, incident.longitude]}
          >
            <Popup>
              <strong>{incident.title}</strong>
              <p>{incident.category?.name || "Sans catégorie"}</p>
              <small>Signalé par: {incident.user?.name || "Anonyme"}</small>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default IncidentMap;
