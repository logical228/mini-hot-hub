/** Railway 生产后端（VITE_API_BASE 未设置时的默认值） */
export const DEFAULT_PROD_API_BASE =
  'https://mini-hot-hub-production-b016.up.railway.app/api';

/**
 * 解析 API 基地址：
 * - 开发：/api（Vite 代理）
 * - 生产：优先 VITE_API_BASE，否则 DEFAULT_PROD_API_BASE
 */
export function resolveApiBase(): string {
  const fromEnv = import.meta.env.VITE_API_BASE?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }
  if (import.meta.env.PROD) {
    return DEFAULT_PROD_API_BASE;
  }
  return '/api';
}
