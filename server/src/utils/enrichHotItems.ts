import type { HotCategory, HotItem, HotPlatform } from '../types/hot.js';

const CATEGORY_KEYWORDS: Record<HotCategory, string[]> = {
  politics: [
    '政治', '政府', '选举', '外交', '政策', '法律', '法院', '国务院', '两会',
    '国际', '战争', '峰会', '总统', '总理', '制裁', '条约', '国防', '台海',
  ],
  sports: [
    '体育', '足球', '篮球', '奥运', '比赛', '冠军', '决赛', '球员', '联赛',
    'FIFA', 'NBA', '世界杯', '网球', '游泳', '田径', '电竞', '赛事', '进球',
  ],
  tech: [
    '科技', '数码', 'AI', '手机', '芯片', '互联网', '发布会', '苹果', '华为',
    '小米', '自动驾驶', '游戏', '编程', '算法', '大模型', 'GPT', '新能源',
    '机器人', '5G', '半导体', '软件', '硬件', 'DeepSeek',
  ],
  entertainment: [
    '明星', '电影', '综艺', '演唱会', '官宣', '票房', '八卦', '粉丝', '剧',
    '网红', '娱乐', '歌手', '演员', '恋爱', '离婚', '红毯', 'MV', '直播',
  ],
};

/** 基于标题关键词推断分类，无匹配时回退文娱 */
export function inferCategory(title: string): HotCategory {
  const normalized = title.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [HotCategory, string[]][]) {
    if (keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))) {
      return category;
    }
  }

  return 'entertainment';
}

export function enrichHotItem(item: HotItem): HotItem {
  return {
    ...item,
    category: item.category ?? inferCategory(item.title),
  };
}

export function enrichHotItems(items: HotItem[]): HotItem[] {
  return items.map(enrichHotItem);
}

export function enrichPlatform(platform: HotPlatform): HotPlatform {
  if (platform.error || platform.items.length === 0) {
    return platform;
  }

  return {
    ...platform,
    items: enrichHotItems(platform.items),
  };
}
