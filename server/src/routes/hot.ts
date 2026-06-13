import { Router } from 'express';
import {
  getAllPlatformsFallbackErrors,
  getAllPlatformsHotCached,
  getPlatformHotCachedAsync,
} from '../services/hotCache.js';
import { isHotSource } from '../services/platform.js';

const router = Router();

function isForceRefresh(refresh: unknown): boolean {
  return process.env.NODE_ENV !== 'production' && refresh === '1';
}

router.get('/', async (req, res) => {
  const forceRefresh = isForceRefresh(req.query.refresh);

  try {
    const results = await getAllPlatformsHotCached(forceRefresh);
    const allHit = results.every((result) => result.cacheHit);

    if (allHit && results.length > 0) {
      console.log('[cache hit] aggregate (all platforms)');
    }

    res.setHeader('X-Cache', allHit ? 'HIT' : 'MISS');
    // 始终 200：失败平台 error: true + items: []，成功平台正常返回
    res.json({
      platforms: results.map(({ platform, fromCache }) => ({
        ...platform,
        fromCache,
      })),
    });
  } catch (err) {
    console.error('[aggregate hot fatal error]', err);
    res.setHeader('X-Cache', 'MISS');
    res.status(200).json({
      platforms: getAllPlatformsFallbackErrors().map((platform) => ({
        ...platform,
        fromCache: false,
      })),
    });
  }
});

router.get('/:source', async (req, res) => {
  const { source } = req.params;

  if (!isHotSource(source)) {
    res.status(404).json({ error: true, message: `平台不存在: ${source}` });
    return;
  }

  const forceRefresh = isForceRefresh(req.query.refresh);
  const { platform, fromCache, cacheHit } = await getPlatformHotCachedAsync(
    source,
    forceRefresh,
  );

  if (cacheHit) {
    console.log(`[cache hit] ${source}:hot`);
  }

  res.setHeader('X-Cache', cacheHit ? 'HIT' : 'MISS');
  res.json({ ...platform, fromCache });
});

export default router;
