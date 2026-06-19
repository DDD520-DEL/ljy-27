import React from 'react';
import { Sofa, Trees, Eye, MapPin, Users, Calendar } from 'lucide-react';
import { RatingStars } from '../AddBench/RatingStars';
import type { Bench } from '../../types/bench';
import { getScoreColor, getBenchTypeLabel, formatDate } from '../../utils/score';

interface ScoreCardProps {
  bench: Bench;
}

interface ScoreRowProps {
  icon: React.ReactNode;
  label: string;
  score: number;
  color: string;
}

const ScoreRow: React.FC<ScoreRowProps> = ({ icon, label, score, color }) => (
  <div className="flex items-center gap-3">
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: color + '20', color }}
    >
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>
          {score.toFixed(1)}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(score / 5) * 100}%`, backgroundColor: color }}
        />
      </div>
    </div>
  </div>
);

export const ScoreCard: React.FC<ScoreCardProps> = ({ bench }) => {
  const overallColor = getScoreColor(bench.overallScore);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center"
          style={{ backgroundColor: overallColor + '15' }}
        >
          <span
            className="text-3xl font-bold"
            style={{ color: overallColor }}
          >
            {bench.overallScore.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500 mt-0.5">综合评分</span>
        </div>
        <div className="flex-1">
          <RatingStars score={bench.overallScore} size={18} />
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users size={12} />
              {bench.checkinCount} 人打卡
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(bench.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <ScoreRow
          icon={<Sofa size={18} />}
          label="坐感舒适度"
          score={bench.comfortScore}
          color="#2D6A4F"
        />
        <ScoreRow
          icon={<Trees size={18} />}
          label="遮阴效果"
          score={bench.shadeScore}
          color="#52B788"
        />
        <ScoreRow
          icon={<Eye size={18} />}
          label="视野好坏"
          score={bench.viewScore}
          color="#F4A261"
        />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} className="text-emerald-600" />
          <span className="font-medium">类型：</span>
          <span>{getBenchTypeLabel(bench.benchType)}</span>
        </div>
      </div>
    </div>
  );
};
