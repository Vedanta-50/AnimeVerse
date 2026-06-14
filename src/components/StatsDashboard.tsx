import React from 'react';
import { Anime, WatchlistStatus, WatchStatus } from '../types';
import { Award, BarChart3, Clock, Film, Heart, ListPlus, Trash2, XCircle } from 'lucide-react';

interface StatsDashboardProps {
  watchlist: WatchlistStatus[];
  animeList: Anime[];
  favorites: string[];
  onRemoveFromWatchlist: (animeId: string) => void;
  onSelectAnime: (anime: Anime) => void;
  userEmail: string;
  onSignOut: () => void;
}

export default function StatsDashboard({ 
  watchlist, 
  animeList, 
  favorites, 
  onRemoveFromWatchlist, 
  onSelectAnime,
  userEmail,
  onSignOut
}: StatsDashboardProps) {

  // Calculate metrics
  const statusCounts: Record<WatchStatus, number> = {
    Watching: 0,
    Completed: 0,
    Planning: 0,
    Dropped: 0,
    'On-Hold': 0,
    None: 0
  };

  let totalSpentMinutes = 0;

  watchlist.forEach(w => {
    statusCounts[w.status]++;
    const matched = animeList.find(a => a.id === w.animeId);
    if (matched) {
      // multiply episodes watched by average episode duration
      totalSpentMinutes += w.progress * matched.durationPerEpisode;
    }
  });

  const totalHrs = Math.floor(totalSpentMinutes / 60);
  const totalMins = totalSpentMinutes % 60;

  const totalFavoritesCount = favorites.length;

  // Active status color definitions
  const badgeColors: Record<WatchStatus, string> = {
    Watching: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    Completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Planning: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    Dropped: 'text-zinc-500 bg-zinc-700/10 border-zinc-700/20',
    'On-Hold': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    None: 'text-gray-400 bg-gray-500/10 border-gray-500/10'
  };

  const username = userEmail ? userEmail.split('@')[0] : 'EpicOtaku';

  return (
    <div id="stats-dashboard" className="max-w-7xl mx-auto px-4 py-2 space-y-8 select-none">
      
      {/* Top Profile Summary Bar */}
      <div className="rounded-2xl p-6 bg-white/[0.01] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-500 to-indigo-500 p-0.5 shadow-xl shadow-rose-500/5">
            <div className="h-full w-full rounded-2xl bg-[#0a0a14] flex items-center justify-center text-xl font-bold uppercase text-white">
              {username.slice(0, 2)}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <span>{username}</span>
              <span className="px-2 py-0.5 text-[9px] tracking-widest bg-rose-500/20 text-rose-300 font-black rounded uppercase border border-rose-500/30">ELITE GENIN</span>
            </h2>
            <p className="text-[11px] text-gray-400 italic mb-2">Member since June 2026 • Rating Critique Veteran</p>
            <button
              onClick={onSignOut}
              className="cursor-pointer px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-white border border-rose-500/25 rounded-lg transition duration-200"
            >
              Log Out of Workspace
            </button>
          </div>
        </div>

        {/* Short stats blocks */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div className="flex items-center justify-center space-x-1 text-rose-500">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-black text-gray-100">{totalHrs}h {totalMins}m</span>
            </div>
            <span className="text-[8px] uppercase tracking-wider text-gray-400 block font-semibold mt-0.5">EST. WATCHTIME</span>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div className="flex items-center justify-center space-x-1 text-violet-400">
              <Film className="h-4 w-4" />
              <span className="text-sm font-black text-gray-100">{watchlist.length} titles</span>
            </div>
            <span className="text-[8px] uppercase tracking-wider text-gray-400 block font-semibold mt-0.5">TRACKED LIST</span>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div className="flex items-center justify-center space-x-1 text-amber-500">
              <Heart className="h-4 w-4 fill-amber-500" />
              <span className="text-sm font-black text-gray-100">{totalFavoritesCount} titles</span>
            </div>
            <span className="text-[8px] uppercase tracking-wider text-gray-400 block font-semibold mt-0.5">FAVORITES</span>
          </div>
        </div>
      </div>

      {/* Numerical distribution bar charts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 p-5 rounded-2xl bg-[#0f0f15]/40 border border-white/5 space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-rose-400" />
            <h3 className="text-xs font-black uppercase text-gray-300 tracking-wider">STATUS METRICS</h3>
          </div>

          <div className="space-y-3">
            {(['Watching', 'Completed', 'Planning', 'Dropped', 'On-Hold'] as WatchStatus[]).map(status => {
              const count = statusCounts[status];
              const pct = watchlist.length > 0 ? (count / watchlist.length) * 100 : 0;
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-300 font-medium">{status}</span>
                    <span className="font-bold text-gray-400">{count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a1a26] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        status === 'Watching' ? 'bg-rose-500' :
                        status === 'Completed' ? 'bg-emerald-500' :
                        status === 'Planning' ? 'bg-sky-500' :
                        status === 'On-Hold' ? 'bg-amber-500' : 'bg-zinc-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Watchlist full item database selector */}
        <div className="md:col-span-3 p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ListPlus className="h-4 w-4 text-violet-400" />
              <h3 className="text-xs font-black uppercase text-gray-300 tracking-wider">Active Watchlist details</h3>
            </div>
            
            <p className="text-[10px] text-gray-400 italic font-medium leading-none">
              Keep your progress updated directly in each card.
            </p>
          </div>

          {watchlist.length === 0 ? (
            <div className="p-10 text-center rounded-xl bg-white/[0.01] border border-dashed border-white/5">
              <p className="text-xs text-gray-400 font-light">No titles tracked yet. Browse the catalog & mark active lists!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300 border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-gray-400 uppercase tracking-widest leading-none font-bold">
                    <th className="py-2.5 px-3">ANIME COVER & TITLE</th>
                    <th className="py-2.5 px-3">STATUS</th>
                    <th className="py-2.5 px-3">PROGRESS</th>
                    <th className="py-2.5 px-3">RATING SCORE</th>
                    <th className="py-2.5 px-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {watchlist.map(item => {
                    const matchedAnime = animeList.find(a => a.id === item.animeId);
                    if (!matchedAnime) return null;

                    return (
                      <tr key={item.animeId} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center space-x-3">
                            <img 
                              onClick={() => onSelectAnime(matchedAnime)}
                              src={matchedAnime.coverImage} 
                              alt={matchedAnime.englishTitle || matchedAnime.title}
                              className="h-10 w-7 rounded object-cover cursor-pointer border border-white/10"
                            />
                            <div>
                              <p 
                                onClick={() => onSelectAnime(matchedAnime)}
                                className="font-bold text-gray-100 hover:text-rose-400 transition cursor-pointer"
                              >
                                {matchedAnime.englishTitle || matchedAnime.title}
                              </p>
                              <span className="text-[9px] text-[#8b5cf6]">{matchedAnime.studios.join(', ')}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold border ${badgeColors[item.status]}`}>
                            {item.status}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center space-x-1.5 font-semibold font-sans">
                            <span className="text-gray-100">{item.progress}</span>
                            <span className="text-gray-500">/</span>
                            <span className="text-gray-400">{matchedAnime.episodeCount || 'Ongoing'} eps</span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="text-[#f59e0b] font-bold font-sans">
                            {item.rating ? `${item.rating}/10 ★` : '—'}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => onRemoveFromWatchlist(item.animeId)}
                            className="p-1 px-2 rounded-md hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 transition"
                            title="Remove tracking"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
