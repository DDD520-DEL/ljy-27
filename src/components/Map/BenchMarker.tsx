import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Bench } from '../../types/bench';
import { getScoreColor } from '../../utils/score';

interface BenchMarkerProps {
  bench: Bench;
  isSelected: boolean;
  onClick: () => void;
}

function createCustomIcon(color: string, isSelected: boolean) {
  const size = isSelected ? 44 : 36;
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        color: white;
        transform: translate(-50%, -50%);
        transition: all 0.2s ease;
      ">
        <svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

export const BenchMarker: React.FC<BenchMarkerProps> = ({
  bench,
  isSelected,
  onClick,
}) => {
  const color = getScoreColor(bench.overallScore);
  const icon = createCustomIcon(color, isSelected);

  return (
    <Marker
      position={[bench.lat, bench.lng]}
      icon={icon}
      eventHandlers={{ click: onClick }}
    >
      <Popup>
        <div className="min-w-[200px]">
          {bench.photos[0] && (
            <img
              src={bench.photos[0]}
              alt={bench.parkName}
              className="w-full h-28 object-cover rounded-lg mb-2"
            />
          )}
          <h3 className="font-bold text-gray-800 text-sm">{bench.parkName}</h3>
          <p className="text-xs text-gray-500 mb-2">{bench.locationDesc}</p>
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-bold"
              style={{ color }}
            >
              {bench.overallScore.toFixed(1)} 分
            </span>
            <span className="text-xs text-gray-400">
              {bench.checkinCount} 人打卡
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
