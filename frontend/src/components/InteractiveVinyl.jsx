import React from 'react';

/**
 * InteractiveVinyl - 33⅓ rpm rotating vinyl disc (~1.8s/turn)
 * Features concentric vinyl grooves, dynamic specular light reflection streaks,
 * and deceleration to an ease stop when paused.
 */
export function InteractiveVinyl({
  isPlaying = false,
  coverImage = '/images/card-vinyl.jpg',
  size = 220,
  className = '',
}) {
  return (
    <div
      className={`relative rounded-full select-none shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Vinyl body container */}
      <div
        className={`w-full h-full rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-2 border-white/[0.08] relative overflow-hidden transition-all ${
          isPlaying ? 'animate-vinyl-spin' : 'animate-vinyl-paused'
        }`}
        style={{
          background: 'radial-gradient(circle, #1a1a24 0%, #0d0e1a 45%, #05060d 75%, #000000 100%)',
        }}
      >
        {/* Micro concentric vinyl grooves */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none opacity-40"
          style={{
            backgroundImage: `repeating-radial-gradient(circle at center, transparent 0, transparent 2px, rgba(255,255,255,0.06) 3px, transparent 4px)`,
          }}
        />

        {/* Specular sheen reflection streaks (two opposite cones of light) */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none mix-blend-overlay opacity-60"
          style={{
            background:
              'conic-gradient(from 45deg at 50% 50%, rgba(255,255,255,0.2) 0deg, transparent 45deg, rgba(255,255,255,0.25) 90deg, transparent 135deg, rgba(255,255,255,0.2) 180deg, transparent 225deg, rgba(255,255,255,0.25) 270deg, transparent 315deg, rgba(255,255,255,0.2) 360deg)',
          }}
        />

        {/* Center record label with artwork */}
        <div
          className="absolute top-1/2 left-1/2 rounded-full overflow-hidden border-2 border-white/20 shadow-inner -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-[#070812]"
          style={{ width: '38%', height: '38%' }}
        >
          {coverImage ? (
            <img
              src={coverImage}
              alt="Vinyl center label"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#FF3D81] to-[#1D1B52]" />
          )}

          {/* Center spindle hole */}
          <div className="absolute w-3.5 h-3.5 rounded-full bg-[#070812] border border-white/40 shadow-inner" />
        </div>
      </div>
    </div>
  );
}

export default InteractiveVinyl;

