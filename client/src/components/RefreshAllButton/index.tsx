import { useRipple } from '../../hooks/useRipple';
import { useTheme } from '../../hooks/useTheme';

interface RefreshAllButtonProps {
  refreshing: boolean;
  disabled?: boolean;
  onRefresh: () => void;
}

export default function RefreshAllButton({ refreshing, disabled, onRefresh }: RefreshAllButtonProps) {
  const { isCyber } = useTheme();
  const createRipple = useRipple('text-text-primary/20');

  return (
    <button
      type="button"
      onClick={(event) => {
        createRipple(event);
        onRefresh();
      }}
      disabled={disabled}
      className={
        isCyber
          ? 'relative flex h-10 items-center gap-1.5 rounded border border-magenta-neon/40 bg-magenta-neon/5 px-3 font-display text-sm text-magenta-neon shadow-[0_0_12px_rgba(255,0,255,0.15)] transition-all hover:shadow-[0_0_20px_rgba(255,0,255,0.3)] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4'
          : 'relative flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 text-sm font-medium text-text-secondary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:text-text-primary hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-[#252836] sm:px-4'
      }
      aria-label="刷新全部热榜"
      title="重新加载全部热榜"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-4 w-4 shrink-0 ${refreshing ? 'animate-spin' : ''}`}
        aria-hidden="true"
      >
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
      </svg>
      <span>刷新</span>
    </button>
  );
}
