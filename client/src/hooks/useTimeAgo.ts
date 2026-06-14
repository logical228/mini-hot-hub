import { useEffect, useState } from 'react';
import { formatRelativeTime } from '../utils/formatRelativeTime';

/** 基于 ISO 时间戳返回相对时间，每分钟自动刷新 */
export function useTimeAgo(isoString: string | undefined): string {
  const [label, setLabel] = useState(() =>
    isoString ? formatRelativeTime(isoString) : '刚刚',
  );

  useEffect(() => {
    if (!isoString) {
      setLabel('刚刚');
      return;
    }

    const update = () => setLabel(formatRelativeTime(isoString));
    update();

    const timerId = window.setInterval(update, 60_000);
    return () => window.clearInterval(timerId);
  }, [isoString]);

  return label;
}

/** @deprecated 请使用 formatRelativeTime */
export { formatRelativeTime as formatTimeAgo } from '../utils/formatRelativeTime';
