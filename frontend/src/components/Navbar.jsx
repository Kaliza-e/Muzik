import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import MusicaLogo, { MusicaWordmark } from './MusicaLogo';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      aria-label="Main Navigation"
      className={`fixed top-0 left-0 right-0 z-[80] transition-all duration-300 px-4 sm:px-8 md:px-12 py-4 ${
        scrolled ? 'bg-[#070812]/85 backdrop-blur-xl border-b border-white/[0.08]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
        {/* Logo wordmark with integrated U (upside down) and A (upright) */}
        <Link
          to="/"
          className="flex items-center group transition-transform hover:scale-[1.02]"
          aria-label="Musica Home"
        >
          <MusicaWordmark className="text-2xl md:text-3xl" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <a
            href="#discover"
            className="text-sm font-medium text-[#B4B2CC] hover:text-white transition-colors tracking-wide"
          >
            Discover
          </a>
          <a
            href="#artists"
            className="text-sm font-medium text-[#B4B2CC] hover:text-white transition-colors tracking-wide"
          >
            Artists
          </a>
          <a
            href="#live-music"
            className="text-sm font-medium text-[#B4B2CC] hover:text-white transition-colors tracking-wide"
          >
            Top Tracks
          </a>
          <a
            href="#premium"
            className="text-sm font-medium text-[#B4B2CC] hover:text-white transition-colors tracking-wide"
          >
            Premium
          </a>
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-sm font-semibold text-[#FF5C93] hover:text-white transition-colors tracking-wide mr-2"
          >
            Open Player
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={logout}
                className="btn-glass px-6 py-2.5 text-xs font-bold tracking-wider rounded-[20px]"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-glass px-7 py-2.5 text-xs font-bold tracking-widest uppercase rounded-[20px]"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.09] text-white/90 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="mt-3 p-6 rounded-[28px] bg-[#0B0D1F] border border-white/[0.09] shadow-2xl md:hidden animate-scale-in">
          <div className="flex flex-col gap-4 text-center">
            <a
              href="#discover"
              onClick={() => setOpen(false)}
              className="py-2 text-base font-medium text-[#B4B2CC] hover:text-white transition-colors"
            >
              Discover
            </a>
            <a
              href="#artists"
              onClick={() => setOpen(false)}
              className="py-2 text-base font-medium text-[#B4B2CC] hover:text-white transition-colors"
            >
              Artists
            </a>
            <a
              href="#live-music"
              onClick={() => setOpen(false)}
              className="py-2 text-base font-medium text-[#B4B2CC] hover:text-white transition-colors"
            >
              Top Tracks
            </a>
            <a
              href="#premium"
              onClick={() => setOpen(false)}
              className="py-2 text-base font-medium text-[#B4B2CC] hover:text-white transition-colors"
            >
              Premium
            </a>
            <div className="h-px bg-white/[0.08] my-1 w-full" />
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="py-3 rounded-[20px] bg-white/[0.06] text-[#FF5C93] font-bold text-sm tracking-wider"
            >
              Open Player
            </Link>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="py-3 text-sm font-semibold text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="btn-glass py-3 text-xs tracking-widest uppercase text-center rounded-[20px]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="btn-accent py-3 text-xs tracking-widest uppercase text-center rounded-[20px]"
                >
                  Join Beats
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
