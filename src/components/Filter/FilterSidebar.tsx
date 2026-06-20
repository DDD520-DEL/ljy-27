import React, { useState } from 'react';
import { X, Star, Sofa, Trees, Eye, Filter, RotateCcw, Heart, Share2, Copy, Check } from 'lucide-react';
import { RatingStars } from '../AddBench/RatingStars';
import type { FilterOptions, BenchType } from '../../types/bench';
import { getBenchTypeLabel } from '../../utils/score';
import { encodeShareUrl, copyToClipboard } from '../../utils/share';
import type { ShareMapView } from '../../utils/share';

interface FilterSidebarProps {
  isOpen: boolean;
  filters: FilterOptions;
  onClose: () => void;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onReset: () => void;
  mapView: ShareMapView;
}

const benchTypes: BenchType[] = ['stone', 'wood', 'other'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  filters,
  onClose,
  onFilterChange,
  onReset,
  mapView,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateShareLink = () => {
    const url = encodeShareUrl({
      filters,
      mapView,
    });
    setShareUrl(url);
    setShowShareModal(true);
    setCopied(false);
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
    filters.benchTypes.length > 0 ||
    filters.onlyFavorites ||
    filters.sortBy !== 'overall';

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

          <div>
            <label className="font-medium text-gray-700 block mb-3">快捷筛选</label>
            <button
              onClick={() => onFilterChange({ onlyFavorites: !filters.onlyFavorites })}
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                filters.onlyFavorites
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300'
              }`}
            >
              <Heart size={18} fill={filters.onlyFavorites ? 'currentColor' : 'none'} />
              仅看我的收藏
            </button>
          </div>
        </div>

        <div className="p-5 border-t border-gray-200 space-y-3">
          <button
            onClick={handleGenerateShareLink}
            className="w-full py-3 rounded-xl bg-white border border-emerald-200 text-emerald-700 font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            生成分享链接
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            应用筛选
          </button>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#F8F5F0] rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 size={20} className="text-emerald-600" />
                  <h3 className="text-lg font-bold text-gray-800">分享筛选结果</h3>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">
                复制链接包含当前筛选条件和地图位置，分享给好友即可查看相同的结果。
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-1.5 transition-all ${
                    copied
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      复制
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
