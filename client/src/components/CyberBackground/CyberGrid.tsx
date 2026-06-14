import { useParallaxScroll } from '../../hooks/useParallaxScroll';

export default function CyberGrid() {
  const offset = useParallaxScroll(0.25);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ transform: `translateY(${offset * -0.5}px)` }}
    >
      <div
        className="absolute inset-[-50%] opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          transform: `perspective(500px) rotateX(60deg) translateY(${offset * 0.3}px)`,
          transformOrigin: 'center top',
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 0, 255, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 255, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          transform: `translateY(${offset * 0.15}px)`,
        }}
      />
    </div>
  );
}
