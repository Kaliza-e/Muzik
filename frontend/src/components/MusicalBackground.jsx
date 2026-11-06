import React, { useEffect, useState } from 'react';

// 16 floating music notes with varied sizes (12-28px), opacities (0.05-0.2), speeds (12-24s), and sine sway
const NOTES_DATA = [
  { id: 1, symbol: '♪', left: '6%', size: '18px', opacity: 0.16, duration: 16, delay: 0, swayDuration: 4 },
  { id: 2, symbol: '♫', left: '14%', size: '24px', opacity: 0.12, duration: 19, delay: 3, swayDuration: 5 },
  { id: 3, symbol: '𝄞', left: '22%', size: '28px', opacity: 0.09, duration: 22, delay: 7, swayDuration: 6 },
  { id: 4, symbol: '♬', left: '31%', size: '16px', opacity: 0.18, duration: 15, delay: 2, swayDuration: 3.5 },
  { id: 5, symbol: '♩', left: '39%', size: '14px', opacity: 0.14, duration: 18, delay: 9, swayDuration: 4.5 },
  { id: 6, symbol: '♪', left: '48%', size: '20px', opacity: 0.11, duration: 17, delay: 4, swayDuration: 5.2 },
  { id: 7, symbol: '♫', left: '55%', size: '26px', opacity: 0.08, duration: 24, delay: 11, swayDuration: 6.5 },
  { id: 8, symbol: '♬', left: '63%', size: '16px', opacity: 0.15, duration: 14, delay: 1, swayDuration: 3.8 },
  { id: 9, symbol: '𝄞', left: '71%', size: '26px', opacity: 0.07, duration: 21, delay: 8, swayDuration: 5.8 },
  { id: 10, symbol: '♩', left: '78%', size: '13px', opacity: 0.17, duration: 16, delay: 5, swayDuration: 4.2 },
  { id: 11, symbol: '♪', left: '85%', size: '22px', opacity: 0.12, duration: 18, delay: 10, swayDuration: 4.9 },
  { id: 12, symbol: '♫', left: '92%', size: '25px', opacity: 0.1, duration: 20, delay: 6, swayDuration: 5.5 },
  { id: 13, symbol: '♬', left: '18%', size: '15px', opacity: 0.14, duration: 15, delay: 12, swayDuration: 3.7 },
  { id: 14, symbol: '♩', left: '42%', size: '17px', opacity: 0.13, duration: 19, delay: 13, swayDuration: 4.4 },
  { id: 15, symbol: '♪', left: '67%', size: '19px', opacity: 0.11, duration: 17, delay: 14, swayDuration: 5.1 },
  { id: 16, symbol: '♫', left: '81%', size: '23px', opacity: 0.09, duration: 23, delay: 15, swayDuration: 6.1 },
];

export function MusicalBackground({ intensity = 'normal' }) {
  const [isActive, setIsActive] = useState(true);

  // Pause when tab hidden
  useEffect(() => {
    const handleVis = () => setIsActive(!document.hidden);
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, []);

  const isSubtle = intensity === 'subtle';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* ── Ambient Radial Glows (Breathing) ── */}
      <div className="absolute top-[-15%] left-[10%] w-[52vw] h-[52vw] max-w-[700px] max-h-[700px] bg-[#4A1236]/35 blur-[150px] rounded-full animate-breathe" />
      <div
        className="absolute top-[35%] right-[-10%] w-[48vw] h-[48vw] max-w-[650px] max-h-[650px] bg-[#1D1B52]/40 blur-[160px] rounded-full animate-breathe"
        style={{ animationDelay: '2s', animationDuration: '5.5s' }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-[#FF3D81]/15 blur-[140px] rounded-full animate-breathe"
        style={{ animationDelay: '3.5s', animationDuration: '6s' }}
      />

      {/* ── 16 Floating Music Notes drifting upwards with sine sway ── */}
      {!isSubtle &&
        NOTES_DATA.map((note) => (
          <div
            key={note.id}
            className="absolute bottom-[-60px]"
            style={{
              left: note.left,
              animation: isActive ? `driftUp ${note.duration}s linear infinite ${note.delay}s` : 'none',
              willChange: 'transform',
            }}
          >
            <span
              className="inline-block font-black select-none text-white transition-colors drop-shadow-[0_0_8px_rgba(255,61,129,0.35)]"
              style={{
                fontSize: note.size,
                opacity: note.opacity,
                animation: isActive
                  ? `sineSway ${note.swayDuration}s ease-in-out infinite alternate, slowRotate ${note.duration * 1.5}s linear infinite`
                  : 'none',
              }}
            >
              {note.symbol}
            </span>
          </div>
        ))}

      {/* ── Ambient Radial Vignette ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,#070812_95%)] opacity-70" />

      <style>{`
        @keyframes driftUp {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-115vh);
            opacity: 0;
          }
        }

        @keyframes sineSway {
          0% {
            transform: translateX(-16px);
          }
          100% {
            transform: translateX(16px);
          }
        }

        @keyframes slowRotate {
          0% {
            rotate: -15deg;
          }
          50% {
            rotate: 15deg;
          }
          100% {
            rotate: -15deg;
          }
        }
      `}</style>
    </div>
  );
}

export default MusicalBackground;
