import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Splash from '../components/Splash';
import MusicalBackground from '../components/MusicalBackground';
import { MusicaWordmark } from '../components/MusicaLogo';
import MagneticButton from '../components/MagneticButton';
import MarqueeStrip from '../components/MarqueeStrip';
import TiltCard from '../components/TiltCard';
import NowPlayingPreview from '../components/NowPlayingPreview';
import FooterHeadline from '../components/FooterHeadline';
import AnimatedCounter from '../components/AnimatedCounter';
import EqualizerBars from '../components/EqualizerBars';
import InteractiveVinyl from '../components/InteractiveVinyl';
import { useLenis } from '../hooks/useLenis';
import { spotifyAPI } from '../api';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Play,
  Pause,
  ArrowUpRight,
  Sparkles,
  Check,
  Disc,
  Radio,
  Sliders,
  ChevronRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Curated Artists for Section C
const FEATURED_ARTISTS = [
  { id: 1, name: 'Khalid', role: 'R&B / Soul', image: '/images/hero-artist.jpg' },
  { id: 2, name: 'Post Malone', role: 'Hip-Hop / Pop', image: '/images/card-crowd.jpg' },
  { id: 3, name: 'Billie Eilish', role: 'Alt / Electro', image: '/images/comfort-headphones.jpg' },
  { id: 4, name: 'Zach Bryan', role: 'Country / Folk', image: '/images/card-vinyl.jpg' },
  { id: 5, name: 'Frank Ocean', role: 'Neo-Soul / Ambient', image: '/images/card-commute.jpg' },
];

function Home() {
  // Smooth Inertia Scrolling
  useLenis();

  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('hasShownSplash'));
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [activeTrack, setActiveTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ignited, setIgnited] = useState(false);
  const [showStickyPlayer, setShowStickyPlayer] = useState(false);
  const [scrollHue, setScrollHue] = useState(0);

  const heroGlowRef = useRef(null);
  const heroEyebrowLineLeft = useRef(null);
  const heroEyebrowLineRight = useRef(null);
  const heroEyebrowText = useRef(null);
  const audioRef = useRef(null);

  // Load Real Tracks from Backend API
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
        console.error('Landing page music fetch failed:', err);
      }
    };
    loadMusic();
    return () => {
      isMounted = false;
    };
  }, []);

  // ═══ 1. PAGE-LOAD HERO SEQUENCE (~2s, plays once) ═══
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // Step 1: Background fades up from black + radial glow scales 0.6 -> 1
    if (heroGlowRef.current) {
      tl.fromTo(
        heroGlowRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 0.75, duration: 1.2 }
      );
    }

    // Step 3: Eyebrow lines draw outward from text (scaleX 0 -> 1, 0.6s)
    if (heroEyebrowLineLeft.current && heroEyebrowLineRight.current) {
      tl.fromTo(
        [heroEyebrowLineLeft.current, heroEyebrowLineRight.current],
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, stagger: 0.08, transformOrigin: 'center' },
        '-=0.9'
      );
    }

    // Eyebrow letters fade in with wide tracking collapse (.6em -> .3em)
    if (heroEyebrowText.current) {
      tl.fromTo(
        heroEyebrowText.current,
        { letterSpacing: '0.65em', opacity: 0 },
        { letterSpacing: '0.35em', opacity: 1, duration: 0.8 },
        '-=0.7'
      );
    }

    // Step 4: Logo MUSICA letters slam in from below with skew (skewX -12°, y +60px to 0, staggered 80ms)
    tl.fromTo(
      '.hero-logo .logo-letter',
      { y: 65, skewX: -12, opacity: 0 },
      { y: 0, skewX: 0, opacity: 1, duration: 0.85, stagger: 0.08, ease: 'expo.out' },
      '-=0.6'
    );

    // The two mic/headphone icons pop in last with elastic scale (0 to 1, back.out 2)
    tl.fromTo(
      ['.hero-logo .logo-icon-u', '.hero-logo .logo-icon-a'],
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.75,
        ease: 'back.out(2)',
        stagger: 0.12,
        onComplete: () => {
          // Ignite: pink glow flashes to 2x then settles
          setIgnited(true);
          setTimeout(() => setIgnited(false), 550);
        },
      },
      '-=0.3'
    );

    // Step 5: Tagline fades up word by word
    tl.fromTo(
      '.tagline-word',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 },
      '-=0.3'
    );

    // Step 6: Buttons rise 24px with stagger
    tl.fromTo(
      '.hero-action-btn',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
      '-=0.2'
    );

    // Step 7: Arch photo/vinyl rises from below with slight rotation
    tl.fromTo(
      '.hero-arch-container',
      { y: 70, rotation: -2, opacity: 0 },
      { y: 0, rotation: 0, opacity: 1, duration: 1.1, ease: 'power3.out' },
      '-=0.4'
    );
  }, []);

  // ═══ Global Arrival Rule (Scroll reveal with blur + y) ═══
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );

    const elements = document.querySelectorAll('.motion-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [trendingTracks]);

  // ═══ Sticky Mini-Player + Scroll-Linked Glow Hue Shift ═══
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowStickyPlayer(scrollY > 550);

      // Section scroll-linked glow: hue shifts slightly (0 to 60deg)
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const pct = Math.min(1, scrollY / maxScroll);
        setScrollHue(Math.floor(pct * 55));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#070812] text-white font-['Outfit'] selection:bg-[#FF3D81] selection:text-white transition-colors duration-500"
      style={{
        filter: scrollHue > 0 ? `hue-rotate(${scrollHue}deg)` : 'none',
      }}
    >
      {/* Optional one-time Splash */}
      {showSplash && <Splash onFinish={handleSplashFinish} />}

      {/* Musical and Glowing Music Effects in Background */}
      <MusicalBackground />

      {/* Hidden audio element for preview stream playback */}
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
          1. HERO SECTION (Page-load sequence)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative z-10 pt-32 sm:pt-40 md:pt-48 pb-0 flex flex-col items-center text-center px-4 sm:px-6"
      >
        {/* Breathing Radial Glow behind logo */}
        <div
          ref={heroGlowRef}
          aria-hidden="true"
          className="absolute top-28 sm:top-36 left-1/2 -translate-x-1/2 w-[380px] sm:w-[540px] h-[380px] sm:h-[540px] rounded-full blur-[140px] bg-[#FF3D81]/30 pointer-events-none animate-breathe"
        />

        {/* Step 3: Eyebrow with side lines drawing outward */}
        <div className="inline-flex items-center gap-3 mb-6">
          <span
            ref={heroEyebrowLineLeft}
            className="eyebrow-line h-px w-6 sm:w-10 bg-white/20 origin-right"
          />
          <span
            ref={heroEyebrowText}
            className="eyebrow-text text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-[#B4B2CC]"
          >
            PREMIUM · EXPERIENCE
          </span>
          <span
            ref={heroEyebrowLineRight}
            className="eyebrow-line h-px w-6 sm:w-10 bg-white/20 origin-left"
          />
        </div>

        {/* Step 4: Huge MUSICA Wordmark with Slam-in letters and elastic U & A */}
        <div className="hero-logo leading-[0.9] select-none flex justify-center">
          <MusicaWordmark
            style={{ fontSize: 'clamp(52px, 11vw, 160px)' }}
            showGlow={true}
            enableParallax={true}
            ignited={ignited}
          />
        </div>

        {/* Step 5: Tagline fading up word by word + Shimmer on "innovation" */}
        <p className="mt-6 text-base sm:text-lg md:text-xl italic font-normal text-[#B4B2CC] max-w-xl mx-auto flex items-center justify-center gap-1.5 flex-wrap">
          <span className="tagline-word">&ldquo;Your</span>
          <span className="tagline-word">rhythm,</span>
          <span className="tagline-word">redefined</span>
          <span className="tagline-word">by</span>
          <span className="tagline-word font-semibold not-italic text-white shimmer-text">
            innovation.&rdquo;
          </span>
        </p>

        {/* Step 6: Magnetic Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 z-20">
          <MagneticButton className="hero-action-btn">
            <Link
              to="/login"
              className="btn-accent btn-pulse-ring px-8 sm:px-10 py-3.5 sm:py-4 text-xs font-bold tracking-widest uppercase rounded-[20px] shadow-lg shadow-[#FF3D81]/25"
            >
              Enter Sound
            </Link>
          </MagneticButton>

          <MagneticButton className="hero-action-btn">
            <Link
              to="/register"
              className="btn-glass px-8 sm:px-10 py-3.5 sm:py-4 text-xs font-bold tracking-widest uppercase rounded-[20px]"
            >
              Join Beats
            </Link>
          </MagneticButton>
        </div>

        {/* Step 7: Arched Photo Rising From Bottom with Equalizer Edge */}
        <div className="mt-14 sm:mt-20 w-full max-w-4xl px-4 flex flex-col items-center">
          <div className="hero-arch-container relative w-full max-w-[820px] h-[280px] sm:h-[380px] md:h-[460px] overflow-hidden asym-arch border-t border-x border-white/10 shadow-2xl bg-[#0B0D1F]">
            <img
              src="/images/hero-artist.jpg"
              alt="Artist in studio headphones illuminated by warm cinematic lighting"
              width="820"
              height="460"
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 hover:scale-110"
            />
            {/* Duotone magenta-navy overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070812] via-[#4A1236]/35 to-transparent mix-blend-multiply pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070812] via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Equalizer row across hero lower edge */}
          <div className="w-full max-w-md -mt-6 z-20">
            <EqualizerBars
              audioRef={audioRef}
              isPlaying={isPlaying}
              barCount={32}
              height="28px"
              barWidth="4px"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION E: INFINITE VELOCITY MARQUEE STRIP
          ───────────────────────────────────────────────────────────── */}
      <MarqueeStrip className="my-8" />

      {/* ─────────────────────────────────────────────────────────────
          SECTION A: DISCOVER / TRENDING TRACKS (3D Tilt Cards)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="discover"
        className="relative z-10 bg-[#0B0D1F] pt-28 sm:pt-36 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-20 motion-reveal"
      >
        <div className="wave-divider text-[#070812]">
          <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
            <path
              d="M0,0 C380,85 740,20 1080,70 C1260,95 1380,45 1440,25 L1440,0 L0,0 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Headline & chips */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF5C93] block">
                AUDIO QUALITY
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-[900] italic tracking-tight text-white leading-[1.08]">
                Wear all day in <br className="hidden sm:inline" />total comfort
              </h2>
              <p className="text-[#B4B2CC] text-base sm:text-lg leading-relaxed max-w-lg font-normal">
                Crystal-clear sound that follows you from the first coffee to the last train home.
              </p>

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

            {/* Right: Asymmetric 3D Tilt Card with Pulsing Hotspot */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <TiltCard className="w-full max-w-[460px] aspect-[4/3] sm:aspect-square asym-corner-1 bg-[#070812] border border-white/[0.09] shadow-2xl">
                <img
                  src="/images/comfort-headphones.jpg"
                  alt="Close-up of premium headphones"
                  width="460"
                  height="460"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0D1F]/70 via-[#4A1236]/30 to-transparent pointer-events-none" />
                <div className="photo-legibility-grad" />

                {/* Pulsing Hotspot Callout */}
                <div className="absolute top-[38%] right-[18%] z-20 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#070812]/85 backdrop-blur-md border border-white/20 shadow-xl">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3D81] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF3D81]" />
                  </span>
                  <span className="text-[11px] font-bold text-white tracking-wide">
                    Powerful bass
                  </span>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION B: TOP TRACKS LIST (Count-up & Mini Equalizer Hover)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="live-music"
        className="relative z-10 bg-[#070812] pt-24 sm:pt-32 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-20 motion-reveal"
      >
        <div className="wave-divider text-[#0B0D1F]">
          <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
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
                TOP TRACKS STREAMING
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

          {/* 3D Tilt Cards Grid for Trending Tracks */}
          {trendingTracks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trendingTracks.map((track, idx) => {
                const isCurrentPlaying = activeTrack?.id === track.id && isPlaying;

                return (
                  <TiltCard
                    key={track.id}
                    onClick={() => handleTrackPlay(track)}
                    className="p-4 rounded-[26px] bg-white/[0.04] border border-white/[0.08] hover:border-white/25 transition-all group flex flex-col justify-between"
                  >
                    <div className="relative aspect-square rounded-[20px] overflow-hidden mb-3.5 bg-[#0B0D1F]">
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Scale-in play button at center */}
                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#FF3D81] text-white flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
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
                      <div className="flex items-center justify-between text-xs text-[#B4B2CC]">
                        <span className="font-mono font-bold text-[#FF5C93]">
                          <AnimatedCounter endValue={idx + 1} prefix="#" duration={0.6} />
                        </span>
                        <span>{Math.floor((track.duration || 210) / 60)}:00</span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-[#FF5C93] transition-colors">
                        {track.title}
                      </h4>
                      <p className="text-xs text-[#B4B2CC] truncate font-normal">
                        {track.artist}
                      </p>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center surface-card">
              <EqualizerBars isPlaying={true} barCount={16} height="24px" className="mb-3" />
              <p className="text-sm text-[#B4B2CC]">Connecting to music backend...</p>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION D: NOW-PLAYING PREVIEW (Spinning Vinyl & Sync Lyrics)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 bg-[#070812] py-20 px-6 sm:px-10 lg:px-20 motion-reveal">
        <div className="max-w-5xl mx-auto">
          <NowPlayingPreview
            track={activeTrack || undefined}
            isExternalPlaying={isPlaying}
            onPlayToggle={(val) => {
              if (activeTrack) handleTrackPlay(activeTrack);
              else setIsPlaying(val);
            }}
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION C: ARTISTS (Circular photos with conic-spin ring on hover)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="artists"
        className="relative z-10 bg-[#1D0F2C] pt-28 sm:pt-36 pb-28 sm:pb-36 px-6 sm:px-10 lg:px-20 motion-reveal"
      >
        <div className="wave-divider text-[#070812]">
          <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
            <path
              d="M0,0 C320,70 640,110 980,50 C1160,20 1340,65 1440,40 L1440,0 L0,0 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF5C93] block">
              MADE FOR YOU
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-[900] italic tracking-tight text-white">
              Built to feel alive
            </h2>
          </div>

          {/* Featured Artists circular cards with conic-gradient ring on hover */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 justify-center">
            {FEATURED_ARTISTS.map((artist) => (
              <div
                key={artist.id}
                className="flex flex-col items-center group cursor-pointer text-center"
              >
                {/* Outer rotating conic ring on hover */}
                <div className="relative p-1 rounded-full transition-transform duration-300 group-hover:scale-105">
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[conic-gradient(#FF3D81,transparent_50%,#8B5CF6,#FF3D81)] animate-spin-slow" />
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/10 bg-[#070812] shadow-xl">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                <h4 className="mt-4 text-base font-bold text-white group-hover:text-[#FF5C93] transition-colors">
                  {artist.name}
                </h4>
                <p className="text-xs text-[#B4B2CC]">{artist.role}</p>
              </div>
            ))}
          </div>

          {/* 3 Asymmetric Photo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <TiltCard className="surface-card p-4 sm:p-5 flex flex-col group">
              <div className="relative aspect-[4/3] w-full asym-corner-2 overflow-hidden bg-[#070812] border border-white/[0.08] mb-6">
                <img
                  src="/images/card-vinyl.jpg"
                  alt="Hands handling vinyl"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-[900] italic text-white tracking-tight mb-2">
                Your daily mix
              </h3>
              <p className="text-sm text-[#B4B2CC] leading-relaxed font-normal">
                Playlists that learn your mood and keep it moving.
              </p>
            </TiltCard>

            <TiltCard className="surface-card p-4 sm:p-5 flex flex-col group">
              <div className="relative aspect-[4/3] w-full asym-corner-3 overflow-hidden bg-[#070812] border border-white/[0.08] mb-6">
                <img
                  src="/images/card-crowd.jpg"
                  alt="Live crowd"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-[900] italic text-white tracking-tight mb-2">
                Live with artists
              </h3>
              <p className="text-sm text-[#B4B2CC] leading-relaxed font-normal">
                Step closer to the music you love, as it happens.
              </p>
            </TiltCard>

            <TiltCard className="surface-card p-4 sm:p-5 flex flex-col group">
              <div className="relative aspect-[4/3] w-full asym-corner-4 overflow-hidden bg-[#070812] border border-white/[0.08] mb-6">
                <img
                  src="/images/card-commute.jpg"
                  alt="Night commute"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-[900] italic text-white tracking-tight mb-2">
                Anywhere, offline
              </h3>
              <p className="text-sm text-[#B4B2CC] leading-relaxed font-normal">
                Download once, play through every tunnel and flight.
              </p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION G: STATS (Numbers Count-up with Pink Flash)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 bg-[#070812] py-20 px-6 sm:px-10 lg:px-20 motion-reveal border-y border-white/[0.06]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl font-[900] italic text-white">
              <AnimatedCounter endValue={120} suffix="M+" duration={1.6} />
            </div>
            <p className="text-xs uppercase tracking-widest text-[#B4B2CC]">Active Listeners</p>
          </div>

          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl font-[900] italic text-white">
              <AnimatedCounter endValue={85} suffix="M+" duration={1.8} />
            </div>
            <p className="text-xs uppercase tracking-widest text-[#B4B2CC]">Tracks in HD</p>
          </div>

          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl font-[900] italic text-white">
              <AnimatedCounter endValue={1.2} suffix="M+" decimals={1} duration={1.5} />
            </div>
            <p className="text-xs uppercase tracking-widest text-[#B4B2CC]">Artists Worldwide</p>
          </div>

          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl font-[900] italic text-white">
              <AnimatedCounter endValue={99.9} suffix="%" decimals={1} duration={2.0} />
            </div>
            <p className="text-xs uppercase tracking-widest text-[#B4B2CC]">Uptime & Fidelity</p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION F: PREMIUM PRICING (Rotating Conic Border & Stagger)
          ───────────────────────────────────────────────────────────── */}
      <section id="pricing" className="relative z-10 bg-[#0B0D1F] py-28 px-6 sm:px-10 lg:px-20 motion-reveal">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF5C93] block">
              SUBSCRIPTION
            </span>
            <h2 className="text-3xl sm:text-5xl font-[900] italic tracking-tight text-white">
              Choose your soundstage
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Plan 1 */}
            <div className="surface-card p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-white">Free Beat</h4>
                <p className="text-xs text-[#B4B2CC]">Essential listening with standard stream quality.</p>
                <div className="text-3xl font-[900] italic text-white">
                  $0 <span className="text-xs text-[#B4B2CC] font-normal not-italic">/ month</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <ul className="space-y-2.5 text-xs text-[#B4B2CC]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FF3D81]" /> Standard 160kbps audio
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FF3D81]" /> Web & mobile streaming
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FF3D81]" /> Basic curated radio
                  </li>
                </ul>
              </div>
              <Link to="/register" className="btn-glass mt-8 w-full py-3 text-xs tracking-wider uppercase text-center rounded-[20px]">
                Start Free
              </Link>
            </div>

            {/* Plan 2: FEATURED (Rotating Conic Gradient Border) */}
            <div className="conic-gradient-border p-8 rounded-[36px] flex flex-col justify-between shadow-2xl relative">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-[#FF3D81] text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
                  Most Popular
                </div>
                <h4 className="text-2xl font-[900] italic text-white">Pro Studio</h4>
                <p className="text-xs text-[#B4B2CC]">Lossless 24-bit audio with spatial sound & offline downloads.</p>
                <div className="text-4xl font-[900] italic text-white">
                  $<AnimatedCounter endValue={9.99} decimals={2} duration={1.2} />
                  <span className="text-xs text-[#B4B2CC] font-normal not-italic"> / month</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <ul className="space-y-2.5 text-xs text-white/90">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FF3D81]" /> 24-bit / 192kHz Lossless FLAC
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FF3D81]" /> Unlimited offline downloads
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FF3D81]" /> Zero audio ads or interruptions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FF3D81]" /> Spatial Head-Tracking Audio
                  </li>
                </ul>
              </div>
              <MagneticButton className="w-full mt-8">
                <Link to="/register" className="btn-accent w-full py-4 text-xs tracking-wider uppercase text-center rounded-[20px] shadow-lg shadow-[#FF3D81]/30">
                  Claim Pro Sound
                </Link>
              </MagneticButton>
            </div>

            {/* Plan 3 */}
            <div className="surface-card p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-white">Studio Master</h4>
                <p className="text-xs text-[#B4B2CC]">For audiophiles, creators, and multi-room listening stages.</p>
                <div className="text-3xl font-[900] italic text-white">
                  $<AnimatedCounter endValue={14.99} decimals={2} duration={1.5} />
                  <span className="text-xs text-[#B4B2CC] font-normal not-italic"> / month</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <ul className="space-y-2.5 text-xs text-[#B4B2CC]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FF3D81]" /> Up to 6 family accounts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FF3D81]" /> Master Quality Authenticated (MQA)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FF3D81]" /> Early access to live studio drops
                  </li>
                </ul>
              </div>
              <Link to="/register" className="btn-glass mt-8 w-full py-3 text-xs tracking-wider uppercase text-center rounded-[20px]">
                Choose Master
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION H: FOOTER/CTA (Letters React to Cursor Proximity)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="premium"
        className="relative z-10 bg-[#070812] pt-32 sm:pt-40 pb-16 sm:pb-20 px-6 sm:px-10 text-center motion-reveal"
      >
        <div className="wave-divider text-[#0B0D1F]">
          <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
            <path
              d="M0,0 C420,90 780,10 1120,65 C1280,90 1390,40 1440,20 L1440,0 L0,0 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto space-y-10">
          {/* Giant headline reacting to cursor proximity with equalizer below */}
          <FooterHeadline />

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4">
            <MagneticButton>
              <Link
                to="/login"
                className="btn-accent px-8 sm:px-10 py-3.5 sm:py-4 text-xs font-bold tracking-widest uppercase rounded-[20px] shadow-lg shadow-[#FF3D81]/25"
              >
                Enter Sound
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                to="/register"
                className="btn-glass px-8 sm:px-10 py-3.5 sm:py-4 text-xs font-bold tracking-widest uppercase rounded-[20px]"
              >
                Join Beats
              </Link>
            </MagneticButton>
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

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: STICKY MINI PLAYER BAR (Slides up after hero)
          ───────────────────────────────────────────────────────────── */}
      {showStickyPlayer && activeTrack && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-slide-up">
          <div className="surface-floating rounded-full px-4 py-2.5 border border-white/[0.15] flex items-center justify-between gap-3 shadow-2xl">
            {/* Spinning mini vinyl */}
            <div className="flex items-center gap-3 min-w-0">
              <InteractiveVinyl
                isPlaying={isPlaying}
                coverImage={activeTrack.cover}
                size={38}
              />
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-white truncate italic uppercase tracking-wider">
                  {activeTrack.title}
                </h5>
                <p className="text-[10px] text-[#B4B2CC] truncate">{activeTrack.artist}</p>
              </div>
            </div>

            {/* Mini equalizer + play button */}
            <div className="flex items-center gap-3 shrink-0">
              <EqualizerBars
                isPlaying={isPlaying}
                barCount={8}
                height="16px"
                barWidth="2.5px"
              />

              <button
                type="button"
                onClick={() => handleTrackPlay(activeTrack)}
                className="w-8 h-8 rounded-full bg-[#FF3D81] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>

              <Link
                to="/dashboard"
                className="text-[10px] font-bold uppercase tracking-wider text-[#FF5C93] hover:text-white px-2 py-1"
              >
                Expand &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 5s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Home;
