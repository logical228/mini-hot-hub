export default function Scanlines() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.04]"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 animate-scanline"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.5) 2px, rgba(0, 255, 255, 0.5) 4px)',
        }}
      />
    </div>
  );
}
