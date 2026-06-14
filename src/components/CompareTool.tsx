import React, { useState } from 'react';
import { Anime } from '../types';
import { Sliders, HelpCircle, Star, Award, Columns, BookOpen, Film } from 'lucide-react';

interface CompareToolProps {
  animeList: Anime[];
  onSelectAnime: (anime: Anime) => void;
}

export default function CompareTool({ animeList, onSelectAnime }: CompareToolProps) {
  const [animeIdA, setAnimeIdA] = useState<string>(animeList[0]?.id || '');
  const [animeIdB, setAnimeIdB] = useState<string>(animeList[1]?.id || animeList[0]?.id || '');

  const animeA = animeList.find(a => a.id === animeIdA);
  const animeB = animeList.find(a => a.id === animeIdB);

  return (
    <div id="anime-compare-tool" className="rounded-2xl p-6 bg-white/[0.01]/10 border border-white/5 space-y-6 select-none max-w-7xl mx-auto px-4 py-2">
      
      {/* Header element */}
      <div className="flex items-center space-x-2.5">
        <Columns className="h-5 w-5 text-rose-500" />
        <div>
          <h3 className="text-xs font-black uppercase text-gray-200 tracking-wider">SIDE-BY-SIDE ANALYZING ENGINE</h3>
          <p className="text-[10px] text-gray-400">Compare specifications, status, score ratings and studios in real time.</p>
        </div>
      </div>

      {/* Selectors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selector A */}
        <div className="space-y-1">
          <label className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold leading-none">PRIMARY ANIME</label>
          <select
            id="compare-select-a"
            value={animeIdA}
            onChange={(e) => setAnimeIdA(e.target.value)}
            className="w-full bg-[#111] border border-white/10 text-xs text-gray-200 p-2.5 rounded-xl cursor-pointer outline-none focus:border-rose-500/30 transition"
          >
            {animeList.map(a => (
              <option key={a.id} value={a.id}>{a.englishTitle || a.title}</option>
            ))}
          </select>
        </div>

        {/* Selector B */}
        <div className="space-y-1">
          <label className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold leading-none">SECONDARY ANIME</label>
          <select
            id="compare-select-b"
            value={animeIdB}
            onChange={(e) => setAnimeIdB(e.target.value)}
            className="w-full bg-[#111] border border-white/10 text-xs text-gray-200 p-2.5 rounded-xl cursor-pointer outline-none focus:border-rose-500/30 transition"
          >
            {animeList.map(a => (
              <option key={a.id} value={a.id}>{a.englishTitle || a.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Side by side stats grid sheets */}
      {animeA && animeB ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/5 pt-3">
          
          {/* Column A specification */}
          <div className="md:col-span-1 pr-0 md:pr-4 flex flex-col items-center space-y-4 text-center">
            <img 
              onClick={() => onSelectAnime(animeA)}
              src={animeA.coverImage} 
              alt={animeA.englishTitle || animeA.title}
              className="h-44 w-32 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition duration-300 border border-white/10"
            />
            
            <div className="space-y-1 leading-tight">
              <h4 
                onClick={() => onSelectAnime(animeA)}
                className="text-sm font-extrabold text-[#f33 a4] text-rose-400 cursor-pointer hover:underline"
              >
                {animeA.englishTitle || animeA.title}
              </h4>
              <p className="text-[10px] text-gray-400">{animeA.studios.join(' • ')}</p>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed font-light italic">
              "{animeA.synopsis.slice(0, 100)}..."
            </p>
          </div>

          {/* Core Spec comparisons Table row-by-row */}
          <div className="md:col-span-1 px-0 md:px-4 py-4 md:py-0 space-y-3 flex flex-col justify-center">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">METRICS MATRIX</h4>
            
            <div className="space-y-2.5">
              {/* Score */}
              <div className="p-2.5 rounded-lg bg-white/[0.01] border border-white/5 flex items-center justify-between text-xs">
                <span className="text-amber-500 font-bold">{animeA.score && animeA.score > 0 ? `${animeA.score} ★` : 'TBA'}</span>
                <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">SCORE RATINGS</span>
                <span className="text-amber-500 font-bold">{animeB.score && animeB.score > 0 ? `${animeB.score} ★` : 'TBA'}</span>
              </div>

              {/* Status */}
              <div className="p-2.5 rounded-lg bg-white/[0.01] border border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-gray-100 font-semibold">{animeA.status}</span>
                <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">AIR STATUS</span>
                <span className="text-gray-100 font-semibold">{animeB.status}</span>
              </div>

              {/* Episode volume */}
              <div className="p-2.5 rounded-lg bg-white/[0.01] border border-white/5 flex items-center justify-between text-xs">
                <span className="text-gray-100 font-bold">{animeA.episodeCount || 'Ongoing'} eps</span>
                <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">VOLUME</span>
                <span className="text-gray-100 font-bold">{animeB.episodeCount || 'Ongoing'} eps</span>
              </div>

              {/* Release Year */}
              <div className="p-2.5 rounded-lg bg-white/[0.01] border border-white/5 flex items-center justify-between text-xs">
                <span className="text-gray-100 font-semibold">{animeA.year}</span>
                <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">YEAR</span>
                <span className="text-gray-100 font-semibold">{animeB.year}</span>
              </div>

              {/* Popularity ranking */}
              <div className="p-2.5 rounded-lg bg-white/[0.01] border border-white/5 flex items-center justify-between text-xs">
                <span className="text-rose-400 font-extrabold">#{animeA.popularityRanking}</span>
                <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">POPULARITY</span>
                <span className="text-rose-400 font-extrabold">#{animeB.popularityRanking}</span>
              </div>
            </div>
          </div>

          {/* Column B specification */}
          <div className="md:col-span-1 pl-0 md:pl-6 pt-4 md:pt-0 flex flex-col items-center space-y-4 text-center">
            <img 
              onClick={() => onSelectAnime(animeB)}
              src={animeB.coverImage} 
              alt={animeB.englishTitle || animeB.title}
              className="h-44 w-32 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition duration-300 border border-white/10"
            />
            
            <div className="space-y-1 leading-tight">
              <h4 
                onClick={() => onSelectAnime(animeB)}
                className="text-sm font-extrabold text-rose-400 cursor-pointer hover:underline"
              >
                {animeB.englishTitle || animeB.title}
              </h4>
              <p className="text-[10px] text-gray-400">{animeB.studios.join(' • ')}</p>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed font-light italic">
              "{animeB.synopsis.slice(0, 100)}..."
            </p>
          </div>

        </div>
      ) : (
        <div className="p-10 text-center text-gray-400 italic font-light text-xs">
          Please select two different shows in selectors to view direct matrix.
        </div>
      )}

    </div>
  );
}
