import { Anime, Character } from '../types';
import { LOCAL_ANIME_DATA } from '../data/animeData';

// Helper to convert Jikan API objects to our standard Anime frontend format
function mapJikanToAnime(j: any): Anime {
  // Extract main characters if available or map standard fields from Jikan structure
  const studioNames = j.studios?.map((s: any) => s.name) || ["Unknown Studio"];
  const genreNames = j.genres?.map((g: any) => g.name) || [];
  
  return {
    id: `jikan-${j.mal_id}`,
    title: j.title,
    englishTitle: j.title_english || undefined,
    japaneseTitle: j.title_japanese || undefined,
    synopsis: j.synopsis || "No description available.",
    bannerImage: j.images?.jpg?.large_image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1400",
    coverImage: j.images?.jpg?.image_url || "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=500",
    genres: genreNames,
    studios: studioNames,
    releaseDate: j.aired?.from?.split('T')[0] || "Unknown",
    season: (j.season ? j.season.charAt(0).toUpperCase() + j.season.slice(1) : "Spring") as any,
    year: j.year || new Date(j.aired?.from).getFullYear() || 2024,
    episodeCount: j.episodes || 0,
    durationPerEpisode: parseInt(j.duration) || 24,
    status: j.status === "Airing" ? "Ongoing" : j.status === "Not yet aired" ? "Upcoming" : "Completed",
    score: j.score || 7.5,
    popularityRanking: j.rank || 999,
    trailerUrl: j.trailer?.embed_url || undefined,
    characters: [] // Character API will load characters on-demand
  };
}

// Global cached requests to avoid hammering Jikan in active sessions
const apiCache: Record<string, any> = {};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Queue/Time gates to stay strictly below Jikan Rate limits (3 requests / sec; 60 requests / minute)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1100; // 1.1 seconds spacing

export async function fetchWithCache(url: string, retries = 3, delay = 1200) {
  if (apiCache[url]) {
    return apiCache[url];
  }
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Staggering locks
      const now = Date.now();
      const timeSinceLast = now - lastRequestTime;
      if (timeSinceLast < MIN_REQUEST_INTERVAL) {
        const waitTime = MIN_REQUEST_INTERVAL - timeSinceLast;
        await sleep(waitTime);
      }
      lastRequestTime = Date.now();

      const res = await fetch(url);
      
      if (res.status === 429) {
        if (attempt < retries) {
          // Double the backoff delay on rate limit
          await sleep(delay * (attempt + 1.5));
          continue;
        }
        console.warn(`Jikan API rate limit (429) encountered at ${url} after ${attempt} retries. Gracefully falling back.`);
        return null;
      }
      
      if (!res.ok) {
        if (attempt < retries) {
          await sleep(delay);
          continue;
        }
        console.warn(`Failed to fetch ${url} (status: ${res.status}). Gracefully falling back.`);
        return null;
      }
      
      const data = await res.json();
      apiCache[url] = data;
      return data;
    } catch (err) {
      if (attempt < retries) {
        await sleep(delay);
        continue;
      }
      console.warn(`Failed to fetch ${url} due to network/CORS error. Gracefully falling back.`);
      return null;
    }
  }
  return null;
}

export async function getTrendingAnime(): Promise<Anime[]> {
  const data = await fetchWithCache("https://api.jikan.moe/v4/top/anime?limit=8&filter=airing");
  if (data && data.data) {
    const mapped = data.data.map((item: any) => mapJikanToAnime(item));
    // Merge local data for enhanced visuals
    return [...LOCAL_ANIME_DATA.filter(a => a.status === 'Ongoing'), ...mapped].filter(
      (value, index, self) => self.findIndex(t => t.title === value.title) === index
    ).slice(0, 8);
  }
  return LOCAL_ANIME_DATA.slice(0, 6);
}

export async function getTopRatedAnime(): Promise<Anime[]> {
  const data = await fetchWithCache("https://api.jikan.moe/v4/top/anime?limit=8");
  if (data && data.data) {
    const mapped = data.data.map((item: any) => mapJikanToAnime(item));
    return [...LOCAL_ANIME_DATA.filter(a => a.score > 8.8), ...mapped].filter(
      (value, index, self) => self.findIndex(t => t.title === value.title) === index
    ).sort((a,b) => b.score - a.score).slice(0, 8);
  }
  return [...LOCAL_ANIME_DATA].sort((a, b) => b.score - a.score).slice(0, 6);
}

export async function getUpcomingAnime(): Promise<Anime[]> {
  const data = await fetchWithCache("https://api.jikan.moe/v4/top/anime?limit=8&filter=upcoming");
  if (data && data.data) {
    const mapped = data.data.map((item: any) => mapJikanToAnime(item));
    return [...LOCAL_ANIME_DATA.filter(a => a.status === 'Upcoming'), ...mapped].filter(
      (value, index, self) => self.findIndex(t => t.title === value.title) === index
    ).slice(0, 8);
  }
  return LOCAL_ANIME_DATA.filter(a => a.status === 'Upcoming').slice(0, 4);
}

export async function searchAnime(
  query: string, 
  filters?: {
    genre?: string;
    studio?: string;
    status?: string;
    year?: number;
    sortBy?: 'score' | 'popularity' | 'release';
  }
): Promise<Anime[]> {
  let results = [...LOCAL_ANIME_DATA];

  // If there's a search term, try Jikan API, combining offline match
  if (query.trim()) {
    const cleanQuery = encodeURIComponent(query.trim());
    const data = await fetchWithCache(`https://api.jikan.moe/v4/anime?q=${cleanQuery}&limit=15`);
    if (data && data.data) {
      const mapped = data.data.map((item: any) => mapJikanToAnime(item));
      results = [...results.filter(a => 
        a.title.toLowerCase().includes(query.toLowerCase()) || 
        a.englishTitle?.toLowerCase().includes(query.toLowerCase())
      ), ...mapped];
    } else {
      // Local fallback search
      results = results.filter(a => 
        a.title.toLowerCase().includes(query.toLowerCase()) || 
        a.englishTitle?.toLowerCase().includes(query.toLowerCase()) ||
        a.genres.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
        a.studios.some(s => s.toLowerCase().includes(query.toLowerCase()))
      );
    }
  }

  // Deduplicate results by title
  results = results.filter(
    (value, index, self) => self.findIndex(t => t.title.toLowerCase() === value.title.toLowerCase()) === index
  );

  // Apply filter options on results
  if (filters) {
    if (filters.genre) {
      results = results.filter(a => a.genres.some(g => g.toLowerCase() === filters.genre!.toLowerCase()));
    }
    if (filters.studio) {
      results = results.filter(a => a.studios.some(s => s.toLowerCase() === filters.studio!.toLowerCase()));
    }
    if (filters.status) {
      results = results.filter(a => a.status.toLowerCase() === filters.status!.toLowerCase());
    }
    if (filters.year) {
      results = results.filter(a => a.year === Number(filters.year));
    }

    if (filters.sortBy) {
      if (filters.sortBy === 'score') {
        results = results.sort((a, b) => (b.score || 0) - (a.score || 0));
      } else if (filters.sortBy === 'popularity') {
        results = results.sort((a, b) => a.popularityRanking - b.popularityRanking);
      } else if (filters.sortBy === 'release') {
        results = results.sort((a, b) => b.year - a.year);
      }
    }
  }

  return results;
}

export async function getAnimeCharacters(animeId: string): Promise<Character[]> {
  // If local anime has characters list, return it
  const local = LOCAL_ANIME_DATA.find(a => a.id === animeId);
  if (local && local.characters && local.characters.length > 0) {
    return local.characters;
  }

  // Otherwise, if it is a Jikan ID, fetch characters from Jikan
  if (animeId.startsWith('jikan-')) {
    const numericId = animeId.replace('jikan-', '');
    const data = await fetchWithCache(`https://api.jikan.moe/v4/anime/${numericId}/characters`);
    if (data && data.data) {
      // Return top 8 characters mapped appropriately
      return data.data.slice(0, 8).map((charItem: any): Character => {
        const c = charItem.character;
        const mainVA = charItem.voice_actors?.find((va: any) => va.language === 'Japanese');
        return {
          id: `jikan-char-${c.mal_id}`,
          name: c.name,
          role: charItem.role,
          image: c.images?.jpg?.image_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
          description: `A prominent character in the series playing a ${charItem.role.toLowerCase()} role.`,
          voiceActors: mainVA ? [{
            id: `va-${mainVA.person.mal_id}`,
            name: mainVA.person.name,
            language: 'Japanese',
            image: mainVA.person.images?.jpg?.image_url || ""
          }] : []
        };
      });
    }
  }

  // Ultimate fallback characters if none found
  return [
    {
      id: "fallback-1",
      name: "Protagonist",
      role: "Main",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=200",
      description: "The primary protagonist of this series.",
      voiceActors: [{ id: "fallback-va", name: "Hiroshi Kamiya", language: "Japanese", image: "" }]
    }
  ];
}
