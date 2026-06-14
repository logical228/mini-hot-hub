import { useTheme } from '../../hooks/useTheme';
import CyberGrid from './CyberGrid';
import CyberParticles from './CyberParticles';
import Scanlines from './Scanlines';

export default function CyberBackground() {
  const { isCyber } = useTheme();

  if (!isCyber) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050810]" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #0A0E27 0%, #050810 70%)',
        }}
      />
      <CyberGrid />
      <CyberParticles />
      <Scanlines />
    </div>
  );
}
