import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Bench } from '../../types/bench';
import { BenchMarker } from './BenchMarker';

interface MapViewProps {
  benches: Bench[];
  selectedBenchId: string | null;
  onBenchClick: (id: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
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

export const MapView: React.FC<MapViewProps> = ({
  benches,
  selectedBenchId,
  onBenchClick,
  onMapClick,
  center = [39.9042, 116.4074],
  zoom = 11,
  interactive = true,
}) => {
  const selectedBench = benches.find((b) => b.id === selectedBenchId);
  const mapCenter = selectedBench
    ? [selectedBench.lat, selectedBench.lng] as [number, number]
    : center;

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
        <MapController center={mapCenter} zoom={selectedBench ? 15 : zoom} />
        {interactive && <MapClickHandler onClick={onMapClick} />}
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
