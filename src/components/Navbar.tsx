import React from 'react';
import { Compass, Search, MessageSquare, User, Calendar, Sliders, RefreshCw, Trophy } from 'lucide-react';
// @ts-ignore
import logoImg from '../assets/images/animeverse_logo_1781446595080.jpg';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userEmail: string;
  onSignOut: () => void;
}

export default function Navbar({ activeTab, setActiveTab, userEmail, onSignOut }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'browse', label: 'Browse & Compare', icon: Sliders },
    { id: 'calendar', label: 'Countdown & Calendar', icon: Calendar },
    { id: 'search', label: 'Search Anime', icon: Search },
    { id: 'community', label: 'Community Hub', icon: MessageSquare },
    { id: 'profile', label: 'My Watchlist & Stats', icon: User },
  ];

  const username = userEmail ? userEmail.split('@')[0] : 'User';

  return (
    <header id="nav-header" className="sticky top-0 z-50 w-full border-b border-rose-500/10 bg-[#030308]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div 
          id="nav-logo"
          onClick={() => setActiveTab('home')}
          className="flex cursor-pointer items-center space-x-2 transition hover:opacity-90"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden p-0.5 bg-gradient-to-tr from-rose-600 via-amber-500 to-indigo-600 shadow-md shadow-rose-500/20">
            <img 
              src={logoImg} 
              alt="AnimeVerse Logo Badge" 
              className="rounded-[10px] object-cover w-full h-full"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-rose-400 bg-clip-text text-transparent">
              Anime<span className="text-rose-500">Verse</span>
            </span>
            <div className="text-[10px] text-gray-400 font-semibold tracking-wider leading-none">ENCYCLOPEDIA</div>
          </div>
        </div>

        {/* Navigation Items - Desktop */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  isActive
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm shadow-rose-500/5'
                    : 'text-gray-300 hover:bg-white/[0.03] hover:text-white border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-rose-400' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Badge */}
        <div id="nav-user" className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition text-left"
          >
            <div className="relative h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white uppercase">
              {username.slice(0, 2)}
            </div>
            <div className="max-w-[80px] truncate">
              <p className="text-[11px] font-bold text-gray-200 truncate leading-none mb-0.5">{username}</p>
              <span className="text-[8px] tracking-widest text-[#a855f7] uppercase font-black">Explorer</span>
            </div>
          </button>

          <button
            onClick={onSignOut}
            className="cursor-pointer px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/15 transition duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Tab-bar (Sticky Bottom on small viewports) */}
      <div id="mobile-nav" className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-rose-500/10 bg-[#030308]/95 backdrop-blur-2xl px-2 py-1">
        <div className="grid grid-cols-6 gap-0.5 justify-items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 w-full rounded-md transition ${
                  isActive 
                    ? 'text-rose-400' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className="h-4 w-4 mb-0.5" />
                <span className="text-[9px] font-medium leading-none truncate w-full text-center">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
