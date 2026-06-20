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
  isBanned: boolean;
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

export type ReportReason =
  | 'inappropriate_photo'
  | 'false_information'
  | 'duplicate'
  | 'commercial_spam'
  | 'other';

export interface Report {
  id: string;
  benchId: string;
  benchName: string;
  photoIndex?: number;
  reason: ReportReason;
  description: string;
  reporter: string;
  createdAt: string;
  status: 'pending' | 'ignored' | 'resolved';
  handledAt?: string;
  handledBy?: string;
}

export interface NewReportData {
  benchId: string;
  benchName: string;
  photoIndex?: number;
  reason: ReportReason;
  description: string;
  reporter: string;
}

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  inappropriate_photo: '照片不当',
  false_information: '信息不实',
  duplicate: '重复提交',
  commercial_spam: '商业广告',
  other: '其他原因',
};
