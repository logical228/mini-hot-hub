import { useRipple } from '../../hooks/useRipple';
import { useTheme } from '../../hooks/useTheme';

const THEME_LABELS = {
  light: { label: '浅色模式', icon: '☀️' },
  dark: { label: '深色模式', icon: '🌙' },
  cyber: { label: '炫酷模式', icon: '⚡' },
} as const;

export default function ThemeToggle() {
  const { resolved, cycleTheme } = useTheme();
  const createRipple = useRipple('text-text-primary/30');

  const current =
    resolved in THEME_LABELS
      ? THEME_LABELS[resolved as keyof typeof THEME_LABELS]
      : THEME_LABELS.light;

  return (
    <button
      type="button"
      onClick={(event) => {
        createRipple(event);
        cycleTheme();
      }}
      className="relative flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 text-sm font-medium text-text-secondary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:text-text-primary hover:shadow-md disabled:cursor-not-allowed cyber:border-cyan-neon/30 cyber:bg-white/5 cyber:text-cyan-neon cyber:shadow-[0_0_12px_rgba(0,255,255,0.15)] cyber:hover:shadow-[0_0_20px_rgba(0,255,255,0.25)] dark:hover:bg-[#252836]"
      aria-label={`当前${current.label}，点击切换`}
      title={`${current.label} · 点击切换`}
    >
      <span aria-hidden="true">{current.icon}</span>
      <span className="hidden font-display text-xs tracking-wide sm:inline">{current.label}</span>
    </button>
  );
}
