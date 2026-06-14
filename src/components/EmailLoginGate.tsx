import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, Shield, Sparkles, LogIn, Compass, Play, Trophy } from 'lucide-react';
// @ts-ignore
import logoImg from '../assets/images/animeverse_logo_1781446595080.jpg';

interface EmailLoginGateProps {
  onSignIn: (email: string) => void;
}

interface AnimeHero {
  name: string;
  series: string;
  tagline: string;
  badge: string;
  color: string;
  image: string;
}

export default function EmailLoginGate({ onSignIn }: EmailLoginGateProps) {
  // Navigation internal state: 'INTRO' or 'EMAIL_GATE'
  const [viewState, setViewState] = useState<'INTRO' | 'EMAIL_GATE'>('INTRO');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sakuras, setSakuras] = useState<{ id: number; left: number; delay: number; scale: number }[]>([]);

  // Curated list of iconic characters standing together in the custom visual lineup
  const animeHeroes: AnimeHero[] = [
    {
      name: "Son Goku",
      series: "Dragon Ball Z",
      tagline: "Breaking critical boundaries",
      badge: "Saiyan Legend",
      color: "from-amber-500 to-orange-600",
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=200&auto=format&fit=crop" // Highly stylized anime aesthetic representing retro combat art
    },
    {
      name: "Manjiro Sano (Mikey)",
      series: "Tokyo Revengers",
      tagline: "Leading Toman to victory",
      badge: "Toman Leader",
      color: "from-rose-500 to-red-700",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200&auto=format&fit=crop" // Neon graffiti anime mood
    },
    {
      name: "Kaoruko Waguri",
      series: "Fragrant Flower blooms",
      tagline: "Blossoming with sweet dignity",
      badge: "Pure Spark",
      color: "from-pink-400 to-rose-400",
      image: "https://images.unsplash.com/photo-1526413232643-8e409d7c621d?q=80&w=200&auto=format&fit=crop" // Blossom ambient mood
    },
    {
      name: "Frieren",
      series: "Beyond Journey's End",
      tagline: "Weaving ancient time loops",
      badge: "Mage of Eternity",
      color: "from-purple-500 to-indigo-600",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=200&auto=format&fit=crop" // Magical starry atmosphere
    }
  ];

  // Floating ambient petals for decorative aesthetics
  useEffect(() => {
    const list = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      scale: 0.6 + Math.random() * 0.7
    }));
    setSakuras(list);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMsg('An email address is required to launch.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSignIn(trimmed);
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <div id="email-gate-container" className="min-h-screen bg-[#030308] text-gray-100 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none font-sans">
      
      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes sakura-drift {
          0% { transform: translateY(-30px) rotate(0deg) translateX(0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.6; }
          100% { transform: translateY(105vh) rotate(360deg) translateX(80px); opacity: 0; }
        }
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .falling-petal {
          animation: sakura-drift 10s linear infinite;
        }
        .floating-accent {
          animation: subtle-bounce 4s ease-in-out infinite;
        }
      `}</style>

      {/* Decorative Grid backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Neon glowing ambient circles */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-rose-600/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 h-80 w-80 rounded-full bg-indigo-600/5 blur-3xl pointer-events-none" />

      {/* Falling Sakura Cherry Blossoms */}
      {sakuras.map(s => (
        <div 
          key={s.id}
          className="absolute text-pink-400/25 pointer-events-none falling-petal text-sm font-bold"
          style={{
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
            transform: `scale(${s.scale})`
          }}
        >
          🌸
        </div>
      ))}

      {/* VIEW STATE 1: INTRO SPLASH - THE GRAND ANIME GATHERING */}
      {viewState === 'INTRO' && (
        <div className="w-full max-w-4xl bg-[#090910]/95 border border-white/5 rounded-3xl relative z-10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-10 floating-accent">
          {/* Glowing accent bar */}
          <div className="absolute top-0 left-20 right-20 h-[1.5px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />

          {/* Heading */}
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-3 mb-2">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl p-0.5 bg-gradient-to-tr from-rose-600 via-amber-500 to-indigo-600 shadow-2xl shadow-rose-500/25">
                <img 
                  src={logoImg} 
                  alt="AnimeVerse Logo" 
                  className="rounded-[22px] object-cover w-full h-full border border-black/20"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full bg-rose-400 animate-pulse border-2 border-[#090910]" />
              </div>
            </div>

            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[9px] uppercase tracking-widest font-black text-rose-400">
              <Sparkles className="h-3.5 w-3.5 text-rose-500 animate-spin" />
              <span>AnimeVerse Grand Assembly</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase leading-none">
              Where Legends <span className="text-rose-500">Stand Together</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
              Step into an immersive, secure workspace. Track your watch lists, compare custom stats, and leave feedback with legendary characters standing in a single timeline frame.
            </p>
          </div>

          {/* CARDS FRAME PANEL: All characters aligned in one line-up frame */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-1 max-w-3xl mx-auto">
            {animeHeroes.map((hero, i) => (
              <div 
                key={i} 
                className="group relative rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 overflow-hidden text-left p-3.5 space-y-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
              >
                {/* Background image cover container */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-950 border border-white/5">
                  <div className={`absolute inset-0 bg-gradient-to-br ${hero.color} opacity-40 mix-blend-color-dodge transition-opacity duration-300 group-hover:opacity-60`} />
                  <img 
                    src={hero.image} 
                    alt={hero.name} 
                    className="w-full h-full object-cover grayscale opacity-55 group-hover:grayscale-0 group-hover:opacity-75 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Absolute Badge corner */}
                  <span className="absolute top-1.5 left-1.5 text-[8px] font-black uppercase text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                    {hero.badge}
                  </span>
                </div>

                <div className="space-y-1 leading-none">
                  <h3 className="text-xs font-black text-white truncate uppercase">{hero.name}</h3>
                  <p className="text-[10px] text-rose-400 font-bold truncate leading-none">{hero.series}</p>
                  <p className="text-[9px] text-gray-500 line-clamp-1 pt-1 italic font-light">
                    "{hero.tagline}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action button triggers view conversion */}
          <div className="pt-2">
            <button
              onClick={() => setViewState('EMAIL_GATE')}
              className="px-8 py-4 px-10 cursor-pointer rounded-2xl bg-gradient-to-r from-rose-600 via-amber-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-black tracking-widest uppercase transition duration-300 transform hover:-translate-y-1 shadow-xl shadow-rose-600/20 inline-flex items-center space-x-2"
            >
              <span>GET STARTED</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW STATE 2: EMAIL GATE FORM SUBMISSION */}
      {viewState === 'EMAIL_GATE' && (
        <div className="w-full max-w-sm bg-[#090910]/95 border border-white/5 p-8 rounded-3xl relative z-10 shadow-2xl backdrop-blur-2xl">
          {/* Glowing top line */}
          <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-rose-500/40 to-transparent" />
          
          <div className="flex flex-col items-center text-center space-y-6">
            
            {/* Logo */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl p-0.5 bg-gradient-to-tr from-rose-600 via-amber-500 to-indigo-600 shadow-lg shadow-rose-500/25">
              <img 
                src={logoImg} 
                alt="AnimeVerse Logo" 
                className="rounded-xl object-cover w-full h-full border border-black/20"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-rose-400 animate-pulse border-2 border-[#090910]" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                Anime<span className="text-rose-500">Verse</span>
              </h1>
              <p className="text-[10px] text-pink-400 tracking-wider font-extrabold uppercase bg-white/5 px-2.5 py-1 rounded inline-block border border-white/5">
                SECURE PUBLIC GATEWAY
              </p>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-xs font-light">
              Enter your email address to save progress. Watchlists, custom rating structures, and feedback are locally cached so you can pick up where you left off.
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="text-left space-y-1.5">
                <label htmlFor="user-email-input" className="text-[10px] uppercase font-extrabold text-gray-500 tracking-wider">
                  Enter Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 h-4.5 w-4.5 text-gray-500" />
                  <input
                    type="email"
                    id="user-email-input"
                    className="w-full text-xs sm:text-sm bg-black/60 border border-white/10 hover:border-white/20 focus:border-rose-500/30 rounded-xl py-3.5 pl-12 pr-4 outline-none text-white placeholder-gray-500 transition font-sans"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>
                {errorMsg && (
                  <p className="text-[11px] text-rose-400 leading-normal pl-1 pt-0.5 animate-pulse font-medium">
                    ⚠️ {errorMsg}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewState('INTRO')}
                  className="px-4 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer text-xs font-bold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 cursor-pointer text-white text-xs font-black tracking-widest uppercase transition duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-rose-600/10 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>PROCEED</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-white/5 w-full flex items-center justify-center space-x-2 text-[10px] text-gray-500 leading-none">
              <Shield className="h-3 w-3 text-emerald-500 animate-pulse" />
              <span>Private Local Storage — No password needed</span>
            </div>

          </div>
        </div>
      )}

      {/* Decorative footer details */}
      <p className="absolute bottom-6 text-[10px] text-gray-600 tracking-wider font-sans leading-none uppercase">
        AnimeVerse Encyclopedia Platform © 2026
      </p>

    </div>
  );
}
