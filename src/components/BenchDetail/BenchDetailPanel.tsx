import React, { useState } from 'react';
import { X, MapPin, Navigation, MessageSquare, ExternalLink, Heart, Check, Users, Star, ChevronRight } from 'lucide-react';
import { ScoreCard } from './ScoreCard';
import { PhotoGallery } from './PhotoGallery';
import { CommentSection } from './CommentSection';
import type { Bench } from '../../types/bench';
import { getScoreColor, getScoreLabel } from '../../utils/score';
import { useBenchStore, type NearbyBench } from '../../store/useBenchStore';
import { formatDistance } from '../../lib/utils';

interface BenchDetailPanelProps {
  bench: Bench;
  onClose: () => void;
  isOpen: boolean;
}

export const BenchDetailPanel: React.FC<BenchDetailPanelProps> = ({
  bench,
  onClose,
  isOpen,
}) => {
  const overallColor = getScoreColor(bench.overallScore);
  const [showNavOptions, setShowNavOptions] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const {
    getCommentCountByBenchId,
    isFavorite,
    toggleFavorite,
    addCheckIn,
    getCheckInCountByBenchId,
    getNearbyBenches,
    setSelectedBench,
  } = useBenchStore();
  const commentCount = getCommentCountByBenchId(bench.id);
  const favorited = isFavorite(bench.id);
  const checkInCount = getCheckInCountByBenchId(bench.id);
  const nearbyBenches: NearbyBench[] = getNearbyBenches(bench.id, 1000);

  const handleFavoriteClick = () => {
    toggleFavorite(bench.id);
  };

  const handleCheckIn = () => {
    if (checkingIn) return;
    setCheckingIn(true);
    addCheckIn(bench);
    setTimeout(() => {
      setCheckingIn(false);
    }, 1000);
  };

  const handleNavigate = (type: 'amap' | 'baidu' | 'qq') => {
    const { lat, lng, parkName, locationDesc } = bench;
    const name = encodeURIComponent(`${parkName} - ${locationDesc}`);
    let url = '';

    switch (type) {
      case 'amap':
        url = `https://uri.amap.com/marker?position=${lng},${lat}&name=${name}&src=parkbench`;
        break;
      case 'baidu':
        url = `http://api.map.baidu.com/marker?location=${lat},${lng}&title=${name}&content=${name}&output=html&src=parkbench`;
        break;
      case 'qq':
        url = `https://apis.map.qq.com/uri/v1/marker?marker=coord:${lat},${lng};title:${name};addr:${name}&referer=parkbench`;
        break;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
    setShowNavOptions(false);
  };

  const handleNearbyBenchClick = (nearbyBenchId: string) => {
    setSelectedBench(nearbyBenchId);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 w-96 bg-[#F8F5F0] shadow-2xl z-40 transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="relative h-52 flex-shrink-0">
          {bench.photos[0] ? (
            <img
              src={bench.photos[0]}
              alt={bench.parkName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleFavoriteClick}
              className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
                favorited
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart size={20} fill={favorited ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="absolute bottom-4 left-5 right-5">
            <h2 className="text-2xl font-bold text-white mb-1">{bench.parkName}</h2>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <MapPin size={14} />
              <span>{bench.locationDesc}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: overallColor }}
            >
              {getScoreLabel(bench.overallScore)}
            </span>
            <span className="text-sm text-gray-500">
              {checkInCount} 位遛弯族推荐
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <MessageSquare size={14} className="text-emerald-600" />
              {commentCount} 条评论
            </span>
          </div>

          <button
            onClick={handleCheckIn}
            disabled={checkingIn}
            className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
              checkingIn
                ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
            }`}
          >
            <Check size={18} />
            {checkingIn ? '签到成功！' : '我要签到'}
          </button>

          <ScoreCard bench={bench} />

          <PhotoGallery photos={bench.photos} parkName={bench.parkName} />

          {bench.note && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={18} className="text-emerald-600" />
                <h3 className="font-bold text-gray-800">打卡留言</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{bench.note}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Navigation size={18} className="text-emerald-600" />
              <h3 className="font-bold text-gray-800">位置信息</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>
                <span className="text-gray-400">纬度：</span>
                {bench.lat.toFixed(4)}
              </p>
              <p>
                <span className="text-gray-400">经度：</span>
                {bench.lng.toFixed(4)}
              </p>
            </div>

            {!showNavOptions ? (
              <button
                onClick={() => setShowNavOptions(true)}
                className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-medium text-sm hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
              >
                <Navigation size={16} />
                打开地图导航
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => handleNavigate('amap')}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:border-emerald-400 hover:bg-emerald-50 transition-all flex items-center justify-between"
                >
                  <span>高德地图导航</span>
                  <ExternalLink size={14} className="text-gray-400" />
                </button>
                <button
                  onClick={() => handleNavigate('baidu')}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:border-emerald-400 hover:bg-emerald-50 transition-all flex items-center justify-between"
                >
                  <span>百度地图导航</span>
                  <ExternalLink size={14} className="text-gray-400" />
                </button>
                <button
                  onClick={() => handleNavigate('qq')}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:border-emerald-400 hover:bg-emerald-50 transition-all flex items-center justify-between"
                >
                  <span>腾讯地图导航</span>
                  <ExternalLink size={14} className="text-gray-400" />
                </button>
                <button
                  onClick={() => setShowNavOptions(false)}
                  className="w-full py-2 text-gray-400 text-xs hover:text-gray-600 transition-colors"
                >
                  取消
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-emerald-600" />
              <h3 className="font-bold text-gray-800">周边长椅</h3>
              <span className="text-xs text-gray-400 ml-auto">1公里范围内</span>
            </div>
            {nearbyBenches.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-sm">
                暂无周边长椅
              </div>
            ) : (
              <div className="space-y-2">
                {nearbyBenches.map((nearby) => (
                  <button
                    key={nearby.id}
                    onClick={() => handleNearbyBenchClick(nearby.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors text-left group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {nearby.photos[0] ? (
                        <img
                          src={nearby.photos[0]}
                          alt={nearby.parkName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <MapPin size={20} className="text-emerald-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800 text-sm truncate">
                          {nearby.parkName}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {nearby.locationDesc}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-sm font-bold"
                          style={{ color: getScoreColor(nearby.overallScore) }}
                        >
                          {nearby.overallScore.toFixed(1)}
                        </span>
                        <Star
                          size={12}
                          className="text-amber-400"
                          fill="currentColor"
                        />
                        <span className="text-xs text-emerald-600 font-medium">
                          {formatDistance(nearby.distance)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-gray-300 group-hover:text-emerald-500 transition-colors flex-shrink-0"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <CommentSection benchId={bench.id} />
        </div>
      </div>
    </div>
  );
};
