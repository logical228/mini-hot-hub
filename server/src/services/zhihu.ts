import type { HotItem, HotPlatform } from '../types/hot.js';

/** 知乎热榜 JSON 接口（非 HTML 页面） */
const ZHIHU_HOT_LIST_URL = 'https://api.zhihu.com/topstory/hot-list';

/** 知乎移动端 User-Agent */
const ZHIHU_MOBILE_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';

const ZHIHU_REFERER = 'https://www.zhihu.com/hot';

const FETCH_TIMEOUT_MS = Number(process.env.FETCH_TIMEOUT) || 5000;

interface ZhihuHotTarget {
  id: number;
  title: string;
  url: string;
}

interface ZhihuHotListItem {
  card_id?: string;
  detail_text?: string;
  target?: ZhihuHotTarget;
}

interface ZhihuHotListResponse {
  data?: ZhihuHotListItem[];
}

function buildZhihuQuestionUrl(cardId: string | undefined, target?: ZhihuHotTarget): string {
  const cardMatch = cardId?.match(/^Q_(\d+)/);
  if (cardMatch) {
    return `https://www.zhihu.com/question/${cardMatch[1]}`;
  }

  const apiMatch = target?.url.match(/questions\/(\d+)/);
  if (apiMatch) {
    return `https://www.zhihu.com/question/${apiMatch[1]}`;
  }

  if (target?.id) {
    return `https://www.zhihu.com/question/${target.id}`;
  }

  throw new Error('知乎热榜解析失败：无法构建问题链接');
}

/**
 * 解析知乎热榜 JSON 为 HotItem 列表。
 *
 * 字段映射（接口变更时优先核对此处）：
 * - data[]                 → 热榜条目数组（按热度排序）
 * - item.target.title      → title（问题标题）
 * - item.detail_text       → heat（如「1020 万热度」）
 * - item.card_id           → url（Q_{questionId} → zhihu.com/question/{id}）
 * - item.target.url        → url 备用（api.zhihu.com/questions/{id}）
 * - 数组下标 + 1           → rank
 */
export function parseZhihuHotListResponse(body: ZhihuHotListResponse): HotItem[] {
  const list = body.data;

  if (!Array.isArray(list) || list.length === 0) {
    throw new Error('知乎热榜解析失败：data 为空或不是数组');
  }

  const items: HotItem[] = [];

  for (const [index, entry] of list.entries()) {
    const title = entry.target?.title?.trim();
    if (!title) {
      continue;
    }

    try {
      items.push({
        rank: index + 1,
        title,
        heat: entry.detail_text?.trim() || undefined,
        url: buildZhihuQuestionUrl(entry.card_id, entry.target),
      });
    } catch {
      continue;
    }
  }

  if (items.length === 0) {
    throw new Error('知乎热榜解析失败：过滤后无有效条目');
  }

  return items;
}

/**
 * 请求知乎热榜 JSON 并解析为 items。
 */
export async function fetchZhihuHotItems(): Promise<HotItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(ZHIHU_HOT_LIST_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': ZHIHU_MOBILE_USER_AGENT,
        Referer: ZHIHU_REFERER,
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(`知乎热榜接口返回 HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('json')) {
      throw new Error('知乎热榜接口返回非 JSON 内容（可能触发反爬，请勿解析 HTML）');
    }

    let body: ZhihuHotListResponse;
    try {
      body = (await response.json()) as ZhihuHotListResponse;
    } catch {
      throw new Error('知乎热榜响应 JSON 解析失败');
    }

    return parseZhihuHotListResponse(body);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`知乎热榜请求超时（>${FETCH_TIMEOUT_MS}ms）`);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('知乎热榜请求发生未知错误');
  } finally {
    clearTimeout(timeoutId);
  }
}

/** 抓取真实知乎热榜并封装为 HotPlatform */
export async function fetchZhihuHot(): Promise<HotPlatform> {
  const items = await fetchZhihuHotItems();

  return {
    source: 'zhihu',
    sourceName: '知乎',
    listName: '知乎热榜',
    updatedAt: new Date().toISOString(),
    fromCache: false,
    items,
  };
}

/** 本地 Mock（非上游接口，供开发/降级使用） */
export function getZhihuHotMock(): HotPlatform {
  return {
    source: 'zhihu',
    sourceName: '知乎',
    listName: '知乎热榜',
    updatedAt: new Date().toISOString(),
    fromCache: false,
    items: [
      { rank: 1, title: '如何看待 AI 编程工具的崛起？', url: 'https://www.zhihu.com/question/10000001', heat: '580 万热度' },
      { rank: 2, title: '为什么年轻人开始追求极简生活？', url: 'https://www.zhihu.com/question/10000002', heat: '420 万热度' },
      { rank: 3, title: '有哪些被低估的编程语言？', url: 'https://www.zhihu.com/question/10000003', heat: '310 万热度' },
      { rank: 4, title: '远程办公三年后的真实体验', url: 'https://www.zhihu.com/question/10000004', heat: '256 万热度' },
      { rank: 5, title: '如何系统性地提升写作能力？', url: 'https://www.zhihu.com/question/10000005', heat: '198 万热度' },
      { rank: 6, title: '2025 年最值得关注的科技趋势', url: 'https://www.zhihu.com/question/10000006', heat: '175 万热度' },
      { rank: 7, title: '副业收入超过主业是什么体验？', url: 'https://www.zhihu.com/question/10000007', heat: '142 万热度' },
      { rank: 8, title: '为什么越来越多人选择独居？', url: 'https://www.zhihu.com/question/10000008', heat: '118 万热度' },
      { rank: 9, title: '有哪些高效的学习方法？', url: 'https://www.zhihu.com/question/10000009', heat: '96 万热度' },
      { rank: 10, title: '如何评价最新一轮互联网裁员？', url: 'https://www.zhihu.com/question/10000010', heat: '82 万热度' },
    ],
  };
}
