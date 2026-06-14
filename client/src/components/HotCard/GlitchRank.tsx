import { motion } from 'framer-motion';

interface GlitchRankProps {
  rank: number;
  neonColor: string;
}

export default function GlitchRank({ rank, neonColor }: GlitchRankProps) {
  return (
    <motion.span
      className="relative inline-flex h-8 w-8 items-center justify-center font-display text-sm font-bold tabular-nums"
      style={{
        color: neonColor,
        textShadow: `0 0 10px ${neonColor}, 0 0 20px ${neonColor}`,
      }}
      animate={{
        textShadow: [
          `0 0 10px ${neonColor}, 0 0 20px ${neonColor}`,
          `2px 0 10px #ff00ff, -2px 0 10px #00ffff`,
          `0 0 10px ${neonColor}, 0 0 20px ${neonColor}`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    >
      <span
        className="absolute inset-0 rounded border opacity-60"
        style={{
          borderColor: neonColor,
          boxShadow: `0 0 12px ${neonColor}, inset 0 0 8px ${neonColor}40`,
        }}
      />
      <span className="relative z-10">{rank}</span>
    </motion.span>
  );
}
