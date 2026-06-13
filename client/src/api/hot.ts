import type { HotAggregateResponse, HotPlatform, HotSource } from '../types/hot';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function fetchHotPlatform(source: HotSource | string): Promise<HotPlatform> {
  return request<HotPlatform>(`/hot/${source}`);
}

export function fetchAllHot(): Promise<HotAggregateResponse> {
  return request<HotAggregateResponse>('/hot');
}
