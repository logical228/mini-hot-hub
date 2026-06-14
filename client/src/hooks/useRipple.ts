import { useCallback, type MouseEvent } from 'react';

export function useRipple(colorClass = 'text-current') {
  return useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');

      ripple.className = `ripple-effect ${colorClass}`;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

      const previous = target.style.position;
      if (!previous || previous === 'static') {
        target.style.position = 'relative';
      }
      target.style.overflow = 'hidden';

      target.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    },
    [colorClass],
  );
}
