import type { HotItem, HotPlatform } from '../types/hot.js';

/** B站热搜 JSON 接口（非 HTML 页面） */
const BILIBILI_HOT_SEARCH_URL =
  'https://api.bilibili.com/x/web-interface/search/square?limit=50';

/** B站移动端 User-Agent */
const BILIBILI_MOBILE_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/604.1 BiliApp/75800100';

const BILIBILI_REFERER = 'https://www.bilibili.com/';

const FETCH_TIMEOUT_MS = Number(process.env.FETCH_TIMEOUT) || 5000;

interface BilibiliTrendingItem {
  keyword?: string;
  show_name?: string;
  heat_score?: number;
  uri?: string;
  goto?: string;
}

interface BilibiliHotSearchResponse {
  code?: number;
  message?: string;
  data?: {
    trending?: {
      list?: BilibiliTrendingItem[];
    };
  };
}

function formatHeat(score: number | undefined): string | undefined {
  if (score == null || Number.isNaN(score)) {
    return undefined;
  }

  if (score >= 10000) {
    const wan = score / 10000;
    return wan >= 100 ? `${Math.round(wan)}万` : `${wan.toFixed(1)}万`;
  }

  return String(score);
}

function buildBilibiliUrl(keyword: string, uri?: string): string {
  const trimmedUri = uri?.trim();
  if (trimmedUri) {
    if (trimmedUri.startsWith('http')) {
      return trimmedUri;
    }
    return `https://www.bilibili.com${trimmedUri.startsWith('/') ? trimmedUri : `/${trimmedUri}`}`;
  }

  return `https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`;
}

/**
 * 解析 B站热搜 JSON 为 HotItem 列表。
 *
 * 字段映射（接口变更时优先核对此处）：
 * - data.trending.list[]  → 热搜条目数组
 * - item.show_name        → title（展示名，缺省回退 keyword）
 * - item.keyword          → title 备用 / url 搜索词
 * - item.heat_score       → heat（格式化为「xx万」）
 * - item.uri              → url（有值时跳转原文，否则搜索页）
 * - 数组下标 + 1          → rank
 */
export function parseBilibiliHotSearchResponse(body: BilibiliHotSearchResponse): HotItem[] {
  const list = body.data?.trending?.list;

  if (!Array.isArray(list) || list.length === 0) {
    throw new Error('B站热搜解析失败：data.trending.list 为空或不是数组');
  }

  const items: HotItem[] = [];

  for (const [index, entry] of list.entries()) {
    const title = (entry.show_name ?? entry.keyword)?.trim();
    if (!title) {
      continue;
    }

    items.push({
      rank: index + 1,
      title,
      heat: formatHeat(entry.heat_score),
      url: buildBilibiliUrl(title, entry.uri),
    });
  }

  if (items.length === 0) {
    throw new Error('B站热搜解析失败：过滤后无有效条目');
  }

  return items;
}

/**
 * 请求 B站热搜 JSON 并解析为 items。
 */
export async function fetchBilibiliHotItems(): Promise<HotItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(BILIBILI_HOT_SEARCH_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': BILIBILI_MOBILE_USER_AGENT,
        Referer: BILIBILI_REFERER,
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(`B站热搜接口返回 HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('json')) {
      throw new Error('B站热搜接口返回非 JSON 内容（可能触发反爬，请勿解析 HTML）');
    }

    let body: BilibiliHotSearchResponse;
    try {
      body = (await response.json()) as BilibiliHotSearchResponse;
    } catch {
      throw new Error('B站热搜响应 JSON 解析失败');
    }

    if (body.code !== 0) {
      throw new Error(`B站热搜接口业务失败：code=${String(body.code)} message=${body.message ?? ''}`);
    }

    return parseBilibiliHotSearchResponse(body);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`B站热搜请求超时（>${FETCH_TIMEOUT_MS}ms）`);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('B站热搜请求发生未知错误');
  } finally {
    clearTimeout(timeoutId);
  }
}

/** 抓取真实 B站热搜并封装为 HotPlatform */
export async function fetchBilibiliHot(): Promise<HotPlatform> {
  const items = await fetchBilibiliHotItems();

  return {
    source: 'bilibili',
    sourceName: 'B站',
    listName: 'B站热搜',
    updatedAt: new Date().toISOString(),
    fromCache: false,
    items,
  };
}

/** 本地 Mock（非上游接口，供开发/降级使用） */
export function getBilibiliHotMock(): HotPlatform {
  return {
    source: 'bilibili',
    sourceName: 'B站',
    listName: 'B站热搜',
    updatedAt: new Date().toISOString(),
    fromCache: false,
    items: [
      { rank: 1, title: '【整活】UP 主挑战 24 小时不眨眼', url: 'https://www.bilibili.com/video/BV1000001', heat: '245.6万' },
      { rank: 2, title: '原神新版本深度测评', url: 'https://www.bilibili.com/video/BV1000002', heat: '198.3万' },
      { rank: 3, title: '一口气看完经典动漫解说', url: 'https://www.bilibili.com/video/BV1000003', heat: '176.1万' },
      { rank: 4, title: '程序员的一天 Vlog', url: 'https://www.bilibili.com/video/BV1000004', heat: '152.8万' },
      { rank: 5, title: '美食 UP 主复刻国宴菜', url: 'https://www.bilibili.com/video/BV1000005', heat: '134.5万' },
      { rank: 6, title: '考研上岸经验全分享', url: 'https://www.bilibili.com/video/BV1000006', heat: '112.2万' },
      { rank: 7, title: '手工区大神新作发布', url: 'https://www.bilibili.com/video/BV1000007', heat: '98.7万' },
      { rank: 8, title: '科技区年度盘点 TOP10', url: 'https://www.bilibili.com/video/BV1000008', heat: '87.4万' },
      { rank: 9, title: '舞蹈区热门翻跳合集', url: 'https://www.bilibili.com/video/BV1000009', heat: '76.9万' },
      { rank: 10, title: '知识区科普：量子计算入门', url: 'https://www.bilibili.com/video/BV1000010', heat: '65.3万' },
    ],
  };
}
