import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, MapPin, Locate, Loader2, AlertCircle, Heart, Footprints, Check, User } from 'lucide-react';
import { MapView } from '../components/Map/MapView';
import { BenchDetailPanel } from '../components/BenchDetail/BenchDetailPanel';
import { FilterSidebar } from '../components/Filter/FilterSidebar';
import { NicknameModal } from '../components/User/NicknameModal';
import { useBenchStore } from '../store/useBenchStore';
import { useUserStore } from '../store/useUserStore';
import { getScoreColor } from '../utils/score';
import { MessageSquare } from 'lucide-react';
import { decodeShareUrl, hasShareParams } from '../utils/share';
import type { ShareMapView } from '../utils/share';

export const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    benches,
    selectedBenchId,
    filters,
    isFilterOpen,
    isDetailOpen,
    initBenches,
    initComments,
    initFavorites,
    initCheckIns,
    initContributedBenches,
    setSelectedBench,
    updateFilters,
    resetFilters,
    toggleFilter,
    toggleDetail,
    toggleFavorite,
    isFavorite,
    getFilteredBenches,
    getSelectedBench,
    getCommentCountByBenchId,
    getTotalCheckInCount,
    getCheckInCountByBenchId,
    addCheckIn,
  } = useBenchStore();
  const { user, initUser } = useUserStore();

  const [searchValue, setSearchValue] = useState('');
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);
  const [mobileCheckingIn, setMobileCheckingIn] = useState(false);
  const [mapView, setMapView] = useState<ShareMapView>({ lat: 39.9339, lng: 116.4044, zoom: 12 });
  const [initializedFromUrl, setInitializedFromUrl] = useState(false);
  const errorTimerRef = React.useRef<number | null>(null);
  const hasLoadedFromUrlRef = useRef(false);

  const clearLocateError = React.useCallback(() => {
    setLocateError(null);
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
  }, []);

  const setLocateErrorWithAutoClear = React.useCallback((message: string) => {
    setLocateError(message);
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }
    errorTimerRef.current = window.setTimeout(() => {
      setLocateError(null);
      errorTimerRef.current = null;
    }, 5000);
  }, []);

  React.useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (benches.length === 0) {
      initBenches();
    }
    initComments();
    initFavorites();
    initCheckIns();
    initContributedBenches();
    initUser();
  }, [benches.length, initBenches, initComments, initFavorites, initCheckIns, initContributedBenches, initUser]);

  useEffect(() => {
    if (hasLoadedFromUrlRef.current) return;
    if (!hasShareParams()) return;
    if (benches.length === 0) return;

    const shareState = decodeShareUrl();

    if (shareState.filters) {
      updateFilters(shareState.filters);
      if (shareState.filters.searchKeyword) {
        setSearchValue(shareState.filters.searchKeyword);
      }
    }

    if (shareState.mapView) {
      setMapView(shareState.mapView);
    }

    if (shareState.benchId) {
      const bench = benches.find((b) => b.id === shareState.benchId);
      if (bench) {
        setSelectedBench(shareState.benchId);
        if (window.innerWidth < 768) {
          setShowMobileDetail(true);
        }
      }
    }

    hasLoadedFromUrlRef.current = true;
    setInitializedFromUrl(true);
  }, [benches, initBenches, updateFilters, setSelectedBench]);

  const filteredBenches = getFilteredBenches();
  const selectedBench = getSelectedBench();

  const handleBenchClick = (id: string) => {
    setSelectedBench(id);
    clearLocateError();
    setUserLocation(null);
    if (window.innerWidth < 768) {
      setShowMobileDetail(true);
    }
  };

  const handleCloseDetail = () => {
    setSelectedBench(null);
    setShowMobileDetail(false);
  };

  const handleMobileCheckIn = () => {
    if (mobileCheckingIn || !selectedBench) return;
    setMobileCheckingIn(true);
    addCheckIn(selectedBench);
    setTimeout(() => {
      setMobileCheckingIn(false);
    }, 1000);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    updateFilters({ searchKeyword: e.target.value });
    clearLocateError();
  };

  const handleViewChange = (lat: number, lng: number, zoom: number) => {
    setMapView({ lat, lng, zoom });
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setLocateErrorWithAutoClear('您的浏览器不支持地理定位');
      return;
    }

    setIsLocating(true);
    clearLocateError();
    setUserLocation(null);
    setSelectedBench(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        let errorMessage = '定位失败';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '您拒绝了位置权限，请在浏览器设置中开启';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置信息不可用';
            break;
          case error.TIMEOUT:
            errorMessage = '定位超时，请重试';
            break;
        }
        setLocateErrorWithAutoClear(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
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
              onClick={() => {
                toggleFilter();
                clearLocateError();
              }}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                isFilterOpen
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Filter size={20} />
            </button>

            <button
              onClick={() => {
                navigate('/footprint');
                clearLocateError();
              }}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all relative ${
                getTotalCheckInCount() > 0
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Footprints size={20} />
              {getTotalCheckInCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {getTotalCheckInCount()}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                navigate('/profile');
                clearLocateError();
              }}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all overflow-hidden ${
                user
                  ? 'bg-gradient-to-br from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={user ? user.nickname : '个人中心'}
            >
              {user ? (
                <span className="text-xl">{user.avatar}</span>
              ) : (
                <User size={20} />
              )}
            </button>

            <button
              onClick={() => {
                navigate('/add');
                clearLocateError();
              }}
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
          onViewChange={handleViewChange}
          center={[mapView.lat, mapView.lng]}
          zoom={mapView.zoom}
          userLocation={userLocation}
        />
      </div>

      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
        {locateError && (
          <div className="bg-red-500 text-white px-3 py-2 rounded-xl text-xs shadow-lg max-w-[200px] flex items-start gap-2">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span>{locateError}</span>
          </div>
        )}
        <button
          onClick={handleLocate}
          disabled={isLocating}
          className={`w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
            isLocating
              ? 'text-emerald-600 cursor-wait'
              : userLocation
              ? 'text-emerald-600 hover:shadow-xl'
              : 'text-gray-600 hover:text-emerald-600 hover:shadow-xl'
          }`}
        >
          {isLocating ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <Locate size={22} />
          )}
        </button>
      </div>

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
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 text-lg">
                            {selectedBench.parkName}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {selectedBench.locationDesc}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(selectedBench.id);
                          }}
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isFavorite(selectedBench.id)
                              ? 'bg-red-100 text-red-500'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <Heart size={20} fill={isFavorite(selectedBench.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className="text-lg font-bold"
                          style={{ color: getScoreColor(selectedBench.overallScore) }}
                        >
                          {selectedBench.overallScore.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {getCheckInCountByBenchId(selectedBench.id)} 人打卡
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <MessageSquare size={12} className="text-emerald-600" />
                          {getCommentCountByBenchId(selectedBench.id)} 条评论
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleMobileCheckIn}
                    disabled={mobileCheckingIn}
                    className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 mb-2 transition-all ${
                      mobileCheckingIn
                        ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                    }`}
                  >
                    <Check size={18} />
                    {mobileCheckingIn ? '签到成功！' : '我要签到'}
                  </button>

                  <button
                    onClick={handleCloseDetail}
                    className="w-full py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
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
        mapView={mapView}
      />

      <NicknameModal />
    </div>
  );
};
