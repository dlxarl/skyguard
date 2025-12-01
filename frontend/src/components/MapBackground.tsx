import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Target, Shelter } from '../types';

const createIcon = (color: string) => {
  return new L.DivIcon({
    className: 'custom-marker',
    html: `<svg width="30" height="30" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const redIcon = createIcon('#FF3B30');
const greenIcon = createIcon('#34C759');

interface MapProps {
  targets: Target[];
  shelters: Shelter[];
}

const LocationController = () => {
  const map = useMap();
  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, 13);
    });
  }, [map]);
  return null;
};

const MapBackground: React.FC<MapProps> = ({ targets, shelters }) => {
  return (
    <MapContainer
      center={[49.0, 31.0]}
      zoom={6}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationController />

      {targets.map((target) => (
        <Marker key={`t-${target.id}`} position={[target.latitude, target.longitude]} icon={redIcon}>
          <Popup>
            <strong style={{ color: '#FF3B30' }}>⚠️ {target.title}</strong><br />
            {target.description}<br />
            <small>{new Date(target.created_at).toLocaleString()}</small>
          </Popup>
        </Marker>
      ))}

      {shelters.map((shelter) => (
        <Marker key={`s-${shelter.id}`} position={[shelter.latitude, shelter.longitude]} icon={greenIcon}>
          <Popup>
            <strong style={{ color: '#34C759' }}>🛡️ {shelter.title}</strong><br />
            {shelter.address}<br />
            Capacity: {shelter.capacity} people
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapBackground;