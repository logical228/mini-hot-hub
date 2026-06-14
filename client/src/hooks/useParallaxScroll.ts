import { useEffect, useState } from 'react';

/** 视差滚动偏移，用于背景网格 / 粒子层 */
export function useParallaxScroll(factor = 0.35): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setOffset(window.scrollY * factor);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [factor]);

  return offset;
}
