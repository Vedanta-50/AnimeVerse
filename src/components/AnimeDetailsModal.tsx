import React, { useState, useEffect } from 'react';
import { Anime, WatchStatus, Character } from '../types';
import { X, Star, Film, Sliders, CheckCircle, PlusCircle, HelpCircle, Users, Link } from 'lucide-react';
import { getAnimeCharacters } from '../services/api';

interface AnimeDetailsModalProps {
  anime: Anime;
  onClose: () => void;
  onSelectRelatedAnime: (id: string) => void;
  watchlistStatus: WatchStatus;
  userProgress: number;
  userRating?: number;
  onUpdateTrack: (animeId: string, status: WatchStatus, progress: number, rating?: number) => void;
}

export default function AnimeDetailsModal({
  anime,
  onClose,
  onSelectRelatedAnime,
  watchlistStatus,
  userProgress,
  userRating = 10,
  onUpdateTrack
}: AnimeDetailsModalProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoadingChars, setIsLoadingChars] = useState(true);
  
  // Custom tracking state inside Modal for updates
  const [localStatus, setLocalStatus] = useState<WatchStatus>(watchlistStatus);
  const [localProgress, setLocalProgress] = useState<number>(userProgress);
  const [localRating, setLocalRating] = useState<number>(userRating);
  const [isSavedMsg, setIsSavedMsg] = useState(false);

  // Sync state with props when modal anime changes
  useEffect(() => {
    setLocalStatus(watchlistStatus);
    setLocalProgress(userProgress);
    setLocalRating(userRating || 10);
  }, [anime.id, watchlistStatus, userProgress, userRating]);

  // Load characters & VAs
  useEffect(() => {
    let active = true;
    setIsLoadingChars(true);
    getAnimeCharacters(anime.id).then(data => {
      if (active) {
        setCharacters(data);
        setIsLoadingChars(false);
      }
    });
    return () => { active = false; };
  }, [anime.id]);

  const handleSaveTracking = () => {
    onUpdateTrack(anime.id, localStatus, localProgress, localRating);
    setIsSavedMsg(true);
    setTimeout(() => setIsSavedMsg(false), 3000);
  };

  return (
    <div id="details-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      {/* Modal Box */}
      <div 
        id={`details-modal-container-${anime.id}`}
        className="relative w-full max-w-5xl rounded-2xl bg-[#07070e] border border-white/5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        
        {/* Banner Section with title and close CTA */}
        <div className="relative h-48 sm:h-64 shrink-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${anime.bannerImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070e] via-[#07070e]/40 to-black/50" />
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-rose-600 border border-white/10 text-white transition z-20"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          {/* Banner core info */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end space-x-5 z-10">
            {/* Poster cover floating */}
            <img 
              src={anime.coverImage} 
              alt={anime.englishTitle || anime.title} 
              className="hidden sm:block h-36 w-24 rounded-lg object-cover border border-white/10 shadow-lg"
            />
            <div className="space-y-1.5 leading-none">
              <span className="px-2 py-0.5 text-[8.5px] font-black tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/25 rounded uppercase">
                {anime.season} {anime.year}
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase leading-tight">
                {anime.englishTitle || anime.title}
              </h2>
              {(anime.englishTitle && (anime.japaneseTitle || anime.title !== anime.englishTitle)) && (
                <p className="text-xs sm:text-sm text-gray-300 font-medium leading-none">{anime.japaneseTitle || anime.title}</p>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Top Quick layout splits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left specifications column */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Synopsis */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-rose-400">Synopsis</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                  {anime.synopsis}
                </p>
              </div>

              {/* Related Anime Row links */}
              {anime.relatedAnime && anime.relatedAnime.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-purple-400">Related Productions</h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.relatedAnime.map((rel, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectRelatedAnime(rel.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.02] hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/25 transition text-xs text-gray-300 hover:text-rose-400 flex items-center space-x-1.5"
                      >
                        <Link className="h-3 w-3" />
                        <span><strong>{rel.relationType}:</strong> {rel.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Characters database carousel */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-indigo-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-200">Main Characters & Voice Actors</h3>
                </div>

                {isLoadingChars ? (
                  <div className="p-6 text-center text-gray-400 text-xs italic">Loading character database...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {characters.map((char) => (
                      <div 
                        key={char.id}
                        className="p-2.5 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <img 
                            src={char.image} 
                            alt={char.name} 
                            className="h-10 w-10 shrink-0 rounded-lg object-cover border border-white/10"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200";
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-200 truncate leading-none mb-0.5">{char.name}</p>
                            <span className="text-[9px] text-gray-400 bg-white/5 px-1 py-0.5 rounded uppercase font-bold">{char.role}</span>
                          </div>
                        </div>

                        {/* VA Details mapping */}
                        {char.voiceActors && char.voiceActors.length > 0 && (
                          <div className="text-right min-w-0 pl-2">
                            <p className="text-[10px] font-bold text-rose-400 truncate leading-none mb-0.5">
                              {char.voiceActors[0].name}
                            </p>
                            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wide">
                              {char.voiceActors[0].language} VA
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right tracking console & hard metadata column */}
            <div className="md:col-span-1 space-y-6">
              
              {/* Detailed specification list block */}
              <div className="p-4 rounded-xl bg-white/[0.01]/10 border border-white/5 space-y-3">
                <h4 className="text-[10px] font-black tracking-widest text-[#a855f7] uppercase leading-none pb-1 border-b border-white/5">
                  SPEC SHEET
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between leading-none"><span className="text-gray-400">Score Rating:</span><span className="font-bold text-[#f59e0b]">{anime.score > 0 ? `${anime.score}/10` : 'Upcoming'}</span></div>
                  <div className="flex justify-between leading-none"><span className="text-gray-400">Popularity Rank:</span><span className="font-bold text-rose-400">#{anime.popularityRanking}</span></div>
                  <div className="flex justify-between leading-none"><span className="text-gray-400">Produced Studio:</span><span className="font-bold text-gray-200">{anime.studios.join(', ')}</span></div>
                  <div className="flex justify-between leading-none"><span className="text-gray-400">Status:</span><span className="font-bold text-gray-200">{anime.status}</span></div>
                  <div className="flex justify-between leading-none"><span className="text-gray-400">Episodes count:</span><span className="font-bold text-gray-200">{anime.episodeCount || 'Ongoing'} ({anime.durationPerEpisode}m)</span></div>
                  <div className="flex justify-between leading-none"><span className="text-gray-400">Release Date:</span><span className="font-bold text-gray-200">{anime.releaseDate}</span></div>
                  
                  {/* Genres */}
                  <div className="pt-2">
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">GENRES</span>
                    <div className="flex flex-wrap gap-1">
                      {anime.genres.map(g => (
                        <span key={g} className="bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded text-[10px] font-medium font-mono">{g}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Watch-Tracking console block */}
              <div className="p-4 rounded-xl bg-white/[0.01]/10 border border-white/5 space-y-4">
                <div className="flex items-center space-x-1">
                  <Sliders className="h-4 w-4 text-rose-400" />
                  <h4 className="text-[10px] font-black uppercase text-gray-200 tracking-wider">TRACKING CONSOLE</h4>
                </div>

                {isSavedMsg && (
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] text-center font-bold">
                    ✓ Progress synced with dashboard!
                  </div>
                )}

                <div className="space-y-3">
                  
                  {/* Status Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-gray-400 font-bold tracking-wider leading-none">STATUS</label>
                    <select
                      id="modal-watchlist-select"
                      value={localStatus}
                      onChange={(e) => {
                        const nextSt = e.target.value as WatchStatus;
                        setLocalStatus(nextSt);
                        if (nextSt === 'Completed' && anime.episodeCount > 0) {
                          setLocalProgress(anime.episodeCount);
                        }
                      }}
                      className="w-full bg-[#111] border border-white/10 text-xs text-gray-200 p-2 rounded-lg outline-none cursor-pointer focus:border-rose-500/30 transition"
                    >
                      <option value="None">None (Unlisted)</option>
                      <option value="Watching">Watching</option>
                      <option value="Completed">Completed</option>
                      <option value="Planning">Planning</option>
                      <option value="Dropped">Dropped</option>
                      <option value="On-Hold">On-Hold</option>
                    </select>
                  </div>

                  {/* Progress watched input box */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold tracking-wider leading-none">
                      <label className="uppercase">EPISODES WATCHED</label>
                      <span>Max {anime.episodeCount || 'Ongoing'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        id="modal-episode-progress-input"
                        value={localProgress}
                        min={0}
                        max={anime.episodeCount || 999}
                        onChange={(e) => setLocalProgress(Math.max(0, Number(e.target.value)))}
                        className="w-20 bg-[#111] border border-white/10 text-xs text-gray-200 p-2 rounded-lg outline-none focus:border-rose-500/30 transition"
                      />
                      <span className="text-xs text-gray-400 font-medium">/ {anime.episodeCount || 'Ongoing'}</span>
                    </div>
                  </div>

                  {/* Personal score slider out of 10 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold tracking-wider leading-none">
                      <label className="uppercase">YOUR RATING SCORE</label>
                      <span className="text-[#f59e0b] font-black">{localRating}/10 ★</span>
                    </div>
                    <input
                      type="range"
                      id="modal-rating-score-slider"
                      min={1}
                      max={10}
                      step={1}
                      value={localRating}
                      onChange={(e) => setLocalRating(Number(e.target.value))}
                      className="w-full h-1.5 bg-[#1a1a26] rounded-full appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>

                  {/* Save button */}
                  <button
                    onClick={handleSaveTracking}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition duration-200 select-none cursor-pointer shadow-lg shadow-rose-600/10"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Expanded Trailer Video block */}
          {anime.trailerUrl && (
            <div className="space-y-3 pt-6 border-t border-white/5 text-center">
              <div className="flex items-center space-x-2">
                <Film className="h-4.5 w-4.5 text-rose-500" />
                <h3 className="text-xs font-black uppercase text-gray-200 tracking-wider">OFFICIAL RELEASES TRAILER VIDEO</h3>
              </div>
              
              <div className="relative aspect-video w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black">
                <iframe
                  id={`trailer-youtube-embed-${anime.id}`}
                  src={anime.trailerUrl}
                  title={`${anime.englishTitle || anime.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
