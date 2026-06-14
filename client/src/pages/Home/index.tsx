import { useMemo, useState } from 'react';
import CategoryTabs from '../../components/CategoryTabs';
import CyberBackground from '../../components/CyberBackground';
import HotCard from '../../components/HotCard';
import RefreshAllButton from '../../components/RefreshAllButton';
import SiteTitle from '../../components/SiteTitle';
import ThemeToggle from '../../components/ThemeToggle';
import type { CategoryFilter } from '../../constants/categories';
import { PLATFORM_PLACEHOLDERS } from '../../constants/platforms';
import { useHotList } from '../../hooks/useHotList';
import { useRipple } from '../../hooks/useRipple';
import { useTheme } from '../../hooks/useTheme';
import type { HotSource } from '../../types/hot';
import { filterPlatformsByCategory } from '../../utils/hotDisplay';
import SiteFooter from './SiteFooter';

function isHotSource(source: string): source is HotSource {
  return source === 'weibo' || source === 'zhihu' || source === 'bilibili';
}

export default function Home() {
  const { isCyber } = useTheme();
  const { platforms, loading, refreshingAll, error, retryingSources, refetch, refetchPlatform } =
    useHotList();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const createRipple = useRipple('text-white/30');

  const displayedPlatforms = useMemo(
    () => filterPlatformsByCategory(platforms, activeCategory),
    [platforms, activeCategory],
  );

  const isInitialLoading = loading && platforms.length === 0;
  const showPageError = error !== null && !loading && platforms.length === 0;

  return (
    <div className="relative min-h-screen bg-surface">
      <CyberBackground />

      <header
        className={
          isCyber
            ? 'sticky top-0 z-20 border-b border-cyan-neon/10 bg-[#050810]/80 backdrop-blur-xl'
            : 'sticky top-0 z-20 border-b border-border/60 bg-surface/85 backdrop-blur-md'
        }
      >
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-3 px-3 py-5 sm:gap-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="min-w-0 flex-1 space-y-1">
            <SiteTitle />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <RefreshAllButton
              refreshing={refreshingAll}
              disabled={loading || refreshingAll}
              onRefresh={() => {
                void refetch({ refresh: true });
              }}
            />
            <ThemeToggle />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-3 pb-4 sm:px-6 sm:pb-5 lg:px-8">
          <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        {showPageError ? (
          <div
            className={
              isCyber
                ? 'flex flex-col items-center justify-center gap-5 rounded-xl border border-magenta-neon/30 bg-white/5 px-6 py-16 backdrop-blur-md'
                : 'flex flex-col items-center justify-center gap-5 rounded-2xl border border-border bg-surface-elevated px-6 py-16 shadow-sm'
            }
          >
            <p
              className={
                isCyber
                  ? 'm-0 text-center font-display text-[#8A8A8A]'
                  : 'm-0 text-center text-text-secondary'
              }
            >
              {isCyber ? `! FATAL :: ${error}` : error}
            </p>
            <button
              type="button"
              onClick={(event) => {
                createRipple(event);
                void refetch({ refresh: true });
              }}
              className={
                isCyber
                  ? 'cyber-btn relative px-6 py-2.5 font-display text-sm'
                  : 'relative rounded-xl bg-text-primary px-6 py-2.5 text-sm font-medium text-surface-elevated shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:bg-[#e8eaed] dark:text-[#0f1117]'
              }
            >
              点击重试
            </button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            aria-busy={isInitialLoading || refreshingAll}
          >
            {isInitialLoading
              ? PLATFORM_PLACEHOLDERS.map((placeholder) => (
                  <HotCard
                    key={placeholder.source}
                    loading
                    data={{
                      ...placeholder,
                      updatedAt: '',
                      items: [],
                    }}
                  />
                ))
              : displayedPlatforms.map((platform) => {
                  const source = platform.source;
                  const cardRetrying = isHotSource(source) && retryingSources[source] === true;

                  return (
                    <HotCard
                      key={platform.source}
                      loading={cardRetrying}
                      data={platform}
                      categoryEmpty={activeCategory !== 'all' && platform.items.length === 0}
                      onRetry={
                        isHotSource(source)
                          ? () => {
                              void refetchPlatform(source);
                            }
                          : undefined
                      }
                    />
                  );
                })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
