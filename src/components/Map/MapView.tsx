import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Bench } from '../../types/bench';
import { BenchMarker } from './BenchMarker';

interface MapViewProps {
  benches: Bench[];
  selectedBenchId: string | null;
  onBenchClick: (id: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onViewChange?: (lat: number, lng: number, zoom: number) => void;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  userLocation?: [number, number] | null;
}

function MapClickHandler({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onClick) {
        onClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function MapController({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom(), {
        duration: 0.5,
      });
    }
  }, [center, zoom, map]);

  return null;
}

function MapViewListener({ onViewChange }: { onViewChange?: (lat: number, lng: number, zoom: number) => void }) {
  const map = useMap();
  const onViewChangeRef = React.useRef(onViewChange);

  useEffect(() => {
    onViewChangeRef.current = onViewChange;
  }, [onViewChange]);

  useEffect(() => {
    if (!onViewChangeRef.current) return;

    const handleMove = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      onViewChangeRef.current?.(center.lat, center.lng, zoom);
    };

    map.on('moveend', handleMove);
    map.on('zoomend', handleMove);

    handleMove();

    return () => {
      map.off('moveend', handleMove);
      map.off('zoomend', handleMove);
    };
  }, [map]);

  return null;
}

export const MapView: React.FC<MapViewProps> = ({
  benches,
  selectedBenchId,
  onBenchClick,
  onMapClick,
  onViewChange,
  center = [39.9042, 116.4074],
  zoom = 11,
  interactive = true,
  userLocation = null,
}) => {
  const selectedBench = benches.find((b) => b.id === selectedBenchId);
  let mapCenter: [number, number] = center;
  if (selectedBench) {
    mapCenter = [selectedBench.lat, selectedBench.lng];
  } else if (userLocation) {
    mapCenter = userLocation;
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={mapCenter} zoom={selectedBench ? 15 : (userLocation ? 16 : zoom)} />
        <MapViewListener onViewChange={onViewChange} />
        {interactive && <MapClickHandler onClick={onMapClick} />}
        {userLocation && (
          <>
            <Circle
              center={userLocation}
              radius={50}
              pathOptions={{
                color: '#3B82F6',
                fillColor: '#3B82F6',
                fillOpacity: 0.15,
                weight: 2,
              }}
            />
            <Marker
              position={userLocation}
              icon={L.divIcon({
                className: 'user-location-marker',
                html: `
                  <div style="
                    width: 20px;
                    height: 20px;
                    background: #3B82F6;
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    transform: translate(-50%, -50%);
                  "></div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              })}
            />
          </>
        )}
        {selectedBench && (
          <Circle
            center={[selectedBench.lat, selectedBench.lng]}
            radius={1000}
            pathOptions={{
              color: '#10B981',
              fillColor: '#10B981',
              fillOpacity: 0.08,
              weight: 2,
              dashArray: '8, 8',
            }}
          />
        )}
        {benches.map((bench) => (
          <BenchMarker
            key={bench.id}
            bench={bench}
            isSelected={bench.id === selectedBenchId}
            onClick={() => onBenchClick(bench.id)}
          />
        ))}
      </MapContainer>
    </div>
  );
};
