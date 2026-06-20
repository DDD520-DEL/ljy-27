import { create } from 'zustand';
import type { Bench, FilterOptions, NewBenchData, Comment, NewCommentData, NewReplyData, CheckInRecord, SortBy, Report, NewReportData } from '../types/bench';
import { loadBenches, saveBenches, loadComments, saveComments, getCommentsByBenchId, getCommentCountByBenchId, loadFavorites, saveFavorites, loadCheckIns, saveCheckIns, loadContributedBenches, saveContributedBenches, loadReports, saveReports, getPendingReports } from '../utils/storage';
import { calculateOverallScore, generateId } from '../utils/score';
import { calculateDistance } from '../lib/utils';

export interface NearbyBench extends Bench {
  distance: number;
}

interface BenchState {
  benches: Bench[];
  comments: Comment[];
  favorites: string[];
  checkIns: CheckInRecord[];
  contributedBenchIds: string[];
  reports: Report[];
  selectedBenchId: string | null;
  filters: FilterOptions;
  isFilterOpen: boolean;
  isDetailOpen: boolean;

  initBenches: () => void;
  initComments: () => void;
  initFavorites: () => void;
  initCheckIns: () => void;
  initContributedBenches: () => void;
  initReports: () => void;
  setSelectedBench: (id: string | null) => void;
  addBench: (data: NewBenchData) => void;
  addCheckIn: (bench: Bench) => void;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  toggleFilter: () => void;
  toggleDetail: () => void;
  toggleFavorite: (benchId: string) => void;
  isFavorite: (benchId: string) => boolean;
  getFilteredBenches: () => Bench[];
  getVisibleBenches: () => Bench[];
  getSelectedBench: () => Bench | undefined;
  addComment: (data: NewCommentData) => void;
  addReply: (data: NewReplyData) => void;
  deleteComment: (commentId: string, benchId: string) => void;
  deleteReply: (commentId: string, replyId: string, benchId: string) => void;
  getCommentsByBenchId: (benchId: string) => Comment[];
  getCommentCountByBenchId: (benchId: string) => number;
  getCheckInCountByBenchId: (benchId: string) => number;
  getTotalCheckInCount: () => number;
  getFavoriteCount: () => number;
  getContributedBenchCount: () => number;
  getRecentCheckIns: (limit?: number) => CheckInRecord[];
  getVisibleCheckIns: () => CheckInRecord[];
  getNearbyBenches: (benchId: string, radiusMeters?: number) => NearbyBench[];
  addReport: (data: NewReportData) => void;
  getPendingReports: () => Report[];
  ignoreReport: (reportId: string, handler: string) => void;
  banBench: (benchId: string, reportId: string, handler: string) => void;
  unbanBench: (benchId: string) => void;
}

const defaultFilters: FilterOptions = {
  minOverallScore: 0,
  minComfortScore: 0,
  minShadeScore: 0,
  minViewScore: 0,
  searchKeyword: '',
  benchTypes: [],
  onlyFavorites: false,
  sortBy: 'overall',
};

export const useBenchStore = create<BenchState>((set, get) => ({
  benches: [],
  comments: [],
  favorites: [],
  checkIns: [],
  contributedBenchIds: [],
  reports: [],
  selectedBenchId: null,
  filters: defaultFilters,
  isFilterOpen: false,
  isDetailOpen: false,

  initBenches: () => {
    const benches = loadBenches();
    set({ benches });
  },

  initComments: () => {
    const comments = loadComments();
    set({ comments });
  },

  initFavorites: () => {
    const favorites = loadFavorites();
    set({ favorites });
  },

  initCheckIns: () => {
    const checkIns = loadCheckIns();
    set({ checkIns });
  },

  initContributedBenches: () => {
    const contributedBenchIds = loadContributedBenches();
    set({ contributedBenchIds });
  },

  initReports: () => {
    const reports = loadReports();
    set({ reports });
  },

  setSelectedBench: (id) => {
    set({ selectedBenchId: id, isDetailOpen: id !== null });
  },

  addBench: (data) => {
    const overallScore = calculateOverallScore(
      data.comfortScore,
      data.shadeScore,
      data.viewScore
    );
    const newBench: Bench = {
      id: generateId(),
      ...data,
      overallScore,
      createdAt: new Date().toISOString(),
      checkinCount: 1,
      isBanned: false,
    };
    const benches = [...get().benches, newBench];
    set({ benches });
    saveBenches(benches);

    const contributedBenchIds = [...get().contributedBenchIds, newBench.id];
    set({ contributedBenchIds });
    saveContributedBenches(contributedBenchIds);

    get().addCheckIn(newBench);
  },

  addCheckIn: (bench) => {
    const newCheckIn: CheckInRecord = {
      id: generateId(),
      benchId: bench.id,
      parkName: bench.parkName,
      locationDesc: bench.locationDesc,
      benchType: bench.benchType,
      comfortScore: bench.comfortScore,
      shadeScore: bench.shadeScore,
      viewScore: bench.viewScore,
      overallScore: bench.overallScore,
      photos: bench.photos,
      note: bench.note,
      createdAt: new Date().toISOString(),
    };
    const checkIns = [...get().checkIns, newCheckIn];
    set({ checkIns });
    saveCheckIns(checkIns);

    const benches = get().benches.map((b) =>
      b.id === bench.id ? { ...b, checkinCount: b.checkinCount + 1 } : b
    );
    set({ benches });
    saveBenches(benches);
  },

  updateFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  toggleFilter: () => {
    set((state) => ({ isFilterOpen: !state.isFilterOpen }));
  },

  toggleDetail: () => {
    set((state) => ({ isDetailOpen: !state.isDetailOpen }));
  },

  toggleFavorite: (benchId) => {
    const { favorites } = get();
    const newFavorites = favorites.includes(benchId)
      ? favorites.filter((id) => id !== benchId)
      : [...favorites, benchId];
    set({ favorites: newFavorites });
    saveFavorites(newFavorites);
  },

  isFavorite: (benchId) => {
    return get().favorites.includes(benchId);
  },

  getFilteredBenches: () => {
    const { benches, filters, favorites, checkIns } = get();
    const filtered = benches.filter((bench) => {
      if (bench.isBanned) return false;
      if (filters.onlyFavorites && !favorites.includes(bench.id)) return false;
      if (bench.overallScore < filters.minOverallScore) return false;
      if (bench.comfortScore < filters.minComfortScore) return false;
      if (bench.shadeScore < filters.minShadeScore) return false;
      if (bench.viewScore < filters.minViewScore) return false;
      if (filters.benchTypes.length > 0 && !filters.benchTypes.includes(bench.benchType)) return false;
      if (filters.searchKeyword) {
        const keyword = filters.searchKeyword.toLowerCase();
        if (
          !bench.parkName.toLowerCase().includes(keyword) &&
          !bench.locationDesc.toLowerCase().includes(keyword) &&
          !bench.note.toLowerCase().includes(keyword)
        ) {
          return false;
        }
      }
      return true;
    });

    const sortBy = filters.sortBy;
    const sorted = [...filtered];

    switch (sortBy) {
      case 'overall':
        sorted.sort((a, b) => b.overallScore - a.overallScore);
        break;
      case 'comfort':
        sorted.sort((a, b) => b.comfortScore - a.comfortScore);
        break;
      case 'shade':
        sorted.sort((a, b) => b.shadeScore - a.shadeScore);
        break;
      case 'view':
        sorted.sort((a, b) => b.viewScore - a.viewScore);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        sorted.sort((a, b) => {
          const aCount = checkIns.filter((c) => c.benchId === a.id).length;
          const bCount = checkIns.filter((c) => c.benchId === b.id).length;
          return bCount - aCount;
        });
        break;
      default:
        break;
    }

    return sorted;
  },

  getVisibleBenches: () => {
    const { benches } = get();
    return benches.filter((bench) => !bench.isBanned);
  },

  getSelectedBench: () => {
    const { benches, selectedBenchId } = get();
    const bench = benches.find((b) => b.id === selectedBenchId);
    if (bench?.isBanned) return undefined;
    return bench;
  },

  addComment: (data) => {
    const newComment: Comment = {
      id: generateId(),
      benchId: data.benchId,
      content: data.content,
      author: data.author,
      createdAt: new Date().toISOString(),
      replies: [],
      isDeleted: false,
    };
    const comments = [...get().comments, newComment];
    set({ comments });
    saveComments(comments);
  },

  addReply: (data) => {
    const comments = get().comments.map((comment) => {
      if (comment.id === data.commentId) {
        return {
          ...comment,
          replies: [
            ...comment.replies,
            {
              id: generateId(),
              content: data.content,
              author: data.author,
              createdAt: new Date().toISOString(),
              replyTo: data.replyTo,
              isDeleted: false,
            },
          ],
        };
      }
      return comment;
    });
    set({ comments });
    saveComments(comments);
  },

  deleteComment: (commentId, benchId) => {
    const comments = get().comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, isDeleted: true };
      }
      return comment;
    });
    set({ comments });
    saveComments(comments);
  },

  deleteReply: (commentId, replyId, benchId) => {
    const comments = get().comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies.map((reply) => {
            if (reply.id === replyId) {
              return { ...reply, isDeleted: true };
            }
            return reply;
          }),
        };
      }
      return comment;
    });
    set({ comments });
    saveComments(comments);
  },

  getCommentsByBenchId: (benchId) => {
    return getCommentsByBenchId(benchId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getCommentCountByBenchId: (benchId) => {
    return getCommentCountByBenchId(benchId);
  },

  getCheckInCountByBenchId: (benchId) => {
    return get().checkIns.filter((c) => c.benchId === benchId).length;
  },

  getTotalCheckInCount: () => {
    const { benches, checkIns } = get();
    const bannedIds = new Set(benches.filter((b) => b.isBanned).map((b) => b.id));
    return checkIns.filter((c) => !bannedIds.has(c.benchId)).length;
  },

  getFavoriteCount: () => {
    const { benches, favorites } = get();
    const bannedIds = new Set(benches.filter((b) => b.isBanned).map((b) => b.id));
    return favorites.filter((id) => !bannedIds.has(id)).length;
  },

  getContributedBenchCount: () => {
    const { benches, contributedBenchIds } = get();
    const bannedIds = new Set(benches.filter((b) => b.isBanned).map((b) => b.id));
    return contributedBenchIds.filter((id) => !bannedIds.has(id)).length;
  },

  getRecentCheckIns: (limit = 5) => {
    const { benches, checkIns } = get();
    const bannedIds = new Set(benches.filter((b) => b.isBanned).map((b) => b.id));
    return [...checkIns]
      .filter((c) => !bannedIds.has(c.benchId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  getVisibleCheckIns: () => {
    const { benches, checkIns } = get();
    const bannedIds = new Set(benches.filter((b) => b.isBanned).map((b) => b.id));
    return checkIns.filter((c) => !bannedIds.has(c.benchId));
  },

  getNearbyBenches: (benchId, radiusMeters = 1000) => {
    const { benches } = get();
    const currentBench = benches.find((b) => b.id === benchId);
    if (!currentBench) return [];

    return benches
      .filter((b) => b.id !== benchId && !b.isBanned)
      .map((b) => ({
        ...b,
        distance: calculateDistance(
          currentBench.lat,
          currentBench.lng,
          b.lat,
          b.lng
        ),
      }))
      .filter((b) => b.distance <= radiusMeters)
      .sort((a, b) => a.distance - b.distance);
  },

  addReport: (data) => {
    const newReport: Report = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    const reports = [...get().reports, newReport];
    set({ reports });
    saveReports(reports);
  },

  getPendingReports: () => {
    return getPendingReports();
  },

  ignoreReport: (reportId, handler) => {
    const reports = get().reports.map((report) => {
      if (report.id === reportId) {
        return {
          ...report,
          status: 'ignored' as const,
          handledAt: new Date().toISOString(),
          handledBy: handler,
        };
      }
      return report;
    });
    set({ reports });
    saveReports(reports);
  },

  banBench: (benchId, reportId, handler) => {
    const benches = get().benches.map((bench) => {
      if (bench.id === benchId) {
        return { ...bench, isBanned: true };
      }
      return bench;
    });
    set({ benches });
    saveBenches(benches);

    const reports = get().reports.map((report) => {
      if (report.id === reportId) {
        return {
          ...report,
          status: 'resolved' as const,
          handledAt: new Date().toISOString(),
          handledBy: handler,
        };
      }
      return report;
    });
    set({ reports });
    saveReports(reports);
  },

  unbanBench: (benchId) => {
    const benches = get().benches.map((bench) => {
      if (bench.id === benchId) {
        return { ...bench, isBanned: false };
      }
      return bench;
    });
    set({ benches });
    saveBenches(benches);
  },
}));
