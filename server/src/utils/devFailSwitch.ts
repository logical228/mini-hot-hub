import type { HotSource } from '../services/platform.js';

const TRUTHY = new Set(['1', 'true', 'yes', 'on']);

function isTruthy(value: string | undefined): boolean {
  if (!value) {
    return false;
  }
  return TRUTHY.has(value.toLowerCase());
}

export function isDevMode(): boolean {
  return process.env.NODE_ENV !== 'production';
}

/** 开发环境：MOCK_FAIL_WEIBO / MOCK_FAIL_ZHIHU / MOCK_FAIL_BILIBILI / MOCK_FAIL_ALL */
export function isDevMockFailEnabled(source: HotSource): boolean {
  if (!isDevMode()) {
    return false;
  }

  if (isTruthy(process.env.MOCK_FAIL_ALL)) {
    return true;
  }

  const envKey = `MOCK_FAIL_${source.toUpperCase()}` as
    | 'MOCK_FAIL_WEIBO'
    | 'MOCK_FAIL_ZHIHU'
    | 'MOCK_FAIL_BILIBILI';

  return isTruthy(process.env[envKey]);
}

/** 开发环境模拟上游抓取失败，生产环境永不触发 */
export function assertDevFetchNotMockFailed(source: HotSource): void {
  if (!isDevMockFailEnabled(source)) {
    return;
  }

  const flag =
    isTruthy(process.env.MOCK_FAIL_ALL) ? 'MOCK_FAIL_ALL' : `MOCK_FAIL_${source.toUpperCase()}`;

  throw new Error(`[dev] 模拟 ${source} 抓取失败（${flag}=1，仅开发环境生效）`);
}

export function listActiveDevMockFails(): HotSource[] {
  if (!isDevMode()) {
    return [];
  }

  const sources: HotSource[] = ['weibo', 'zhihu', 'bilibili'];
  return sources.filter(isDevMockFailEnabled);
}
