import React, { useState, useEffect, useRef } from 'react';
import InteractiveVinyl from './InteractiveVinyl';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

const SAMPLE_LYRICS = [
  { time: 0, text: 'Hear the silence before the drop...' },
  { time: 4, text: 'Frequencies colliding in the dark' },
  { time: 8, text: 'Crystal clear resonance in every breath' },
  { time: 12, text: 'Your rhythm, redefined by innovation' },
  { time: 16, text: 'Feel every beat alive in your mind' },
  { time: 20, text: 'Bass reverberating through midnight city lights' },
  { time: 24, text: 'Lossless immersion, pure acoustic bliss' },
];

// Pre-seeded waveform bar heights
const WAVEFORM_HEIGHTS = [
  25, 45, 60, 35, 75, 90, 50, 65, 80, 100, 70, 55, 85, 95, 60, 40,
  70, 85, 90, 65, 50, 75, 95, 80, 60, 45, 70, 85, 90, 75, 60, 40,
  55, 70, 80, 50
];

export function NowPlayingPreview({
  track = {
    title: 'Sonic Frontiers',
    artist: 'Musica Studio Sessions',
    cover: '/images/card-vinyl.jpg',
    duration: 30,
  },
  onPlayToggle,
  isExternalPlaying,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(6);
  const [volume, setVolume] = useState(0.8);
  const lyricsContainerRef = useRef(null);

  // Sync external playing state if provided
  useEffect(() => {
    if (typeof isExternalPlaying === 'boolean') {
      setIsPlaying(isExternalPlaying);
    }
  }, [isExternalPlaying]);

  // Playback timer simulation
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev + 1 >= 28) return 0;
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Find active lyric index
  const activeLyricIndex = SAMPLE_LYRICS.reduce((acc, item, index) => {
    if (currentTime >= item.time) return index;
    return acc;
  }, 0);

  // Auto-scroll lyrics smoothly
  useEffect(() => {
    if (lyricsContainerRef.current) {
      const activeEl = lyricsContainerRef.current.children[activeLyricIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeLyricIndex]);

  const togglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (onPlayToggle) onPlayToggle(next);
  };

  const progressPct = (currentTime / 28) * 100;

  return (
    <div className="surface-card p-6 sm:p-8 rounded-[36px] border border-white/[0.1] bg-[#0B0D1F]/90 shadow-2xl backdrop-blur-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Spinning Vinyl + Cover Art */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group">
            {/* Spinning vinyl disc extending outward */}
            <div className="relative flex items-center justify-center">
              <InteractiveVinyl
                isPlaying={isPlaying}
                coverImage={track.cover || '/images/card-vinyl.jpg'}
                size={220}
              />
            </div>
          </div>
        </div>

        {/* Right: Track Details, Interactive Waveform & Synchronized Lyrics */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FF5C93] block mb-1">
              NOW STREAMING
            </span>
            <h3 className="text-2xl sm:text-3xl font-[900] italic text-white tracking-tight">
              {track.title}
            </h3>
            <p className="text-sm text-[#B4B2CC] font-medium">{track.artist}</p>
          </div>

          {/* Interactive Waveform whose bars fill pink as progress advances */}
          <div className="space-y-2">
            <div className="flex items-end justify-between gap-1.5 h-12 bg-white/[0.03] p-2 rounded-2xl border border-white/[0.06]">
              {WAVEFORM_HEIGHTS.map((h, i) => {
                const barPct = (i / WAVEFORM_HEIGHTS.length) * 100;
                const isFilled = barPct <= progressPct;

                return (
                  <span
                    key={i}
                    className="flex-1 rounded-full transition-colors duration-150 origin-bottom"
                    style={{
                      height: `${h}%`,
                      background: isFilled
                        ? 'linear-gradient(180deg, #FF3D81, #E0246A)'
                        : 'rgba(255, 255, 255, 0.15)',
                      boxShadow: isFilled ? '0 0 8px rgba(255, 61, 129, 0.6)' : 'none',
                    }}
                  />
                );
              })}
            </div>

            <div className="flex justify-between text-[10px] font-mono text-[#B4B2CC] tabular-nums px-1">
              <span>0:{currentTime < 10 ? `0${currentTime}` : currentTime}</span>
              <span>0:28</span>
            </div>
          </div>

          {/* Synchronized Scrolling Lyrics */}
          <div className="p-4 rounded-2xl bg-[#070812]/80 border border-white/[0.06] h-28 overflow-y-auto no-scrollbar relative">
            <div ref={lyricsContainerRef} className="space-y-2">
              {SAMPLE_LYRICS.map((line, idx) => {
                const isActive = idx === activeLyricIndex;
                return (
                  <p
                    key={idx}
                    className={`text-xs sm:text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-white scale-[1.03] font-bold origin-left drop-shadow-[0_0_8px_rgba(255,61,129,0.5)]'
                        : 'text-white/35 scale-100'
                    }`}
                  >
                    {line.text}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Previous track"
                onClick={() => setCurrentTime(0)}
                className="text-[#B4B2CC] hover:text-white transition-colors"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="w-12 h-12 rounded-full bg-[#FF3D81] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#FF3D81]/30"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                aria-label="Next track"
                onClick={() => setCurrentTime(0)}
                className="text-[#B4B2CC] hover:text-white transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#B4B2CC]" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#FF3D81]"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NowPlayingPreview;

