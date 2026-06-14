import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

export default function SiteTitle() {
  const { isCyber } = useTheme();

  if (!isCyber) {
    return (
      <>
        <h1 className="m-0 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          迷你今日热榜
        </h1>
        <p className="m-0 text-sm text-text-secondary sm:text-base">
          60 秒内掌握中文互联网正在发生的事
        </p>
      </>
    );
  }

  return (
    <>
      <motion.h1
        className="cyber-title m-0 font-display text-2xl font-bold tracking-wider sm:text-3xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        迷你今日热榜
        <span className="cyber-cursor ml-0.5 inline-block h-[1em] w-[3px] animate-blink bg-cyan-neon align-middle" />
      </motion.h1>
      <motion.p
        className="m-0 font-display text-sm tracking-wide text-[#8A8A8A] sm:text-base"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {'>'} DATA_FEED :: 中文互联网实时热搜聚合终端
      </motion.p>
    </>
  );
}
