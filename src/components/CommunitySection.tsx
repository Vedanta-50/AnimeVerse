import React, { useState } from 'react';
import { Anime, CommunityPoll, UserReview } from '../types';
import { Vote, Star, MessageSquare, ThumbsUp, Heart, Edit3, Award, Trophy, Search } from 'lucide-react';
import { COMMUNITY_POLLS, INITIAL_REVIEWS } from '../data/animeData';

interface CommunitySectionProps {
  animeList: Anime[];
  userEmail: string;
}

export default function CommunitySection({ animeList, userEmail }: CommunitySectionProps) {
  const [polls, setPolls] = useState<CommunityPoll[]>(COMMUNITY_POLLS);
  const [reviews, setReviews] = useState<UserReview[]>(INITIAL_REVIEWS);
  const [selectedReviewAnime, setSelectedReviewAnime] = useState<string>(animeList[0]?.id || '');
  const [userRating, setUserRating] = useState<number>(10);
  const [userComment, setUserComment] = useState<string>('');
  const [userFeedbackMsg, setUserFeedbackMsg] = useState<string>('');
  const [votedPollIds, setVotedPollIds] = useState<Record<string, string>>({});

  const handleVote = (pollId: string, optionId: string) => {
    if (votedPollIds[pollId]) return; // Averted double voting

    setVotedPollIds(prev => ({ ...prev, [pollId]: optionId }));
    setPolls(prevPolls => prevPolls.map(poll => {
      if (poll.id !== pollId) return poll;
      const updatedOptions = poll.options.map(opt => {
        if (opt.id !== optionId) return opt;
        return { ...opt, votes: opt.votes + 1 };
      });
      return {
        ...poll,
        options: updatedOptions,
        totalVotes: poll.totalVotes + 1
      };
    }));
  };

  const username = userEmail ? userEmail.split('@')[0] : 'LegendaryOtaku';

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    const matchedAnime = animeList.find(a => a.id === selectedReviewAnime);
    const newReview: UserReview = {
      id: `rev-${Date.now()}`,
      animeId: selectedReviewAnime,
      animeTitle: matchedAnime ? (matchedAnime.englishTitle || matchedAnime.title) : 'Selected Anime',
      username: username,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100',
      rating: userRating,
      reviewText: userComment,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0
    };

    setReviews(prev => [newReview, ...prev]);
    setUserComment('');
    setUserFeedbackMsg(`✨ Review successfully posted to AnimeVerse feeds!`);
    setTimeout(() => setUserFeedbackMsg(''), 5000);
  };

  const handleLikeReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id !== reviewId) return r;
      return { ...r, likes: r.likes + 1 };
    }));
  };

  // Badges Achievement reference
  const globalBadges = [
    { id: 'first-rev', title: 'Grand Critic', desc: 'Write at least 1 detailed critique review', icon: Edit3, color: 'from-amber-500 to-orange-600', active: true },
    { id: 'sage', title: 'Infinite Sage', desc: 'Score greater than 20 distinct series on database', icon: Trophy, color: 'from-emerald-500 to-teal-600', active: false },
    { id: 'poll-cap', title: 'Democratic Otaku', desc: 'Participate in AnimeVerse weekly discussions & polls', icon: Vote, color: 'from-rose-500 to-pink-600', active: true },
    { id: 'search-tag', title: 'Visual Scout', desc: 'Query database to retrieve custom covers and high-resolution visuals', icon: Search, color: 'from-indigo-500 to-violet-600', active: true },
  ];

  return (
    <div id="community-hub" className="max-w-7xl mx-auto px-4 py-2 space-y-10">
      
      {/* Visual highlights Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#17092c] via-[#0b0416] to-[#04020a] border border-violet-500/10 flex flex-col md:flex-row items-center justify-between">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-violet-500/10 text-violet-400 font-extrabold text-[10px] tracking-wider uppercase border border-violet-500/20">
            <Trophy className="h-3 w-3 inline mr-1 text-yellow-400" />
            <span>COMMUNITY ENGAGEMENT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight font-sans">
            AnimeVerse Community Hub
          </h2>
          <p className="text-xs text-gray-400 max-w-lg leading-relaxed font-light">
            Share ratings, vote in live popularity polls, track visual achievements, and publish critique reviews for database items.
          </p>
        </div>
        
        <div className="mt-6 md:mt-0 flex space-x-3">
          <div className="px-5 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <span className="block text-xl font-bold text-rose-500">12.5k</span>
            <span className="text-[9px] uppercase tracking-wider text-gray-400">Voters</span>
          </div>
          <div className="px-5 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <span className="block text-xl font-bold text-violet-400">4,120</span>
            <span className="text-[9px] uppercase tracking-wider text-gray-400">Reviews</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Live interactive Polls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center space-x-2">
            <Vote className="h-5 w-5 text-rose-500" />
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-200">Active Polls</h3>
          </div>

          <div className="space-y-6">
            {polls.map((poll) => {
              const userVotedOpt = votedPollIds[poll.id];
              return (
                <div 
                  key={poll.id}
                  id={`poll-card-${poll.id}`}
                  className="rounded-xl p-5 bg-white/[0.02] border border-white/5 space-y-4"
                >
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-200 leading-snug">
                      {poll.question}
                    </h4>
                    <span className="text-[9px] text-gray-400 block mt-1 tracking-wide uppercase font-mono">
                      TOTAL VOTES: {poll.totalVotes}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {poll.options.map((opt) => {
                      const pct = poll.totalVotes > 0 ? (opt.votes / poll.totalVotes) * 100 : 0;
                      const hasVotedThis = userVotedOpt === opt.id;
                      const hasVotedAny = !!userVotedOpt;

                      return (
                        <button
                          key={opt.id}
                          disabled={hasVotedAny}
                          onClick={() => handleVote(poll.id, opt.id)}
                          className="w-full relative text-left p-3 rounded-lg bg-[#0e0e14] border border-white/5 overflow-hidden transition hover:border-rose-500/20 disabled:hover:border-white/5"
                        >
                          {/* Vote Fill percentage bar */}
                          <div 
                            className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ${hasVotedThis ? 'bg-rose-500/10' : 'bg-white/[0.01]'}`}
                            style={{ width: `${pct}%` }}
                          />

                          <div className="relative z-10 flex justify-between items-center text-xs">
                            <span className={`font-medium ${hasVotedThis ? 'text-rose-400 font-bold' : 'text-gray-300'}`}>
                              {opt.text} {hasVotedThis && '✓'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold">
                              {pct.toFixed(1)}% ({opt.votes})
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {userVotedOpt ? (
                    <div className="text-[10px] text-emerald-400 bg-emerald-500/5 p-2 rounded border border-emerald-500/10 text-center font-semibold">
                      Your vote has been submitted. Thank you for voting!
                    </div>
                  ) : (
                    <p className="text-[9px] text-gray-400 italic text-center leading-none">
                      Select an option above to cast your live vote.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Achievement Badges Showcase */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <h3 className="text-xs font-black uppercase text-gray-200 tracking-wider">Achievement Badges</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {globalBadges.map((b) => {
                const Icon = b.icon;
                return (
                  <div 
                    key={b.id}
                    className={`p-3 rounded-xl border flex items-center space-x-3 transition ${
                      b.active 
                        ? 'bg-gradient-to-r from-zinc-900 via-[#18181b] to-[#27272a] border-yellow-500/20' 
                        : 'bg-[#0f0f15]/40 opacity-50 border-white/5'
                    }`}
                  >
                    <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center text-white bg-gradient-to-tr ${b.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-extrabold ${b.active ? 'text-yellow-400' : 'text-gray-300'}`}>
                        {b.title} {b.active && '🏆'}
                      </h4>
                      <p className="text-[9.5px] text-gray-400 leading-snug">{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right columns: Reviews stream & submitting new content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-rose-500" />
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-200">User Reviews Stream</h3>
            </div>
          </div>

          {/* New Review form panel */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3 flex items-center space-x-2">
              <Edit3 className="h-4 w-4 text-rose-400" />
              <span>Write anime database review</span>
            </h4>

            {userFeedbackMsg && (
              <div className="mb-3.5 p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs text-center font-bold">
                {userFeedbackMsg}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                
                {/* Anime selector */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 tracking-wider block font-bold">CHOOSE TITLE</label>
                  <select
                    id="review-anime-selector"
                    value={selectedReviewAnime}
                    onChange={(e) => setSelectedReviewAnime(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 text-gray-200 rounded-lg p-2 text-xs outline-none focus:border-rose-500/30 transition"
                  >
                    {animeList.map(a => (
                      <option key={a.id} value={a.id}>{a.englishTitle || a.title}</option>
                    ))}
                  </select>
                </div>

                {/* Rating out of 10 */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 tracking-wider block font-bold font-sans">RATING SCORE (1-10)</label>
                  <select
                    id="review-rating-score"
                    value={userRating}
                    onChange={(e) => setUserRating(Number(e.target.value))}
                    className="w-full bg-[#111] border border-white/10 text-gray-200 rounded-lg p-2 text-xs outline-none focus:border-rose-500/30 transition"
                  >
                    {[10,9,8,7,6,5,4,3,2,1].map(score => (
                      <option key={score} value={score}>{score}/10 - {score >= 9 ? 'Masterpiece' : score >= 7 ? 'Recommended' : score >= 5 ? 'Average' : 'Skippable'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Text comment form */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-400 tracking-wider block font-bold">CRITIQUE SUMMARY</label>
                <textarea
                  id="review-comment-text"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  rows={3}
                  placeholder="Share details on animation, character depth, script pacing or music themes..."
                  className="w-full bg-[#111] border border-white/10 text-xs text-gray-100 placeholder-gray-500 rounded-lg p-3 outline-none focus:border-rose-500/30 transition"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  id="submit-review-btn"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition duration-200 shadow shadow-rose-600/20"
                >
                  Post Critique
                </button>
              </div>
            </form>
          </div>

          {/* Stream display List */}
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div 
                key={rev.id}
                id={`review-item-${rev.id}`}
                className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-3"
              >
                <div className="flex items-center justify-between leading-none">
                  <div className="flex items-center space-x-2.5">
                    <img 
                      src={rev.avatar} 
                      alt={rev.username}
                      className="h-7 w-7 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-100">{rev.username}</span>
                      <span className="block text-[8px] text-gray-400 mt-0.5 uppercase tracking-wide font-mono">POSTED {rev.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 bg-[#f59e0b]/5 border border-[#f59e0b]/10 text-[#f59e0b] px-2 py-1 rounded text-xs font-black">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500 leading-none" />
                    <span>{rev.rating}/10</span>
                  </div>
                </div>

                <div>
                  <h5 className="text-[11px] uppercase tracking-widest text-[#a855f7] font-bold leading-none mb-1">
                    Critically Reviewing: {rev.animeTitle}
                  </h5>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                    {rev.reviewText}
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-2 border-t border-white/5 text-[10px] text-gray-400">
                  <button
                    onClick={() => handleLikeReview(rev.id)}
                    className="flex items-center space-x-1 bg-white/[0.03] hover:bg-rose-500/10 hover:text-rose-400 px-2 py-1 rounded border border-white/5 hover:border-rose-500/10 transition"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span>Helpful ({rev.likes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
