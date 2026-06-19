import { create } from 'zustand';
import type { Bench, FilterOptions, NewBenchData, Comment, NewCommentData, NewReplyData } from '../types/bench';
import { loadBenches, saveBenches, loadComments, saveComments, getCommentsByBenchId, getCommentCountByBenchId } from '../utils/storage';
import { calculateOverallScore, generateId } from '../utils/score';

interface BenchState {
  benches: Bench[];
  comments: Comment[];
  selectedBenchId: string | null;
  filters: FilterOptions;
  isFilterOpen: boolean;
  isDetailOpen: boolean;

  initBenches: () => void;
  initComments: () => void;
  setSelectedBench: (id: string | null) => void;
  addBench: (data: NewBenchData) => void;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  toggleFilter: () => void;
  toggleDetail: () => void;
  getFilteredBenches: () => Bench[];
  getSelectedBench: () => Bench | undefined;
  addComment: (data: NewCommentData) => void;
  addReply: (data: NewReplyData) => void;
  deleteComment: (commentId: string, benchId: string) => void;
  deleteReply: (commentId: string, replyId: string, benchId: string) => void;
  getCommentsByBenchId: (benchId: string) => Comment[];
  getCommentCountByBenchId: (benchId: string) => number;
}

const defaultFilters: FilterOptions = {
  minOverallScore: 0,
  minComfortScore: 0,
  minShadeScore: 0,
  minViewScore: 0,
  searchKeyword: '',
  benchTypes: [],
};

export const useBenchStore = create<BenchState>((set, get) => ({
  benches: [],
  comments: [],
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

  getFilteredBenches: () => {
    const { benches, filters } = get();
    return benches.filter((bench) => {
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
}));
