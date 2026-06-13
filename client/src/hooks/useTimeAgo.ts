import { useEffect, useState } from 'react';

export function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();

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
  return `${diffDay} 天前`;
}

/** 基于 ISO 时间戳返回相对时间，每分钟自动刷新 */
export function useTimeAgo(isoString: string | undefined): string {
  const [label, setLabel] = useState(() =>
    isoString ? formatTimeAgo(isoString) : '刚刚',
  );

  useEffect(() => {
    if (!isoString) {
      setLabel('刚刚');
      return;
    }

    const update = () => setLabel(formatTimeAgo(isoString));
    update();

    const timerId = window.setInterval(update, 60_000);
    return () => window.clearInterval(timerId);
  }, [isoString]);

  return label;
}
