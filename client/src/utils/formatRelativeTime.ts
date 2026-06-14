/**
 * 将 ISO 8601 时间戳格式化为中文相对时间（如「3 分钟前」）。
 */
export function formatRelativeTime(isoString: string, now: number = Date.now()): string {
  const date = new Date(isoString);
  const diffMs = now - date.getTime();

  if (Number.isNaN(date.getTime())) {
    return '刚刚';
  }

  if (diffMs < 0) {
    return '刚刚';
  }

  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) {
    return '刚刚';
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} 分钟前`;
  }

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return `${diffHour} 小时前`;
  }

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) {
    return `${diffDay} 天前`;
  }

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) {
    return `${diffMonth} 个月前`;
  }

  const diffYear = Math.floor(diffMonth / 12);
  return `${diffYear} 年前`;
}
