import type { Bench, Comment, CheckInRecord } from '../types/bench';
import { mockBenches } from '../data/mockBenches';

const STORAGE_KEY = 'park_bench_data';
const COMMENTS_STORAGE_KEY = 'park_bench_comments';
const FAVORITES_STORAGE_KEY = 'park_bench_favorites';
const CHECKINS_STORAGE_KEY = 'park_bench_checkins';

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
