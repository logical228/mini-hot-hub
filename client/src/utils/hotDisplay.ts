import type { CategoryFilter } from '../constants/categories';
import type { HotPlatform } from '../types/hot';

export function filterPlatformByCategory(
  platform: HotPlatform,
  category: CategoryFilter,
): HotPlatform {
  if (category === 'all') {
    return platform;
  }

  return {
    ...platform,
    items: platform.items.filter((item) => item.category === category),
  };
}

export function filterPlatformsByCategory(
  platforms: HotPlatform[],
  category: CategoryFilter,
): HotPlatform[] {
  return platforms.map((platform) => filterPlatformByCategory(platform, category));
}

export function getRankStyles(rank: number, isCyber = false) {
  if (isCyber) {
    return { item: '', rank: '', title: 'text-sm' };
  }

  if (rank === 1) {
    return {
      item: 'bg-gradient-to-r from-amber-50/80 to-transparent dark:from-amber-950/30',
      rank: 'h-7 w-7 text-sm font-bold text-amber-900 bg-gradient-to-br from-amber-200 to-amber-400 shadow-sm dark:text-amber-950',
      title: 'font-semibold text-[0.9375rem]',
    };
  }
  if (rank === 2) {
    return {
      item: 'bg-gradient-to-r from-gray-100/80 to-transparent dark:from-gray-800/40',
      rank: 'h-7 w-7 text-sm font-bold text-gray-600 bg-gradient-to-br from-gray-200 to-gray-300 shadow-sm dark:text-gray-200',
      title: 'font-semibold text-[0.9375rem]',
    };
  }
  if (rank === 3) {
    return {
      item: 'bg-gradient-to-r from-orange-50/80 to-transparent dark:from-orange-950/25',
      rank: 'h-7 w-7 text-sm font-bold text-orange-900 bg-gradient-to-br from-orange-200 to-orange-400 shadow-sm dark:text-orange-950',
      title: 'font-semibold text-[0.9375rem]',
    };
  }
  return {
    item: '',
    rank: 'h-6 w-6 text-xs font-semibold text-text-muted',
    title: 'text-sm font-normal',
  };
}
