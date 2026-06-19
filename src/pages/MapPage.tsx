import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, MapPin, Locate } from 'lucide-react';
import { MapView } from '../components/Map/MapView';
import { BenchDetailPanel } from '../components/BenchDetail/BenchDetailPanel';
import { FilterSidebar } from '../components/Filter/FilterSidebar';
import { useBenchStore } from '../store/useBenchStore';
import { getScoreColor } from '../utils/score';

export const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    benches,
    selectedBenchId,
    filters,
    isFilterOpen,
    isDetailOpen,
    initBenches,
    setSelectedBench,
    updateFilters,
    resetFilters,
    toggleFilter,
    toggleDetail,
    getFilteredBenches,
    getSelectedBench,
  } = useBenchStore();

  const [searchValue, setSearchValue] = useState('');
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  useEffect(() => {
    if (benches.length === 0) {
      initBenches();
    }
  }, [benches.length, initBenches]);

  const filteredBenches = getFilteredBenches();
  const selectedBench = getSelectedBench();

  const handleBenchClick = (id: string) => {
    setSelectedBench(id);
    if (window.innerWidth < 768) {
      setShowMobileDetail(true);
    }
  };

  const handleCloseDetail = () => {
    setSelectedBench(null);
    setShowMobileDetail(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    updateFilters({ searchKeyword: e.target.value });
  };

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Current position:', position.coords);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div className="h-screen w-full bg-[#F8F5F0] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-30 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-3 flex items-center gap-3">
            <div className="flex items-center gap-2 px-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <MapPin size={22} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-gray-800 text-lg leading-tight">
                  遛弯歇脚地图
                </h1>
                <p className="text-xs text-gray-500">找到最舒服的公园长椅</p>
              </div>
            </div>

            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchValue}
                onChange={handleSearch}
                placeholder="搜索公园或位置..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-transparent focus:border-emerald-300 focus:bg-white outline-none transition-all text-sm"
              />
            </div>

            <button
              onClick={toggleFilter}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                isFilterOpen
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Filter size={20} />
            </button>

            <button
              onClick={() => navigate('/add')}
              className="h-11 px-5 rounded-xl bg-emerald-600 text-white font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">打卡</span>
            </button>
          </div>

          {filteredBenches.length > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 px-1">
              <span>共找到</span>
              <span className="font-bold text-emerald-600">
                {filteredBenches.length}
              </span>
              <span>个歇脚点</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0">
        <MapView
          benches={filteredBenches}
          selectedBenchId={selectedBenchId}
          onBenchClick={handleBenchClick}
          center={[39.9339, 116.4044]}
          zoom={12}
        />
      </div>

      <button
        onClick={handleLocate}
        className="absolute bottom-6 right-6 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:shadow-xl transition-all"
      >
        <Locate size={22} />
      </button>

      {selectedBench && (
        <BenchDetailPanel
          bench={selectedBench}
          isOpen={isDetailOpen && window.innerWidth >= 768}
          onClose={handleCloseDetail}
        />
      )}

      {selectedBench && showMobileDetail && (
        <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={handleCloseDetail}
          />
          <div className="relative bg-[#F8F5F0] rounded-t-3xl max-h-[70vh] overflow-hidden animate-slide-up">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="px-5 pb-5 overflow-y-auto max-h-[calc(70vh-20px)]">
              {selectedBench && (
                <>
                  <div className="flex items-start gap-3 mb-4">
                    {selectedBench.photos[0] && (
                      <img
                        src={selectedBench.photos[0]}
                        alt={selectedBench.parkName}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {selectedBench.parkName}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {selectedBench.locationDesc}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-lg font-bold"
                          style={{ color: getScoreColor(selectedBench.overallScore) }}
                        >
                          {selectedBench.overallScore.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {selectedBench.checkinCount} 人打卡
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseDetail}
                    className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium"
                  >
                    查看详情
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <FilterSidebar
        isOpen={isFilterOpen}
        filters={filters}
        onClose={toggleFilter}
        onFilterChange={updateFilters}
        onReset={resetFilters}
      />
    </div>
  );
};
