import React, { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * MarqueeStrip - Giant outlined text strip scrolling horizontally forever.
 * Speeds up and flips direction based on user scroll velocity.
 */
export function MarqueeStrip({
  text = 'FEEL EVERY BEAT · PREMIUM SOUND · UNMATCHED CLARITY · IMMERSIVE BASS ·',
  className = '',
}) {
  const marqueeRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(1);
  const reqId = useRef(null);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    // Track scroll velocity via ScrollTrigger or scroll delta
    let lastScrollY = window.scrollY;
    let targetVelocity = 1;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Flip direction and scale velocity
      if (Math.abs(delta) > 0.5) {
        targetVelocity = delta > 0 ? 1 + Math.min(Math.abs(delta) * 0.08, 4) : -(1 + Math.min(Math.abs(delta) * 0.08, 4));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation loop with dampening
    const animate = () => {
      velocityRef.current += (targetVelocity - velocityRef.current) * 0.08;
      // Ease back to normal baseline velocity +1
      targetVelocity += (1 - targetVelocity) * 0.04;

      offsetRef.current -= velocityRef.current * 1.2;

      // Infinite wrap at 50%
      if (marqueeRef.current) {
        marqueeRef.current.style.transform = `translate3d(${offsetRef.current % 1400}px, 0, 0)`;
      }

      reqId.current = requestAnimationFrame(animate);
    };

    reqId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(reqId.current);
    };
  }, []);

  const items = Array.from({ length: 6 }).fill(text).join(' ');

  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden py-8 select-none border-y border-white/[0.06] bg-[#070812]/50 backdrop-blur-sm ${className}`}
    >
      <div
        ref={marqueeRef}
        className="whitespace-nowrap flex text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-[900] italic tracking-tighter uppercase text-transparent stroke-text"
        style={{
          WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.18)',
          willChange: 'transform',
        }}
      >
        <span className="hover:text-[#FF3D81]/30 transition-colors">{items}</span>
      </div>
    </div>
  );
}

export default MarqueeStrip;

