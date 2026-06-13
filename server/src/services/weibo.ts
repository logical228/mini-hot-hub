import type { HotItem, HotPlatform } from '../types/hot.js';

/** 微博热搜 JSON 接口（非 HTML 页面） */
const WEIBO_HOT_SEARCH_URL = 'https://weibo.com/ajax/side/hotSearch';

/** 微博 iOS 客户端 User-Agent（移动端） */
const WEIBO_MOBILE_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Weibo (iPhone14,2__weibo__13.10.0__iphone__os16.0)';

/**
 * Referer：JSON 接口托管在 weibo.com 域下，需使用主站 Referer 才能返回 JSON；
 * 仅设 m.weibo.cn 时服务端 fetch 易被 403。
 */
const WEIBO_REFERER = 'https://weibo.com/';

const FETCH_TIMEOUT_MS = Number(process.env.FETCH_TIMEOUT) || 5000;

/** 上游 realtime 单条结构（仅声明解析用到的字段） */
interface WeiboRealtimeItem {
  word: string;
  word_scheme?: string;
  num?: number;
  realpos?: number;
  rank?: number;
  is_ad?: number;
}

interface WeiboHotSearchResponse {
  ok?: number;
  data?: {
    realtime?: WeiboRealtimeItem[];
  };
}

function formatHeat(num: number | undefined): string | undefined {
  if (num == null || Number.isNaN(num)) {
    return undefined;
  }

  if (num >= 10000) {
    return `${Math.round(num / 10000)}万`;
  }

  return String(num);
}

function buildWeiboSearchUrl(wordScheme: string, word: string): string {
  const query = wordScheme || `#${word}#`;
  return `https://s.weibo.com/weibo?q=${encodeURIComponent(query)}&t=31&band_rank=1&Refer=top`;
}

/**
 * 解析微博热搜 JSON 为 HotItem 列表。
 *
 * 字段映射（接口变更时优先核对此处）：
 * - data.realtime[]          → 热搜条目数组
 * - item.word                → title（热搜词）
 * - item.num                 → heat（格式化为「xx万」）
 * - item.word_scheme         → url 搜索词（缺省回退 #word#）
 * - item.realpos             → rank（缺省用数组序号 + 1）
 * - item.is_ad               → 广告条目，跳过
 */
export function parseWeiboHotSearchResponse(body: WeiboHotSearchResponse): HotItem[] {
  const realtime = body.data?.realtime;

  if (!Array.isArray(realtime) || realtime.length === 0) {
    throw new Error('微博热搜解析失败：data.realtime 为空或不是数组');
  }

  const items: HotItem[] = [];

  for (const [index, entry] of realtime.entries()) {
    if (entry.is_ad) {
      continue;
    }

    const title = entry.word?.trim();
    if (!title) {
      continue;
    }

    const rank = entry.realpos ?? index + 1;
    const wordScheme = entry.word_scheme?.trim() || `#${title}#`;

    items.push({
      rank,
      title,
      heat: formatHeat(entry.num),
      url: buildWeiboSearchUrl(wordScheme, title),
    });
  }

  if (items.length === 0) {
    throw new Error('微博热搜解析失败：过滤后无有效条目');
  }

  return items;
}

/**
 * 请求微博热搜 JSON 并解析为 items。
 */
export async function fetchWeiboHotItems(): Promise<HotItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(WEIBO_HOT_SEARCH_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': WEIBO_MOBILE_USER_AGENT,
        Referer: WEIBO_REFERER,
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(`微博热搜接口返回 HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('json')) {
      throw new Error('微博热搜接口返回非 JSON 内容（可能触发反爬，请勿解析 HTML）');
    }

    let body: WeiboHotSearchResponse;
    try {
      body = (await response.json()) as WeiboHotSearchResponse;
    } catch {
      throw new Error('微博热搜响应 JSON 解析失败');
    }

    if (body.ok !== 1) {
      throw new Error(`微博热搜接口业务失败：ok=${String(body.ok)}`);
    }

    return parseWeiboHotSearchResponse(body);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`微博热搜请求超时（>${FETCH_TIMEOUT_MS}ms）`);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('微博热搜请求发生未知错误');
  } finally {
    clearTimeout(timeoutId);
  }
}

/** 抓取真实微博热搜并封装为 HotPlatform */
export async function fetchWeiboHot(): Promise<HotPlatform> {
  const items = await fetchWeiboHotItems();

  return {
    source: 'weibo',
    sourceName: '微博',
    listName: '微博热搜榜',
    updatedAt: new Date().toISOString(),
    fromCache: false,
    items,
  };
}

/** 本地 Mock（非上游接口，供开发/降级使用） */
export function getWeiboHotMock(): HotPlatform {
  return {
    source: 'weibo',
    sourceName: '微博',
    listName: '微博热搜榜',
    updatedAt: new Date().toISOString(),
    fromCache: false,
    items: [
      { rank: 1, title: '某热点事件持续发酵', url: 'https://s.weibo.com/weibo?q=热点事件', heat: '532万' },
      { rank: 2, title: '另一热点话题上榜', url: 'https://s.weibo.com/weibo?q=热点话题', heat: '218万' },
      { rank: 3, title: '明星官宣引发全网讨论', url: 'https://s.weibo.com/weibo?q=明星官宣', heat: '186万' },
      { rank: 4, title: '科技新品发布会定档', url: 'https://s.weibo.com/weibo?q=科技新品', heat: '142万' },
      { rank: 5, title: '体育赛事决赛精彩瞬间', url: 'https://s.weibo.com/weibo?q=体育赛事', heat: '98万' },
      { rank: 6, title: '城市文旅活动火爆出圈', url: 'https://s.weibo.com/weibo?q=文旅活动', heat: '76万' },
      { rank: 7, title: '职场话题再度引发共鸣', url: 'https://s.weibo.com/weibo?q=职场话题', heat: '65万' },
      { rank: 8, title: '电影票房突破新纪录', url: 'https://s.weibo.com/weibo?q=电影票房', heat: '54万' },
      { rank: 9, title: '教育政策最新解读', url: 'https://s.weibo.com/weibo?q=教育政策', heat: '43万' },
      { rank: 10, title: '美食探店视频刷屏', url: 'https://s.weibo.com/weibo?q=美食探店', heat: '38万' },
    ],
  };
}
