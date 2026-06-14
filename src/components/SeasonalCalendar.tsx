import React, { useState, useEffect } from 'react';
import { Anime } from '../types';
import { Clock, Calendar, AlertCircle, Sparkles, RefreshCw, Star } from 'lucide-react';

interface SeasonalCalendarProps {
  upcomingAnimeList: Anime[];
  onSelectAnime: (anime: Anime) => void;
}

export default function SeasonalCalendar({ upcomingAnimeList, onSelectAnime }: SeasonalCalendarProps) {
  const [countdownStates, setCountdownStates] = useState<Record<string, string>>({});

  // Active time ticker for countdown releases
  useEffect(() => {
    const updateCountdowns = () => {
      const states: Record<string, string> = {};
      
      upcomingAnimeList.forEach(anime => {
        // Fallback target date if undefined
        const targetStr = anime.upcomingEpisodeAirDate || `${anime.year}-10-01T00:00:00.000Z`;
        const targetTime = new Date(targetStr).getTime();
        const now = Date.now();
        const diff = targetTime - now;

        if (diff <= 0) {
          states[anime.id] = "AIRING NOW 📺";
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          states[anime.id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
      });

      setCountdownStates(states);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [upcomingAnimeList]);

  // Seasonal months schema
  const calendarMonths = [
    { title: 'Summer 2026 Season', active: true, months: 'June - August 2026' },
    { title: 'Fall 2026 Season', active: false, months: 'September - November 2026' },
    { title: 'Winter 2027 Season', active: false, months: 'December - February 2027' }
  ];

  return (
    <div id="seasonal-countdown-calendar" className="max-w-7xl mx-auto px-4 py-2 space-y-10 selection:bg-rose-500 selection:text-white">
      
      {/* Visual countdown block */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-rose-500 animate-pulse" />
          <h2 className="text-lg font-black uppercase text-gray-200 tracking-wider">RELEASES COUNTDOWN TICKER</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingAnimeList.map((anime) => {
            const timeStr = countdownStates[anime.id] || "Loading...";
            return (
              <div 
                key={anime.id}
                id={`countdown-card-${anime.id}`}
                className="rounded-xl overflow-hidden bg-white/[0.01] border border-white/5 hover:border-rose-500/25 transition flex"
              >
                <img 
                  onClick={() => onSelectAnime(anime)}
                  src={anime.coverImage} 
                  alt={anime.englishTitle || anime.title}
                  className="h-28 w-20 object-cover cursor-pointer hover:opacity-90 transition border-r border-white/5"
                />
                
                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 
                      onClick={() => onSelectAnime(anime)}
                      className="text-xs font-bold text-gray-100 truncate hover:text-rose-400 cursor-pointer transition"
                    >
                      {anime.englishTitle || anime.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 block truncate mt-0.5 leading-none">Studio: {anime.studios.join(' & ')}</p>
                  </div>

                  {/* High visual countdown block */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-rose-400 font-extrabold block">AIRTIME REMAINING:</span>
                    <div className="px-2.5 py-1 text-xs rounded bg-[#090910] border border-rose-500/10 text-rose-300 font-black font-mono tracking-wider w-fit">
                      {timeStr}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seasonal Scheduling Section */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-black uppercase text-gray-200 tracking-wider">SEASONAL CALENDAR INDEX</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {calendarMonths.map((m, idx) => {
            // Filter anime matching the active year & season
            const matchName = m.title.split(' ')[0] as any;
            const matches = upcomingAnimeList.filter(a => a.season === matchName);

            return (
              <div 
                key={idx}
                className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  m.active 
                    ? 'bg-slate-900/40 border-indigo-500/20 shadow-xl' 
                    : 'bg-[#0a0a14]/60 border-white/5 opacity-80'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start leading-none">
                    <div>
                      <h3 className="text-sm font-black text-gray-100">{m.title}</h3>
                      <span className="text-[10px] text-gray-400 leading-none">{m.months}</span>
                    </div>
                    {m.active && (
                      <span className="px-2 py-0.5 text-[9px] font-black tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded">
                        CURRENT
                      </span>
                    )}
                  </div>

                  {/* List of shows slated */}
                  <div className="space-y-2">
                    {matches.length === 0 ? (
                      <div className="p-3 text-center text-gray-400 text-[10px] italic bg-[#0f0f15]/50 roundedborder border-white/5 border-dashed">
                        No official dates posted yet.
                      </div>
                    ) : (
                      matches.map(show => (
                        <div 
                          key={show.id}
                          onClick={() => onSelectAnime(show)}
                          className="p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-indigo-500/35 transition cursor-pointer flex items-center justify-between"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-gray-200 truncate pr-2">{show.englishTitle || show.title}</p>
                            <span className="text-[9px] text-gray-400 block truncate">{show.studios.join(' • ')}</span>
                          </div>
                          
                          <div className="text-[9px] font-semibold text-rose-400 whitespace-nowrap">
                            {show.releaseDate.split('-')[2]} Jul 2026
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 text-[10px] text-gray-500 leading-snug">
                  * Air schedule dates reflect Japan Standard Time (JST) releases. Delay streams vary by location.
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
