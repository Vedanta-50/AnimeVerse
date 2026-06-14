import React, { useState, useEffect } from 'react';
import { Anime } from '../types';
import { Play, Info, Calendar, Star, Award, Search } from 'lucide-react';

interface HeroSliderProps {
  slides: Anime[];
  onSelectAnime: (anime: Anime) => void;
  onOpenAssistant: () => void;
}

export default function HeroSlider({ slides, onSelectAnime, onOpenAssistant }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const current = slides[currentIndex];

  return (
    <div id="hero-slider-container" className="relative w-full h-[32rem] sm:h-[36rem] overflow-hidden rounded-2xl md:rounded-3xl border border-white/5 bg-[#0a0a14]">
      {/* Background Banner Image */}
      <div 
        id="hero-banner-image"
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-105"
        style={{ backgroundImage: `url(${current.bannerImage})` }}
      />

      {/* Modern Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030308] via-[#030308]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030308] via-[#030308]/40 to-transparent hidden md:block" />
      
      {/* Dynamic Animated Particle Accent */}
      <div className="absolute top-8 right-8 z-10 flex items-center space-x-2 bg-rose-500/10 backdrop-blur-md px-3 py-1 rounded-full border border-rose-500/20 text-rose-400 text-xs font-bold animate-pulse">
        <Award className="h-3.5 w-3.5" />
        <span>SPOTLIGHT ANIME</span>
      </div>

      {/* Content Container */}
      <div id="hero-content" className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-12 z-10 max-w-4xl">
        <div className="space-y-4">
          
          {/* Tag Pill List */}
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 text-xs font-bold bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 rounded-md text-purple-300">
              {current.season} {current.year}
            </span>
            <span className="px-2.5 py-1 text-xs font-bold bg-white/[0.05] border border-white/10 rounded-md text-gray-300 flex items-center space-x-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{current.score || 'TBA'} Score</span>
            </span>
            <span className="px-2.5 py-1 text-xs font-black bg-rose-500/10 border border-rose-500/30 rounded-md text-rose-400">
              # {current.popularityRanking} Popularity
            </span>
            {current.status === 'Ongoing' && (
              <span className="px-2.5 py-1 text-xs font-black bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/20 animate-pulse">
                • ONGOING
              </span>
            )}
          </div>

          {/* Titles */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight uppercase font-sans">
              {current.englishTitle || current.title}
            </h1>
            {(current.englishTitle && (current.japaneseTitle || current.title !== current.englishTitle)) && (
              <p className="text-sm sm:text-lg font-medium text-gray-300 tracking-wide">
                {current.japaneseTitle || current.title}
              </p>
            )}
          </div>

          {/* Synopsis text (clamped) */}
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl line-clamp-3 leading-relaxed font-light">
            {current.synopsis}
          </p>

          {/* Metadata information */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-400 pt-1">
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-gray-300">Studios:</span>
              <span className="text-rose-400 font-medium">{current.studios.join(', ')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-gray-300">Episodes:</span>
              <span className="text-gray-100 font-medium">{current.episodeCount || 'Ongoing'} ({current.durationPerEpisode}m)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-gray-300">Genres:</span>
              <span className="text-gray-300 font-medium">{current.genres.join(' • ')}</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onSelectAnime(current)}
              className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition duration-300 shadow-lg shadow-rose-600/30 font-sans transform hover:-translate-y-0.5"
            >
              <Info className="h-4 w-4" />
              <span>Full Details & Trailer</span>
            </button>
            
            <button
              onClick={onOpenAssistant}
              className="flex items-center space-x-2 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 font-medium text-xs sm:text-sm px-5 py-3 rounded-xl transition duration-300 transform hover:-translate-y-0.5"
            >
              <Search className="h-4 w-4 text-rose-400" />
              <span>Search Anime Pictures</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicators/Toggles */}
      <div className="absolute bottom-4 right-6 z-15 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-350 ${
              idx === currentIndex ? 'w-8 bg-rose-500' : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
