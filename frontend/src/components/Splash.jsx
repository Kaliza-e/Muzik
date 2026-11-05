import React, { useEffect, useState } from 'react';
import { FiZap, FiArrowRight, FiUserPlus, FiLogIn, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import MusicaLogo, { MusicaWordmark } from './MusicaLogo';
import MusicalBackground from './MusicalBackground';

// Deterministic audio bar heights to avoid impure Math.random() in render
const AUDIO_BAR_HEIGHTS = [
  40, 65, 30, 85, 45, 95, 60, 30, 75, 50,
  90, 35, 70, 85, 40, 100, 55, 30, 65, 80,
  45, 70, 90, 35, 60, 85, 50, 40, 95, 65,
  30, 80, 45, 90, 60, 35, 75, 85, 40, 70
];

function Splash({ onFinish }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070812] overflow-hidden font-['Outfit']">
      {/* Musical and glowing effects in background */}
      <MusicalBackground />

      {/* Dismiss / close button */}
      {onFinish && (
        <button
          type="button"
          onClick={onFinish}
          aria-label="Skip splash screen"
          className="absolute top-6 right-6 z-30 w-11 h-11 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/70 hover:text-white flex items-center justify-center transition-colors"
        >
          <FiX size={20} />
        </button>
      )}

      <div className="relative z-20 w-full max-w-lg px-6 text-center">
        {/* Custom Logo matching reference */}
        <div className="mb-8 animate-scale-in flex justify-center">
          <div className="w-24 h-24 rounded-[32px] bg-white/[0.05] border border-white/[0.12] flex items-center justify-center shadow-2xl relative group">
            <MusicaLogo size={58} />
          </div>
        </div>

        {/* Brand Content */}
        <div
          className={`space-y-6 transition-all duration-700 transform ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="space-y-3">
            <div className="flex justify-center">
              <MusicaWordmark className="text-6xl sm:text-7xl md:text-8xl leading-none" />
            </div>
            <div className="flex items-center justify-center gap-3 text-[#B4B2CC] text-[10px] sm:text-[11px] font-bold tracking-[0.35em] uppercase">
              <span className="h-px w-8 bg-white/10" />
              <span>Premium</span>
              <FiZap className="text-[#FF3D81]" />
              <span>Experience</span>
              <span className="h-px w-8 bg-white/10" />
            </div>
          </div>

          <p className="text-[#B4B2CC] text-lg sm:text-xl font-normal max-w-sm mx-auto leading-relaxed italic">
            &ldquo;Your rhythm, redefined by{' '}
            <span className="text-white font-semibold not-italic">innovation</span>.&rdquo;
          </p>

          <div className="flex flex-col gap-4 pt-6 max-w-xs mx-auto">
            {/* Enter Sound Button */}
            <Link
              to="/login"
              className="btn-accent w-full py-4 rounded-[20px] text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-3 shadow-lg shadow-[#FF3D81]/25"
            >
              <FiLogIn className="text-lg" />
              <span>Enter Sound</span>
              <FiArrowRight className="text-base" />
            </Link>

            {/* Join Beats Button */}
            <Link
              to="/register"
              className="btn-glass w-full py-4 rounded-[20px] text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-3"
            >
              <FiUserPlus className="text-lg text-[#FF5C93]" />
              <span>Join Beats</span>
            </Link>

            {/* Explore Landing Page Button */}
            {onFinish && (
              <button
                type="button"
                onClick={onFinish}
                className="pt-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#B4B2CC]/60 hover:text-white transition-colors"
              >
                Skip to Landing Page &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Audio Spectrum Graphic */}
        <div className="absolute bottom-[-110px] left-[-10%] right-[-10%] flex items-end justify-center gap-1.5 h-36 opacity-20 pointer-events-none">
          {AUDIO_BAR_HEIGHTS.map((height, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-gradient-to-t from-[#FF3D81] to-[#1D1B52]"
              style={{
                height: `${height}%`,
                animationDelay: `${i * 40}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Splash;
