import type { HotCategory } from '../types/hot';

export type CategoryFilter = 'all' | HotCategory;

export interface CategoryTabItem {
  id: CategoryFilter;
  label: string;
}

export const CATEGORY_TABS: CategoryTabItem[] = [
  { id: 'all', label: '全部分类' },
  { id: 'politics', label: '时事政治' },
  { id: 'sports', label: '体育竞技' },
  { id: 'entertainment', label: '文娱明星' },
  { id: 'tech', label: '科技数码' },
];

export const PLATFORM_COLORS: Record<string, string> = {
  weibo: '#E6162D',
  zhihu: '#0084FF',
  bilibili: '#FB7299',
};

export const PLATFORM_TAILWIND: Record<string, string> = {
  weibo: 'text-weibo',
  zhihu: 'text-zhihu',
  bilibili: 'text-bilibili',
};
