import React, { useRef, useState } from 'react';

/**
 * TiltCard - 3D Perspective Tilt Card with Specular Glare Layer
 * Tilts with cursor position, generates specular spotlight, and springs back on leave.
 */
export function TiltCard({
  children,
  className = '',
  maxTilt = 12,
  glare = true,
  onClick,
  ...props
}) {
  const cardRef = useRef(null);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const isFine = window.matchMedia('(pointer: fine)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFine || isReduced) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
    card.style.transition = 'transform 0.1s ease-out';

    if (glare) {
      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.35,
      });
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';

    if (glare) {
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden cursor-pointer select-none ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      {...props}
    >
      {children}

      {/* Dynamic Specular Glare Layer */}
      {glare && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[inherit]"
          style={{
            background: `radial-gradient(circle 260px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.22) 0%, transparent 80%)`,
            opacity: glarePos.opacity,
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </div>
  );
}

export default TiltCard;

