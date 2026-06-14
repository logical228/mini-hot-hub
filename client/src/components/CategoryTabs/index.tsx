import { motion } from 'framer-motion';
import { useRipple } from '../../hooks/useRipple';
import { useTheme } from '../../hooks/useTheme';
import type { CategoryFilter } from '../../constants/categories';
import { CATEGORY_TABS } from '../../constants/categories';

interface CategoryTabsProps {
  active: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const { isCyber } = useTheme();
  const createRipple = useRipple('text-text-primary/20');

  return (
    <div className="relative -mx-1">
      <div
        className="flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none"
        role="tablist"
        aria-label="热搜分类"
      >
        {CATEGORY_TABS.map((tab) => {
          const isActive = tab.id === active;

          if (isCyber) {
            return (
              <motion.button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={(event) => {
                  createRipple(event);
                  onChange(tab.id);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={[
                  'relative shrink-0 rounded border px-4 py-2 font-display text-sm tracking-wide transition-all',
                  isActive
                    ? 'border-cyan-neon/60 bg-cyan-neon/10 text-cyan-neon shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                    : 'border-white/10 bg-white/5 text-[#8A8A8A] hover:border-cyan-neon/30 hover:text-cyan-neon/80',
                ].join(' ')}
              >
                {tab.label}
              </motion.button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={(event) => {
                createRipple(event);
                onChange(tab.id);
              }}
              className={[
                'relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-text-primary text-surface-elevated shadow-md dark:bg-[#e8eaed] dark:text-[#0f1117]'
                  : 'border border-border bg-surface-elevated text-text-secondary hover:-translate-y-0.5 hover:border-text-muted hover:text-text-primary hover:shadow-sm',
              ].join(' ')}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
