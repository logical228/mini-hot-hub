/** Railway 生产后端（VITE_API_BASE 未设置时的默认值） */
export const DEFAULT_PROD_API_BASE =
  'https://mini-hot-hub-production-b016.up.railway.app/api';

function isAbsoluteUrl(value: string): boolean {
  return value.startsWith('http://') || value.startsWith('https://');
}

/**
 * 解析 API 基地址：
 * - 开发：/api（Vite 代理）
 * - 生产：仅接受完整的 https://… URL；忽略 Vercel 里误填的 `/api`
 */
export function resolveApiBase(): string {
  const fromEnv = import.meta.env.VITE_API_BASE?.trim();

  if (fromEnv && isAbsoluteUrl(fromEnv)) {
    return fromEnv.replace(/\/$/, '');
  }

  if (import.meta.env.PROD) {
    return DEFAULT_PROD_API_BASE;
  }

  return fromEnv || '/api';
}

/** 运行时兜底：旧构建或相对路径误配时，生产环境仍指向 Railway */
export function getApiBase(): string {
  const base = resolveApiBase();
  if (import.meta.env.PROD && !isAbsoluteUrl(base)) {
    return DEFAULT_PROD_API_BASE;
  }
  return base;
}
