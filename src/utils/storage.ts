import type { Bench } from '../types/bench';
import { mockBenches } from '../data/mockBenches';

const STORAGE_KEY = 'park_bench_data';

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
