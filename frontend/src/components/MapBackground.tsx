import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Target, Shelter } from '../types';

import DroneIcon from '../assets/icons/drone.svg';
import RocketIcon from '../assets/icons/rocket.svg';
import PlaneIcon from '../assets/icons/plane.svg';
import HelicopterIcon from '../assets/icons/helicopter.svg';
import BangIcon from '../assets/icons/bang.svg';

const createTargetIcon = (iconUrl: string) => {
  return new L.Icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const targetIcons: Record<string, L.Icon> = {
  drone: createTargetIcon(DroneIcon),
  rocket: createTargetIcon(RocketIcon),
  plane: createTargetIcon(PlaneIcon),
  helicopter: createTargetIcon(HelicopterIcon),
  bang: createTargetIcon(BangIcon),
};

const createShelterIcon = (color: string) => {
  return new L.DivIcon({
    className: 'custom-marker',
    html: `<svg width="30" height="30" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const greenIcon = createShelterIcon('#34C759');

const getTargetIcon = (targetType: string): L.Icon => {
  return targetIcons[targetType] || targetIcons.bang;
};

const getTargetEmoji = (targetType: string): string => {
  const emojis: Record<string, string> = {
    drone: '🛸',
    rocket: '🚀',
    plane: '✈️',
    helicopter: '🚁',
    bang: '💥',
  };
  return emojis[targetType] || '⚠️';
};

const probabilityColors: Record<string, string> = {
  low: '#6c757d',
  medium: '#ffc107',
  high: '#dc3545',
};

const statusColors: Record<string, string> = {
  pending: '#17a2b8',
  unconfirmed: '#ffc107',
  confirmed: '#28a745',
  rejected: '#dc3545',
};

const statusLabels: Record<string, string> = {
  pending: '⏳ Pending',
  unconfirmed: '❓ Unconfirmed',
  confirmed: '✅ Confirmed',
  rejected: '❌ Rejected',
};

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
  const [legendOpen, setLegendOpen] = useState(true);

  const visibleTargets = targets.filter(t => t.status !== 'rejected');

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

      {}
      <div className="map-legend">
        <div className="map-legend-header" onClick={() => setLegendOpen(!legendOpen)}>
          <span className="map-legend-title">Map Legend</span>
          <svg 
            className={`map-legend-toggle ${legendOpen ? '' : 'collapsed'}`}
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className={`map-legend-content ${legendOpen ? 'open' : 'closed'}`}>
          <div className="map-legend-item">
            <img src={DroneIcon} alt="Drone" width="20" height="20" />
            <span>Drone</span>
          </div>
          <div className="map-legend-item">
            <img src={RocketIcon} alt="Rocket" width="20" height="20" />
            <span>Rocket</span>
          </div>
          <div className="map-legend-item">
            <img src={PlaneIcon} alt="Plane" width="20" height="20" />
            <span>Plane</span>
          </div>
          <div className="map-legend-item">
            <img src={HelicopterIcon} alt="Helicopter" width="20" height="20" />
            <span>Helicopter</span>
          </div>
          <div className="map-legend-item">
            <img src={BangIcon} alt="Bang" width="20" height="20" />
            <span>Bang</span>
          </div>
          <div className="map-legend-item">
            <div className="map-legend-radius"></div>
            <span>Damage radius</span>
          </div>
          <div className="map-legend-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#34C759" stroke="white" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Shelter</span>
          </div>
        </div>
      </div>

      {visibleTargets.map((target) => (
        <React.Fragment key={`target-${target.id}`}>
          {(target.status === 'confirmed' || target.status === 'unconfirmed') && (
            <Circle
              center={[target.latitude, target.longitude]}
              radius={(target.danger_radius || 2) * 1000}
              pathOptions={{
                color: probabilityColors[target.probability || 'low'],
                fillColor: probabilityColors[target.probability || 'low'],
                fillOpacity: 0.2,
                weight: 2,
              }}
            />
          )}
          <Marker 
            position={[target.latitude, target.longitude]} 
            icon={getTargetIcon(target.target_type)}
          >
            <Popup>
              <div style={{ minWidth: '180px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>{getTargetEmoji(target.target_type)}</span>
                  <strong style={{ color: '#333', fontSize: '14px' }}>{target.title}</strong>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                  <span 
                    style={{ 
                      background: statusColors[target.status], 
                      color: 'white', 
                      padding: '3px 8px', 
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600
                    }}
                  >
                    {statusLabels[target.status]}
                  </span>
                  {target.probability && (
                    <span 
                      style={{ 
                        background: probabilityColors[target.probability], 
                        color: 'white', 
                        padding: '3px 8px', 
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}
                    >
                      {target.probability.toUpperCase()}
                    </span>
                  )}
                </div>
                {target.description && (
                  <p style={{ margin: '0 0 8px 0', color: '#555', fontSize: '12px' }}>
                    {target.description}
                  </p>
                )}
                {target.report_count && target.report_count > 1 && (
                  <p style={{ margin: '0 0 6px 0', color: '#666', fontSize: '12px' }}>
                    📊 Reports: {target.report_count}
                  </p>
                )}
                <p style={{ margin: 0, color: '#888', fontSize: '11px' }}>
                  {new Date(target.created_at).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        </React.Fragment>
      ))}

      {shelters.map((shelter) => (
        <Marker key={`s-${shelter.id}`} position={[shelter.latitude, shelter.longitude]} icon={greenIcon}>
          <Popup>
            <div style={{ minWidth: '160px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>🛡️</span>
                <strong style={{ color: '#333', fontSize: '14px' }}>{shelter.title}</strong>
              </div>
              {shelter.address && (
                <p style={{ margin: '0 0 6px 0', color: '#333', fontSize: '12px' }}>
                  📍 {shelter.address}
                </p>
              )}
              <p style={{ margin: 0, color: '#333', fontSize: '12px' }}>
                Capacity: {shelter.capacity} people
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapBackground;
