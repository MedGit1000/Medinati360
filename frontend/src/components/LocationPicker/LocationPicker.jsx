import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// This is a fix for a known issue with Leaflet's default icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// This is a small helper component that listens for map clicks
function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  // This hook from react-leaflet captures map events
  useMapEvents({
    click(e) {
      // Extract the lat and lng values from the event object
      const { lat, lng } = e.latlng;

      // Set the marker's position on the map
      setPosition(e.latlng);

      // THE FIX IS HERE: Pass the lat and lng as two separate arguments
      // instead of a single object. This matches what the parent component expects.
      onLocationSelect(lat, lng);
    },
  });

  // Render the marker only after a position has been selected
  return position === null ? null : (
    <Marker position={position}>
      <Popup>Localisation sélectionnée</Popup>
    </Marker>
  );
}

const LocationPicker = ({ onLocationSelect }) => {
  // Default center for the map (Rabat, Morocco)
  const initialPosition = [34.020882, -6.84165];

  return (
    <div
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid var(--border-color)",
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
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
