import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchAllHot, fetchHotPlatform } from '../api/hot';
import { sortPlatforms } from '../constants/platforms';
import type { HotPlatform, HotSource } from '../types/hot';

export interface UseHotListResult {
  platforms: HotPlatform[];
  /** 首次加载（无数据时） */
  loading: boolean;
  /** 全页刷新中（已有数据时） */
  refreshingAll: boolean;
  error: string | null;
  /** 单卡片重试中的平台 source */
  retryingSources: Partial<Record<HotSource, boolean>>;
  /** 重新请求全部平台 GET /api/hot */
  refetch: (options?: { refresh?: boolean }) => void;
  /** 重新请求单平台 GET /api/hot/:source */
  refetchPlatform: (source: HotSource) => void;
}

function mergePlatform(platforms: HotPlatform[], next: HotPlatform): HotPlatform[] {
  const exists = platforms.some((p) => p.source === next.source);
  const merged = exists
    ? platforms.map((p) => (p.source === next.source ? next : p))
    : [...platforms, next];

  return sortPlatforms(merged);
}

/** 一次请求 GET /api/hot，返回全部平台热榜 */
export function useHotList(): UseHotListResult {
  const [platforms, setPlatforms] = useState<HotPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryingSources, setRetryingSources] = useState<Partial<Record<HotSource, boolean>>>({});
  const platformsRef = useRef(platforms);
  platformsRef.current = platforms;

  const refetch = useCallback(async (options?: { refresh?: boolean }) => {
    setError(null);

    if (platformsRef.current.length === 0) {
      setLoading(true);
    } else {
      setRefreshingAll(true);
    }

    try {
      const { platforms: result } = await fetchAllHot({ refresh: options?.refresh });
      setPlatforms(sortPlatforms(result));
    } catch (err) {
      if (platformsRef.current.length === 0) {
        setError(err instanceof Error ? err.message : '加载失败，请稍后重试');
      }
    } finally {
      setLoading(false);
      setRefreshingAll(false);
    }
  }, []);

  const refetchPlatform = useCallback(async (source: HotSource) => {
    setRetryingSources((prev) => ({ ...prev, [source]: true }));

    try {
      const platform = await fetchHotPlatform(source, { refresh: true });
      setPlatforms((prev) => mergePlatform(prev, platform));
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载失败，请稍后重试';
      setPlatforms((prev) => {
        const fallback: HotPlatform = {
          source,
          sourceName: prev.find((p) => p.source === source)?.sourceName ?? source,
          listName: prev.find((p) => p.source === source)?.listName ?? '',
          updatedAt: new Date().toISOString(),
          error: true,
          message,
          items: [],
          fromCache: false,
        };
        return mergePlatform(prev, fallback);
      });
    } finally {
      setRetryingSources((prev) => ({ ...prev, [source]: false }));
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { platforms, loading, refreshingAll, error, retryingSources, refetch, refetchPlatform };
}
