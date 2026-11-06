import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MusicaLogo from './MusicaLogo';

/**
 * PageTransition - Full-screen pink curtain wipe with spinning logo icon for 0.6s on route changes.
 */
export function PageTransition() {
  const location = useLocation();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Skip initial load
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    setAnimating(true);
    const timer = setTimeout(() => {
      setAnimating(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!animating) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden"
    >
      {/* Pink gradient curtain sliding across */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF3D81] via-[#E0246A] to-[#1D0F2C] transform -translate-x-full animate-curtain-wipe" />

      {/* Spinning logo icon in the middle */}
      <div className="relative z-10 animate-spin-fast">
        <div className="p-4 rounded-3xl bg-[#070812]/80 backdrop-blur-md border border-white/20 shadow-2xl">
          <MusicaLogo size={54} />
        </div>
      </div>

      <style>{`
        @keyframes curtainWipe {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-curtain-wipe {
          animation: curtainWipe 0.6s cubic-bezier(0.77, 0, 0.175, 1) forwards;
        }
        @keyframes spinFast {
          0% {
            transform: rotate(0deg) scale(0.7);
            opacity: 0;
          }
          50% {
            transform: rotate(180deg) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) scale(0.7);
            opacity: 0;
          }
        }
        .animate-spin-fast {
          animation: spinFast 0.6s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}

export default PageTransition;

