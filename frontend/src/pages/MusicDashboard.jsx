import React, { useState, useEffect, useRef } from 'react';
import MusicSidebar from '../components/MusicSideBar';
import SongCard from '../components/SongCard';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Search,
  Bell,
  Loader2,
  Home,
  Music as MusicIcon,
  Heart,
  List,
  Sliders,
} from 'lucide-react';
import { spotifyAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import MusicaLogo, { MusicaWordmark } from '../components/MusicaLogo';
import MusicalBackground from '../components/MusicalBackground';
import InteractiveVinyl from '../components/InteractiveVinyl';
import EqualizerBars from '../components/EqualizerBars';

function MusicDashboard() {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const audioRef = useRef(null);

  // Real specific duration from track metadata
  const totalDuration = currentSong?.duration || 210;

  // Track playback time continuously for the song's specific time
  useEffect(() => {
    if (!isPlaying || !currentSong) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev + 1 >= totalDuration) {
          handleNextSong();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, currentSong, totalDuration, currentIndex, songs]);

  // When audio preview clip reaches 30s, seamlessly loop it until full duration is reached
  const handleAudioEnded = () => {
    if (elapsedSeconds < totalDuration) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      handleNextSong();
    }
  };

  // Fetch initial tracks
  useEffect(() => {
    let isMounted = true;
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const data = await spotifyAPI.getNewReleases();
        if (!isMounted) return;
        setSongs(data || []);
        if (data && data.length > 0) {
          setCurrentSong((prev) => prev || data[0]);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error("Failed to fetch tracks:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTrending();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync Audio Element safely
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    const audio = audioRef.current;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name !== 'AbortError') {
            console.error("Playback failed:", error);
            setIsPlaying(false);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      setIsSearching(true);
      try {
        const results = await spotifyAPI.search(query);
        setSongs(results || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    } else if (query.length === 0) {
      const data = await spotifyAPI.getNewReleases();
      setSongs(data || []);
    }
  };

  const handlePlay = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setElapsedSeconds(0);
    const index = songs.findIndex((s) => s.id === song.id);
    if (index !== -1) setCurrentIndex(index);
  };

  const handleNextSong = () => {
    if (songs.length === 0) return;
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(songs[nextIndex]);
    setElapsedSeconds(0);
    setIsPlaying(true);
  };

  const handlePrevSong = () => {
    if (songs.length === 0) return;
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentIndex(prevIndex);
    setCurrentSong(songs[prevIndex]);
    setElapsedSeconds(0);
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newSeconds = Math.floor(pct * totalDuration);
    setElapsedSeconds(newSeconds);

    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = newSeconds % audioRef.current.duration;
    }
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const userInitials = (user?.name || "Aryan")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-screen w-full bg-[#070812] text-white overflow-hidden font-['Outfit'] select-none">
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP SIDEBAR (240px, visible on screens >= 900px)
          ───────────────────────────────────────────────────────────── */}
      <div className="w-[240px] shrink-0 hidden min-[900px]:block h-full">
        <MusicSidebar />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT AREA
          ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-[#070812]">
        {/* Musical and Glowing Music Effects in Background */}
        <MusicalBackground intensity="subtle" />

        {/* ── TOP BAR ── */}
        <header className="shrink-0 px-6 sm:px-10 py-5 flex items-center justify-between gap-4 z-20 border-b border-white/[0.06] bg-[#070812]/80 backdrop-blur-md">
          {/* Mobile brand (shown below 900px) */}
          <div className="min-[900px]:hidden flex items-center shrink-0">
            <MusicaWordmark className="text-xl" />
          </div>

          {/* Pill Search Input */}
          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B4B2CC] group-focus-within:text-white transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search songs, artists..."
              aria-label="Search songs and artists"
              className="w-full pl-11 pr-10 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.09] text-sm text-white placeholder-[#B4B2CC]/60 focus:outline-none focus:border-[#FF3D81] focus:bg-white/[0.08] transition-all"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF3D81] animate-spin" />
            )}
          </div>

          {/* User profile avatar & notification */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              type="button"
              aria-label="Notifications"
              className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.09] flex items-center justify-center text-[#B4B2CC] hover:text-white hover:bg-white/[0.08] transition-colors relative min-h-[44px] min-w-[44px]"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#FF3D81]" />
            </button>

            {/* Profile Avatar with Initials (No Cartoons) */}
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF3D81] to-[#7C3AED] flex items-center justify-center font-bold text-sm text-white shadow-md uppercase cursor-pointer"
              title={user?.name || "Aryan"}
            >
              {userInitials}
            </div>
          </div>
        </header>

        {/* ── SCROLLABLE DASHBOARD BODY ── */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 pt-6 pb-36 space-y-8">
          {/* ─────────────────────────────────────────────────────────
              A. WELCOME BANNER (Real photo, left-to-right gradient, wave bottom)
              ───────────────────────────────────────────────────────── */}
          <div className="relative rounded-[32px] overflow-hidden border border-white/[0.08] bg-[#0B0D1F] shadow-xl">
            {/* Background Real Photo */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/dashboard-banner.jpg"
                alt="Listener with closed eyes immersed in high-fidelity headphones"
                width="1400"
                height="320"
                className="w-full h-full object-cover object-right opacity-65"
              />
              {/* Left-to-right dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#070812] via-[#070812]/90 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D1F] via-transparent to-transparent opacity-80" />
            </div>

            {/* Banner Text Content */}
            <div className="relative z-10 p-8 sm:p-12 max-w-xl space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-[900] italic tracking-tight text-white leading-tight">
                Good evening, {user?.name || "Aryan"}
              </h2>
              <p className="text-sm sm:text-base text-[#B4B2CC] font-normal">
                Time for your next track.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (songs.length > 0) handlePlay(songs[0]);
                  }}
                  className="btn-accent px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase inline-flex items-center gap-2 shadow-lg shadow-[#FF3D81]/25 hover:shadow-[#FF3D81]/40"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Play Something
                </button>
              </div>
            </div>

            {/* Wavy bottom edge */}
            <div className="w-full overflow-hidden leading-none z-10 relative">
              <svg
                viewBox="0 0 1200 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-8 block"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0 C300,35 600,5 900,30 C1050,42 1140,15 1200,20 L1200,40 L0,40 Z"
                  fill="#070812"
                />
              </svg>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              B. STATS ROW (4 flat cards, large italic numbers, pink delta)
              ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 min-[1200px]:grid-cols-4 gap-4 sm:gap-6">
            {/* Stat 1 */}
            <div className="surface-card p-5 sm:p-6">
              <p className="text-xs font-semibold text-[#B4B2CC] uppercase tracking-wider mb-2">
                Songs played
              </p>
              <div className="text-3xl sm:text-4xl font-[900] italic text-white tracking-tight mb-2">
                1,248
              </div>
              <p className="text-xs font-bold text-[#FF5C93] tracking-wide">
                +16% this week
              </p>
            </div>

            {/* Stat 2 */}
            <div className="surface-card p-5 sm:p-6">
              <p className="text-xs font-semibold text-[#B4B2CC] uppercase tracking-wider mb-2">
                Favorites
              </p>
              <div className="text-3xl sm:text-4xl font-[900] italic text-white tracking-tight mb-2">
                128
              </div>
              <p className="text-xs font-bold text-[#FF5C93] tracking-wide">
                +8 this week
              </p>
            </div>

            {/* Stat 3 */}
            <div className="surface-card p-5 sm:p-6">
              <p className="text-xs font-semibold text-[#B4B2CC] uppercase tracking-wider mb-2">
                Hours listened
              </p>
              <div className="text-3xl sm:text-4xl font-[900] italic text-white tracking-tight mb-2">
                34.6
              </div>
              <p className="text-xs font-bold text-[#FF5C93] tracking-wide">
                +6.2 this week
              </p>
            </div>

            {/* Stat 4 */}
            <div className="surface-card p-5 sm:p-6">
              <p className="text-xs font-semibold text-[#B4B2CC] uppercase tracking-wider mb-2">
                Current streak
              </p>
              <div className="text-3xl sm:text-4xl font-[900] italic text-white tracking-tight mb-2">
                7
              </div>
              <p className="text-xs font-medium text-[#B4B2CC]">
                days in a row
              </p>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              C. MIDDLE ROW: CHARTS (Listening Overview + Top Genres)
              ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Listening overview (Pink-to-Indigo Bar Chart) */}
            <div className="lg:col-span-7 surface-card p-6 sm:p-7 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Listening overview
                </h3>
                <span className="text-xs text-[#B4B2CC]">This week</span>
              </div>

              {/* Bar Chart Container */}
              <div className="h-44 sm:h-48 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-4">
                {[
                  { day: 'Mon', h: 48, label: '3.2h' },
                  { day: 'Tue', h: 74, label: '5.1h' },
                  { day: 'Wed', h: 42, label: '2.8h' },
                  { day: 'Thu', h: 92, label: '6.4h' },
                  { day: 'Fri', h: 58, label: '4.0h' },
                  { day: 'Sat', h: 100, label: '7.0h' },
                  { day: 'Sun', h: 65, label: '4.5h' },
                ].map((item) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-semibold text-[#B4B2CC] opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.label}
                    </span>
                    <div className="w-full max-w-[42px] bg-white/[0.04] rounded-t-xl h-36 flex items-end overflow-hidden p-0.5">
                      <div
                        className="w-full rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                        style={{
                          height: `${item.h}%`,
                          background: 'linear-gradient(180deg, #FF3D81 0%, #1D1B52 100%)',
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#B4B2CC] group-hover:text-white transition-colors">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Genres (Donut Chart with Accessible Palette) */}
            <div className="lg:col-span-5 surface-card p-6 sm:p-7 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Top genres
                </h3>
                <span className="text-xs text-[#B4B2CC]">Top 5</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                {/* SVG Donut Chart */}
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="14"
                      fill="none"
                    />
                    {/* Pop 45% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#FF3D81"
                      strokeWidth="14"
                      strokeDasharray="107.4 238.7"
                      strokeDashoffset="0"
                      fill="none"
                    />
                    {/* Lo-fi 25% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#7C3AED"
                      strokeWidth="14"
                      strokeDasharray="59.7 238.7"
                      strokeDashoffset="-107.4"
                      fill="none"
                    />
                    {/* Hip Hop 15% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#38BDF8"
                      strokeWidth="14"
                      strokeDasharray="35.8 238.7"
                      strokeDashoffset="-167.1"
                      fill="none"
                    />
                    {/* Rock 10% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#E0246A"
                      strokeWidth="14"
                      strokeDasharray="23.9 238.7"
                      strokeDashoffset="-202.9"
                      fill="none"
                    />
                    {/* Other 5% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#64748B"
                      strokeWidth="14"
                      strokeDasharray="12 238.7"
                      strokeDashoffset="-226.8"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-[900] italic text-white">45%</span>
                    <span className="text-[10px] uppercase font-bold text-[#B4B2CC]">Pop</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF3D81] shrink-0" />
                    <span className="text-white font-medium">Pop</span>
                    <span className="text-[#B4B2CC] ml-auto">45%</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] shrink-0" />
                    <span className="text-white font-medium">Lo-fi</span>
                    <span className="text-[#B4B2CC] ml-auto">25%</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] shrink-0" />
                    <span className="text-white font-medium">Hip Hop</span>
                    <span className="text-[#B4B2CC] ml-auto">15%</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E0246A] shrink-0" />
                    <span className="text-white font-medium">Rock</span>
                    <span className="text-[#B4B2CC] ml-auto">10%</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#64748B] shrink-0" />
                    <span className="text-white font-medium">Other</span>
                    <span className="text-[#B4B2CC] ml-auto">5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              D. BOTTOM ROW: RECENTLY PLAYED & DAILY MIX
              ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Recently Played List */}
            <div className="lg:col-span-6 surface-card p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Recently played
                </h3>
                <span className="text-xs text-[#B4B2CC]">Latest</span>
              </div>

              <div className="space-y-2">
                {(songs.length > 0
                  ? songs.slice(0, 3)
                  : [
                      { id: '1', title: 'Sunset Skies', artist: 'Last Chord', duration: 222 },
                      { id: '2', title: 'Golden Hour', artist: 'JVKE', duration: 209 },
                      { id: '3', title: 'Coffee Shop', artist: 'Late Night Club', duration: 180 },
                    ]
                ).map((track, i) => (
                  <div
                    key={track.id || i}
                    onClick={() => handlePlay(track)}
                    className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-white/[0.06] transition-colors cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1D1B52] to-[#4A1236] overflow-hidden shrink-0 flex items-center justify-center">
                      {track.cover ? (
                        <img
                          src={track.cover}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <MusicIcon className="w-5 h-5 text-white/40 group-hover:text-[#FF3D81] transition-colors" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-[#FF5C93] transition-colors">
                        {track.title}
                      </h4>
                      <p className="text-xs text-[#B4B2CC] truncate font-normal">
                        {track.artist}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Play ${track.title}`}
                      className="w-8 h-8 rounded-full bg-white/[0.05] group-hover:bg-[#FF3D81] group-hover:text-white flex items-center justify-center text-[#B4B2CC] transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Mix Card (Real photo, curved corner, dark gradient, "EXPLORE NOW") */}
            <div className="lg:col-span-6 relative overflow-hidden asym-corner-3 border border-white/[0.09] bg-[#0B0D1F] p-8 flex flex-col justify-end min-h-[220px] shadow-xl group">
              <img
                src="/images/daily-mix.jpg"
                alt="Cosy lounge with warm lamp illumination"
                width="800"
                height="400"
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#070812] via-[#070812]/80 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <h3 className="text-2xl sm:text-3xl font-[900] italic text-white tracking-tight">
                  Chill Vibes
                </h3>
                <p className="text-xs text-[#B4B2CC] font-normal">
                  Daily mix &middot; 80 songs
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (songs.length > 0) handlePlay(songs[0]);
                    }}
                    className="btn-accent px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF3D81]/25 hover:shadow-[#FF3D81]/40"
                  >
                    Explore Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              E. FULL SONGS / TRENDING GRID (Keep existing data bindings)
              ───────────────────────────────────────────────────────── */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-[900] italic tracking-tight text-white uppercase">
                {searchQuery ? `Results for "${searchQuery}"` : "Trending Releases"}
              </h3>
              <span className="text-xs text-[#B4B2CC]">
                {songs.length} tracks available
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="surface-card p-4 space-y-3">
                    <div className="aspect-square skeleton w-full rounded-2xl" />
                    <div className="h-4 skeleton w-3/4 rounded" />
                    <div className="h-3 skeleton w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : songs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {songs.map((song) => (
                  <SongCard key={song.id} song={song} onPlay={handlePlay} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 surface-card">
                <p className="text-base font-semibold text-white/70">
                  No tracks found matching your query
                </p>
                <p className="text-xs text-[#B4B2CC] mt-1">
                  Try searching for another artist or album
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. STICKY PILL-SHAPED MINI PLAYER AT THE BOTTOM
            ───────────────────────────────────────────────────────────── */}
        <div className="fixed bottom-4 left-4 right-4 min-[900px]:left-[260px] min-[900px]:right-8 z-50">
          <div className="surface-floating rounded-full px-5 py-3 border border-white/[0.12] flex flex-wrap md:flex-nowrap items-center justify-between gap-3 sm:gap-6 shadow-2xl">
            {/* Hidden Audio Element */}
            <audio
              ref={audioRef}
              src={currentSong?.preview_url}
              onEnded={handleAudioEnded}
            />

            {/* Left: Song Info */}
            <div className="flex items-center gap-3.5 w-full sm:w-auto md:w-1/4 min-w-0">
              <div className="shrink-0 flex items-center justify-center">
                <InteractiveVinyl
                  isPlaying={isPlaying}
                  coverImage={currentSong?.cover || '/images/card-vinyl.jpg'}
                  size={46}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate italic uppercase tracking-wider">
                  {currentSong?.title || "Sunset Skies"}
                </h4>
                <p className="text-[11px] text-[#B4B2CC] truncate font-normal">
                  {currentSong?.artist || "Last Chord"}
                </p>
              </div>
            </div>

            {/* Center: Play Controls & Progress Bar */}
            <div className="flex-1 flex flex-col items-center gap-1.5 w-full md:w-auto">
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={handlePrevSong}
                  aria-label="Previous track"
                  className="text-[#B4B2CC] hover:text-white transition-colors p-1"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="w-10 h-10 rounded-full bg-[#FF3D81] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#FF3D81]/30 min-w-[44px] min-h-[44px]"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNextSong}
                  aria-label="Next track"
                  className="text-[#B4B2CC] hover:text-white transition-colors p-1"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Slider with Real Specific Duration */}
              <div className="w-full flex items-center gap-3 max-w-lg">
                <span className="text-[10px] text-[#B4B2CC] tabular-nums shrink-0">
                  {formatTime(elapsedSeconds)}
                </span>
                <div
                  className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer relative overflow-hidden"
                  onClick={handleSeek}
                  title="Seek position"
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#FF3D81] to-[#FF5C93] rounded-full transition-all duration-150"
                    style={{
                      width: `${
                        totalDuration > 0
                          ? Math.min(100, (elapsedSeconds / totalDuration) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-[#B4B2CC] tabular-nums shrink-0">
                  {formatTime(totalDuration)}
                </span>
              </div>
            </div>

            {/* Right: Volume */}
            <div className="hidden sm:flex items-center justify-end gap-2.5 w-1/4">
              <Volume2 className="w-4 h-4 text-[#B4B2CC] shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                aria-label="Volume slider"
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (audioRef.current) audioRef.current.volume = val;
                }}
                className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#FF3D81]"
              />
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            4. MOBILE BOTTOM TAB BAR (below 900px)
            ───────────────────────────────────────────────────────────── */}
        <nav
          aria-label="Mobile navigation bar"
          className="min-[900px]:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070812]/95 backdrop-blur-xl border-t border-white/[0.08] px-4 py-2 flex items-center justify-around"
        >
          <a
            href="/dashboard"
            aria-label="Dashboard"
            className="flex flex-col items-center gap-1 py-1 text-[#FF5C93] min-h-[44px] justify-center"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Home</span>
          </a>
          <a
            href="#my-music"
            aria-label="My Music"
            className="flex flex-col items-center gap-1 py-1 text-[#B4B2CC] hover:text-white min-h-[44px] justify-center"
          >
            <MusicIcon className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Music</span>
          </a>
          <a
            href="#favorites"
            aria-label="Favorites"
            className="flex flex-col items-center gap-1 py-1 text-[#B4B2CC] hover:text-white min-h-[44px] justify-center"
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Saved</span>
          </a>
          <a
            href="#playlists"
            aria-label="Playlists"
            className="flex flex-col items-center gap-1 py-1 text-[#B4B2CC] hover:text-white min-h-[44px] justify-center"
          >
            <List className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Playlists</span>
          </a>
          <a
            href="#settings"
            aria-label="Settings"
            className="flex flex-col items-center gap-1 py-1 text-[#B4B2CC] hover:text-white min-h-[44px] justify-center"
          >
            <Sliders className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Config</span>
          </a>
        </nav>
      </main>
    </div>
  );
}

export default MusicDashboard;
