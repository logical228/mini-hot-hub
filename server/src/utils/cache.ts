interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const store = new Map<string, CacheEntry>();

const DEFAULT_TTL_SEC = 600;

export function getDefaultTtlSec(): number {
  const parsed = Number(process.env.CACHE_TTL);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TTL_SEC;
}

export function getCache<T>(key: string): T | null {
  const entry = store.get(key);

  if (!entry) {
    return null;
  }

  if (Date.now() >= entry.expiresAt) {
    store.delete(key);
    return null;
  }

  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlSec?: number): void {
  const ttl = ttlSec ?? getDefaultTtlSec();

  store.set(key, {
    data,
    expiresAt: Date.now() + ttl * 1000,
  });
}
