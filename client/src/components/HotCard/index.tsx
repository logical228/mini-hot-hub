import type { HotPlatform } from '../../types/hot';
import Skeleton from './Skeleton';
import UpdatedAtFooter from './UpdatedAtFooter';
import styles from './HotCard.module.css';

const PLATFORM_COLORS: Record<string, string> = {
  weibo: '#E6162D',
  zhihu: '#0084FF',
  bilibili: '#FB7299',
};

interface HotCardProps {
  loading: boolean;
  error?: string | null;
  data?: HotPlatform | null;
  onRetry?: () => void;
}

function getItemClass(rank: number): string {
  if (rank === 1) return `${styles.item} ${styles.itemTop1}`;
  if (rank === 2) return `${styles.item} ${styles.itemTop2}`;
  if (rank === 3) return `${styles.item} ${styles.itemTop3}`;
  return styles.item;
}

function getRankClass(rank: number): string {
  if (rank === 1) return `${styles.rank} ${styles.rankTop1}`;
  if (rank === 2) return `${styles.rank} ${styles.rankTop2}`;
  if (rank === 3) return `${styles.rank} ${styles.rankTop3}`;
  return styles.rank;
}

function getTitleClass(rank: number): string {
  if (rank <= 3) return `${styles.title} ${styles.titleTop}`;
  return styles.title;
}

interface CardHeaderProps {
  source?: string;
  sourceName?: string;
  listName?: string;
  loading?: boolean;
}

function CardHeader({ source, sourceName, listName, loading }: CardHeaderProps) {
  const accentColor = source ? (PLATFORM_COLORS[source] ?? '#6b7280') : '#e5e7eb';

  if (loading && !sourceName) {
    return (
      <header className={styles.header}>
        <span className={`${styles.colorBar} ${styles.skeletonBlock}`} aria-hidden="true" />
        <div className={styles.headerText}>
          <span className={`${styles.skeletonSourceName} ${styles.skeletonBlock}`} />
          <span className={`${styles.skeletonListName} ${styles.skeletonBlock}`} />
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <span
        className={styles.colorBar}
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      />
      <div className={styles.headerText}>
        <h2 className={styles.sourceName}>{sourceName ?? '热榜'}</h2>
        {listName ? <p className={styles.listName}>{listName}</p> : null}
      </div>
    </header>
  );
}

function SuccessBody({ platform }: { platform: HotPlatform }) {
  const { updatedAt, items, fromCache } = platform;

  return (
    <>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.rank} className={getItemClass(item.rank)}>
            <span className={getRankClass(item.rank)}>{item.rank}</span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={getTitleClass(item.rank)}
            >
              {item.title}
            </a>
            {item.heat ? (
              <span className={item.rank <= 3 ? `${styles.heat} ${styles.heatTop}` : styles.heat}>
                {item.heat}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      <UpdatedAtFooter updatedAt={updatedAt} fromCache={fromCache} />
    </>
  );
}

function EmptyBody({ updatedAt, fromCache }: { updatedAt?: string; fromCache?: boolean }) {
  return (
    <>
      <div className={styles.stateBody}>
        <p className={styles.emptyMessage}>暂无数据</p>
      </div>
      {updatedAt ? <UpdatedAtFooter updatedAt={updatedAt} fromCache={fromCache} /> : null}
    </>
  );
}

function ErrorBody({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className={styles.stateBody}>
      <p className={styles.errorMessage}>{message}</p>
      {onRetry ? (
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          点击重试
        </button>
      ) : null}
    </div>
  );
}

export default function HotCard({ loading, error, data, onRetry }: HotCardProps) {
  const headerProps = {
    source: data?.source,
    sourceName: data?.sourceName,
    listName: data?.listName,
    loading,
  };

  return (
    <article className={styles.card}>
      <CardHeader {...headerProps} />

      {loading ? (
        <Skeleton />
      ) : error ? (
        <ErrorBody message={error} onRetry={onRetry} />
      ) : data ? (
        data.error ? (
          <ErrorBody
            message={data.message ?? '该榜单暂时无法加载，请稍后再试'}
            onRetry={onRetry}
          />
        ) : data.items.length === 0 ? (
          <EmptyBody updatedAt={data.updatedAt} fromCache={data.fromCache} />
        ) : (
          <SuccessBody platform={data} />
        )
      ) : (
        <EmptyBody />
      )}
    </article>
  );
}
