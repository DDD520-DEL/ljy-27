import { create } from 'zustand';
import type { Bench, FilterOptions, NewBenchData } from '../types/bench';
import { loadBenches, saveBenches } from '../utils/storage';
import { calculateOverallScore, generateId } from '../utils/score';

interface BenchState {
  benches: Bench[];
  selectedBenchId: string | null;
  filters: FilterOptions;
  isFilterOpen: boolean;
  isDetailOpen: boolean;

  initBenches: () => void;
  setSelectedBench: (id: string | null) => void;
  addBench: (data: NewBenchData) => void;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  toggleFilter: () => void;
  toggleDetail: () => void;
  getFilteredBenches: () => Bench[];
  getSelectedBench: () => Bench | undefined;
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
  selectedBenchId: null,
  filters: defaultFilters,
  isFilterOpen: false,
  isDetailOpen: false,

  initBenches: () => {
    const benches = loadBenches();
    set({ benches });
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
}));
