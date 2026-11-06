import React, { useRef, useState, useEffect } from 'react';
import EqualizerBars from './EqualizerBars';

const HEADLINE_TEXT = 'ENTER SOUND.';

/**
 * FooterHeadline - Interactive letters that scale and glow based on cursor proximity,
 * with a thin row of 32 bouncing equalizer bars along the bottom.
 */
export function FooterHeadline({ className = '' }) {
  const containerRef = useRef(null);
  const letterRefs = useRef([]);
  const [scales, setScales] = useState(() => Array(HEADLINE_TEXT.length).fill(1));
  const [glows, setGlows] = useState(() => Array(HEADLINE_TEXT.length).fill(0));

  useEffect(() => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFine || isReduced) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const newScales = [];
      const newGlows = [];

      for (let i = 0; i < letterRefs.current.length; i++) {
        const el = letterRefs.current[i];
        if (!el) {
          newScales.push(1);
          newGlows.push(0);
          continue;
        }

        const rect = el.getBoundingClientRect();
        const letterCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };

        const dist = Math.hypot(e.clientX - letterCenter.x, e.clientY - letterCenter.y);
        const threshold = 160;

        if (dist < threshold) {
          const factor = 1 - dist / threshold;
          newScales.push(1 + factor * 0.28);
          newGlows.push(factor);
        } else {
          newScales.push(1);
          newGlows.push(0);
        }
      }

      setScales(newScales);
      setGlows(newGlows);
    };

    const handleMouseLeave = () => {
      setScales(Array(HEADLINE_TEXT.length).fill(1));
      setGlows(Array(HEADLINE_TEXT.length).fill(0));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    containerRef.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative flex flex-col items-center ${className}`}>
      {/* Reactive letters */}
      <div className="flex items-center justify-center select-none flex-wrap">
        {HEADLINE_TEXT.split('').map((char, index) => {
          const scale = scales[index] || 1;
          const glow = glows[index] || 0;

          return (
            <span
              key={index}
              ref={(el) => (letterRefs.current[index] = el)}
              className="inline-block font-[900] italic tracking-tighter uppercase transition-transform duration-150 ease-out origin-center"
              style={{
                fontSize: 'clamp(48px, 11vw, 150px)',
                lineHeight: 0.95,
                transform: `scale(${scale})`,
                color: glow > 0.1 ? '#FFFFFF' : '#FFFFFF',
                textShadow:
                  glow > 0.05
                    ? `0 0 ${20 * glow}px rgba(255, 61, 129, ${0.4 + glow * 0.5}), 0 0 ${40 * glow}px rgba(255, 61, 129, 0.4)`
                    : 'none',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </div>

      {/* Row of equalizer bars along the bottom */}
      <div className="w-full max-w-xl mt-8">
        <EqualizerBars barCount={32} height="28px" barWidth="4px" />
      </div>
    </div>
  );
}

export default FooterHeadline;

