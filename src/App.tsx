import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import AnimeCard from './components/AnimeCard';
import AnimeSearch from './components/AnimeSearch';
import CommunitySection from './components/CommunitySection';
import StatsDashboard from './components/StatsDashboard';
import SeasonalCalendar from './components/SeasonalCalendar';
import CompareTool from './components/CompareTool';
import AnimeDetailsModal from './components/AnimeDetailsModal';
import EmailLoginGate from './components/EmailLoginGate';
import { Anime, WatchlistStatus, WatchStatus } from './types';
import { LOCAL_ANIME_DATA, GENRE_LIST, STUDIO_LIST } from './data/animeData';
import { getTrendingAnime, getTopRatedAnime, getUpcomingAnime, searchAnime } from './services/api';
import { Compass, Sparkles, Star, Calendar, RefreshCw, Trophy, Heart, Flame, Filter, Sliders, ChevronRight, Search } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [animeList, setAnimeList] = useState<Anime[]>(LOCAL_ANIME_DATA);
  const [trending, setTrending] = useState<Anime[]>(LOCAL_ANIME_DATA.slice(0, 4));
  const [topRated, setTopRated] = useState<Anime[]>(LOCAL_ANIME_DATA.slice(0, 4));
  const [upcoming, setUpcoming] = useState<Anime[]>(LOCAL_ANIME_DATA.filter(a => a.status === 'Upcoming'));
  
  // Selected Anime for modal view
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  // Filter states for Browse tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStudio, setSelectedStudio] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'popularity' | 'release'>('score');

  // Loading States
  const [isLoading, setIsLoading] = useState(false);

  // User email state
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('animeverse-user-email') || null;
  });

  const [watchlist, setWatchlist] = useState<WatchlistStatus[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Sync state whenever userEmail changes
  useEffect(() => {
    if (!userEmail) {
      setWatchlist([]);
      setFavorites([]);
      return;
    }
    const savedWatchlist = localStorage.getItem(`animeverse-watchlist-${userEmail}`);
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    } else {
      // Empty slate for new emails as specified: "no progress should be there in this web. Coz it is for the public who will enter their email and use the web"
      setWatchlist([]);
    }

    const savedFavorites = localStorage.getItem(`animeverse-favorites-${userEmail}`);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    } else {
      setFavorites([]);
    }
  }, [userEmail]);

  // Saving user states to storage when modified
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(`animeverse-watchlist-${userEmail}`, JSON.stringify(watchlist));
    }
  }, [watchlist, userEmail]);

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(`animeverse-favorites-${userEmail}`, JSON.stringify(favorites));
    }
  }, [favorites, userEmail]);

  // Load online API Jikan data on mount
  useEffect(() => {
    async function loadOnlineData() {
      setIsLoading(true);
      try {
        const trendData = await getTrendingAnime();
        const topData = await getTopRatedAnime();
        const upData = await getUpcomingAnime();

        // Update lists safely
        if (trendData && trendData.length > 0) setTrending(trendData);
        if (topData && topData.length > 0) setTopRated(topData);
        if (upData && upData.length > 0) setUpcoming(upData);

        // Combine for browse inventory
        const combined = [...LOCAL_ANIME_DATA, ...trendData, ...topData, ...upData];
        // Deduplicate
        const unique = combined.filter(
          (value, index, self) => self.findIndex(t => t.id === value.id) === index
        );
        setAnimeList(unique);
      } catch (err) {
        console.warn("Failed to retrieve live Jikan data, using robust local data.", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOnlineData();
  }, []);

  // Sync Browse & Search filtering triggers
  useEffect(() => {
    async function executeSearch() {
      setIsLoading(true);
      const yearVal = selectedYear ? Number(selectedYear) : undefined;
      const results = await searchAnime(searchQuery, {
        genre: selectedGenre || undefined,
        studio: selectedStudio || undefined,
        status: selectedStatus || undefined,
        year: yearVal,
        sortBy: sortBy
      });

      // Merge results with standard cache
      const combined = [...results, ...animeList];
      const unique = combined.filter(
        (value, index, self) => self.findIndex(t => t.id === value.id) === index
      );
      
      // Filter current screen view results
      let filtered = [...unique];
      if (searchQuery.trim()) {
        filtered = filtered.filter(a => 
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          a.englishTitle?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (selectedGenre) {
        filtered = filtered.filter(a => a.genres.includes(selectedGenre));
      }
      if (selectedStudio) {
        filtered = filtered.filter(a => a.studios.includes(selectedStudio));
      }
      if (selectedStatus) {
        filtered = filtered.filter(a => a.status === selectedStatus);
      }
      if (selectedYear) {
        filtered = filtered.filter(a => a.year === Number(selectedYear));
      }

      // Sort
      if (sortBy === 'score') {
        filtered.sort((a, b) => b.score - a.score);
      } else if (sortBy === 'popularity') {
        filtered.sort((a, b) => a.popularityRanking - b.popularityRanking);
      } else if (sortBy === 'release') {
        filtered.sort((a, b) => b.year - a.year);
      }

      setAnimeList(prev => {
        const mergedAll = [...filtered, ...prev];
        return mergedAll.filter((value, index, self) => self.findIndex(t => t.id === value.id) === index);
      });
      setIsLoading(false);
    }
    executeSearch();
  }, [searchQuery, selectedGenre, selectedStudio, selectedStatus, selectedYear, sortBy]);

  // Quick Tracking Sync Form
  const handleQuickTrack = (animeId: string, status: WatchStatus) => {
    if (status === 'None') {
      setWatchlist(prev => prev.filter(w => w.animeId !== animeId));
      return;
    }

    const matchedAnime = animeList.find(a => a.id === animeId);
    const maxEpisodes = matchedAnime ? matchedAnime.episodeCount : 12;

    setWatchlist(prev => {
      const exists = prev.find(w => w.animeId === animeId);
      if (exists) {
        return prev.map(w => w.animeId === animeId ? {
          ...w,
          status,
          progress: status === 'Completed' ? maxEpisodes : w.progress,
          updatedAt: new Date().toISOString()
        } : w);
      } else {
        return [...prev, {
          animeId,
          status,
          progress: status === 'Completed' ? maxEpisodes : 0,
          rating: 10,
          updatedAt: new Date().toISOString()
        }];
      }
    });

    // Proactively back up completed/watching as favorites
    if (status === 'Completed' || status === 'Watching') {
      if (!favorites.includes(animeId)) {
        setFavorites(prev => [...prev, animeId]);
      }
    }
  };

  // Detailed Modal Sync Form Update
  const handleUpdateTrackDetail = (animeId: string, status: WatchStatus, progress: number, rating?: number) => {
    if (status === 'None') {
      setWatchlist(prev => prev.filter(w => w.animeId !== animeId));
      return;
    }

    setWatchlist(prev => {
      const exists = prev.find(w => w.animeId === animeId);
      if (exists) {
        return prev.map(w => w.animeId === animeId ? {
          ...w,
          status,
          progress,
          rating,
          updatedAt: new Date().toISOString()
        } : w);
      } else {
        return [...prev, {
          animeId,
          status,
          progress,
          rating,
          updatedAt: new Date().toISOString()
        }];
      }
    });
  };

  // Transitions for Related Anime ID clickable selection within details modal
  const handleSelectRelatedAnime = (id: string) => {
    const matched = animeList.find(a => a.id === id);
    if (matched) {
      setSelectedAnime(matched);
    } else {
      // Create lazy fallback if not instantly matched
      const fallbackMock: Anime = {
        id,
        title: id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' '),
        synopsis: "An exciting related production in the franchise ecosystem. Check release schedules for details.",
        bannerImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1400",
        coverImage: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=500",
        genres: ["Action", "Adventure"],
        studios: ["MAPPA"],
        releaseDate: "2024-10-12",
        season: "Fall",
        year: 2024,
        episodeCount: 12,
        durationPerEpisode: 24,
        status: "Completed",
        score: 8.5,
        popularityRanking: 15,
        characters: []
      };
      setSelectedAnime(fallbackMock);
    }
  };

  // Pick a random anime and pop open modal list
  const handleRandomAnimeLaunch = () => {
    if (animeList.length === 0) return;
    const rndIdx = Math.floor(Math.random() * animeList.length);
    setSelectedAnime(animeList[rndIdx]);
  };

  // Formulate filtered lists based on search params
  const browseFilteredList = animeList.filter(a => {
    if (selectedGenre && !a.genres.includes(selectedGenre)) return false;
    if (selectedStudio && !a.studios.includes(selectedStudio)) return false;
    if (selectedStatus && a.status !== selectedStatus) return false;
    if (selectedYear && a.year !== Number(selectedYear)) return false;
    if (searchQuery.trim()) {
      const titleMatch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.englishTitle?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!titleMatch) return false;
    }
    return true;
  });

  if (!userEmail) {
    return (
      <EmailLoginGate 
        onSignIn={(email) => {
          localStorage.setItem('animeverse-user-email', email);
          setUserEmail(email);
        }} 
      />
    );
  }

  return (
    <div id="animeverse-root-app" className="min-h-screen bg-[#030308] text-gray-100 flex flex-col font-sans mb-16 md:mb-0">
      
      {/* Global Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userEmail={userEmail || ''} 
        onSignOut={() => {
          localStorage.removeItem('animeverse-user-email');
          setUserEmail(null);
          setActiveTab('home');
        }}
      />

      {/* Main viewport Container */}
      <main id="viewport-panel" className="flex-grow py-6 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        {activeTab === 'home' && (
          <div id="home-view" className="space-y-12 animate-fade-in">
            
            {/* Spotlight Hero Slider */}
            <HeroSlider 
              slides={trending.slice(0, 5)} 
              onSelectAnime={setSelectedAnime} 
              onOpenAssistant={() => setActiveTab('search')}
            />

            {/* Trending Section grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Flame className="h-5 w-5 text-rose-500 animate-pulse" />
                  <h2 className="text-xl font-black text-white hover:text-rose-400 cursor-pointer uppercase tracking-tight">Trending Series</h2>
                </div>
                <button onClick={() => setActiveTab('browse')} className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center space-x-1">
                  <span>View All Catalog</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {trending.map(anime => {
                  const tracking = watchlist.find(w => w.animeId === anime.id)?.status || 'None';
                  return (
                    <AnimeCard 
                      key={anime.id} 
                      anime={anime} 
                      onSelect={setSelectedAnime}
                      watchlistStatus={tracking}
                      onQuickTrack={handleQuickTrack}
                    />
                  );
                })}
              </div>
            </section>

            {/* Top Rated Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Top Rated Enclyclopedia</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 font-sans">
                {topRated.slice(0, 4).map(anime => {
                  const tracking = watchlist.find(w => w.animeId === anime.id)?.status || 'None';
                  return (
                    <AnimeCard 
                      key={anime.id} 
                      anime={anime} 
                      onSelect={setSelectedAnime}
                      watchlistStatus={tracking}
                      onQuickTrack={handleQuickTrack}
                    />
                  );
                })}
              </div>
            </section>

            {/* Upcoming releases preview calendar card bar */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
              
              {/* Upcoming Highlights ticker panel */}
              <div className="md:col-span-1 p-5 rounded-2xl bg-gradient-to-br from-indigo-950/20 via-zinc-950 to-indigo-950/10 border border-white/5 space-y-4">
                <div className="flex items-center space-x-2">
                  <ChevronRight className="h-4.5 w-4.5 text-rose-500" />
                  <h3 className="text-xs font-black uppercase text-gray-200 tracking-wider">UPCOMING COUNTDOWNS</h3>
                </div>

                <div className="space-y-3.5">
                  {upcoming.slice(0, 3).map(anime => (
                    <div 
                      key={anime.id} 
                      onClick={() => setSelectedAnime(anime)}
                      className="flex items-center space-x-3 cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition"
                    >
                      <img src={anime.coverImage} alt={anime.englishTitle || anime.title} className="h-10 w-7 rounded object-cover border border-white/10" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-200 truncate leading-none mb-1">{anime.englishTitle || anime.title}</p>
                        <span className="text-[9px] font-black text-indigo-400 bg-indigo-505/10 rounded uppercase leading-none">{anime.season} {anime.year}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setActiveTab('calendar')}
                  className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/20 text-xs font-bold transition"
                >
                  View Broadcast Tickers
                </button>
              </div>

              {/* Discovery search promo panel */}
              <div className="md:col-span-2 p-5 rounded-2xl bg-[#090910] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4.5 w-4.5 text-rose-400 animate-pulse" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-rose-400">DYNAMIC VISUAL SEARCH</h3>
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase">Want to look up any anime and get actual pictures instantly?</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-light">
                    Search across thousands of series of any genre, studio, broadcast day, or rating level. Discover casting information, visual previews, trailers, and more!
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('search')}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-black transition duration-300 shrink-0 transform hover:-translate-y-0.5"
                >
                  Start Typing
                </button>
              </div>

            </section>

          </div>
        )}

        {activeTab === 'browse' && (
          <div id="browse-view" className="space-y-8 animate-fade-in">
            
            {/* Search filter deck layout */}
            <div className="p-5 rounded-2xl bg-white/[0.01]/10 border border-white/5 space-y-4">
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-rose-500" />
                  <h2 className="text-xs font-black uppercase text-gray-300 tracking-wider">Advanced Directory Filters</h2>
                </div>

                {/* Random Generator & Compare Link */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRandomAnimeLaunch}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center space-x-1.5 select-none"
                    title="Generate a random detailed profile"
                  >
                    <RefreshCw className="h-3.5 w-3.5 cursor-pointer leading-none" />
                    <span>Random Series</span>
                  </button>
                </div>
              </div>

              {/* Filter inputs row grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {/* Text query input */}
                <div className="col-span-2 md:col-span-1 space-y-1">
                  <label className="text-[9.5px] uppercase text-gray-400 tracking-wider font-bold">SEARCH TITLES</label>
                  <input
                    type="text"
                    id="searchbox-text-query"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, studio..."
                    className="w-full bg-[#111] border border-white/10 text-xs text-gray-200 py-2 px-3 rounded-lg outline-none focus:border-rose-500/30 transition leading-none placeholder-gray-600"
                  />
                </div>

                {/* Genre Selector */}
                <div className="space-y-1">
                  <label className="text-[9.5px] uppercase text-gray-400 tracking-wider font-bold">GENRE</label>
                  <select
                    id="genre-dropdown-filter"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 text-xs text-gray-300 p-2 rounded-lg cursor-pointer outline-none"
                  >
                    <option value="">All Genres</option>
                    {GENRE_LIST.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                {/* Studio Selector */}
                <div className="space-y-1">
                  <label className="text-[9.5px] uppercase text-gray-400 tracking-wider font-bold">STUDIO</label>
                  <select
                    id="studio-dropdown-filter"
                    value={selectedStudio}
                    onChange={(e) => setSelectedStudio(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 text-xs text-gray-300 p-2 rounded-lg cursor-pointer outline-none"
                  >
                    <option value="">All Studios</option>
                    {STUDIO_LIST.map(studio => (
                      <option key={studio} value={studio}>{studio}</option>
                    ))}
                  </select>
                </div>

                {/* Status Selector */}
                <div className="space-y-1">
                  <label className="text-[9.5px] uppercase text-gray-400 tracking-wider font-bold">STATUS</label>
                  <select
                    id="status-dropdown-filter"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 text-xs text-gray-300 p-2 rounded-lg cursor-pointer outline-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>

                {/* Sort Sort Selector */}
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-[9.5px] uppercase text-gray-400 tracking-wider font-bold">SORT CRITERIA</label>
                  <select
                    id="sorting-dropdown-filter"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-[#111] border border-white/10 text-xs text-gray-300 p-2 rounded-lg cursor-pointer outline-none font-bold"
                  >
                    <option value="score">Sorted: Score Ratings</option>
                    <option value="popularity">Sorted: Database Popularity</option>
                    <option value="release">Sorted: Recent Launch</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Results Grid block */}
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-400 font-mono">
                CATALOG DIRECTORY INDEX ({browseFilteredList.length} matches)
              </h3>

              {isLoading ? (
                <div className="py-20 text-center text-gray-400 text-xs italic font-semibold animate-pulse">Running advanced searches on database...</div>
              ) : browseFilteredList.length === 0 ? (
                <div className="py-20 text-center rounded-2xl bg-white/[0.01] border border-dashed border-white/5 space-y-1.5">
                  <p className="text-xs text-gray-400 font-light leading-none">Your filter combination did not yield matching enclyclopedia items.</p>
                  <button onClick={() => { setSelectedGenre(''); setSelectedStudio(''); setSelectedStatus(''); setSearchQuery(''); }} className="text-xs font-bold text-rose-400 hover:text-rose-300 mt-1">
                    Clear Filter Locks
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {browseFilteredList.map(anime => {
                    const tracking = watchlist.find(w => w.animeId === anime.id)?.status || 'None';
                    return (
                      <AnimeCard 
                        key={anime.id} 
                        anime={anime} 
                        onSelect={setSelectedAnime}
                        watchlistStatus={tracking}
                        onQuickTrack={handleQuickTrack}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            {/* Direct Side-by-Side compare matrix workspace */}
            <section className="pt-8 border-t border-white/5">
              <CompareTool animeList={animeList} onSelectAnime={setSelectedAnime} />
            </section>

          </div>
        )}

        {activeTab === 'calendar' && (
          <div id="calendar-view" className="animate-fade-in">
            <SeasonalCalendar 
              upcomingAnimeList={upcoming} 
              onSelectAnime={setSelectedAnime} 
            />
          </div>
        )}

        {activeTab === 'search' && (
          <div id="search-view" className="animate-fade-in">
            <AnimeSearch 
              localAnimeList={animeList} 
              onSelectAnime={setSelectedAnime} 
              watchlist={watchlist}
              onQuickTrack={handleQuickTrack}
            />
          </div>
        )}

        {activeTab === 'community' && (
          <div id="community-view" className="animate-fade-in">
            <CommunitySection 
              animeList={animeList} 
              userEmail={userEmail || ''} 
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <div id="profile-view" className="animate-fade-in">
            <StatsDashboard 
              watchlist={watchlist} 
              animeList={animeList}
              favorites={favorites}
              onRemoveFromWatchlist={(id) => setWatchlist(prev => prev.filter(w => w.animeId !== id))}
              onSelectAnime={setSelectedAnime}
              userEmail={userEmail || ''}
              onSignOut={() => {
                localStorage.removeItem('animeverse-user-email');
                setUserEmail(null);
                setActiveTab('home');
              }}
            />
          </div>
        )}

      </main>

      {/* Footer information bar */}
      <footer id="footer-section" className="border-t border-rose-500/10 bg-[#030308] py-8 text-center text-xs text-gray-500 mt-12 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-sans text-[11px] leading-relaxed">
            <strong>AnimeVerse © 2026</strong> — A legal fully custom-curated anime encyclopedia index database. 
            All trailers represent official YouTube links. No files are stored locally.
          </p>
          <div className="flex items-center justify-center space-x-4 text-[10px] text-gray-400">
            <button onClick={() => setActiveTab('home')} className="hover:text-rose-400 transition font-medium">Spotlights</button>
            <span>•</span>
            <button onClick={() => setActiveTab('browse')} className="hover:text-rose-400 transition font-medium">Directory Index</button>
            <span>•</span>
            <button onClick={() => setActiveTab('calendar')} className="hover:text-rose-400 transition font-medium">Broadcasting Dates</button>
            <span>•</span>
            <button onClick={() => setActiveTab('profile')} className="hover:text-rose-400 transition font-medium">Personal Watch Tracker</button>
          </div>
        </div>
      </footer>

      {/* Central detailed overlay popup */}
      {selectedAnime && (
        <AnimeDetailsModal 
          anime={selectedAnime}
          onClose={() => setSelectedAnime(null)}
          onSelectRelatedAnime={handleSelectRelatedAnime}
          watchlistStatus={watchlist.find(w => w.animeId === selectedAnime.id)?.status || 'None'}
          userProgress={watchlist.find(w => w.animeId === selectedAnime.id)?.progress || 0}
          userRating={watchlist.find(w => w.animeId === selectedAnime.id)?.rating}
          onUpdateTrack={handleUpdateTrackDetail}
        />
      )}

      <SpeedInsights />
    </div>
  );
}
