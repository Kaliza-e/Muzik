import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiMusic,
  FiHeart,
  FiList,
  FiMic,
  FiSliders,
  FiLogOut,
  FiArrowLeft,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import MusicaLogo, { MusicaWordmark } from './MusicaLogo';

const NAV_ITEMS = [
  { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
  { icon: FiMusic, label: 'My Music', path: '#my-music' },
  { icon: FiHeart, label: 'Favorites', path: '#favorites' },
  { icon: FiList, label: 'Playlists', path: '#playlists' },
  { icon: FiMic, label: 'Podcasts', path: '#podcasts' },
  { icon: FiSliders, label: 'Settings', path: '#settings' },
];

function MusicSidebar({ className = '' }) {
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();

  return (
    <aside
      aria-label="Sidebar Navigation"
      className={`h-full flex flex-col justify-between bg-[#070812] border-r border-white/[0.08] p-5 select-none font-['Outfit'] ${className}`}
    >
      <div>
        {/* Brand Wordmark with Logo on U (upside down) and A (upright) */}
        <div className="px-3 pt-2 pb-8 flex items-center justify-between">
          <Link to="/" className="inline-block group transition-transform hover:scale-[1.02]">
            <MusicaWordmark className="text-2xl" />
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5" aria-label="Main sidebar links">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/dashboard'
                ? location.pathname === '/dashboard'
                : location.hash === item.path;

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-semibold transition-all duration-200 min-h-[44px] ${
                  isActive
                    ? 'bg-[#FF3D81]/15 text-white border border-[#FF3D81]/30 shadow-sm'
                    : 'text-[#B4B2CC] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon
                  className={`text-lg transition-transform ${
                    isActive ? 'text-[#FF5C93]' : 'text-[#B4B2CC]'
                  }`}
                />
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Premium Card & Navigation / Logout */}
      <div className="space-y-3 pt-6">
        {/* Return to Landing Page URL */}
        <Link
          to="/"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold text-[#B4B2CC] hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          <FiArrowLeft className="text-sm text-[#FF5C93]" />
          <span>Back to Landing Page</span>
        </Link>

        {/* Asymmetric "Go Premium" card */}
        <div className="p-4 rounded-[24px_24px_24px_6px] bg-gradient-to-tr from-[#1D0F2C] to-[#4A1236]/80 border border-white/[0.1] shadow-lg">
          <h4 className="text-sm font-bold text-white tracking-wide mb-1">
            Go Premium
          </h4>
          <p className="text-xs text-[#B4B2CC] leading-relaxed mb-3">
            Unlock ad-free and more.
          </p>
          <button
            type="button"
            className="w-full py-2 px-3 text-[11px] font-bold tracking-wider uppercase rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Upgrade Plan
          </button>
        </div>

        {/* Logout or Sign In */}
        {isAuthenticated ? (
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-full text-xs font-semibold text-[#B4B2CC] hover:text-red-400 hover:bg-white/[0.04] transition-colors min-h-[44px]"
          >
            <FiLogOut className="text-base" />
            <span>Log out</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="flex items-center justify-center py-2.5 w-full rounded-full text-xs font-bold uppercase tracking-wider text-white bg-white/[0.08] hover:bg-white/[0.14] transition-colors min-h-[44px]"
          >
            Sign In
          </Link>
        )}
      </div>
    </aside>
  );
}

export default MusicSidebar;
