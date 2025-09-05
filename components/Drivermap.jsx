"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Drivermap({ currentLocation, destination = [18.5204, 73.8567], route = null }) {
  const [driverLocation, setDriverLocation] = useState(currentLocation ? [currentLocation.lat, currentLocation.lng] : null);

  useEffect(() => {
    if (currentLocation) {
      setDriverLocation([currentLocation.lat, currentLocation.lng]);
    }
  }, [currentLocation]);

  if (!driverLocation || !destination) return <p>Loading map...</p>;

  return (
    console.log("Map rendered with driver location:", driverLocation),
    (
      <div className="w-full h-[500px] overflow-hidden rounded-lg ">
        <MapContainer
          center={driverLocation} // ✅ FIXED: use driverLocation
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Driver marker */}
          <Marker position={driverLocation}>
            <Popup>Driver’s Current Location</Popup>
          </Marker>

          {/* Destination marker */}
          <Marker position={destination}>
            <Popup>Destination</Popup>
          </Marker>

          {/* Line from driver to destination or provided route polyline */}
          {route && Array.isArray(route) && route.length > 1 ? (
            <Polyline positions={route} color="blue" />
          ) : (
            <Polyline positions={[driverLocation, destination]} color="blue" />
          )}
        </MapContainer>
      </div>
    )
  );
}
