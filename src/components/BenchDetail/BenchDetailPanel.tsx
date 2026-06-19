import React, { useState } from 'react';
import { X, MapPin, Navigation, MessageSquare, ExternalLink } from 'lucide-react';
import { ScoreCard } from './ScoreCard';
import { PhotoGallery } from './PhotoGallery';
import { CommentSection } from './CommentSection';
import type { Bench } from '../../types/bench';
import { getScoreColor, getScoreLabel } from '../../utils/score';
import { useBenchStore } from '../../store/useBenchStore';

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
  const { getCommentCountByBenchId } = useBenchStore();
  const commentCount = getCommentCountByBenchId(bench.id);

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

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>

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
              {bench.checkinCount} 位遛弯族推荐
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <MessageSquare size={14} className="text-emerald-600" />
              {commentCount} 条评论
            </span>
          </div>

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

          <CommentSection benchId={bench.id} />
        </div>
      </div>
    </div>
  );
};
