import React, { useRef, useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { Bench } from '../../types/bench';
import { getScoreColor } from '../../utils/score';
import { useBenchStore } from '../../store/useBenchStore';

interface DailyRecommendProps {
  benches: Bench[];
  onBenchClick: (benchId: string) => void;
}

export const DailyRecommend: React.FC<DailyRecommendProps> = ({ benches, onBenchClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(benches.length > 0);
  const { getMostLikedPhotoIndex } = useBenchStore();

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (benches.length === 0) return null;

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">今日推荐</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">每日精选 3 个舒适歇脚点</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              canScrollLeft
                ? 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              canScrollRight
                ? 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={updateScrollButtons}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {benches.map((bench, index) => {
          const photoIndex = getMostLikedPhotoIndex(bench.id, bench.photos.length);
          const coverPhoto = bench.photos[photoIndex] || bench.photos[0];

          return (
            <button
              key={bench.id}
              onClick={() => onBenchClick(bench.id)}
              className="flex-shrink-0 w-[260px] sm:w-[280px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden text-left transition-all duration-200 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] group"
            >
              <div className="relative h-36 sm:h-40 overflow-hidden">
                {coverPhoto ? (
                  <img
                    src={coverPhoto}
                    alt={bench.parkName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <Sparkles size={32} className="text-white/50" />
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-300" />
                  <span>推荐 {index + 1}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span
                    className="text-sm font-bold"
                    style={{ color: getScoreColor(bench.overallScore) }}
                  >
                    {bench.overallScore.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {bench.parkName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {bench.locationDesc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
