import type { HotPlatform } from '../types/hot';

/** 骨架屏占位，仅用于 loading 态，非数据来源 */
export const PLATFORM_PLACEHOLDERS: Pick<HotPlatform, 'source' | 'sourceName' | 'listName'>[] = [
  { source: 'weibo', sourceName: '微博', listName: '微博热搜榜' },
  { source: 'zhihu', sourceName: '知乎', listName: '知乎热榜' },
  { source: 'bilibili', sourceName: 'B站', listName: 'B站热搜' },
];

export const PLATFORM_ORDER = ['weibo', 'zhihu', 'bilibili'] as const;

export function sortPlatforms(platforms: HotPlatform[]): HotPlatform[] {
  const order = PLATFORM_ORDER as readonly string[];
  return [...platforms].sort(
    (a, b) => order.indexOf(a.source) - order.indexOf(b.source),
  );
}
