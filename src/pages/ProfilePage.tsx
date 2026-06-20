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
  Download,
  Upload,
  Database,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Award,
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useBenchStore } from '../store/useBenchStore';
import { useAchievementStore } from '../store/useAchievementStore';
import { getScoreColor, getBenchTypeLabel } from '../utils/score';
import { NicknameModal } from '../components/User/NicknameModal';
import type { ImportResult } from '../utils/storage';

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
    exportData,
    importData,
  } = useBenchStore();
  const { initAchievements, getUnlockedCount, getTotalCount, hasNewAchievements } = useAchievementStore();

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [nicknameError, setNicknameError] = useState('');
  const [importResult, setImportResult] = useState<{
    show: boolean;
  } & Partial<ImportResult>>({ show: false });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    initUser();
    initBenches();
    initComments();
    initFavorites();
    initCheckIns();
    initContributedBenches();
    initReports();
    initAchievements();
  }, [initUser, initBenches, initComments, initFavorites, initCheckIns, initContributedBenches, initReports, initAchievements]);

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

  const handleExport = () => {
    exportData();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = importData(text);
      setImportResult({
        show: true,
        success: result.success,
        message: result.message,
        stats: result.stats,
      });
    } catch {
      setImportResult({
        show: true,
        success: false,
        message: '读取文件失败，请重试',
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeImportResult = () => {
    setImportResult({ show: false });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <NicknameModal />
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">请先设置昵称</h3>
          <button
            onClick={openNicknameModal}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-colors"
          >
            设置昵称
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] dark:bg-gray-900 transition-colors duration-300">
      <NicknameModal />
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-4"
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
                <div className="absolute top-24 left-0 z-20 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl grid grid-cols-6 gap-1 transition-colors duration-300">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => handleSelectAvatar(avatar)}
                      className={`w-10 h-10 rounded-lg text-2xl flex items-center justify-center transition-all ${
                        user.avatar === avatar
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 ring-2 ring-emerald-500 dark:ring-emerald-400'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
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

          <button
            onClick={() => navigate('/feedback')}
            className="w-full mt-3 p-4 rounded-2xl bg-white/15 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium">反馈与建议</div>
                <div className="text-xs text-emerald-100">提交使用建议或问题反馈</div>
              </div>
            </div>
            <ArrowLeft size={20} className="rotate-180" />
          </button>

          <button
            onClick={() => navigate('/achievements')}
            className="w-full mt-3 p-4 rounded-2xl bg-white/15 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Award size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium">成就徽章</div>
                <div className="text-xs text-emerald-100">
                  已解锁 {getUnlockedCount()} / {getTotalCount()} 个成就
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasNewAchievements() && (
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              )}
              <ArrowLeft size={20} className="rotate-180" />
            </div>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Calendar size={20} className="text-emerald-600 dark:text-emerald-400" />
              最近打卡
            </h2>
            {recentCheckIns.length > 0 && (
              <button
                onClick={() => navigate('/footprint')}
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
              >
                查看全部 →
              </button>
            )}
          </div>

          {recentCheckIns.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                <Footprints size={32} className="text-emerald-400 dark:text-emerald-500" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">还没有打卡记录</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">快去地图上发现歇脚点吧</p>
              <button
                onClick={() => navigate('/')}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-colors"
              >
                去探索
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCheckIns.map((checkIn, index) => (
                <div
                  key={checkIn.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
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
                            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">
                              #{index + 1}
                            </span>
                            <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate">
                              {checkIn.parkName}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs">
                          {getBenchTypeLabel(checkIn.benchType)}
                        </span>
                        <span className="flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                          <Sofa size={10} />
                          {checkIn.comfortScore}
                        </span>
                        <span className="flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                          <Trees size={10} />
                          {checkIn.shadeScore}
                        </span>
                        <span className="flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                          <Eye size={10} />
                          {checkIn.viewScore}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 dark:text-gray-500">
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

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
            <Database size={20} className="text-emerald-600 dark:text-emerald-400" />
            数据管理
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 transition-colors duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <Download size={22} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 dark:text-gray-100">导出数据</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  将您的签到记录、收藏列表和提交的长椅数据导出为 JSON 文件进行备份
                </p>
              </div>
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-colors flex-shrink-0"
              >
                导出
              </button>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700" />

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <Upload size={22} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 dark:text-gray-100">导入数据</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  从 JSON 备份文件恢复数据，系统会自动去重合并，不会覆盖已有数据
                </p>
              </div>
              <button
                onClick={handleImportClick}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors flex-shrink-0"
              >
                导入
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {importResult.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  importResult.success
                    ? 'bg-emerald-100 dark:bg-emerald-900/50'
                    : 'bg-red-100 dark:bg-red-900/50'
                }`}
              >
                {importResult.success ? (
                  <CheckCircle size={24} className="text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {importResult.success ? '导入成功' : '导入失败'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{importResult.message}</p>
              </div>
            </div>

            {importResult.success && importResult.stats && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">新增长椅</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {importResult.stats.benchesAdded}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">跳过长椅</span>
                    <span className="font-medium text-gray-400 dark:text-gray-500">
                      {importResult.stats.benchesSkipped}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">新增签到</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {importResult.stats.checkInsAdded}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">跳过签到</span>
                    <span className="font-medium text-gray-400 dark:text-gray-500">
                      {importResult.stats.checkInsSkipped}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">新增收藏</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {importResult.stats.favoritesAdded}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">跳过收藏</span>
                    <span className="font-medium text-gray-400 dark:text-gray-500">
                      {importResult.stats.favoritesSkipped}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">新增评论</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {importResult.stats.commentsAdded}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">跳过评论</span>
                    <span className="font-medium text-gray-400 dark:text-gray-500">
                      {importResult.stats.commentsSkipped}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">新增举报</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {importResult.stats.reportsAdded}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">跳过举报</span>
                    <span className="font-medium text-gray-400 dark:text-gray-500">
                      {importResult.stats.reportsSkipped}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">合并点赞</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {importResult.stats.photoLikesMerged}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">保持点赞</span>
                    <span className="font-medium text-gray-400 dark:text-gray-500">
                      {importResult.stats.photoLikesSkipped}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">新增成就</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {importResult.stats.achievementsAdded ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">跳过成就</span>
                    <span className="font-medium text-gray-400 dark:text-gray-500">
                      {importResult.stats.achievementsSkipped ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={closeImportResult}
              className={`w-full py-3 rounded-xl font-medium transition-colors ${
                importResult.success
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 dark:hover:bg-emerald-500'
                  : 'bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-500'
              }`}
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
