import React, { useState } from 'react';
import { FiPlay, FiHeart, FiMoreHorizontal } from 'react-icons/fi';

const SongCard = ({ song, onPlay }) => {
  const [imgError, setImgError] = useState(false);

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    if (typeof seconds === 'string') return seconds;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPlay(song);
        }
      }}
      onClick={() => onPlay(song)}
      className="p-3.5 rounded-[28px] bg-white/[0.05] border border-white/[0.09] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 group cursor-pointer flex flex-col justify-between"
    >
      {/* Cover with fallback gradient */}
      <div className="relative rounded-[20px] overflow-hidden mb-3 aspect-square bg-gradient-to-tr from-[#1D1B52] to-[#4A1236]">
        {song.cover && !imgError ? (
          <img
            src={song.cover}
            alt={song.title ? `${song.title} album cover` : 'Track cover'}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#1D1B52] to-[#4A1236]">
            <span className="text-2xl font-black italic text-white/30">M</span>
          </div>
        )}

        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-[#FF3D81] text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
            <FiPlay className="text-xl ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Heart icon button */}
        <button
          type="button"
          aria-label="Save to favorites"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#070812]/70 backdrop-blur-md text-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:text-[#FF3D81] transition-all min-w-[32px] min-h-[32px]"
        >
          <FiHeart size={14} />
        </button>
      </div>

      {/* Song details */}
      <div className="space-y-1 px-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-bold truncate text-white group-hover:text-[#FF5C93] transition-colors">
            {song.title}
          </h4>
          <span className="text-[10px] font-semibold text-[#B4B2CC] tabular-nums shrink-0">
            {formatDuration(song.duration)}
          </span>
        </div>
        <p className="text-xs text-[#B4B2CC] truncate font-normal">
          {song.artist}
        </p>

        <div className="pt-2 flex items-center justify-between text-[10px] text-[#B4B2CC]/60 font-medium">
          <span className="truncate max-w-[120px]">{song.album || 'Single'}</span>
          <button
            type="button"
            aria-label="Track options"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-white transition-colors p-1"
          >
            <FiMoreHorizontal className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
