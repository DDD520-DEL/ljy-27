import type { Bench, Comment, CheckInRecord, Report } from '../types/bench';
import type { UserProfile } from '../types/user';
import { mockBenches } from '../data/mockBenches';

export interface ExportData {
  version: string;
  exportedAt: string;
  user: UserProfile | null;
  checkIns: CheckInRecord[];
  favorites: string[];
  contributedBenchIds: string[];
  benches: Bench[];
  comments: Comment[];
  reports: Report[];
  photoLikes: Record<string, number>;
}

export interface ImportResult {
  success: boolean;
  message: string;
  stats: {
    checkInsAdded: number;
    checkInsSkipped: number;
    favoritesAdded: number;
    favoritesSkipped: number;
    benchesAdded: number;
    benchesSkipped: number;
    commentsAdded: number;
    commentsSkipped: number;
    reportsAdded: number;
    reportsSkipped: number;
    photoLikesMerged: number;
    photoLikesSkipped: number;
  };
}

const STORAGE_KEY = 'park_bench_data';
const COMMENTS_STORAGE_KEY = 'park_bench_comments';
const FAVORITES_STORAGE_KEY = 'park_bench_favorites';
const CHECKINS_STORAGE_KEY = 'park_bench_checkins';
const USER_STORAGE_KEY = 'park_bench_user';
const CONTRIBUTED_BENCHES_STORAGE_KEY = 'park_bench_contributed';
const REPORTS_STORAGE_KEY = 'park_bench_reports';
const PHOTO_LIKES_STORAGE_KEY = 'park_bench_photo_likes';
const ONBOARDING_STORAGE_KEY = 'park_bench_onboarding_completed';
const DAILY_RECOMMEND_STORAGE_KEY = 'park_bench_daily_recommend';

export function loadPhotoLikes(): Record<string, number> {
  try {
    const stored = localStorage.getItem(PHOTO_LIKES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load photo likes from storage:', e);
  }
  return {};
}

export function savePhotoLikes(photoLikes: Record<string, number>): void {
  try {
    localStorage.setItem(PHOTO_LIKES_STORAGE_KEY, JSON.stringify(photoLikes));
  } catch (e) {
    console.error('Failed to save photo likes to storage:', e);
  }
}

export function loadBenches(): Bench[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load benches from storage:', e);
  }
  saveBenches(mockBenches);
  return mockBenches;
}

export function saveBenches(benches: Bench[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(benches));
  } catch (e) {
    console.error('Failed to save benches to storage:', e);
  }
}

export function loadComments(): Comment[] {
  try {
    const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load comments from storage:', e);
  }
  return [];
}

export function saveComments(comments: Comment[]): void {
  try {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  } catch (e) {
    console.error('Failed to save comments to storage:', e);
  }
}

export function getCommentsByBenchId(benchId: string): Comment[] {
  const comments = loadComments();
  return comments.filter((c) => c.benchId === benchId && !c.isDeleted);
}

export function getCommentCountByBenchId(benchId: string): number {
  const comments = getCommentsByBenchId(benchId);
  let count = 0;
  comments.forEach((comment) => {
    count++;
    count += comment.replies.filter((r) => !r.isDeleted).length;
  });
  return count;
}

export function loadFavorites(): string[] {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load favorites from storage:', e);
  }
  return [];
}

export function saveFavorites(favorites: string[]): void {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to save favorites to storage:', e);
  }
}

export function loadCheckIns(): CheckInRecord[] {
  try {
    const stored = localStorage.getItem(CHECKINS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load check-ins from storage:', e);
  }
  return [];
}

export function saveCheckIns(checkIns: CheckInRecord[]): void {
  try {
    localStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(checkIns));
  } catch (e) {
    console.error('Failed to save check-ins to storage:', e);
  }
}

export function getCheckInCountByBenchId(benchId: string): number {
  const checkIns = loadCheckIns();
  return checkIns.filter((c) => c.benchId === benchId).length;
}

export function loadUser(): UserProfile | null {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load user from storage:', e);
  }
  return null;
}

export function saveUser(user: UserProfile): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user to storage:', e);
  }
}

export function clearUser(): void {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear user from storage:', e);
  }
}

export function loadContributedBenches(): string[] {
  try {
    const stored = localStorage.getItem(CONTRIBUTED_BENCHES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load contributed benches from storage:', e);
  }
  return [];
}

export function saveContributedBenches(benchIds: string[]): void {
  try {
    localStorage.setItem(CONTRIBUTED_BENCHES_STORAGE_KEY, JSON.stringify(benchIds));
  } catch (e) {
    console.error('Failed to save contributed benches to storage:', e);
  }
}

export function loadReports(): Report[] {
  try {
    const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load reports from storage:', e);
  }
  return [];
}

export function saveReports(reports: Report[]): void {
  try {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports to storage:', e);
  }
}

export function getPendingReports(): Report[] {
  const reports = loadReports();
  return reports.filter((r) => r.status === 'pending').sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getReportsByBenchId(benchId: string): Report[] {
  const reports = loadReports();
  return reports.filter((r) => r.benchId === benchId);
}

const EXPORT_VERSION = '1.0';

export function exportAllData(): ExportData {
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    user: loadUser(),
    checkIns: loadCheckIns(),
    favorites: loadFavorites(),
    contributedBenchIds: loadContributedBenches(),
    benches: loadBenches(),
    comments: loadComments(),
    reports: loadReports(),
    photoLikes: loadPhotoLikes(),
  };
}

function isValidDateString(str: string): boolean {
  const date = new Date(str);
  return !isNaN(date.getTime());
}

function validateBench(bench: unknown): bench is Bench {
  if (typeof bench !== 'object' || bench === null) return false;
  const b = bench as Record<string, unknown>;
  return (
    typeof b.id === 'string' &&
    typeof b.lat === 'number' &&
    typeof b.lng === 'number' &&
    typeof b.parkName === 'string' &&
    typeof b.locationDesc === 'string' &&
    typeof b.benchType === 'string' &&
    typeof b.comfortScore === 'number' &&
    typeof b.shadeScore === 'number' &&
    typeof b.viewScore === 'number' &&
    typeof b.overallScore === 'number' &&
    Array.isArray(b.photos) &&
    typeof b.note === 'string' &&
    typeof b.createdAt === 'string' &&
    isValidDateString(b.createdAt) &&
    typeof b.checkinCount === 'number' &&
    typeof b.isBanned === 'boolean'
  );
}

function validateCheckInRecord(record: unknown): record is CheckInRecord {
  if (typeof record !== 'object' || record === null) return false;
  const r = record as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.benchId === 'string' &&
    typeof r.parkName === 'string' &&
    typeof r.locationDesc === 'string' &&
    typeof r.benchType === 'string' &&
    typeof r.comfortScore === 'number' &&
    typeof r.shadeScore === 'number' &&
    typeof r.viewScore === 'number' &&
    typeof r.overallScore === 'number' &&
    Array.isArray(r.photos) &&
    typeof r.note === 'string' &&
    typeof r.createdAt === 'string' &&
    isValidDateString(r.createdAt)
  );
}

function validateReply(reply: unknown): reply is { id: string; content: string; author: string; createdAt: string; replyTo?: string; isDeleted: boolean } {
  if (typeof reply !== 'object' || reply === null) return false;
  const r = reply as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.content === 'string' &&
    typeof r.author === 'string' &&
    typeof r.createdAt === 'string' &&
    isValidDateString(r.createdAt) &&
    typeof r.isDeleted === 'boolean'
  );
}

function validateComment(comment: unknown): comment is Comment {
  if (typeof comment !== 'object' || comment === null) return false;
  const c = comment as Record<string, unknown>;
  return (
    typeof c.id === 'string' &&
    typeof c.benchId === 'string' &&
    typeof c.content === 'string' &&
    typeof c.author === 'string' &&
    typeof c.createdAt === 'string' &&
    isValidDateString(c.createdAt) &&
    Array.isArray(c.replies) &&
    (c.replies as unknown[]).every(validateReply) &&
    typeof c.isDeleted === 'boolean'
  );
}

function validateReport(report: unknown): report is Report {
  if (typeof report !== 'object' || report === null) return false;
  const r = report as Record<string, unknown>;
  const validStatuses = ['pending', 'ignored', 'resolved'];
  if (
    typeof r.id !== 'string' ||
    typeof r.benchId !== 'string' ||
    typeof r.benchName !== 'string' ||
    typeof r.reason !== 'string' ||
    typeof r.description !== 'string' ||
    typeof r.reporter !== 'string' ||
    typeof r.createdAt !== 'string' ||
    !isValidDateString(r.createdAt) ||
    typeof r.status !== 'string' ||
    !validStatuses.includes(r.status)
  ) {
    return false;
  }
  if (r.status !== 'pending') {
    if (
      typeof r.handledAt !== 'string' ||
      !isValidDateString(r.handledAt) ||
      typeof r.handledBy !== 'string'
    ) {
      return false;
    }
  }
  return true;
}

function validateExportData(data: unknown): data is ExportData {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;

  if (typeof d.version !== 'string') return false;
  if (typeof d.exportedAt !== 'string' || !isValidDateString(d.exportedAt)) return false;

  if (d.user !== null && typeof d.user !== 'object') return false;
  if (d.user && typeof d.user === 'object') {
    const u = d.user as Record<string, unknown>;
    if (typeof u.id !== 'string' || typeof u.nickname !== 'string' || typeof u.avatar !== 'string' || typeof u.createdAt !== 'string') {
      return false;
    }
  }

  if (!Array.isArray(d.checkIns) || !d.checkIns.every(validateCheckInRecord)) return false;
  if (!Array.isArray(d.favorites) || !d.favorites.every((f) => typeof f === 'string')) return false;
  if (!Array.isArray(d.contributedBenchIds) || !d.contributedBenchIds.every((id) => typeof id === 'string')) return false;
  if (!Array.isArray(d.benches) || !d.benches.every(validateBench)) return false;
  if (!Array.isArray(d.comments) || !d.comments.every(validateComment)) return false;
  if (!Array.isArray(d.reports) || !d.reports.every(validateReport)) return false;
  if (typeof d.photoLikes !== 'object' || d.photoLikes === null) return false;

  return true;
}

export function importData(jsonString: string): ImportResult {
  const result: ImportResult = {
    success: false,
    message: '',
    stats: {
      checkInsAdded: 0,
      checkInsSkipped: 0,
      favoritesAdded: 0,
      favoritesSkipped: 0,
      benchesAdded: 0,
      benchesSkipped: 0,
      commentsAdded: 0,
      commentsSkipped: 0,
      reportsAdded: 0,
      reportsSkipped: 0,
      photoLikesMerged: 0,
      photoLikesSkipped: 0,
    },
  };

  let data: unknown;
  try {
    data = JSON.parse(jsonString);
  } catch {
    result.message = '文件格式错误，无法解析 JSON';
    return result;
  }

  if (!validateExportData(data)) {
    result.message = '数据格式无效或不完整';
    return result;
  }

  const existingBenches = loadBenches();
  const existingCheckIns = loadCheckIns();
  const existingFavorites = loadFavorites();
  const existingComments = loadComments();
  const existingReports = loadReports();
  const existingContributed = loadContributedBenches();
  const existingPhotoLikes = loadPhotoLikes();

  const existingBenchIds = new Set(existingBenches.map((b) => b.id));
  const existingCheckInIds = new Set(existingCheckIns.map((c) => c.id));
  const existingFavoriteSet = new Set(existingFavorites);
  const existingCommentIds = new Set(existingComments.map((c) => c.id));
  const existingReportIds = new Set(existingReports.map((r) => r.id));
  const existingContributedSet = new Set(existingContributed);

  const newBenches: Bench[] = [];
  for (const bench of data.benches) {
    if (!existingBenchIds.has(bench.id)) {
      newBenches.push(bench);
      existingBenchIds.add(bench.id);
      result.stats.benchesAdded++;
    } else {
      result.stats.benchesSkipped++;
    }
  }
  if (newBenches.length > 0) {
    saveBenches([...existingBenches, ...newBenches]);
  }

  const newCheckIns: CheckInRecord[] = [];
  for (const checkIn of data.checkIns) {
    if (!existingCheckInIds.has(checkIn.id)) {
      newCheckIns.push(checkIn);
      existingCheckInIds.add(checkIn.id);
      result.stats.checkInsAdded++;
    } else {
      result.stats.checkInsSkipped++;
    }
  }
  if (newCheckIns.length > 0) {
    saveCheckIns([...existingCheckIns, ...newCheckIns]);
  }

  const newFavorites: string[] = [];
  for (const fav of data.favorites) {
    if (!existingFavoriteSet.has(fav) && existingBenchIds.has(fav)) {
      newFavorites.push(fav);
      existingFavoriteSet.add(fav);
      result.stats.favoritesAdded++;
    } else {
      result.stats.favoritesSkipped++;
    }
  }
  if (newFavorites.length > 0) {
    saveFavorites([...existingFavorites, ...newFavorites]);
  }

  const newComments: Comment[] = [];
  for (const comment of data.comments) {
    if (!existingCommentIds.has(comment.id) && existingBenchIds.has(comment.benchId)) {
      newComments.push(comment);
      existingCommentIds.add(comment.id);
      result.stats.commentsAdded++;
    } else {
      result.stats.commentsSkipped++;
    }
  }
  if (newComments.length > 0) {
    saveComments([...existingComments, ...newComments]);
  }

  const newReports: Report[] = [];
  for (const report of data.reports) {
    if (!existingReportIds.has(report.id) && existingBenchIds.has(report.benchId)) {
      newReports.push(report);
      existingReportIds.add(report.id);
      result.stats.reportsAdded++;
    } else {
      result.stats.reportsSkipped++;
    }
  }
  if (newReports.length > 0) {
    saveReports([...existingReports, ...newReports]);
  }

  let hasNewContributed = false;
  for (const benchId of data.contributedBenchIds) {
    if (!existingContributedSet.has(benchId) && existingBenchIds.has(benchId)) {
      existingContributed.push(benchId);
      existingContributedSet.add(benchId);
      hasNewContributed = true;
    }
  }
  if (hasNewContributed) {
    saveContributedBenches(existingContributed);
  }

  const currentUser = loadUser();
  if (!currentUser && data.user) {
    saveUser(data.user);
  }

  const mergedPhotoLikes = { ...existingPhotoLikes };
  for (const [key, count] of Object.entries(data.photoLikes)) {
    if (!mergedPhotoLikes[key] || count > mergedPhotoLikes[key]) {
      mergedPhotoLikes[key] = count;
      result.stats.photoLikesMerged++;
    } else {
      result.stats.photoLikesSkipped++;
    }
  }
  if (result.stats.photoLikesMerged > 0) {
    savePhotoLikes(mergedPhotoLikes);
  }

  result.success = true;
  const totalAdded =
    result.stats.benchesAdded +
    result.stats.checkInsAdded +
    result.stats.favoritesAdded +
    result.stats.commentsAdded +
    result.stats.reportsAdded +
    result.stats.photoLikesMerged;

  if (totalAdded === 0) {
    result.message = '导入完成，没有新增数据（所有数据已存在）';
  } else {
    result.message = `导入成功！新增 ${totalAdded} 条数据`;
  }

  return result;
}

export function downloadExportFile(data: ExportData): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const date = new Date(data.exportedAt);
  const dateStr = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  const fileName = `park-bench-backup-${dateStr}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function hasCompletedOnboarding(): boolean {
  try {
    const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    return stored === 'true';
  } catch (e) {
    console.error('Failed to load onboarding status:', e);
  }
  return false;
}

export function setOnboardingCompleted(): void {
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  } catch (e) {
    console.error('Failed to save onboarding status:', e);
  }
}

export function resetOnboarding(): void {
  try {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset onboarding status:', e);
  }
}

interface DailyRecommendData {
  date: string;
  benchIds: string[];
}

function getTodayString(): string {
  const today = new Date();
  return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
}

function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getDailyRecommendBenches(allBenches: Bench[]): Bench[] {
  const today = getTodayString();

  try {
    const stored = localStorage.getItem(DAILY_RECOMMEND_STORAGE_KEY);
    if (stored) {
      const data: DailyRecommendData = JSON.parse(stored);
      if (data.date === today) {
        const recommended = data.benchIds
          .map((id) => allBenches.find((b) => b.id === id && !b.isBanned))
          .filter((b): b is Bench => b !== undefined);
        if (recommended.length === 3) {
          return recommended;
        }
      }
    }
  } catch (e) {
    console.error('Failed to load daily recommend data:', e);
  }

  const availableBenches = allBenches.filter((b) => !b.isBanned);
  if (availableBenches.length <= 3) {
    const result = availableBenches.slice(0, 3);
    const data: DailyRecommendData = {
      date: today,
      benchIds: result.map((b) => b.id),
    };
    try {
      localStorage.setItem(DAILY_RECOMMEND_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save daily recommend data:', e);
    }
    return result;
  }

  const seed = hashString(today);
  const random = seededRandom(seed);

  const shuffled = [...availableBenches];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const result = shuffled.slice(0, 3);

  const data: DailyRecommendData = {
    date: today,
    benchIds: result.map((b) => b.id),
  };
  try {
    localStorage.setItem(DAILY_RECOMMEND_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save daily recommend data:', e);
  }

  return result;
}
