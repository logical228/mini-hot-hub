import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { getPlatformColor } from '../../constants/cyberTheme';
import { useRipple } from '../../hooks/useRipple';
import { useTheme } from '../../hooks/useTheme';
import type { HotPlatform } from '../../types/hot';
import HotListItem from './HotListItem';
import Skeleton from './Skeleton';
import UpdatedAtFooter from './UpdatedAtFooter';

interface HotCardProps {
  loading: boolean;
  error?: string | null;
  data?: HotPlatform | null;
  onRetry?: () => void;
  categoryEmpty?: boolean;
}

interface CardHeaderProps {
  source?: string;
  sourceName?: string;
  listName?: string;
  loading?: boolean;
}

function CardHeader({ source, sourceName, listName, loading }: CardHeaderProps) {
  const { isCyber } = useTheme();
  const accentColor = getPlatformColor(source ?? '', isCyber);

  if (loading && !sourceName) {
    return (
      <header
        className={
          isCyber
            ? 'cyber-card-header flex items-stretch gap-3 px-4 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5'
            : 'flex items-stretch gap-3 border-b border-border px-4 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5'
        }
      >
        <span className="h-auto w-1 shrink-0 rounded-full skeleton-shimmer" aria-hidden="true" />
        <div className="min-w-0 flex-1 space-y-2">
          <span className="block h-5 w-20 rounded skeleton-shimmer" />
          <span className="block h-3.5 w-28 rounded skeleton-shimmer" />
        </div>
      </header>
    );
  }

  if (isCyber) {
    return (
      <header
        className="cyber-card-header relative flex items-stretch gap-3 px-4 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5"
        style={{
          borderColor: `${accentColor}40`,
          boxShadow: `0 0 20px ${accentColor}15, inset 0 1px 0 ${accentColor}30`,
        }}
      >
        <span
          className="w-1 shrink-0 rounded-full"
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 0 10px ${accentColor}`,
          }}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <h2
            className="m-0 font-display text-lg font-bold tracking-wide"
            style={{ color: accentColor, textShadow: `0 0 12px ${accentColor}80` }}
          >
            {sourceName ?? '热榜'}
          </h2>
          {listName ? (
            <p className="mt-1 mb-0 font-display text-xs tracking-wider text-[#8A8A8A]">
              {listName}
            </p>
          ) : null}
        </div>
      </header>
    );
  }

  return (
    <header className="flex items-stretch gap-3 border-b border-border px-4 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5">
      <span
        className="w-1 shrink-0 rounded-full"
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <h2 className="m-0 text-lg font-semibold leading-snug text-text-primary">
          {sourceName ?? '热榜'}
        </h2>
        {listName ? (
          <p className="mt-1 mb-0 text-[0.8125rem] text-text-muted">{listName}</p>
        ) : null}
      </div>
    </header>
  );
}

function SuccessBody({ platform }: { platform: HotPlatform }) {
  const { updatedAt, items, fromCache, source } = platform;

  return (
    <>
      <ul className="m-0 flex-1 list-none p-0 py-1">
        {items.map((item, index) => (
          <HotListItem key={`${item.rank}-${item.title}`} item={item} index={index} source={source} />
        ))}
      </ul>
      <UpdatedAtFooter updatedAt={updatedAt} fromCache={fromCache} />
    </>
  );
}

function EmptyBody({
  updatedAt,
  fromCache,
  message = '暂无数据',
}: {
  updatedAt?: string;
  fromCache?: boolean;
  message?: string;
}) {
  const { isCyber } = useTheme();

  return (
    <>
      <div className="flex min-h-[280px] flex-1 flex-col items-center justify-center gap-4 px-6 py-12">
        <p
          className={
            isCyber
              ? 'm-0 text-center font-display text-sm text-[#8A8A8A]'
              : 'm-0 text-center text-sm text-text-muted'
          }
        >
          {isCyber ? `> ${message}` : message}
        </p>
      </div>
      {updatedAt ? <UpdatedAtFooter updatedAt={updatedAt} fromCache={fromCache} /> : null}
    </>
  );
}

function ErrorBody({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { isCyber } = useTheme();
  const createRipple = useRipple('text-text-primary/20');

  return (
    <div className="flex min-h-[280px] flex-1 flex-col items-center justify-center gap-4 px-6 py-12">
      <p
        className={
          isCyber
            ? 'm-0 text-center font-display text-sm leading-relaxed text-[#8A8A8A]'
            : 'm-0 text-center text-sm leading-relaxed text-text-secondary'
        }
      >
        {isCyber ? `! ERROR :: ${message}` : message}
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={(event) => {
            createRipple(event);
            onRetry();
          }}
          className={
            isCyber
              ? 'cyber-btn relative px-5 py-2 font-display text-sm'
              : 'relative rounded-lg border border-border bg-surface-elevated px-5 py-2 text-sm font-medium text-text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-text-muted hover:shadow-md'
          }
        >
          点击重试
        </button>
      ) : null}
    </div>
  );
}

function CyberCard({
  neonColor,
  children,
  className,
}: {
  neonColor: string;
  children: ReactNode;
  className: string;
}) {
  return (
    <motion.article
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      style={{
        boxShadow: `0 0 30px ${neonColor}12, 0 0 1px ${neonColor}60`,
      }}
    >
      {children}
    </motion.article>
  );
}

export default function HotCard({ loading, error, data, onRetry, categoryEmpty }: HotCardProps) {
  const { isCyber } = useTheme();
  const headerProps = {
    source: data?.source,
    sourceName: data?.sourceName,
    listName: data?.listName,
    loading,
  };

  const neonColor = getPlatformColor(data?.source ?? '', isCyber);

  const cardClass = isCyber
    ? 'cyber-card flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl'
    : [
        'flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-surface-elevated sm:rounded-2xl',
        'shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)]',
        'dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]',
      ].join(' ');

  const body = (
    <>
      <CardHeader {...headerProps} />
      {loading ? (
        <Skeleton />
      ) : error ? (
        <ErrorBody message={error} onRetry={onRetry} />
      ) : data ? (
        data.error ? (
          <ErrorBody message={data.message ?? '该榜单暂时无法加载，请稍后再试'} onRetry={onRetry} />
        ) : data.items.length === 0 ? (
          <EmptyBody
            updatedAt={data.updatedAt}
            fromCache={data.fromCache}
            message={categoryEmpty ? '该分类下暂无热搜' : '暂无数据'}
          />
        ) : (
          <SuccessBody platform={data} />
        )
      ) : (
        <EmptyBody />
      )}
    </>
  );

  if (isCyber) {
    return (
      <CyberCard neonColor={neonColor} className={cardClass}>
        {body}
      </CyberCard>
    );
  }

  return <article className={cardClass}>{body}</article>;
}
