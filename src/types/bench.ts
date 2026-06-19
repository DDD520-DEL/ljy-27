export type BenchType = 'stone' | 'wood' | 'other';

export interface Bench {
  id: string;
  lat: number;
  lng: number;
  parkName: string;
  locationDesc: string;
  benchType: BenchType;
  comfortScore: number;
  shadeScore: number;
  viewScore: number;
  overallScore: number;
  photos: string[];
  note: string;
  createdAt: string;
  checkinCount: number;
}

export interface FilterOptions {
  minOverallScore: number;
  minComfortScore: number;
  minShadeScore: number;
  minViewScore: number;
  searchKeyword: string;
  benchTypes: BenchType[];
}

export interface NewBenchData {
  lat: number;
  lng: number;
  parkName: string;
  locationDesc: string;
  benchType: BenchType;
  comfortScore: number;
  shadeScore: number;
  viewScore: number;
  photos: string[];
  note: string;
}
