import React from 'react';
import { History, TrendingUp, X, Trash2 } from 'lucide-react';
import { useBenchStore } from '../../store/useBenchStore';

interface SearchHistoryProps {
  onKeywordClick: (keyword: string) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ onKeywordClick }) => {
  const { searchHistory, hotSearches, removeSearchKeyword, clearAllSearchHistory } = useBenchStore();

  const handleHistoryClick = (keyword: string) => {
    onKeywordClick(keyword);
  };

  const handleHotSearchClick = (keyword: string) => {
    onKeywordClick(keyword);
  };

  const handleRemoveHistory = (e: React.MouseEvent, keyword: string) => {
    e.stopPropagation();
    removeSearchKeyword(keyword);
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要清空所有搜索历史吗？')) {
      clearAllSearchHistory();
    }
  };

  if (searchHistory.length === 0 && hotSearches.length === 0) {
    return null;
  }

  const getHotSearchRankStyle = (index: number) => {
    if (index === 0) return 'bg-red-500 text-white';
    if (index === 1) return 'bg-orange-500 text-white';
    if (index === 2) return 'bg-yellow-500 text-white';
    return 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300';
  };

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-lg p-4 mt-2 transition-colors duration-300">
      {searchHistory.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History size={16} className="text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                搜索历史
              </span>
            </div>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
              <span>清空</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((keyword, index) => (
              <div
                key={`${keyword}-${index}`}
                className="group flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                onClick={() => handleHistoryClick(keyword)}
              >
                <span className="max-w-[120px] truncate">{keyword}</span>
                <button
                  onClick={(e) => handleRemoveHistory(e, keyword)}
                  className="opacity-0 group-hover:opacity-100 ml-1 text-gray-400 hover:text-red-500 transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {hotSearches.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-red-500" />
            <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
              热门搜索
            </span>
          </div>
          <div className="space-y-2">
            {hotSearches.slice(0, 6).map((item, index) => (
              <div
                key={item.keyword}
                className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                onClick={() => handleHotSearchClick(item.keyword)}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getHotSearchRankStyle(index)}`}
                >
                  {index + 1}
                </span>
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-200 truncate">
                  {item.keyword}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {item.count}次
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
