import type { HotAggregateResponse, HotPlatform, HotSource } from '../types/hot';
import { getApiBase } from './config';

const API_BASE = getApiBase();

interface FetchOptions {
  /** 开发环境跳过缓存，重试时建议开启 */
  refresh?: boolean;
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function withRefreshQuery(path: string, options?: FetchOptions): string {
  if (!options?.refresh) {
    return path;
  }
  return `${path}?refresh=1`;
}

export function fetchHotPlatform(
  source: HotSource | string,
  options?: FetchOptions,
): Promise<HotPlatform> {
  return request<HotPlatform>(withRefreshQuery(`/hot/${source}`, options));
}

export function fetchAllHot(options?: FetchOptions): Promise<HotAggregateResponse> {
  return request<HotAggregateResponse>(withRefreshQuery('/hot', options));
}
