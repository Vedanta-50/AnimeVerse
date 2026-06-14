import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, Film, Sparkles, Tv, HelpCircle, X, Compass, ArrowRight, Grid } from 'lucide-react';
import { Anime, WatchStatus } from '../types';
import { searchAnime } from '../services/api';
import AnimeCard from './AnimeCard';

interface AnimeSearchProps {
  localAnimeList: Anime[];
  onSelectAnime: (anime: Anime) => void;
  watchlist: { animeId: string; status: WatchStatus }[];
  onQuickTrack: (animeId: string, status: WatchStatus) => void;
}

const PRESET_GENRES = [
  "Action", "Adventure", "Fantasy", "Drama", "Sci-Fi", 
  "Comedy", "Romance", "Mystery", "Supernatural", "Suspense"
];

const PRESET_TAGS = [
  { label: "High Rated (8.5+)", rating: 8.5 },
  { label: "Masterpieces (9.0+)", rating: 9.0 },
  { label: "Ongoing Series", status: "Ongoing" },
  { label: "Classic/Completed", status: "Completed" },
];

export default function AnimeSearch({ localAnimeList, onSelectAnime, watchlist, onQuickTrack }: AnimeSearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [results, setResults] = useState<Anime[]>(localAnimeList);
  const [searchSource, setSearchSource] = useState<'all' | 'local' | 'online'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Debounce query to prevent hammer of API / lag
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 450);
    return () => clearTimeout(handler);
  }, [query]);

  // Execute Search
  useEffect(() => {
    async function performSearch() {
      setIsLoading(true);
      try {
        if (debouncedQuery.trim()) {
          // Live search in Jikan/Local
          const apiResults = await searchAnime(debouncedQuery, {
            genre: selectedGenre || undefined,
            status: selectedStatus || undefined,
            sortBy: 'score'
          });
          
          let filtered = [...apiResults];
          if (minRating > 0) {
            filtered = filtered.filter(a => a.score >= minRating);
          }
          if (searchSource === 'local') {
            filtered = filtered.filter(a => !a.id.startsWith('jikan-'));
          } else if (searchSource === 'online') {
            filtered = filtered.filter(a => a.id.startsWith('jikan-'));
          }

          setResults(filtered);
        } else {
          // Default browse of local inventory with active filter tags
          let filtered = [...localAnimeList];
          if (selectedGenre) {
            filtered = filtered.filter(a => a.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase()));
          }
          if (selectedStatus) {
            filtered = filtered.filter(a => a.status === selectedStatus);
          }
          if (minRating > 0) {
            filtered = filtered.filter(a => a.score >= minRating);
          }
          setResults(filtered);
        }
      } catch (err) {
        console.error("Anime search query error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    performSearch();
  }, [debouncedQuery, selectedGenre, minRating, selectedStatus, searchSource, localAnimeList]);

  // Toggle or choose genre badge
  const handleGenreSelect = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
    }
  };

  // Quick Preset Tags
  const handlePresetSelect = (preset: typeof PRESET_TAGS[number]) => {
    if (preset.rating) {
      setMinRating(minRating === preset.rating ? 0 : preset.rating);
    }
    if (preset.status) {
      setSelectedStatus(selectedStatus === preset.status ? null : preset.status);
    }
  };

  return (
    <div id="anime-search-container" className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 animate-fade-in select-none">
      
      {/* Search Deck Hero Header */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-zinc-950 via-rose-950/10 to-indigo-950/10 border border-white/5 overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-40 w-40 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute left-0 bottom-0 -mb-8 -ml-8 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Search className="h-3.5 w-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">Dynamic Anime Search</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Search Anime & Get <span className="bg-gradient-to-r from-rose-400 to-indigo-400 bg-clip-text text-transparent">Instant Visuals</span>
          </h1>
          
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light max-w-2xl">
            Type your favorite anime name, production studio, or genre keyword. Get direct high-quality pictures, synopsis trailers, voice actor casts, and schedules instantly.
          </p>
        </div>

        {/* The prominent real-time search input bar */}
        <div className="relative z-10 mt-8 max-w-2xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="anime-search-bar"
              className="w-full text-sm bg-black/60 border border-white/10 hover:border-white/20 focus:border-rose-500/35 rounded-2xl py-4 pl-12 pr-10 outline-none text-white placeholder-gray-500 transition-all font-sans leading-none"
              placeholder="Search anime title, e.g. Demon Slayer, Naruto, Bleach, Spy x Family..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-4 p-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-gray-500">Database Source:</span>
            <button
              onClick={() => setSearchSource('all')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                searchSource === 'all' 
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' 
                  : 'bg-white/[0.02] text-gray-400 border border-transparent hover:text-white'
              }`}
            >
              All Sources
            </button>
            <button
              onClick={() => setSearchSource('local')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                searchSource === 'local' 
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' 
                  : 'bg-white/[0.02] text-gray-400 border border-transparent hover:text-white'
              }`}
            >
              Curated Local
            </button>
            <button
              onClick={() => setSearchSource('online')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                searchSource === 'online' 
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' 
                  : 'bg-white/[0.02] text-gray-400 border border-transparent hover:text-white'
              }`}
            >
              Jikan Live API
            </button>

            <span className="text-gray-600 px-1">|</span>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.04] transition flex items-center space-x-1"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>{showFilters ? 'Hide Fine Filters' : 'Show Advanced Filters'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Deck Collapsible panel */}
      {showFilters && (
        <div className="p-5 rounded-2xl bg-white/[0.01]/10 border border-white/5 space-y-4 animate-slide-down">
          
          {/* Preset Smart Tags */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Quick Search Suggestions</span>
            <div className="flex flex-wrap gap-2">
              {PRESET_TAGS.map((tag) => {
                const isSelected = 
                  (tag.rating && minRating === tag.rating) || 
                  (tag.status && selectedStatus === tag.status);
                return (
                  <button
                    key={tag.label}
                    onClick={() => handlePresetSelect(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      isSelected
                        ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                        : 'bg-[#111] hover:bg-white/[0.02] border-white/5 text-gray-300 hover:text-white'
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Genre badges row */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Filter Genres</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_GENRES.map((genre) => {
                const isGenreActive = selectedGenre?.toLowerCase() === genre.toLowerCase();
                return (
                  <button
                    key={genre}
                    onClick={() => handleGenreSelect(genre)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      isGenreActive
                        ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            {/* Rating slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Minimum Rating Quality Score</span>
                <span className="text-rose-400 font-bold tracking-tight bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  {minRating > 0 ? `★ ${minRating.toFixed(1)}+` : 'Any Rating'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="9.5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Clear Filter locks button */}
            <div className="flex items-end justify-start sm:justify-end pb-1.5">
              {(selectedGenre || minRating > 0 || selectedStatus) && (
                <button
                  onClick={() => {
                    setSelectedGenre(null);
                    setMinRating(0);
                    setSelectedStatus(null);
                    setQuery('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/10 border border-rose-500/20 transition flex items-center space-x-1.5"
                >
                  <X className="h-4 w-4" />
                  <span>Reset All Filter Locks</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Results grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-rose-400">
            {debouncedQuery.trim() ? `Search Results for "${debouncedQuery}"` : 'All Available Anime'} ({results.length} titles found)
          </h2>
          {isLoading && (
            <div className="flex items-center space-x-1">
              <div className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-bounce" />
              <div className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-1 animate-pulse">Browsing database...</span>
            </div>
          )}
        </div>

        {results.length === 0 ? (
          <div className="py-24 text-center rounded-3xl bg-white/[0.01] border border-dashed border-white/5 space-y-3 max-w-lg mx-auto">
            <p className="text-sm text-gray-300 font-black uppercase">No Matching Anime Found</p>
            <p className="text-xs text-gray-500 leading-relaxed font-light px-4">
              We couldn't locate any anime named "{debouncedQuery}" matching your current genre or rating selections. Make sure spelling is correct or try to reset filters.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedGenre(null);
                setMinRating(0);
                setSelectedStatus(null);
                setSearchSource('all');
              }}
              className="mt-2 text-xs font-black text-rose-400 hover:text-rose-300 uppercase tracking-widest bg-rose-500/5 px-4 py-2 rounded-full border border-rose-500/10"
            >
              Clear Search filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((anime) => {
              const trackingStatus = watchlist.find(w => w.animeId === anime.id)?.status || 'None';
              return (
                <div key={anime.id} className="transform hover:-translate-y-1.5 transition-transform duration-300">
                  <AnimeCard
                    anime={anime}
                    onSelect={onSelectAnime}
                    watchlistStatus={trackingStatus}
                    onQuickTrack={onQuickTrack}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recommended visual cards carousel banner */}
      {!debouncedQuery.trim() && (
        <section className="p-6 sm:p-8 rounded-2xl bg-[#090910] border border-white/5 space-y-4">
          <div className="flex items-center space-x-2">
            <Compass className="h-4.5 w-4.5 text-[#a855f7]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-300">Need some suggestions to search?</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              onClick={() => { setQuery('Jujutsu Kaisen'); }} 
              className="p-4 rounded-xl bg-white/[0.02] hover:bg-rose-500/5 hover:border-rose-500/20 border border-white/5 cursor-pointer transition text-left group"
            >
              <h4 className="text-xs font-bold text-gray-200 group-hover:text-rose-400">Jujutsu Kaisen</h4>
              <p className="text-[10px] text-gray-500 mt-1">Search modern supernatural action masterpieces with high production value.</p>
              <div className="text-[9px] text-rose-400 font-bold mt-2.5 flex items-center space-x-1">
                <span>Search now</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
              </div>
            </div>

            <div 
              onClick={() => { setQuery("Frieren"); }} 
              className="p-4 rounded-xl bg-white/[0.02] hover:bg-rose-500/5 hover:border-rose-500/20 border border-white/5 cursor-pointer transition text-left group"
            >
              <h4 className="text-xs font-bold text-gray-200 group-hover:text-rose-400">Frieren: Beyond Journey's End</h4>
              <p className="text-[10px] text-gray-500 mt-1">Discover beautifully composed emotional and slow-paced fantasy epics.</p>
              <div className="text-[9px] text-rose-400 font-bold mt-2.5 flex items-center space-x-1">
                <span>Search now</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
              </div>
            </div>

            <div 
              onClick={() => { setQuery("Demon Slayer"); }} 
              className="p-4 rounded-xl bg-white/[0.02] hover:bg-rose-500/5 hover:border-rose-500/20 border border-white/5 cursor-pointer transition text-left group"
            >
              <h4 className="text-xs font-bold text-gray-200 group-hover:text-rose-400">Kimetsu no Yaiba</h4>
              <p className="text-[10px] text-gray-500 mt-1">Unleash jaw-dropping fluid combat visual animations from Studio ufotable.</p>
              <div className="text-[9px] text-rose-400 font-bold mt-2.5 flex items-center space-x-1">
                <span>Search now</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
