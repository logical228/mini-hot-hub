/** 与服务端 CACHE_TTL 默认值保持一致（秒） */
export const DEFAULT_CACHE_TTL_SECONDS = 600;

/** 页脚展示的缓存更新间隔（分钟），可通过 VITE_CACHE_TTL 与后端对齐 */
export function getCacheTtlMinutes(): number {
  const raw = import.meta.env.VITE_CACHE_TTL;
  const seconds =
    raw !== undefined && raw !== '' && !Number.isNaN(Number(raw))
      ? Number(raw)
      : DEFAULT_CACHE_TTL_SECONDS;

  return Math.max(1, Math.round(seconds / 60));
}

/** 侵权 / 违规联系邮箱（占位，部署时请替换） */
export const CONTACT_EMAIL = 'your-email@example.com';
