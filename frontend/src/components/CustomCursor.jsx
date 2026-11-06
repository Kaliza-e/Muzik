import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor - Desktop interactive cursor with:
 * 1. Soft pink radial cursor glow (lerp 0.12)
 * 2. Trailing ring that expands on buttons/links and shows "PLAY" over album art
 * 3. Click feedback ripple rings
 * 4. Disabled on touch devices and prefers-reduced-motion
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursorState, setCursorState] = useState({ isHover: false, isPlay: false });
  const [ripples, setRipples] = useState([]);

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);

  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const glowPos = useRef({ x: -100, y: -100 });
  const reqId = useRef(null);

  useEffect(() => {
    // Only enable on desktop pointer:fine and when reduced-motion is off
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) return;

    setEnabled(true);
    document.body.classList.add('has-custom-cursor');

    const handleMouseMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };

      // Update dot position immediately for 0 latency
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Check hover targets
      const target = e.target.closest('button, a, [role="button"], input, .btn-accent, .btn-glass');
      const isCard = e.target.closest('.album-card, .song-card-hover, [data-cursor="play"]');

      if (isCard) {
        setCursorState({ isHover: true, isPlay: true });
      } else if (target) {
        setCursorState({ isHover: true, isPlay: false });
      } else {
        setCursorState({ isHover: false, isPlay: false });
      }
    };

    const handleClick = (e) => {
      // Create ripple ring on click
      const id = Date.now() + Math.random();
      const newRipple = { id, x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-4), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 650);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);

    // Lerp loop for trailing ring and cursor glow
    const render = () => {
      // Lerp factor 0.12 as specified in prompt
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;

      glowPos.current.x += (pos.current.x - glowPos.current.x) * 0.08;
      glowPos.current.y += (pos.current.y - glowPos.current.y) * 0.08;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPos.current.x}px, ${glowPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      reqId.current = requestAnimationFrame(render);
    };

    reqId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(reqId.current);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Soft pink cursor glow following with lerp */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-[420px] h-[420px] rounded-full pointer-events-none z-10 opacity-30 mix-blend-screen transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(255,61,129,0.35) 0%, rgba(29,27,82,0.15) 45%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* Primary pinpoint dot */}
      <div ref={dotRef} className="cursor-dot" />

      {/* Trailing ring (expands or shows PLAY) */}
      <div
        ref={ringRef}
        className={`cursor-ring ${cursorState.isHover ? 'is-hover' : ''} ${
          cursorState.isPlay ? 'is-play' : ''
        }`}
      >
        {cursorState.isPlay && <span>PLAY</span>}
      </div>

      {/* Click ripple rings */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-circle"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
            width: '24px',
            height: '24px',
            marginLeft: '-12px',
            marginTop: '-12px',
          }}
        />
      ))}
    </>
  );
}

export default CustomCursor;

