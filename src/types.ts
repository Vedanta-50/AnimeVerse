export interface VoiceActor {
  id: string;
  name: string;
  language: string;
  image: string;
}

export interface Character {
  id: string;
  name: string;
  role: 'Main' | 'Supporting';
  image: string;
  description: string;
  voiceActors: VoiceActor[];
  popularityRanking?: number;
}

export interface Episode {
  number: number;
  title: string;
  airDate: string;
  duration: string;
  synopsis?: string;
}

export interface Anime {
  id: string; // Jikan ID or custom local ID
  title: string;
  englishTitle?: string;
  japaneseTitle?: string;
  synopsis: string;
  bannerImage: string;
  coverImage: string;
  genres: string[];
  studios: string[];
  releaseDate: string;
  season: 'Spring' | 'Summer' | 'Fall' | 'Winter';
  year: number;
  episodeCount: number;
  durationPerEpisode: number; // in minutes
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  score: number; // 0-10
  popularityRanking: number;
  trailerUrl?: string; // YouTube embed URL
  characters: Character[];
  relatedAnime?: { id: string; title: string; relationType: string }[];
  episodesList?: Episode[];
  upcomingEpisodeAirDate?: string; // for Countdown timer
}

// User Tracking types
export type WatchStatus = 'Watching' | 'Completed' | 'Planning' | 'Dropped' | 'On-Hold' | 'None';

export interface WatchlistStatus {
  animeId: string;
  status: WatchStatus;
  progress: number; // Episodes watched
  rating?: number; // User personal rating (1-10)
  updatedAt: string;
}

export interface UserReview {
  id: string;
  animeId: string;
  animeTitle: string;
  username: string;
  avatar: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  likes: number;
}

export interface UserProfile {
  username: string;
  email: string;
  avatar: string;
  bio: string;
  joinDate: string;
  favorites: string[]; // list of animeIds
  watchlist: WatchlistStatus[];
  badges: string[];
}

export interface CommunityPoll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  userVotedOptionId?: string;
  expiresAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
