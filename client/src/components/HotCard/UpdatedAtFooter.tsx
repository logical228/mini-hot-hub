import { useTimeAgo } from '../../hooks/useTimeAgo';
import styles from './HotCard.module.css';

interface UpdatedAtFooterProps {
  updatedAt: string;
  fromCache?: boolean;
}

export default function UpdatedAtFooter({ updatedAt, fromCache }: UpdatedAtFooterProps) {
  const timeAgo = useTimeAgo(updatedAt);

  return (
    <footer
      className={styles.footer}
      title={
        fromCache
          ? '数据来自服务端缓存；updatedAt 为写入缓存的时刻，缓存有效期内刷新页面该时间不会变化，属正常现象'
          : undefined
      }
    >
      <span className={styles.footerTime}>更新于 {timeAgo}</span>
      {fromCache ? (
        <span className={styles.footerCacheHint}>缓存有效期内时间不变</span>
      ) : null}
    </footer>
  );
}
