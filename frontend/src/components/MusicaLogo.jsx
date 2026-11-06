import React, { useRef, useEffect } from 'react';

/**
 * MusicaLogo - Custom vector logo matching the user's design reference:
 * Over-ear headphones enclosing a capsule studio microphone with 3 grille bars,
 * a U-bracket cradle, and a signature glowing pink accent dot at the base.
 *
 * Micro-animations:
 * - The microphone gently sways (±3°, 3s).
 * - The tiny pink dot blinks like a record light.
 */
export function MusicaLogo({
  size = 32,
  className = '',
  showGlow = true,
  upsideDown = false,
  isSwaying = true,
  glowIntensity = 1,
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
          className="absolute inset-0 rounded-full blur-[9px] bg-[#FF3D81]/35 pointer-events-none scale-110 transition-all duration-300"
          style={{
            opacity: 0.35 * glowIntensity,
            transform: `scale(${1 + glowIntensity * 0.15})`,
          }}
          aria-hidden="true"
        />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_2px_8px_rgba(255,61,129,0.3)] overflow-visible"
        aria-hidden="true"
      >
        {/* ── Over-ear Headphones ── */}
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

        {/* ── Studio Condenser Microphone (Gently sways ±3°) ── */}
        <g className={isSwaying ? 'animate-mic-sway' : ''}>
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

          {/* ── Signature Record Light Pink Dot (Blinking) ── */}
          <circle
            cx="50"
            cy="86"
            r="6.5"
            fill="#FF3D81"
            className="animate-record-blink"
          />
          <circle
            cx="50"
            cy="86"
            r="10"
            fill="#FF3D81"
            opacity="0.3"
            className="animate-pulse"
          />
        </g>
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
 *
 * Interactivity:
 * - 3D parallax on mouse move: shifts ±12px, tilts ±5°, with icons moving 1.4x farther for depth.
 */
export function MusicaWordmark({
  className = '',
  style = {},
  showGlow = true,
  enableParallax = false,
  ignited = false,
}) {
  const containerRef = useRef(null);
  const iconURef = useRef(null);
  const iconARef = useRef(null);

  useEffect(() => {
    if (!enableParallax) return;

    const isFine = window.matchMedia('(pointer: fine)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFine || isReduced) return;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // Normalized between -1 and 1
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;

      // Parallax shifts up to ±12px, 3D tilt rotateX/Y ±5deg
      const shiftX = normX * 12;
      const shiftY = normY * 12;
      const rotX = -normY * 5;
      const rotY = normX * 5;

      if (containerRef.current) {
        containerRef.current.style.transform = `perspective(1000px) translate3d(${shiftX.toFixed(
          2
        )}px, ${shiftY.toFixed(2)}px, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(
          2
        )}deg)`;
      }

      // Icons move 1.4x farther for holographic depth
      const iconShiftX = shiftX * 1.4;
      const iconShiftY = shiftY * 1.4;
      if (iconURef.current) {
        iconURef.current.style.transform = `translate3d(${iconShiftX.toFixed(
          2
        )}px, ${iconShiftY.toFixed(2)}px, 12px) -skew-x-[11deg]`;
      }
      if (iconARef.current) {
        iconARef.current.style.transform = `translate3d(${iconShiftX.toFixed(
          2
        )}px, ${iconShiftY.toFixed(2)}px, 12px) -skew-x-[11deg]`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enableParallax]);

  return (
    <span
      ref={containerRef}
      className={`inline-flex items-center font-[900] italic tracking-tight text-white uppercase select-none transition-transform duration-200 ease-out ${className}`}
      style={{ ...style, transformStyle: 'preserve-3d' }}
    >
      <span className="logo-letter inline-block">M</span>

      {/* Logo as 'U' (upside down) */}
      <span
        ref={iconURef}
        className="logo-icon-u inline-flex items-center justify-center mx-[0.04em] shrink-0 transform -skew-x-[11deg] transition-transform duration-200"
      >
        <MusicaLogo
          size="0.82em"
          upsideDown={true}
          showGlow={showGlow}
          glowIntensity={ignited ? 2 : 1}
          className="align-middle"
        />
      </span>

      <span className="logo-letter inline-block">S</span>
      <span className="logo-letter inline-block">I</span>
      <span className="logo-letter inline-block">C</span>

      {/* Logo as 'A' (right side up) */}
      <span
        ref={iconARef}
        className="logo-icon-a inline-flex items-center justify-center mx-[0.04em] shrink-0 transform -skew-x-[11deg] transition-transform duration-200"
      >
        <MusicaLogo
          size="0.82em"
          upsideDown={false}
          showGlow={showGlow}
          glowIntensity={ignited ? 2 : 1}
          className="align-middle"
        />
      </span>
    </span>
  );
}

export default MusicaLogo;
