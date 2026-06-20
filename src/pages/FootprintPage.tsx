import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Star, Sofa, Trees, Eye, ArrowLeft, Footprints } from 'lucide-react';
import { useBenchStore } from '../store/useBenchStore';
import { getScoreColor, getBenchTypeLabel } from '../utils/score';
import type { CheckInRecord } from '../types/bench';

interface GroupedCheckIns {
  [key: string]: CheckInRecord[];
}

export const FootprintPage: React.FC = () => {
  const navigate = useNavigate();
  const { initBenches, initCheckIns, getTotalCheckInCount, getVisibleCheckIns } = useBenchStore();

  useEffect(() => {
    initBenches();
    initCheckIns();
  }, [initBenches, initCheckIns]);

  const checkIns = getVisibleCheckIns();

  const sortedCheckIns = [...checkIns].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const groupedCheckIns = sortedCheckIns.reduce<GroupedCheckIns>((acc, checkIn) => {
    const date = new Date(checkIn.createdAt);
    const key = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(checkIn);
    return acc;
  }, {});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const totalCount = getTotalCheckInCount();

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">返回地图</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Footprints size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">签到足迹</h1>
              <p className="text-sm text-gray-500">记录你发现的每一个舒适歇脚点</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-emerald-600">{totalCount}</div>
              <div className="text-sm text-gray-500">总签到次数</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-teal-600">{Object.keys(groupedCheckIns).length}</div>
              <div className="text-sm text-gray-500">活跃月份</div>
            </div>
          </div>
        </div>

        {sortedCheckIns.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Footprints size={40} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">还没有签到记录</h3>
            <p className="text-gray-500 mb-4">快去打卡你发现的第一个歇脚点吧</p>
            <button
              onClick={() => navigate('/add')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
            >
              去打卡
            </button>
          </div>
        ) : (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 to-transparent" />
              
              {Object.entries(groupedCheckIns).map(([month, records]) => (
                <div key={month} className="mb-8">
                  <div className="flex items-center gap-3 mb-4 sticky top-0 bg-[#F8F5F0] py-2 z-10">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
                      <Calendar size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">{month}</h2>
                    <p className="text-sm text-gray-500">{records.length} 次签到</p>
                    </div>
                  </div>

                  <div className="ml-6 space-y-4">
                    {records.map((checkIn, index) => (
                      <div
                        key={checkIn.id}
                        className="relative pl-8"
                      >
                        <div className="absolute left-[-22px] top-6 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#F8F5F0] shadow-sm" />
                        
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            {checkIn.photos[0] && (
                              <img
                                src={checkIn.photos[0]}
                                alt={checkIn.parkName}
                                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-gray-800 text-lg">
                                    {checkIn.parkName}
                                  </h3>
                                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <MapPin size={14} className="flex-shrink-0" />
                                    <span className="truncate">{checkIn.locationDesc}</span>
                                  </div>
                                </div>
                                <span
                                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold flex-shrink-0"
                                  style={{ 
                                    backgroundColor: `${getScoreColor(checkIn.overallScore)}20`,
                                    color: getScoreColor(checkIn.overallScore),
                                  }}
                                >
                                  <Star size={14} fill="currentColor" />
                                  {checkIn.overallScore.toFixed(1)}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 mt-3 flex-wrap">
                                <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs">
                                  {getBenchTypeLabel(checkIn.benchType)}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <Sofa size={12} />
                                  {checkIn.comfortScore}分
                                </span>
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <Trees size={12} />
                                  {checkIn.shadeScore}分
                                </span>
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <Eye size={12} />
                                  {checkIn.viewScore}分
                                </span>
                              </div>

                              {checkIn.note && (
                                <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-lg">
                                  "{checkIn.note}"
                                </p>
                              )}

                              <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                                <Calendar size={12} />
                                <span>{formatDate(checkIn.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};
