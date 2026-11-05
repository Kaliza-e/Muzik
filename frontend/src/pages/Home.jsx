import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Splash from '../components/Splash';
import MusicalBackground from '../components/MusicalBackground';
import { MusicaWordmark } from '../components/MusicaLogo';
import { spotifyAPI } from '../api';
import { Play, Pause, Music, Volume2, ArrowUpRight } from 'lucide-react';

function Home() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('hasShownSplash');
  });

  // Real backend music state
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [activeTrack, setActiveTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const loadMusic = async () => {
      try {
        const data = await spotifyAPI.getNewReleases();
        if (isMounted && data && data.length > 0) {
          setTrendingTracks(data.slice(0, 8));
          setActiveTrack(data[0]);
        }
      } catch (err) {
        console.error("Landing page music fetch failed:", err);
      }
    };
    loadMusic();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasShownSplash', 'true');
  };

  const handleTrackPlay = (track) => {
    if (activeTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    } else {
      setActiveTrack(track);
      setIsPlaying(true);
      setTimeout(() => {
        audioRef.current?.play().catch(() => setIsPlaying(false));
      }, 50);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070812] text-white font-['Outfit'] selection:bg-[#FF3D81] selection:text-white">
      {/* Optional one-time Splash */}
      {showSplash && <Splash onFinish={handleSplashFinish} />}

      {/* Musical and Glowing Music Effects in Background */}
      <MusicalBackground />

      {/* Hidden audio element for landing page music sample playback */}
      <audio
        ref={audioRef}
        src={activeTrack?.preview_url}
        onEnded={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => setIsPlaying(false));
          }
        }}
      />

      <Navbar />

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION
          ───────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative z-10 pt-32 sm:pt-40 md:pt-48 pb-0 flex flex-col items-center text-center px-4 sm:px-6"
      >
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-3 mb-6 reveal-on-scroll">
          <span className="h-px w-6 sm:w-10 bg-white/20" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-[#B4B2CC]">
            PREMIUM · EXPERIENCE
          </span>
          <span className="h-px w-6 sm:w-10 bg-white/20" />
        </div>

        {/* Huge MUSICA Wordmark with integrated logo on U (upside down) and A (upright) */}
        <h1 className="reveal-on-scroll leading-[0.9] select-none flex justify-center">
          <MusicaWordmark
            style={{ fontSize: 'clamp(52px, 11vw, 160px)' }}
            showGlow={true}
          />
        </h1>

        {/* Tagline */}
        <p className="mt-6 text-base sm:text-lg md:text-xl italic font-normal text-[#B4B2CC] max-w-xl mx-auto reveal-on-scroll">
          &ldquo;Your rhythm, redefined by{' '}
          <span className="text-white font-semibold not-italic">innovation</span>.&rdquo;
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 z-20 reveal-on-scroll">
          <Link
            to="/login"
            className="btn-accent px-8 sm:px-10 py-3.5 sm:py-4 text-xs font-bold tracking-widest uppercase rounded-[20px] shadow-lg shadow-[#FF3D81]/25 hover:shadow-[#FF3D81]/40"
          >
            Enter Sound
          </Link>
          <Link
            to="/register"
            className="btn-glass px-8 sm:px-10 py-3.5 sm:py-4 text-xs font-bold tracking-widest uppercase rounded-[20px]"
          >
            Join Beats
          </Link>
        </div>

        {/* Arched Photo Rising From Bottom */}
        <div className="mt-14 sm:mt-20 w-full max-w-4xl px-4 flex justify-center">
          <div className="relative w-full max-w-[820px] h-[280px] sm:h-[380px] md:h-[460px] overflow-hidden asym-arch border-t border-x border-white/10 shadow-2xl bg-[#0B0D1F]">
            <img
              src="/images/hero-artist.jpg"
              alt="Artist in studio headphones illuminated by warm cinematic lighting"
              width="820"
              height="460"
              loading="lazy"
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 hover:scale-110"
            />
            {/* Duotone magenta-navy overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070812] via-[#4A1236]/35 to-transparent mix-blend-multiply pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070812] via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. WEAR ALL DAY IN TOTAL COMFORT
          ───────────────────────────────────────────────────────────── */}
      <section
        id="discover"
        className="relative z-10 bg-[#0B0D1F] pt-28 sm:pt-36 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-20"
      >
        {/* SVG Wave divider at top filled with #070812 */}
        <div className="wave-divider text-[#070812]">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C380,85 740,20 1080,70 C1260,95 1380,45 1440,25 L1440,0 L0,0 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text & Chips */}
          <div className="lg:col-span-6 space-y-6 reveal-on-scroll">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF5C93] block">
              AUDIO QUALITY
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-[900] italic tracking-tight text-white leading-[1.08]">
              Wear all day in <br className="hidden sm:inline" />total comfort
            </h2>
            <p className="text-[#B4B2CC] text-base sm:text-lg leading-relaxed max-w-lg font-normal">
              Crystal-clear sound that follows you from the first coffee to the last train home.
            </p>

            {/* Chips */}
            <div className="pt-4 flex flex-wrap gap-3">
              <span className="px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.09] text-xs font-semibold text-white/90 hover:border-white/25 transition-colors">
                Lossless audio
              </span>
              <span className="px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.09] text-xs font-semibold text-white/90 hover:border-white/25 transition-colors">
                Offline playlists
              </span>
              <span className="px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.09] text-xs font-semibold text-white/90 hover:border-white/25 transition-colors">
                Spatial sound
              </span>
            </div>
          </div>

          {/* Right Column: Asymmetric Photo with Pink Hotspot */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end reveal-on-scroll">
            <div className="relative w-full max-w-[460px] aspect-[4/3] sm:aspect-square asym-corner-1 overflow-hidden border border-white/[0.09] bg-[#070812] shadow-2xl group">
              <img
                src="/images/comfort-headphones.jpg"
                alt="Close-up of premium comfortable headphones resting on listener"
                width="460"
                height="460"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Duotone Treatment */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0D1F]/70 via-[#4A1236]/30 to-transparent pointer-events-none" />
              <div className="photo-legibility-grad" />

              {/* Pink Hotspot Callout */}
              <div className="absolute top-[38%] right-[18%] z-20 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#070812]/85 backdrop-blur-md border border-white/20 shadow-xl pointer-events-auto">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3D81] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF3D81]" />
                </span>
                <span className="text-[11px] font-bold text-white tracking-wide">
                  Powerful bass
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. REAL BACKEND MUSIC STREAMING PREVIEW
          ───────────────────────────────────────────────────────────── */}
      <section
        id="live-music"
        className="relative z-10 bg-[#070812] pt-24 sm:pt-32 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-20"
      >
        {/* Wave divider at top filled with #0B0D1F */}
        <div className="wave-divider text-[#0B0D1F]">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C340,75 700,25 1060,65 C1240,85 1370,40 1440,20 L1440,0 L0,0 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF5C93] block mb-2">
                LIVE SOUND STREAM
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-[900] italic tracking-tight text-white">
                Listen straight from the source
              </h2>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF5C93] hover:text-white transition-colors"
            >
              <span>Explore All in Dashboard</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Live Tracks Grid loaded directly from backend API */}
          {trendingTracks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trendingTracks.map((track) => {
                const isCurrentPlaying = activeTrack?.id === track.id && isPlaying;
                return (
                  <div
                    key={track.id}
                    onClick={() => handleTrackPlay(track)}
                    className="p-4 rounded-[26px] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative aspect-square rounded-[20px] overflow-hidden mb-3.5 bg-[#0B0D1F]">
                      <img
                        src={track.cover}
                        alt={track.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#FF3D81] text-white flex items-center justify-center shadow-lg">
                          {isCurrentPlaying ? (
                            <Pause className="w-5 h-5 fill-current" />
                          ) : (
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          )}
                        </div>
                      </div>
                      {isCurrentPlaying && (
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#FF3D81] text-[9px] font-bold text-white tracking-wider uppercase shadow-md flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          Playing
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-[#FF5C93] transition-colors">
                        {track.title}
                      </h4>
                      <p className="text-xs text-[#B4B2CC] truncate font-normal">
                        {track.artist}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center surface-card">
              <Music className="w-8 h-8 text-[#B4B2CC]/40 mx-auto mb-2 animate-bounce" />
              <p className="text-sm text-[#B4B2CC]">Connecting to music backend...</p>
            </div>
          )}

          {/* Active track bar if playing on landing page */}
          {activeTrack && (
            <div className="surface-floating rounded-full px-6 py-3.5 flex items-center justify-between gap-4 border border-white/[0.12] shadow-2xl">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={activeTrack.cover}
                  alt={activeTrack.title}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/20"
                />
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-white truncate italic uppercase tracking-wider">
                    {activeTrack.title}
                  </h5>
                  <p className="text-[10px] text-[#B4B2CC] truncate">{activeTrack.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleTrackPlay(activeTrack)}
                  className="w-9 h-9 rounded-full bg-[#FF3D81] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex btn-accent px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase"
                >
                  Open in Player
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. BUILT TO FEEL ALIVE (3 Asymmetric Cards)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="artists"
        className="relative z-10 bg-[#1D0F2C] pt-28 sm:pt-36 pb-28 sm:pb-36 px-6 sm:px-10 lg:px-20"
      >
        {/* SVG Wave divider at top filled with #070812 */}
        <div className="wave-divider text-[#070812]">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C320,70 640,110 980,50 C1160,20 1340,65 1440,40 L1440,0 L0,0 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20 space-y-3 reveal-on-scroll">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF5C93] block">
              MADE FOR YOU
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-[900] italic tracking-tight text-white">
              Built to feel alive
            </h2>
          </div>

          {/* 3 Asymmetric Photo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="surface-card p-4 sm:p-5 flex flex-col group reveal-on-scroll">
              <div className="relative aspect-[4/3] w-full asym-corner-2 overflow-hidden bg-[#070812] border border-white/[0.08] mb-6">
                <img
                  src="/images/card-vinyl.jpg"
                  alt="Hands handling vintage vinyl record under soft studio glow"
                  width="400"
                  height="300"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D0F2C]/80 via-transparent to-transparent pointer-events-none" />
              </div>
              <h3 className="text-xl sm:text-2xl font-[900] italic text-white tracking-tight mb-2">
                Your daily mix
              </h3>
              <p className="text-sm text-[#B4B2CC] leading-relaxed font-normal">
                Playlists that learn your mood and keep it moving.
              </p>
            </div>

            {/* Card 2 */}
            <div className="surface-card p-4 sm:p-5 flex flex-col group reveal-on-scroll">
              <div className="relative aspect-[4/3] w-full asym-corner-3 overflow-hidden bg-[#070812] border border-white/[0.08] mb-6">
                <img
                  src="/images/card-crowd.jpg"
                  alt="Vibrant concert audience bathed in laser lights"
                  width="400"
                  height="300"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D0F2C]/80 via-transparent to-transparent pointer-events-none" />
              </div>
              <h3 className="text-xl sm:text-2xl font-[900] italic text-white tracking-tight mb-2">
                Live with artists
              </h3>
              <p className="text-sm text-[#B4B2CC] leading-relaxed font-normal">
                Step closer to the music you love, as it happens.
              </p>
            </div>

            {/* Card 3 */}
            <div className="surface-card p-4 sm:p-5 flex flex-col group reveal-on-scroll">
              <div className="relative aspect-[4/3] w-full asym-corner-4 overflow-hidden bg-[#070812] border border-white/[0.08] mb-6">
                <img
                  src="/images/card-commute.jpg"
                  alt="City lights reflecting during a nocturnal transit commute"
                  width="400"
                  height="300"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D0F2C]/80 via-transparent to-transparent pointer-events-none" />
              </div>
              <h3 className="text-xl sm:text-2xl font-[900] italic text-white tracking-tight mb-2">
                Anywhere, offline
              </h3>
              <p className="text-sm text-[#B4B2CC] leading-relaxed font-normal">
                Download once, play through every tunnel and flight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. FINAL CTA & FOOTER
          ───────────────────────────────────────────────────────────── */}
      <section
        id="premium"
        className="relative z-10 bg-[#070812] pt-32 sm:pt-40 pb-16 sm:pb-20 px-6 sm:px-10 text-center"
      >
        {/* SVG Wave divider at top filled with #1D0F2C */}
        <div className="wave-divider text-[#1D0F2C]">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C420,90 780,10 1120,65 C1280,90 1390,40 1440,20 L1440,0 L0,0 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 reveal-on-scroll">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-[900] italic tracking-tight text-white leading-none">
            Enter sound.
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4">
            <Link
              to="/login"
              className="btn-accent px-8 sm:px-10 py-3.5 sm:py-4 text-xs font-bold tracking-widest uppercase rounded-[20px] shadow-lg shadow-[#FF3D81]/25 hover:shadow-[#FF3D81]/40"
            >
              Enter Sound
            </Link>
            <Link
              to="/register"
              className="btn-glass px-8 sm:px-10 py-3.5 sm:py-4 text-xs font-bold tracking-widest uppercase rounded-[20px]"
            >
              Join Beats
            </Link>
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className="mt-28 sm:mt-36 pt-8 border-t border-white/[0.08] max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-normal text-[#B4B2CC]/70">
          <div>
            &copy; {new Date().getFullYear()} Musica. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms</a>
            <a href="#help" className="hover:text-white transition-colors">Help</a>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default Home;
