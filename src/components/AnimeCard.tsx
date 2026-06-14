import React from 'react';
import { Anime, WatchStatus } from '../types';
import { Star, Plus, Check, Play, AppWindow, BookmarkPlus } from 'lucide-react';

interface AnimeCardProps {
  key?: string;
  anime: Anime;
  onSelect: (anime: Anime) => void;
  watchlistStatus?: WatchStatus;
  onQuickTrack?: (animeId: string, status: WatchStatus) => void;
}

export default function AnimeCard({ anime, onSelect, watchlistStatus = 'None', onQuickTrack }: AnimeCardProps) {
  const scoreFormatted = anime.score && anime.score > 0 ? anime.score.toFixed(2) : 'N/A';
  
  const statusColors = {
    Ongoing: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Completed: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Upcoming: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  const trackingPills: Record<WatchStatus, string> = {
    Watching: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    Completed: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    Planning: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
    Dropped: 'bg-zinc-700/35 text-zinc-400 border border-zinc-700/50',
    'On-Hold': 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    None: '',
  };

  return (
    <div 
      id={`anime-card-${anime.id}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-white/[0.02] border border-white/5 hover:border-rose-500/20 transition-all duration-300 shadow-xl hover:shadow-rose-500/5"
    >
      {/* Cover Artwork Container */}
      <div 
        onClick={() => onSelect(anime)}
        className="relative aspect-[3/4] w-full overflow-hidden cursor-pointer"
      >
        <img 
          src={anime.coverImage} 
          alt={anime.englishTitle || anime.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
        />
        
        {/* Rating Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#030308]/80 backdrop-blur-md border border-white/10 text-[11px] font-extrabold text-[#f59e0b]">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <span>{scoreFormatted}</span>
        </div>

        {/* Status indicator tag */}
        <div className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold border backdrop-blur-md bg-[#030308]/80 ${statusColors[anime.status] || 'bg-gray-500/10 text-gray-400'}`}>
          {anime.status}
        </div>

        {/* Dynamic tracking status flag */}
        {watchlistStatus !== 'None' && (
          <div className={`absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold border backdrop-blur-md ${trackingPills[watchlistStatus]}`}>
             {watchlistStatus}
          </div>
        )}

        {/* Action Quick Info Hover Screen Overlay */}
        <div className="absolute inset-0 bg-[#030308]/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <p className="text-[11px] leading-relaxed text-gray-200 line-clamp-4 font-light mb-2">
            {anime.synopsis}
          </p>
          <div className="flex items-center space-x-1.5 text-[10px] text-gray-400">
            <span className="rounded bg-white/10 px-1 py-0.5">{anime.season} {anime.year}</span>
            <span>•</span>
            <span>{anime.episodeCount || '?'} Episodes</span>
          </div>
        </div>
      </div>

      {/* Specifications content */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div onClick={() => onSelect(anime)} className="cursor-pointer space-y-1">
          <h3 className="text-xs font-bold text-gray-100 group-hover:text-rose-400 transition line-clamp-1">
            {anime.englishTitle || anime.title}
          </h3>
          <p className="text-[10px] text-gray-400 truncate">
            {anime.studios.join(' & ')}
          </p>
        </div>

        {/* Watchlist Quick tracker option dropdown */}
        {onQuickTrack && (
          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold font-mono">TRACKING</span>
            
            <div className="relative flex items-center space-x-1">
              <select
                id={`track-select-${anime.id}`}
                value={watchlistStatus}
                onChange={(e) => onQuickTrack(anime.id, e.target.value as WatchStatus)}
                className="text-[10px] font-semibold bg-[#111] hover:bg-[#181818] border border-white/10 text-gray-300 rounded cursor-pointer px-1 py-0.5 outline-none transition"
              >
                <option value="None">+ Tracking</option>
                <option value="Watching">Watching</option>
                <option value="Completed">Completed</option>
                <option value="Planning">Planning</option>
                <option value="Dropped">Dropped</option>
                <option value="On-Hold">On-Hold</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
