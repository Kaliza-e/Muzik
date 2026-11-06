import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { MusicaWordmark } from './MusicaLogo';
import MagneticButton from './MagneticButton';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Discover', href: '#discover' },
    { label: 'Artists', href: '#artists' },
    { label: 'Top Tracks', href: '#live-music' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className={`fixed top-0 left-0 right-0 z-[80] transition-all duration-300 px-4 sm:px-8 md:px-12 py-4 animate-fade-down ${
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
          <MusicaWordmark className="text-2xl md:text-3xl" enableParallax={true} />
        </Link>

        {/* Desktop Links (staggered entrance + animated underline + active glowing dot) */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((item, index) => {
            const isActive = location.hash === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`nav-link-animated text-sm font-medium tracking-wide transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-white nav-link-active' : 'text-[#B4B2CC] hover:text-white'
                }`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D81] shadow-[0_0_8px_#FF3D81]" />
                )}
              </a>
            );
          })}
        </div>

        {/* Action Buttons with Magnetic Pull */}
        <div className="hidden md:flex items-center gap-4">
          <MagneticButton>
            <Link
              to="/dashboard"
              className="text-sm font-semibold text-[#FF5C93] hover:text-white transition-colors tracking-wide px-3 py-2"
            >
              Open Player
            </Link>
          </MagneticButton>

          {isAuthenticated ? (
            <MagneticButton>
              <button
                type="button"
                onClick={logout}
                className="btn-glass px-6 py-2.5 text-xs font-bold tracking-wider rounded-[20px]"
              >
                Logout
              </button>
            </MagneticButton>
          ) : (
            <MagneticButton>
              <Link
                to="/login"
                className="btn-glass px-7 py-2.5 text-xs font-bold tracking-widest uppercase rounded-[20px]"
              >
                Sign In
              </Link>
            </MagneticButton>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
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
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-base font-medium text-[#B4B2CC] hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
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
