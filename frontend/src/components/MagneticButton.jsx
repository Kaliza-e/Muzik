import React, { useRef, useEffect } from 'react';

/**
 * MagneticButton - Magnetic button wrapper:
 * Pulls toward cursor within 80px radius (max 10px translation), springs back on leave.
 * Disabled on touch/coarse devices and prefers-reduced-motion.
 */
export function MagneticButton({ children, className = '', maxDistance = 10, ...props }) {
  const btnRef = useRef(null);

  useEffect(() => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFine || isReduced) return;

    const btn = btnRef.current;
    if (!btn) return;

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.hypot(distX, distY);

      if (distance < 80) {
        // Normalize and scale to maxDistance
        const pullFactor = 1 - distance / 80;
        const moveX = (distX / distance) * (maxDistance * pullFactor);
        const moveY = (distY / distance) * (maxDistance * pullFactor);

        btn.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`;
        btn.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)';
      } else {
        btn.style.transform = 'translate3d(0, 0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    };

    const handleMouseLeave = () => {
      btn.style.transform = 'translate3d(0, 0, 0)';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxDistance]);

  return (
    <div ref={btnRef} className={`inline-block ${className}`} {...props}>
      {children}
    </div>
  );
}

export default MagneticButton;

