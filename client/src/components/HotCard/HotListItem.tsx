import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useRipple } from '../../hooks/useRipple';
import { useTheme } from '../../hooks/useTheme';
import { getPlatformNeon } from '../../constants/cyberTheme';
import type { HotItem } from '../../types/hot';
import { getRankStyles } from '../../utils/hotDisplay';
import GlitchRank from './GlitchRank';

interface HotListItemProps {
  item: HotItem;
  index: number;
  source: string;
}

export default function HotListItem({ item, index, source }: HotListItemProps) {
  const { isCyber } = useTheme();
  const createRipple = useRipple('text-text-primary/15');
  const styles = getRankStyles(item.rank, isCyber);
  const neonColor = getPlatformNeon(source);

  if (isCyber) {
    return (
      <motion.li
        className="cyber-hot-item group relative mx-2 my-1 grid grid-cols-[36px_1fr_auto] items-center gap-2 rounded-lg px-3 py-2.5 sm:mx-3 sm:gap-2.5 sm:px-4"
        style={{ '--neon-color': neonColor } as CSSProperties}
        initial={{ opacity: 0, x: -24, filter: 'blur(4px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        transition={{
          delay: index * 0.03,
          type: 'spring',
          stiffness: 260,
          damping: 22,
        }}
        whileHover={{
          scale: 1.015,
          x: 4,
          transition: { type: 'spring', stiffness: 400, damping: 15 },
        }}
      >
        {item.rank <= 3 ? (
          <GlitchRank rank={item.rank} neonColor={neonColor} />
        ) : (
          <span className="inline-flex h-6 w-6 items-center justify-center font-display text-xs tabular-nums text-[#8A8A8A]">
            {item.rank}
          </span>
        )}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={createRipple}
          className="relative min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#8A8A8A] no-underline transition-colors duration-200"
        >
          <span className="group-hover:hidden">{item.title}</span>
          <span
            className="hidden group-hover:inline"
            style={{ color: neonColor, textShadow: `0 0 8px ${neonColor}` }}
          >
            {item.title}
          </span>
        </a>
        {item.heat ? (
          <span className="shrink-0 whitespace-nowrap font-display text-xs text-[#8A8A8A] group-hover:text-[var(--neon-color)]">
            {item.heat}
          </span>
        ) : null}
      </motion.li>
    );
  }

  return (
    <motion.li
      className={[
        'group grid grid-cols-[28px_1fr_auto] items-center gap-2 px-4 py-2 sm:gap-2.5 sm:px-5 sm:py-2.5',
        'transition-all duration-200 hover:-translate-y-px hover:bg-black/[0.03] hover:shadow-sm',
        'dark:hover:bg-white/[0.04]',
        styles.item,
      ].join(' ')}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      whileHover={{ y: -1 }}
    >
      <span
        className={['inline-flex items-center justify-center rounded-md tabular-nums', styles.rank].join(
          ' ',
        )}
      >
        {item.rank}
      </span>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={createRipple}
        className={[
          'relative min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-text-primary',
          'no-underline transition-colors duration-150 hover:text-zhihu group-hover:text-zhihu',
          styles.title,
        ].join(' ')}
      >
        {item.title}
      </a>
      {item.heat ? (
        <span
          className={[
            'shrink-0 whitespace-nowrap text-xs text-text-muted',
            item.rank <= 3 ? 'font-medium text-text-secondary' : '',
          ].join(' ')}
        >
          {item.heat}
        </span>
      ) : null}
    </motion.li>
  );
}
