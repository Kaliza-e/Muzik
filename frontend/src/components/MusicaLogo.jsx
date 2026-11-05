import React from 'react';

/**
 * MusicaLogo - Custom vector logo matching the user's design reference:
 * Over-ear headphones enclosing a capsule studio microphone with 3 grille bars,
 * a U-bracket cradle, and a signature glowing pink accent dot at the base.
 *
 * Can be rendered normal (upright) or upside down (rotated 180° for the letter 'U').
 */
export function MusicaLogo({
  size = 32,
  className = '',
  showGlow = true,
  upsideDown = false,
}) {
  return (
    <div
      className={`inline-flex items-center justify-center relative shrink-0 ${
        upsideDown ? 'rotate-180' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {showGlow && (
        <div
          className="absolute inset-0 rounded-full blur-[8px] bg-[#FF3D81]/30 pointer-events-none scale-110"
          aria-hidden="true"
        />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_2px_8px_rgba(255,61,129,0.25)]"
        aria-hidden="true"
      >
        {/* ── Over-ear Headphones ── */}
        {/* Headband arch */}
        <path
          d="M 18,50 C 18,24 32,12 50,12 C 68,12 82,24 82,50"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          className="text-white"
        />

        {/* Left ear cup */}
        <rect
          x="11"
          y="44"
          width="14"
          height="32"
          rx="7"
          fill="currentColor"
          className="text-white"
        />

        {/* Right ear cup */}
        <rect
          x="75"
          y="44"
          width="14"
          height="32"
          rx="7"
          fill="currentColor"
          className="text-white"
        />

        {/* ── Studio Condenser Microphone ── */}
        {/* Capsule body */}
        <rect
          x="38"
          y="26"
          width="24"
          height="40"
          rx="12"
          fill="currentColor"
          className="text-white"
        />

        {/* 3 horizontal grille bars */}
        <rect x="44" y="38" width="12" height="2.8" rx="1.4" fill="#070812" />
        <rect x="44" y="44" width="12" height="2.8" rx="1.4" fill="#070812" />
        <rect x="44" y="50" width="12" height="2.8" rx="1.4" fill="#070812" />

        {/* Cradle U-bracket */}
        <path
          d="M 33,54 C 33,70 67,70 67,54"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          className="text-white"
        />

        {/* Cradle vertical stem */}
        <path
          d="M 50,69 L 50,78"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          className="text-white"
        />

        {/* ── Signature Pink Glowing Accent Dot ── */}
        <circle
          cx="50"
          cy="86"
          r="6.5"
          fill="#FF3D81"
          className="animate-pulse"
        />
        <circle
          cx="50"
          cy="86"
          r="9"
          fill="#FF3D81"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}

/**
 * MusicaWordmark - Wordmark where the logo is integrated inside the text MUSICA:
 * - 'M'
 * - 'U': The logo rendered upside down (headband curve cups the bottom to form the U)
 * - 'S'
 * - 'I'
 * - 'C'
 * - 'A': The logo rendered right side up (headband arch forms the top of the A)
 */
export function MusicaWordmark({ className = '', style = {}, showGlow = true }) {
  return (
    <span
      className={`inline-flex items-center font-[900] italic tracking-tight text-white uppercase select-none ${className}`}
      style={style}
    >
      <span>M</span>

      {/* Logo as 'U' (upside down) */}
      <span className="inline-flex items-center justify-center mx-[0.04em] shrink-0 transform -skew-x-[11deg]">
        <MusicaLogo
          size="0.82em"
          upsideDown={true}
          showGlow={showGlow}
          className="align-middle"
        />
      </span>

      <span>S</span>
      <span>I</span>
      <span>C</span>

      {/* Logo as 'A' (right side up) */}
      <span className="inline-flex items-center justify-center mx-[0.04em] shrink-0 transform -skew-x-[11deg]">
        <MusicaLogo
          size="0.82em"
          upsideDown={false}
          showGlow={showGlow}
          className="align-middle"
        />
      </span>
    </span>
  );
}

export default MusicaLogo;
