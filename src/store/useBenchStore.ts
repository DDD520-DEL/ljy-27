import { create } from 'zustand';
import type { Bench, FilterOptions, NewBenchData, Comment, NewCommentData, NewReplyData, CheckInRecord } from '../types/bench';
import { loadBenches, saveBenches, loadComments, saveComments, getCommentsByBenchId, getCommentCountByBenchId, loadFavorites, saveFavorites, loadCheckIns, saveCheckIns } from '../utils/storage';
import { calculateOverallScore, generateId } from '../utils/score';

interface BenchState {
  benches: Bench[];
  comments: Comment[];
  favorites: string[];
  checkIns: CheckInRecord[];
  selectedBenchId: string | null;
  filters: FilterOptions;
  isFilterOpen: boolean;
  isDetailOpen: boolean;

  initBenches: () => void;
  initComments: () => void;
  initFavorites: () => void;
  initCheckIns: () => void;
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
  getSelectedBench: () => Bench | undefined;
  addComment: (data: NewCommentData) => void;
  addReply: (data: NewReplyData) => void;
  deleteComment: (commentId: string, benchId: string) => void;
  deleteReply: (commentId: string, replyId: string, benchId: string) => void;
  getCommentsByBenchId: (benchId: string) => Comment[];
  getCommentCountByBenchId: (benchId: string) => number;
  getCheckInCountByBenchId: (benchId: string) => number;
  getTotalCheckInCount: () => number;
}

const defaultFilters: FilterOptions = {
  minOverallScore: 0,
  minComfortScore: 0,
  minShadeScore: 0,
  minViewScore: 0,
  searchKeyword: '',
  benchTypes: [],
  onlyFavorites: false,
};

export const useBenchStore = create<BenchState>((set, get) => ({
  benches: [],
  comments: [],
  favorites: [],
  checkIns: [],
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
    };
    const benches = [...get().benches, newBench];
    set({ benches });
    saveBenches(benches);
    
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
    const { benches, filters, favorites } = get();
    return benches.filter((bench) => {
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
  },

  getSelectedBench: () => {
    const { benches, selectedBenchId } = get();
    return benches.find((b) => b.id === selectedBenchId);
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
    return get().checkIns.length;
  },
}));
