import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Footprints,
  Heart,
  MapPin,
  Calendar,
  Star,
  Sofa,
  Trees,
  Eye,
  Pencil,
  Check,
  X,
  Flag,
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useBenchStore } from '../store/useBenchStore';
import { getScoreColor, getBenchTypeLabel } from '../utils/score';
import { NicknameModal } from '../components/User/NicknameModal';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, initUser, updateNickname, updateAvatar, getAvatarOptions, openNicknameModal } = useUserStore();
  const {
    initBenches,
    initComments,
    initFavorites,
    initCheckIns,
    initContributedBenches,
    initReports,
    getTotalCheckInCount,
    getFavoriteCount,
    getContributedBenchCount,
    getRecentCheckIns,
    getPendingReports,
  } = useBenchStore();

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [nicknameError, setNicknameError] = useState('');

  useEffect(() => {
    initUser();
    initBenches();
    initComments();
    initFavorites();
    initCheckIns();
    initContributedBenches();
    initReports();
  }, [initUser, initBenches, initComments, initFavorites, initCheckIns, initContributedBenches, initReports]);

  const totalCheckIns = getTotalCheckInCount();
  const favoriteCount = getFavoriteCount();
  const contributedCount = getContributedBenchCount();
  const recentCheckIns = getRecentCheckIns(5);
  const pendingReportCount = getPendingReports().length;
  const avatarOptions = getAvatarOptions();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleStartEditNickname = () => {
    if (user) {
      setNicknameInput(user.nickname);
      setIsEditingNickname(true);
      setNicknameError('');
    }
  };

  const handleSaveNickname = () => {
    const trimmed = nicknameInput.trim();
    if (!trimmed) {
      setNicknameError('昵称不能为空');
      return;
    }
    if (trimmed.length > 12) {
      setNicknameError('昵称不能超过 12 个字符');
      return;
    }
    updateNickname(trimmed);
    setIsEditingNickname(false);
    setNicknameError('');
  };

  const handleCancelEditNickname = () => {
    setIsEditingNickname(false);
    setNicknameError('');
  };

  const handleSelectAvatar = (avatar: string) => {
    updateAvatar(avatar);
    setIsEditingAvatar(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <NicknameModal />
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">请先设置昵称</h3>
          <button
            onClick={openNicknameModal}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            设置昵称
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <NicknameModal />
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">返回地图</span>
        </button>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 mb-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="relative">
              <button
                onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-5xl hover:bg-white/30 transition-colors"
              >
                {user.avatar}
              </button>
              {isEditingAvatar && (
                <div className="absolute top-24 left-0 z-20 bg-white rounded-2xl p-3 shadow-xl grid grid-cols-6 gap-1">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => handleSelectAvatar(avatar)}
                      className={`w-10 h-10 rounded-lg text-2xl flex items-center justify-center transition-all ${
                        user.avatar === avatar
                          ? 'bg-emerald-100 ring-2 ring-emerald-500'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {isEditingNickname ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nicknameInput}
                    onChange={(e) => {
                      setNicknameInput(e.target.value);
                      if (nicknameError) setNicknameError('');
                    }}
                    maxLength={12}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 outline-none focus:border-white text-base"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveNickname();
                      if (e.key === 'Escape') handleCancelEditNickname();
                    }}
                  />
                  <button
                    onClick={handleSaveNickname}
                    className="w-9 h-9 rounded-lg bg-white text-emerald-600 flex items-center justify-center hover:bg-white/90 transition-colors"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={handleCancelEditNickname}
                    className="w-9 h-9 rounded-lg bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{user.nickname}</h1>
                  <button
                    onClick={handleStartEditNickname}
                    className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              )}
              {nicknameError && (
                <p className="text-white/80 text-xs mt-1">{nicknameError}</p>
              )}
              <p className="text-emerald-100 text-sm mt-1">
                加入时间：{formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/15 rounded-2xl p-4 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Footprints size={18} className="text-emerald-100" />
              </div>
              <div className="text-3xl font-bold">{totalCheckIns}</div>
              <div className="text-xs text-emerald-100 mt-0.5">累计打卡</div>
            </div>
            <div className="bg-white/15 rounded-2xl p-4 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Heart size={18} className="text-emerald-100" />
              </div>
              <div className="text-3xl font-bold">{favoriteCount}</div>
              <div className="text-xs text-emerald-100 mt-0.5">收藏数</div>
            </div>
            <div className="bg-white/15 rounded-2xl p-4 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MapPin size={18} className="text-emerald-100" />
              </div>
              <div className="text-3xl font-bold">{contributedCount}</div>
              <div className="text-xs text-emerald-100 mt-0.5">贡献长椅</div>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/reports')}
            className="w-full mt-4 p-4 rounded-2xl bg-white/15 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Flag size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium">举报管理</div>
                <div className="text-xs text-emerald-100">处理用户举报内容</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {pendingReportCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                  {pendingReportCount}
                </span>
              )}
              <ArrowLeft size={20} className="rotate-180" />
            </div>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={20} className="text-emerald-600" />
              最近打卡
            </h2>
            {recentCheckIns.length > 0 && (
              <button
                onClick={() => navigate('/footprint')}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                查看全部 →
              </button>
            )}
          </div>

          {recentCheckIns.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <Footprints size={32} className="text-emerald-400" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">还没有打卡记录</h3>
              <p className="text-sm text-gray-500 mb-4">快去地图上发现歇脚点吧</p>
              <button
                onClick={() => navigate('/')}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                去探索
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCheckIns.map((checkIn, index) => (
                <div
                  key={checkIn.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {checkIn.photos[0] && (
                      <img
                        src={checkIn.photos[0]}
                        alt={checkIn.parkName}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                              #{index + 1}
                            </span>
                            <h3 className="font-bold text-gray-800 truncate">
                              {checkIn.parkName}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <MapPin size={12} className="flex-shrink-0" />
                            <span className="truncate">{checkIn.locationDesc}</span>
                          </div>
                        </div>
                        <span
                          className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-sm font-bold flex-shrink-0"
                          style={{
                            backgroundColor: `${getScoreColor(checkIn.overallScore)}20`,
                            color: getScoreColor(checkIn.overallScore),
                          }}
                        >
                          <Star size={12} fill="currentColor" />
                          {checkIn.overallScore.toFixed(1)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs">
                          {getBenchTypeLabel(checkIn.benchType)}
                        </span>
                        <span className="flex items-center gap-0.5 text-xs text-gray-500">
                          <Sofa size={10} />
                          {checkIn.comfortScore}
                        </span>
                        <span className="flex items-center gap-0.5 text-xs text-gray-500">
                          <Trees size={10} />
                          {checkIn.shadeScore}
                        </span>
                        <span className="flex items-center gap-0.5 text-xs text-gray-500">
                          <Eye size={10} />
                          {checkIn.viewScore}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Calendar size={10} />
                        <span>{formatDate(checkIn.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
