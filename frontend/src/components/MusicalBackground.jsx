import React from 'react';

// Floating music symbols with varied sizes, positions, and drift speeds
const FLOATING_NOTES = [
  { symbol: '♪', left: '8%', top: '22%', size: 'text-2xl', delay: '0s', duration: '14s' },
  { symbol: '♫', left: '88%', top: '15%', size: 'text-3xl', delay: '2s', duration: '18s' },
  { symbol: '♬', left: '25%', top: '65%', size: 'text-xl', delay: '4s', duration: '16s' },
  { symbol: '♩', left: '75%', top: '75%', size: 'text-2xl', delay: '1s', duration: '20s' },
  { symbol: '♫', left: '45%', top: '82%', size: 'text-xl', delay: '5s', duration: '15s' },
  { symbol: '♪', left: '92%', top: '48%', size: 'text-2xl', delay: '3s', duration: '17s' },
  { symbol: '𝄞', left: '15%', top: '42%', size: 'text-4xl', delay: '6s', duration: '22s' },
  { symbol: '♬', left: '60%', top: '28%', size: 'text-xl', delay: '3.5s', duration: '19s' },
];

function MusicalBackground({ intensity = 'normal' }) {
  const isSubtle = intensity === 'subtle';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* ── Deep Ambient Pulsing Glow Orbs ── */}
      <div className="absolute top-[-15%] left-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-[#4A1236]/35 blur-[150px] rounded-full animate-pulse" />
      <div
        className="absolute top-[35%] right-[-10%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] bg-[#1D1B52]/40 blur-[160px] rounded-full animate-pulse"
        style={{ animationDelay: '2s', animationDuration: '6s' }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-[#FF3D81]/15 blur-[140px] rounded-full animate-pulse"
        style={{ animationDelay: '4s', animationDuration: '7s' }}
      />

      {/* ── Floating Glowing Musical Notes ── */}
      {!isSubtle &&
        FLOATING_NOTES.map((note, index) => (
          <span
            key={index}
            className={`absolute ${note.size} font-black select-none pointer-events-none text-white/[0.07] hover:text-[#FF3D81]/30 transition-colors drop-shadow-[0_0_12px_rgba(255,61,129,0.3)] animate-floatSubtle`}
            style={{
              left: note.left,
              top: note.top,
              animationDelay: note.delay,
              animationDuration: note.duration,
            }}
          >
            {note.symbol}
          </span>
        ))}

      {/* ── Ambient Radial Vignette ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#070812_95%)] opacity-70" />
    </div>
  );
}

export default MusicalBackground;

