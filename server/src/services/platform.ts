import type { HotPlatform } from '../types/hot.js';
import { getBilibiliHotMock } from './bilibili.js';
import { getWeiboHotMock } from './weibo.js';
import { getZhihuHotMock } from './zhihu.js';

export type HotSource = 'weibo' | 'zhihu' | 'bilibili';

const PLATFORM_GETTERS: Record<HotSource, () => HotPlatform> = {
  weibo: getWeiboHotMock,
  zhihu: getZhihuHotMock,
  bilibili: getBilibiliHotMock,
};

export const HOT_SOURCES = Object.keys(PLATFORM_GETTERS) as HotSource[];

export function isHotSource(source: string): source is HotSource {
  return HOT_SOURCES.includes(source as HotSource);
}

export function getPlatformHotMock(source: HotSource): HotPlatform {
  return PLATFORM_GETTERS[source]();
}

export function getAllPlatformsHotMock(): HotPlatform[] {
  return HOT_SOURCES.map((source) => getPlatformHotMock(source));
}
