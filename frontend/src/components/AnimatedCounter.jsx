import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCounter - Numbers count up smoothly when entering viewport,
 * with a quick pink flash on completion.
 */
export function AnimatedCounter({
  endValue = 100,
  duration = 1.8,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const [currentVal, setCurrentVal] = useState(0);
  const [completed, setCompleted] = useState(false);
  const ref = useRef(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setCurrentVal(endValue);
      setCompleted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;

          const startTime = performance.now();
          const step = (now) => {
            const elapsed = (now - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out expo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const value = easeProgress * endValue;

            setCurrentVal(value);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCurrentVal(endValue);
              setCompleted(true);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.25 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [endValue, duration]);

  const formattedValue =
    decimals > 0
      ? currentVal.toFixed(decimals)
      : Math.floor(currentVal).toLocaleString();

  return (
    <span
      ref={ref}
      className={`tabular-nums transition-all duration-300 ${
        completed ? 'text-white drop-shadow-[0_0_12px_rgba(255,61,129,0.7)]' : ''
      } ${className}`}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}

export default AnimatedCounter;

