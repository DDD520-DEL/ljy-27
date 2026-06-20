import { create } from 'zustand';
import type { UnlockedAchievement, AchievementId } from '../types/achievement';
import { ACHIEVEMENTS } from '../types/achievement';
import type { CheckInRecord, BenchType } from '../types/bench';
import {
  loadAchievements,
  unlockAchievement as storageUnlockAchievement,
  markAchievementAsRead as storageMarkAsRead,
  markAllAchievementsAsRead as storageMarkAllAsRead,
} from '../utils/storage';

interface AchievementState {
  achievements: UnlockedAchievement[];
  newlyUnlocked: AchievementId[];

  initAchievements: () => void;
  checkAchievements: (checkIns: CheckInRecord[]) => AchievementId[];
  unlockAchievement: (id: AchievementId) => boolean;
  isUnlocked: (id: AchievementId) => boolean;
  getUnlockedAt: (id: AchievementId) => string | null;
  isNew: (id: AchievementId) => boolean;
  markAsRead: (id: AchievementId) => void;
  markAllAsRead: () => void;
  hasNewAchievements: () => boolean;
  getUnlockedCount: () => number;
  getTotalCount: () => number;
  clearNewlyUnlocked: () => void;
}

const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const checkFirstCheckin = (checkIns: CheckInRecord[]): boolean => {
  return checkIns.length >= 1;
};

const checkCheckin10 = (checkIns: CheckInRecord[]): boolean => {
  return checkIns.length >= 10;
};

const checkParks5 = (checkIns: CheckInRecord[]): boolean => {
  const parks = new Set(checkIns.map((c) => c.parkName));
  return parks.size >= 5;
};

const checkBenchTypesAll = (checkIns: CheckInRecord[]): boolean => {
  const types = new Set<BenchType>(checkIns.map((c) => c.benchType));
  return types.has('stone') && types.has('wood') && types.has('other');
};

const checkStreak7 = (checkIns: CheckInRecord[]): boolean => {
  if (checkIns.length === 0) return false;

  const dateSet = new Set(
    checkIns.map((c) => {
      const date = new Date(c.createdAt);
      return formatDateKey(date);
    })
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let currentDate = new Date(today);

  while (true) {
    const dateKey = formatDateKey(currentDate);
    if (dateSet.has(dateKey)) {
      streak++;
      if (streak >= 7) return true;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return false;
};

const ACHIEVEMENT_CHECKS: Record<AchievementId, (checkIns: CheckInRecord[]) => boolean> = {
  first_checkin: checkFirstCheckin,
  checkin_10: checkCheckin10,
  parks_5: checkParks5,
  bench_types_all: checkBenchTypesAll,
  streak_7: checkStreak7,
};

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: [],
  newlyUnlocked: [],

  initAchievements: () => {
    const achievements = loadAchievements();
    set({ achievements });
  },

  checkAchievements: (checkIns) => {
    const newlyUnlocked: AchievementId[] = [];
    const currentAchievements = get().achievements;
    const unlockedIds = new Set(currentAchievements.map((a) => a.id));

    for (const achievement of ACHIEVEMENTS) {
      if (!unlockedIds.has(achievement.id)) {
        const checkFn = ACHIEVEMENT_CHECKS[achievement.id];
        if (checkFn && checkFn(checkIns)) {
          const unlocked = storageUnlockAchievement(achievement.id);
          if (unlocked) {
            newlyUnlocked.push(achievement.id);
          }
        }
      }
    }

    if (newlyUnlocked.length > 0) {
      const updated = loadAchievements();
      set({
        achievements: updated,
        newlyUnlocked: [...get().newlyUnlocked, ...newlyUnlocked],
      });
    }

    return newlyUnlocked;
  },

  unlockAchievement: (id) => {
    const currentAchievements = get().achievements;
    if (currentAchievements.some((a) => a.id === id)) {
      return false;
    }
    const unlocked = storageUnlockAchievement(id);
    if (unlocked) {
      const updated = loadAchievements();
      set({
        achievements: updated,
        newlyUnlocked: [...get().newlyUnlocked, id],
      });
      return true;
    }
    return false;
  },

  isUnlocked: (id) => {
    return get().achievements.some((a) => a.id === id);
  },

  getUnlockedAt: (id) => {
    const achievement = get().achievements.find((a) => a.id === id);
    return achievement ? achievement.unlockedAt : null;
  },

  isNew: (id) => {
    const achievement = get().achievements.find((a) => a.id === id);
    return achievement?.isNew ?? false;
  },

  markAsRead: (id) => {
    storageMarkAsRead(id);
    const updated = loadAchievements();
    set({ achievements: updated });
  },

  markAllAsRead: () => {
    storageMarkAllAsRead();
    const updated = loadAchievements();
    set({ achievements: updated, newlyUnlocked: [] });
  },

  hasNewAchievements: () => {
    return get().achievements.some((a) => a.isNew);
  },

  getUnlockedCount: () => {
    return get().achievements.length;
  },

  getTotalCount: () => {
    return ACHIEVEMENTS.length;
  },

  clearNewlyUnlocked: () => {
    set({ newlyUnlocked: [] });
  },
}));
