import type { HotPlatform } from '../types/hot.js';
import { fetchBilibiliHot } from './bilibili.js';
import { fetchWeiboHot } from './weibo.js';
import { fetchZhihuHot } from './zhihu.js';
import { getPlatformHotMock, HOT_SOURCES } from './platform.js';
import type { HotSource } from './platform.js';
import { getCache, setCache } from '../utils/cache.js';

const ERROR_MESSAGE = '该榜单暂时无法加载，请稍后再试';

const PLATFORM_META: Record<
  HotSource,
  Pick<HotPlatform, 'source' | 'sourceName' | 'listName'>
> = {
  weibo: { source: 'weibo', sourceName: '微博', listName: '微博热搜榜' },
  zhihu: { source: 'zhihu', sourceName: '知乎', listName: '知乎热榜' },
  bilibili: { source: 'bilibili', sourceName: 'B站', listName: 'B站热搜' },
};

const LIVE_FETCHERS: Partial<Record<HotSource, () => Promise<HotPlatform>>> = {
  weibo: fetchWeiboHot,
  zhihu: fetchZhihuHot,
  bilibili: fetchBilibiliHot,
};

function getCacheKey(source: HotSource): string {
  return `${source}:hot`;
}

function createErrorPlatform(source: HotSource, message: string): HotPlatform {
  const meta = PLATFORM_META[source];

  return {
    ...meta,
    updatedAt: new Date().toISOString(),
    error: true,
    message,
    items: [],
    fromCache: false,
  };
}

export interface PlatformHotResult {
  platform: HotPlatform;
  fromCache: boolean;
  cacheHit: boolean;
}

async function getLiveHotCached(
  source: HotSource,
  forceRefresh: boolean,
): Promise<PlatformHotResult> {
  const cacheKey = getCacheKey(source);
  const fetcher = LIVE_FETCHERS[source];

  if (!fetcher) {
    return getPlatformHotCached(source, forceRefresh);
  }

  if (!forceRefresh) {
    const cached = getCache<HotPlatform>(cacheKey);

    if (cached) {
      return { platform: cached, fromCache: true, cacheHit: true };
    }
  }

  try {
    const platform = await fetcher();
    setCache(cacheKey, platform);
    return { platform, fromCache: false, cacheHit: false };
  } catch (err) {
    console.error(`[${source} fetch error]`, err);
    return {
      platform: createErrorPlatform(source, ERROR_MESSAGE),
      fromCache: false,
      cacheHit: false,
    };
  }
}

export function getPlatformHotCached(
  source: HotSource,
  forceRefresh = false,
): PlatformHotResult {
  const cacheKey = getCacheKey(source);

  if (!forceRefresh) {
    const cached = getCache<HotPlatform>(cacheKey);

    if (cached) {
      return { platform: cached, fromCache: true, cacheHit: true };
    }
  }

  const platform = getPlatformHotMock(source);
  setCache(cacheKey, platform);

  return { platform, fromCache: false, cacheHit: false };
}

export async function getPlatformHotCachedAsync(
  source: HotSource,
  forceRefresh = false,
): Promise<PlatformHotResult> {
  if (LIVE_FETCHERS[source]) {
    return getLiveHotCached(source, forceRefresh);
  }

  return getPlatformHotCached(source, forceRefresh);
}

export function getAllPlatformsFallbackErrors(): HotPlatform[] {
  return HOT_SOURCES.map((source) => createErrorPlatform(source, ERROR_MESSAGE));
}

export async function getAllPlatformsHotCached(
  forceRefresh = false,
): Promise<PlatformHotResult[]> {
  // 平台互相隔离：任一平台失败不影响其他平台（符合 TECH_DESIGN 异常隔离）
  const settled = await Promise.allSettled(
    HOT_SOURCES.map((source) => getPlatformHotCachedAsync(source, forceRefresh)),
  );

  return settled.map((result, index) => {
    const source = HOT_SOURCES[index];

    if (result.status === 'fulfilled') {
      return result.value;
    }

    console.error(`[${source} aggregate error]`, result.reason);
    return {
      platform: createErrorPlatform(source, ERROR_MESSAGE),
      fromCache: false,
      cacheHit: false,
    };
  });
}
