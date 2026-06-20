import type { FilterOptions } from '../types/bench';

export interface ShareMapView {
  lat: number;
  lng: number;
  zoom: number;
}

export interface ShareState {
  filters?: Partial<FilterOptions>;
  mapView?: ShareMapView;
  benchId?: string;
}

export function encodeShareUrl(state: ShareState): string {
  const params = new URLSearchParams();

  if (state.benchId) {
    params.set('bench', state.benchId);
  }

  if (state.mapView) {
    params.set('lat', state.mapView.lat.toFixed(6));
    params.set('lng', state.mapView.lng.toFixed(6));
    params.set('zoom', state.mapView.zoom.toString());
  }

  if (state.filters) {
    const f = state.filters;
    if (f.minOverallScore !== undefined && f.minOverallScore > 0) {
      params.set('mos', f.minOverallScore.toString());
    }
    if (f.minComfortScore !== undefined && f.minComfortScore > 0) {
      params.set('mcs', f.minComfortScore.toString());
    }
    if (f.minShadeScore !== undefined && f.minShadeScore > 0) {
      params.set('mss', f.minShadeScore.toString());
    }
    if (f.minViewScore !== undefined && f.minViewScore > 0) {
      params.set('mvs', f.minViewScore.toString());
    }
    if (f.searchKeyword) {
      params.set('q', f.searchKeyword);
    }
    if (f.benchTypes && f.benchTypes.length > 0) {
      params.set('types', f.benchTypes.join(','));
    }
    if (f.onlyFavorites) {
      params.set('fav', '1');
    }
  }

  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export function decodeShareUrl(): ShareState {
  const params = new URLSearchParams(window.location.search);
  const state: ShareState = {};

  const benchId = params.get('bench');
  if (benchId) {
    state.benchId = benchId;
  }

  const lat = params.get('lat');
  const lng = params.get('lng');
  const zoom = params.get('zoom');
  if (lat && lng && zoom) {
    state.mapView = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      zoom: parseFloat(zoom),
    };
  }

  const filters: Partial<FilterOptions> = {};
  const mos = params.get('mos');
  if (mos) filters.minOverallScore = parseFloat(mos);

  const mcs = params.get('mcs');
  if (mcs) filters.minComfortScore = parseFloat(mcs);

  const mss = params.get('mss');
  if (mss) filters.minShadeScore = parseFloat(mss);

  const mvs = params.get('mvs');
  if (mvs) filters.minViewScore = parseFloat(mvs);

  const q = params.get('q');
  if (q) filters.searchKeyword = q;

  const types = params.get('types');
  if (types) {
    filters.benchTypes = types.split(',') as FilterOptions['benchTypes'];
  }

  const fav = params.get('fav');
  if (fav === '1') {
    filters.onlyFavorites = true;
  }

  if (Object.keys(filters).length > 0) {
    state.filters = filters;
  }

  return state;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

export function hasShareParams(): boolean {
  return window.location.search.length > 0;
}
