import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MessageSquare, Heart } from 'lucide-react';
import type { Bench } from '../../types/bench';
import { getScoreColor } from '../../utils/score';
import { useBenchStore } from '../../store/useBenchStore';

interface BenchMarkerProps {
  bench: Bench;
  isSelected: boolean;
  onClick: () => void;
}

function createCustomIcon(color: string, isSelected: boolean, isFavorite: boolean) {
  const size = isSelected ? 44 : 36;
  const heartSvg = isFavorite ? `
    <svg style="position: absolute; top: -6px; right: -6px; width: 18px; height: 18px;" viewBox="0 0 24 24" fill="#EF4444" stroke="white" stroke-width="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ` : '';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 3px solid ${isFavorite ? '#EF4444' : 'white'};
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
        position: relative;
      ">
        ${heartSvg}
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
  const { getCommentCountByBenchId, isFavorite, toggleFavorite } = useBenchStore();
  const favorited = isFavorite(bench.id);
  const icon = createCustomIcon(color, isSelected, favorited);
  const commentCount = getCommentCountByBenchId(bench.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(bench.id);
  };

  return (
    <Marker
      position={[bench.lat, bench.lng]}
      icon={icon}
      eventHandlers={{ click: onClick }}
    >
      <Popup className="bench-popup">
        <div className="min-w-[200px]">
          {bench.photos[0] && (
            <img
              src={bench.photos[0]}
              alt={bench.parkName}
              className="w-full h-28 object-cover rounded-lg mb-2"
            />
          )}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{bench.parkName}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">{bench.locationDesc}</p>
            </div>
            <button
              onClick={handleFavoriteClick}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                favorited
                  ? 'bg-red-100 dark:bg-red-900/50 text-red-500 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400'
              }`}
            >
              <Heart size={16} fill={favorited ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-sm font-bold"
              style={{ color }}
            >
              {bench.overallScore.toFixed(1)} 分
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {bench.checkinCount} 人打卡
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <MessageSquare size={12} className="text-emerald-600 dark:text-emerald-400" />
              {commentCount}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
