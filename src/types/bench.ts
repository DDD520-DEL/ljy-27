export type BenchType = 'stone' | 'wood' | 'other';

export type SortBy =
  | 'overall'
  | 'comfort'
  | 'shade'
  | 'view'
  | 'newest'
  | 'popular';

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
  onlyFavorites: boolean;
  sortBy: SortBy;
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

export interface Reply {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  replyTo?: string;
  isDeleted: boolean;
}

export interface Comment {
  id: string;
  benchId: string;
  content: string;
  author: string;
  createdAt: string;
  replies: Reply[];
  isDeleted: boolean;
}

export interface NewCommentData {
  benchId: string;
  content: string;
  author: string;
}

export interface NewReplyData {
  commentId: string;
  benchId: string;
  content: string;
  author: string;
  replyTo?: string;
}

export interface CheckInRecord {
  id: string;
  benchId: string;
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
}
