import React from 'react';
import { X, Star, Sofa, Trees, Eye, Filter, RotateCcw } from 'lucide-react';
import { RatingStars } from '../AddBench/RatingStars';
import type { FilterOptions, BenchType } from '../../types/bench';
import { getBenchTypeLabel } from '../../utils/score';

interface FilterSidebarProps {
  isOpen: boolean;
  filters: FilterOptions;
  onClose: () => void;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onReset: () => void;
}

const benchTypes: BenchType[] = ['stone', 'wood', 'other'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  filters,
  onClose,
  onFilterChange,
  onReset,
}) => {
  const handleTypeToggle = (type: BenchType) => {
    const currentTypes = filters.benchTypes;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    onFilterChange({ benchTypes: newTypes });
  };

  const hasActiveFilters =
    filters.minOverallScore > 0 ||
    filters.minComfortScore > 0 ||
    filters.minShadeScore > 0 ||
    filters.minViewScore > 0 ||
    filters.benchTypes.length > 0;

  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-[#F8F5F0] shadow-2xl z-40 transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-800">筛选条件</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="mt-3 flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700"
            >
              <RotateCcw size={14} />
              重置筛选
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star size={16} className="text-amber-500" />
              <label className="font-medium text-gray-700">综合评分</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minOverallScore}
                onChange={(e) =>
                  onFilterChange({ minOverallScore: parseFloat(e.target.value) })
                }
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <span className="text-sm font-medium text-gray-600 w-10 text-right">
                {filters.minOverallScore.toFixed(1)}+
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sofa size={16} className="text-emerald-600" />
              <label className="font-medium text-gray-700">坐感舒适度</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={filters.minComfortScore}
                onChange={(e) =>
                  onFilterChange({
                    minComfortScore: parseFloat(e.target.value),
                  })
                }
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <span className="text-sm font-medium text-gray-600 w-10 text-right">
                {filters.minComfortScore}+
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trees size={16} className="text-green-500" />
              <label className="font-medium text-gray-700">遮阴效果</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={filters.minShadeScore}
                onChange={(e) =>
                  onFilterChange({
                    minShadeScore: parseFloat(e.target.value),
                  })
                }
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <span className="text-sm font-medium text-gray-600 w-10 text-right">
                {filters.minShadeScore}+
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Eye size={16} className="text-amber-500" />
              <label className="font-medium text-gray-700">视野好坏</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={filters.minViewScore}
                onChange={(e) =>
                  onFilterChange({
                    minViewScore: parseFloat(e.target.value),
                  })
                }
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <span className="text-sm font-medium text-gray-600 w-10 text-right">
                {filters.minViewScore}+
              </span>
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-700 block mb-3">长椅类型</label>
            <div className="flex flex-wrap gap-2">
              {benchTypes.map((type) => {
                const isSelected = filters.benchTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => handleTypeToggle(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    {getBenchTypeLabel(type)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            应用筛选
          </button>
        </div>
      </div>
    </div>
  );
};
