import { Anime, CommunityPoll, Character } from '../types';

export const LOCAL_ANIME_DATA: Anime[] = [
  {
    id: "frieren",
    title: "Sousou no Frieren",
    englishTitle: "Frieren: Beyond Journey's End",
    japaneseTitle: "葬送のフリーレン",
    synopsis: "The adventure is over but life goes on for an elven mage who begins to learn what time means to her companions. Elf mage Frieren and her courageous fellow adventurers have defeated the Demon King and brought peace to the land. But Frieren will long outlive the rest of her former party. How will she come to understand what life means to the humans around her? Decades after their victory, her friend's funeral confronts Frieren with her own regret over her relative lack of intimacy with them. She sets out on a new journey to learn more about feelings and connect with humanity.",
    bannerImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1400&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop",
    genres: ["Adventure", "Drama", "Fantasy"],
    studios: ["Madhouse"],
    releaseDate: "2023-09-29",
    season: "Fall",
    year: 2023,
    episodeCount: 28,
    durationPerEpisode: 24,
    status: "Completed",
    score: 9.39,
    popularityRanking: 1,
    trailerUrl: "https://www.youtube.com/embed/qgQunxD0qSg",
    characters: [
      {
        id: "frieren-char",
        name: "Frieren",
        role: "Main",
        image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=200&auto=format&fit=crop",
        description: "An elven mage who was a member of the group that defeated the Demon King. Because elves have extremely long lifespans, her perception of time is vastly different from her human companions.",
        voiceActors: [
          { id: "at-va", name: "Atsumi Tanezaki", language: "Japanese", image: "" },
          { id: "md-va", name: "Mallorie Rodak", language: "English", image: "" }
        ]
      },
      {
        id: "fern-char",
        name: "Fern",
        role: "Main",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=200&auto=format&fit=crop",
        description: "An orphan adopted by Heiter who becomes Frieren's apprentice mage. She is calm, sensible, and handles Frieren's absentminded habits.",
        voiceActors: [
          { id: "ki-va", name: "Kana Ichinose", language: "Japanese", image: "" },
          { id: "jm-va", name: "Jill Harris", language: "English", image: "" }
        ]
      },
      {
        id: "stark-char",
        name: "Stark",
        role: "Main",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
        description: "A young warrior trained by Eisen. Despite being technically incredibly strong, Stark is often comically cowardly and easily frightened.",
        voiceActors: [
          { id: "ck-va", name: "Chiaki Kobayashi", language: "Japanese", image: "" }
        ]
      }
    ],
    relatedAnime: [
      { id: "frieren-specials", title: "Sousou no Frieren Mini Anime", relationType: "Spin-off" }
    ],
    episodesList: [
      { number: 1, title: "The Journey's End", airDate: "2023-09-29", duration: "24m" },
      { number: 2, title: "It Didn't Have to Be Magic...", airDate: "2023-09-29", duration: "24m" },
      { number: 3, title: "Killing Magic", airDate: "2023-10-06", duration: "24m" }
    ]
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen Season 2",
    englishTitle: "Jujutsu Kaisen S2",
    japaneseTitle: "呪術廻戦 懐玉・玉折 / 渋谷事変",
    synopsis: "The past comes back to haunt Jujutsu High sorcerers. Satoru Gojo and Suguru Geto are tasked with escorting the Star Plasma Vessel, Riko Amanai, to Master Tengen. But when an assassin named Toji Fushiguro attacks, their friendship and moral bearings are shattered. Years later, back in the present, the Shibuya Incident begins, posing an existential threat to all of modern Tokyo as Jujutsu sorcerers battle cursed spirits.",
    bannerImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1400&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=500&auto=format&fit=crop",
    genres: ["Action", "Fantasy", "Supernatural"],
    studios: ["MAPPA"],
    releaseDate: "2023-07-06",
    season: "Summer",
    year: 2023,
    episodeCount: 23,
    durationPerEpisode: 23,
    status: "Completed",
    score: 8.82,
    popularityRanking: 2,
    trailerUrl: "https://www.youtube.com/embed/O6qV3Bi2HR0",
    characters: [
      {
        id: "gojo-char",
        name: "Satoru Gojo",
        role: "Main",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
        description: "The strongest Jujutsu sorcerer alive. He teaches first-years at Jujutsu High and possesses the legendary Limitless and Six Eyes abilities.",
        voiceActors: [
          { id: "yn-va", name: "Yuichi Nakamura", language: "Japanese", image: "" },
          { id: "kc-va", name: "Kaiji Tang", language: "English", image: "" }
        ]
      },
      {
        id: "geto-char",
        name: "Suguru Geto",
        role: "Main",
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop",
        description: "A former classmate of Gojo who turned against humanity, believing sorcerers are superior and that all non-sorcerers must be purged.",
        voiceActors: [
          { id: "ts-va", name: "Takahiro Sakurai", language: "Japanese", image: "" }
        ]
      },
      {
        id: "toji-char",
        name: "Toji Fushiguro",
        role: "Supporting",
        image: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=200&auto=format&fit=crop",
        description: "The 'Sorcerer Killer,' an assassin with zero cursed energy who relies on absolute physical prowess and cursed tools.",
        voiceActors: [
          { id: "tk-va", name: "Takehito Koyasu", language: "Japanese", image: "" }
        ]
      }
    ],
    relatedAnime: [
      { id: "jujutsu-kaisen-s1", title: "Jujutsu Kaisen Season 1", relationType: "Prequel" },
      { id: "jujutsu-kaisen-0", title: "Jujutsu Kaisen 0 (Movie)", relationType: "Prequel" }
    ]
  },
  {
    id: "demon-slayer",
    title: "Kimetsu no Yaiba: Hashira Training Arc",
    englishTitle: "Demon Slayer: Hashira Training Arc",
    japaneseTitle: "鬼滅の刃 柱稽古編",
    synopsis: "In preparation for the impending war against Muzan Kibutsuji, all members of the Demon Slayer Corps, including Tanjiro Kamado, engage in strenuous Hashira Training. Guided by the elite Hashiras, they seek to unlock the hidden marks that boost physical power.",
    bannerImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop",
    genres: ["Action", "Fantasy", "Historical"],
    studios: ["ufotable"],
    releaseDate: "2024-05-12",
    season: "Spring",
    year: 2024,
    episodeCount: 8,
    durationPerEpisode: 24,
    status: "Completed",
    score: 8.64,
    popularityRanking: 3,
    trailerUrl: "https://www.youtube.com/embed/5mct-A7Xq1E",
    characters: [
      {
        id: "tanjiro-char",
        name: "Kamado Tanjiro",
        role: "Main",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        description: "A kind-hearted boy who becomes a demon slayer to save his demonized sister, Nezuko, and avenge his murdered family.",
        voiceActors: [
          { id: "nh-va", name: "Natsuki Hanae", language: "Japanese", image: "" },
          { id: "za-va", name: "Zach Aguilar", language: "English", image: "" }
        ]
      },
      {
        id: "nezuko-char",
        name: "Kamado Nezuko",
        role: "Main",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
        description: "Tanjiro's younger sister who was turned into a demon but retains her human protective instincts, sleeping to recover energy.",
        voiceActors: [
          { id: "ak-va", name: "Akari Kito", language: "Japanese", image: "" }
        ]
      }
    ],
    relatedAnime: [
      { id: "demon-slayer-s1", title: "Demon Slayer Season 1", relationType: "Prequel" },
      { id: "demon-slayer-mugen", title: "Demon Slayer: Mugen Train Movie", relationType: "Prequel" }
    ]
  },
  {
    id: "chainsaw-man",
    title: "Chainsaw Man S1",
    englishTitle: "Chainsaw Man",
    japaneseTitle: "チェンソーマン",
    synopsis: "Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by harvesting devil carcasses with Pochita. One day, Denji is betrayed and killed. As his consciousness fades, he makes a contract with Pochita and gets revived as 'Chainsaw Man' — a man with a devil's heart.",
    bannerImage: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?q=80&w=1400&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=500&auto=format&fit=crop",
    genres: ["Action", "Drama", "Gore"],
    studios: ["MAPPA"],
    releaseDate: "2022-10-12",
    season: "Fall",
    year: 2022,
    episodeCount: 12,
    durationPerEpisode: 24,
    status: "Completed",
    score: 8.51,
    popularityRanking: 4,
    trailerUrl: "https://www.youtube.com/embed/v4y_1Shep1o",
    characters: [
      {
        id: "denji-char",
        name: "Denji",
        role: "Main",
        image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=200&auto=format&fit=crop",
        description: "A naive, basic teen who turns into Chainsaw Man. He seeks to satisfy his simple biological desires and find a warm, loving home.",
        voiceActors: [
          { id: "tk2-va", name: "Toya Kikunosuke", language: "Japanese", image: "" }
        ]
      },
      {
        id: "power-char",
        name: "Power",
        role: "Main",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
        description: "The Blood Fiend who acts childishly, hates vegetables, loves cats, and has a highly aggressive, self-flattering attitude.",
        voiceActors: [
          { id: "fa-va", name: "Fairouz Ai", language: "Japanese", image: "" }
        ]
      },
      {
        id: "makima-char",
        name: "Makima",
        role: "Main",
        image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=200&auto=format&fit=crop",
        description: "A mysterious high-ranking Public Safety Devil Hunter who takes Denji in as her human pet.",
        voiceActors: [
          { id: "tk3-va", name: "Tomori Kusunoki", language: "Japanese", image: "" }
        ]
      }
    ],
    relatedAnime: [
      { id: "chainsaw-man-movie", title: "Chainsaw Man: Reze Arc Movie", relationType: "Sequel" }
    ]
  },
  {
    id: "chainsaw-man-movie",
    title: "Chainsaw Man Movie: Reze Arc",
    englishTitle: "Chainsaw Man Movie: Reze Arc",
    japaneseTitle: "劇場版 チェンソーマン レゼ篇",
    synopsis: "The film continues immediately after the events of season 1. Denji meets a sweet, quiet girl named Reze in a cafe and immediately falls head over heels in love. However, Reze hides a deadly, explosive secret that will throw Tokyo's Public Safety division into full-scale war.",
    bannerImage: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1400&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=500&auto=format&fit=crop",
    genres: ["Action", "Drama", "Romance", "Gore"],
    studios: ["MAPPA"],
    releaseDate: "2026-09-15",
    season: "Fall",
    year: 2026,
    episodeCount: 1,
    durationPerEpisode: 110,
    status: "Upcoming",
    score: 0,
    popularityRanking: 12,
    trailerUrl: "https://www.youtube.com/embed/LWyv1O6Z79k",
    characters: [
      {
        id: "reze-char",
        name: "Reze",
        role: "Main",
        image: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=200&auto=format&fit=crop",
        description: "A kind waitress at a local cafe who bonds with Denji. Also known as the Bomb Devil, a foreign assassin weapon.",
        voiceActors: [
          { id: "ru-va", name: "Reina Ueda", language: "Japanese", image: "" }
        ]
      }
    ],
    upcomingEpisodeAirDate: "2026-09-15T00:00:00.000Z", // active countdown target!
    relatedAnime: [
      { id: "chainsaw-man", title: "Chainsaw Man Season 1", relationType: "Prequel" }
    ]
  },
  {
    id: "attack-on-titan",
    title: "Shingeki no Kyojin: The Final Season",
    englishTitle: "Attack on Titan: Final Season",
    japaneseTitle: "進撃の巨人 The Final Season",
    synopsis: "The truth outside the walls is finally revealed, together with the dark histories of the Eldian and Marleyan empires. Eren Yeager, now with the power of the Founding Titan, starts the Rumbling — a catastrophic march of colossal titans to flatten all life beyond Paradis Island. His former comrades team up to do whatever it takes to stop Eren from destroying the entire world.",
    bannerImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1400&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500&auto=format&fit=crop",
    genres: ["Drama", "Action", "Military", "Mystery"],
    studios: ["MAPPA"],
    releaseDate: "2020-12-07",
    season: "Winter",
    year: 2020,
    episodeCount: 30,
    durationPerEpisode: 24,
    status: "Completed",
    score: 9.15,
    popularityRanking: 5,
    trailerUrl: "https://www.youtube.com/embed/M_OauHnAFc8",
    characters: [
      {
        id: "eren-char",
        name: "Eren Yeager",
        role: "Main",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        description: "The primary protagonist who seeks complete, absolute freedom for his island Paradis, choosing to erase the rest of the world.",
        voiceActors: [
          { id: "yk-va", name: "Yuki Kaji", language: "Japanese", image: "" },
          { id: "bp-va", name: "Bryce Papenbrook", language: "English", image: "" }
        ]
      },
      {
        id: "mikasa-char",
        name: "Mikasa Ackerman",
        role: "Main",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        description: "Eren's childhood companion, incredibly skilled in combat, who struggles with her love for Eren versus saving humanity.",
        voiceActors: [
          { id: "yi-va", name: "Yui Ishikawa", language: "Japanese", image: "" }
        ]
      }
    ]
  },
  {
    id: "spy-x-family",
    title: "Spy x Family",
    englishTitle: "Spy x Family",
    japaneseTitle: "スパイファミリー",
    synopsis: "A master spy known as Twilight must form a make-believe family to complete an ultra-hazardous political investigation. He adopts a sweet psychic orphan named Anya and enters an arranged marriage with Yor, who is unbeknownst to him a stellar professional assassin. Together, this makeshift family must learn to navigate domestic life while keeping their secret capacities locked away.",
    bannerImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1400&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1533142262402-401209b82956?q=80&w=500&auto=format&fit=crop",
    genres: ["Comedy", "Action", "Slice of Life"],
    studios: ["Wit Studio", "CloverWorks"],
    releaseDate: "2022-04-09",
    season: "Spring",
    year: 2022,
    episodeCount: 25,
    durationPerEpisode: 24,
    status: "Completed",
    score: 8.52,
    popularityRanking: 6,
    trailerUrl: "https://www.youtube.com/embed/cc7bV7T6p6M",
    characters: [
      {
        id: "loid-char",
        name: "Loid Forger",
        role: "Main",
        image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=200&auto=format&fit=crop",
        description: "Alias Twilight. A brilliant spy for WISE who behaves flawlessly but is frequently bewildered by his fake family's chaotic acts.",
        voiceActors: [
          { id: "te-va", name: "Takuya Eguchi", language: "Japanese", image: "" }
        ]
      },
      {
        id: "anya-char",
        name: "Anya Forger",
        role: "Main",
        image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=200&auto=format&fit=crop",
        description: "A funny little girl who can read thoughts, she loves peanuts and spy cartoons, and is the absolute soul of the Forger dynamic.",
        voiceActors: [
          { id: "at-va-forger", name: "Atsumi Tanezaki", language: "Japanese", image: "" }
        ]
      },
      {
        id: "yor-char",
        name: "Yor Forger",
        role: "Main",
        image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&auto=format&fit=crop",
        description: "Known as Thorn Princess. A deadly assassin with inhuman strength who is soft-spoken, clumsy, and a terrible cook.",
        voiceActors: [
          { id: "sh-va", name: "Saori Hayami", language: "Japanese", image: "" }
        ]
      }
    ]
  },
  {
    id: "solo-leveling-s2",
    title: "Solo Leveling Season 2: Arise from the Shadow",
    englishTitle: "Solo Leveling S2",
    japaneseTitle: "俺だけレベルアップな件 Season 2",
    synopsis: "Following the historic Double Dungeon ordeal and Jinwoo's evolution into the Monarch of Shadows, international guilds realize a god-tier entity is operating in Korea. As gate breaches grow more threatening, Jinwoo must summon his shadow armies and raise his tier further.",
    bannerImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1400&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=500&auto=format&fit=crop",
    genres: ["Action", "Fantasy", "System"],
    studios: ["A-1 Pictures"],
    releaseDate: "2026-07-28",
    season: "Summer",
    year: 2026,
    episodeCount: 12,
    durationPerEpisode: 24,
    status: "Upcoming",
    score: 0,
    popularityRanking: 18,
    trailerUrl: "https://www.youtube.com/embed/g8fH_7HkIks",
    characters: [
      {
        id: "jinwoo-char",
        name: "Sung Jinwoo",
        role: "Main",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
        description: "The world's weakest hunter who was chosen by a mysterious 'System' to become its sole player, leveling up unlimitedly.",
        voiceActors: [
          { id: "tb-va", name: "Taito Ban", language: "Japanese", image: "" }
        ]
      }
    ],
    upcomingEpisodeAirDate: "2026-07-28T18:00:00.000Z",
    relatedAnime: [
      { id: "solo-leveling-s1", title: "Solo Leveling Season 1", relationType: "Prequel" }
    ]
  }
];

export const GENRE_LIST = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Gore", "Historical", "Military", "Mystery", "Romance", "Slice of Life", "Supernatural"
];

export const STUDIO_LIST = [
  "MAPPA", "Madhouse", "ufotable", "Wit Studio", "CloverWorks", "A-1 Pictures", "Studio Ghibli", "Bones"
];

export const COMMUNITY_POLLS: CommunityPoll[] = [
  {
    id: "poll-1",
    question: "Which anime are you most excited for in 2026?",
    options: [
      { id: "opt-1", text: "Chainsaw Man: Reze Arc Movie", votes: 1420 },
      { id: "opt-2", text: "Solo Leveling Season 2", votes: 1105 },
      { id: "opt-3", text: "Oshi no Ko Season 3", votes: 852 },
      { id: "opt-4", text: "Demon Slayer Infinity Castle Movie Arc", votes: 2154 }
    ],
    totalVotes: 5531,
    expiresAt: "2026-07-31"
  },
  {
    id: "poll-2",
    question: "Who is your favorite character of Beyond Journey's End?",
    options: [
      { id: "opt-frieren", text: "Frieren (Elf Sage)", votes: 3102 },
      { id: "opt-fern", text: "Fern (Apprentice)", votes: 1045 },
      { id: "opt-stark", text: "Stark (Warrior)", votes: 890 },
      { id: "opt-himmel", text: "Himmel (The Hero)", votes: 2439 }
    ],
    totalVotes: 7476,
    expiresAt: "2026-06-30"
  }
];

export const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    animeId: "frieren",
    animeTitle: "Sousou no Frieren",
    username: "OtakuSage",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
    rating: 10,
    reviewText: "An absolute masterpiece. Highly contemplative, visually stunning, with pacing that allows character relations to breathe. Most fantasy anime rush into battles, but this is a beautiful homage to the quiet time AFTER the quest is fulfilled. Madhouse did an extraordinary job animating this.",
    createdAt: "2026-05-12",
    likes: 245
  },
  {
    id: "rev-2",
    animeId: "jujutsu-kaisen",
    animeTitle: "Jujutsu Kaisen Season 2",
    username: "SorcererX",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
    rating: 9,
    reviewText: "Shibuya Incident is peak chaotic action. The choreography by MAPPA is next-gen. Satoru Gojo's past arc was beautiful and tragic. Lost 1 point because the production schedule felt visible in a few frames, but otherwise an amazing roller coaster.",
    createdAt: "2026-06-01",
    likes: 189
  }
];
