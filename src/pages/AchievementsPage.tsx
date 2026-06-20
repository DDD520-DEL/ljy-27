import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Lock, Sparkles, CheckCircle } from 'lucide-react';
import { useAchievementStore } from '../store/useAchievementStore';
import { ACHIEVEMENTS } from '../types/achievement';
import type { Achievement, AchievementId } from '../types/achievement';

export const AchievementsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    initAchievements,
    isUnlocked,
    getUnlockedAt,
    isNew,
    markAllAsRead,
    getUnlockedCount,
    getTotalCount,
  } = useAchievementStore();

  useEffect(() => {
    initAchievements();
  }, [initAchievements]);

  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const unlockedCount = getUnlockedCount();
  const totalCount = getTotalCount();
  const progressPercent = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const renderAchievement = (achievement: Achievement) => {
    const unlocked = isUnlocked(achievement.id);
    const unlockedAt = getUnlockedAt(achievement.id);
    const newlyUnlocked = isNew(achievement.id);

    return (
      <div
        key={achievement.id}
        className={`relative rounded-2xl p-5 transition-all duration-300 ${
          unlocked
            ? 'bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg'
            : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 opacity-75'
        }`}
      >
        {newlyUnlocked && (
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
            <Sparkles size={12} className="text-white" />
          </div>
        )}

        <div className="flex items-start gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 transition-all ${
              unlocked
                ? 'shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 grayscale'
            }`}
            style={unlocked ? { backgroundColor: achievement.bgColor } : {}}
          >
            {unlocked ? achievement.icon : achievement.lockedIcon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className={`font-bold text-lg ${
                  unlocked
                    ? 'text-gray-800 dark:text-gray-100'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {achievement.title}
              </h3>
              {unlocked && (
                <CheckCircle
                  size={18}
                  style={{ color: achievement.color }}
                />
              )}
              {!unlocked && <Lock size={16} className="text-gray-400 dark:text-gray-500" />}
            </div>
            <p
              className={`text-sm mt-1 ${
                unlocked
                  ? 'text-gray-600 dark:text-gray-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {achievement.description}
            </p>
            {unlocked && unlockedAt && (
              <p className="text-xs mt-2 text-gray-400 dark:text-gray-500">
                解锁时间：{formatDate(unlockedAt)}
              </p>
            )}
          </div>
        </div>

        {unlocked && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-5"
            style={{ backgroundColor: achievement.color }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">返回地图</span>
        </button>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 mb-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Award size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">我的成就</h1>
              <p className="text-sm text-amber-100">打卡解锁更多徽章</p>
            </div>
          </div>

          <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-amber-100">解锁进度</span>
              <span className="font-bold text-lg">
                {unlockedCount} / {totalCount}
              </span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {ACHIEVEMENTS.map((achievement) => renderAchievement(achievement))}
        </div>

        {unlockedCount === 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-3">
              <Award size={32} className="text-amber-400 dark:text-amber-500" />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
              还没有成就
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              快去打卡，解锁你的第一个成就徽章吧！
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-colors"
            >
              去探索
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
