import { useCallback, useEffect, useState } from 'react';
import { fetchAllHot } from '../api/hot';
import { sortPlatforms } from '../constants/platforms';
import type { HotPlatform } from '../types/hot';

export interface UseHotListResult {
  platforms: HotPlatform[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** 一次请求 GET /api/hot，返回全部平台热榜 */
export function useHotList(): UseHotListResult {
  const [platforms, setPlatforms] = useState<HotPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { platforms: result } = await fetchAllHot();
      setPlatforms(sortPlatforms(result));
    } catch (err) {
      setPlatforms([]);
      setError(err instanceof Error ? err.message : '加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { platforms, loading, error, refetch };
}
