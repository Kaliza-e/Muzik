import React, { useEffect, useRef, useState } from 'react';

// Pre-seeded randomized speeds and phases for smooth CSS bouncing
const BAR_PARAMS = Array.from({ length: 32 }).map((_, i) => ({
  id: i,
  duration: (0.45 + (i * 0.17) % 0.75).toFixed(2),
  delay: ((i * 0.11) % 0.8).toFixed(2),
  minScale: 0.18 + (i % 5) * 0.05,
}));

export function EqualizerBars({
  audioRef,
  isPlaying = false,
  className = '',
  barCount = 32,
  barWidth = '3px',
  height = '36px',
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameId = useRef(null);
  const barsRef = useRef([]);

  // Pause when off-screen or tab hidden
  useEffect(() => {
    const handleVisibility = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
    };
  }, []);

  // Web Audio AnalyserNode (if live audio is playing)
  useEffect(() => {
    if (!audioRef?.current || !isPlaying) return;

    try {
      if (!analyserRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const audioCtx = new AudioContext();
          const source = audioCtx.createMediaElementSource(audioRef.current);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyser.connect(audioCtx.destination);

          analyserRef.current = analyser;
          dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        }
      }
    } catch {
      // Browsers restrict connecting media elements multiple times across cross-origin audio;
      // fallback smoothly to procedural audio-reactive bounce
    }

    const updateAudioBars = () => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        for (let i = 0; i < barsRef.current.length; i++) {
          const bar = barsRef.current[i];
          if (bar) {
            const val = (dataArrayRef.current[i % dataArrayRef.current.length] || 50) / 255;
            const scale = Math.max(0.15, val * 1.1);
            bar.style.transform = `scaleY(${scale})`;
          }
        }
      }
      animationFrameId.current = requestAnimationFrame(updateAudioBars);
    };

    if (analyserRef.current) {
      animationFrameId.current = requestAnimationFrame(updateAudioBars);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [audioRef, isPlaying]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`flex items-end justify-center gap-1.5 select-none ${className}`}
      style={{ height }}
    >
      {BAR_PARAMS.slice(0, barCount).map((bar, i) => (
        <span
          key={bar.id}
          ref={(el) => (barsRef.current[i] = el)}
          className="rounded-full bg-gradient-to-t from-[#1D1B52] to-[#FF3D81] transition-transform origin-bottom"
          style={{
            width: barWidth,
            height: '100%',
            opacity: isPlaying ? 0.95 : 0.65,
            animation: isVisible && !analyserRef.current
              ? `bounceBar ${bar.duration}s ease-in-out infinite alternate ${bar.delay}s`
              : 'none',
            transform: 'scaleY(0.25)',
          }}
        />
      ))}

      <style>{`
        @keyframes bounceBar {
          0% { transform: scaleY(0.2); opacity: 0.5; }
          50% { transform: scaleY(0.9); opacity: 0.95; }
          100% { transform: scaleY(0.35); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

export default EqualizerBars;

