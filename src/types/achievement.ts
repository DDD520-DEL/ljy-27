export type AchievementId =
  | 'first_checkin'
  | 'checkin_10'
  | 'parks_5'
  | 'bench_types_all'
  | 'streak_7';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  lockedIcon: string;
  color: string;
  bgColor: string;
}

export interface UnlockedAchievement {
  id: AchievementId;
  unlockedAt: string;
  isNew: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_checkin',
    title: '初次相遇',
    description: '完成第一次打卡',
    icon: '🌟',
    lockedIcon: '⭐',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  {
    id: 'checkin_10',
    title: '打卡达人',
    description: '累计完成 10 次打卡',
    icon: '🏆',
    lockedIcon: '🎯',
    color: '#10B981',
    bgColor: '#D1FAE5',
  },
  {
    id: 'parks_5',
    title: '公园探险家',
    description: '在 5 个不同的公园打卡',
    icon: '🗺️',
    lockedIcon: '🧭',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
  },
  {
    id: 'bench_types_all',
    title: '长椅收藏家',
    description: '打卡覆盖全部三种长椅类型',
    icon: '🪑',
    lockedIcon: '🚪',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
  },
  {
    id: 'streak_7',
    title: '坚持不懈',
    description: '连续 7 天打卡',
    icon: '🔥',
    lockedIcon: '💧',
    color: '#EF4444',
    bgColor: '#FEE2E2',
  },
];
