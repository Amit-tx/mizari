import { japanThemes, animeThemes, AnimeReactivePhase } from '@/data/themes';

// Theme Store catalog — defines which themes are free vs paid and their categories
export interface StoreTheme {
  id: string;
  name: string;
  emoji: string;
  tier: 'free' | 'premium' | 'exclusive';
  price: number; // in INR (0 = free)
  description: string;
  categories: string[];
  tags: string[];
  effect?: string; // animation effect name
  bgGradient?: string;
  bgColor: string;
  textColor: string;
  btnBg: string;
  reactivePhases?: AnimeReactivePhase[];
  btnBorder?: string;
  btnStyle?: string;
}

function mapEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('sakura')) return '🌸';
  if (n.includes('sunset')) return '🌅';
  if (n.includes('dawn')) return '🌅';
  if (n.includes('rain')) return '🌧';
  if (n.includes('night')) return '🌙';
  if (n.includes('torii') || n.includes('shrine')) return '⛩️';
  if (n.includes('bamboo')) return '🎋';
  if (n.includes('samurai')) return '⚔️';
  if (n.includes('kitsune')) return '🦊';
  if (n.includes('lantern')) return '🏮';
  if (n.includes('zen')) return '🪨';
  if (n.includes('koi') || n.includes('pond')) return '🐟';
  if (n.includes('autumn')) return '🍁';
  if (n.includes('winter') || n.includes('snow')) return '❄️';
  if (n.includes('wave')) return '🌊';
  if (n.includes('firefly') || n.includes('village')) return '✨';
  if (n.includes('street') || n.includes('edo')) return '🏮';
  if (n.includes('aurora')) return '🌌';
  if (n.includes('ink') || n.includes('brush')) return '🖌️';
  if (n.includes('frieren')) return '🪄';
  if (n.includes('demon slayer') || n.includes('slayer')) return '⚔️';
  if (n.includes('naruto')) return '🍥';
  if (n.includes('dragon ball')) return '🐉';
  if (n.includes('one piece')) return '🏴';
  if (n.includes('jujutsu')) return '🌀';
  if (n.includes('titan')) return '🛡️';
  if (n.includes('hero academia')) return '🦸';
  if (n.includes('hunter')) return '🎣';
  if (n.includes('ghoul')) return '☕';
  if (n.includes('death note')) return '📓';
  if (n.includes('online')) return '⚔️';
  if (n.includes('clover')) return '🍀';
  if (n.includes('leveling')) return '🗡️';
  if (n.includes('chainsaw')) return '🪚';
  if (n.includes('spy')) return '🕵️';
  if (n.includes('haikyuu')) return '🏐';
  if (n.includes('blue lock') || n.includes('lock')) return '⚽';
  if (n.includes('jojo')) return '🌟';
  if (n.includes('sailor')) return '🌙';
  if (n.includes('evangelion')) return '🤖';
  if (n.includes('bebop')) return '🚀';
  if (n.includes('geass')) return '👁️';
  if (n.includes('berserk')) return '🗡️';
  if (n.includes('zero')) return '🍎';
  if (n.includes('overlord')) return '💀';
  if (n.includes('punch')) return '👊';
  if (n.includes('psycho')) return '🧠';
  if (n.includes('mecha')) return '🤖';
  return '🎨';
}

function parsePrice(priceStr: string): number {
  if (priceStr.toLowerCase() === 'free') return 0;
  return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
}

const mappedJapanThemes: StoreTheme[] = japanThemes.map((t) => {
  const price = parsePrice(t.price);
  const tier = price === 0 ? 'free' : price >= 99 ? 'exclusive' : 'premium';
  return {
    id: t.slug,
    name: t.name,
    emoji: mapEmoji(t.name),
    tier,
    price,
    description: t.headline,
    categories: ['Anime', 'Creator'] as any,
    tags: t.tags as string[],
    effect: t.particle === 'petal' ? 'sakura' : t.particle === 'firefly' ? 'fireflies' : undefined,
    bgGradient: t.art,
    bgColor: t.particle === 'firefly' ? '#0A0E1A' : '#FFF0F5',
    textColor: t.particle === 'firefly' ? '#B8D4F0' : '#8C3A4F',
    btnBg: 'rgba(255,255,255,0.1)',
  };
});

const mappedAnimeThemes: StoreTheme[] = animeThemes.map((t) => {
  const price = parsePrice(t.price);
  const tier = price === 0 ? 'free' : price >= 99 ? 'exclusive' : 'premium';
  return {
    id: t.slug,
    name: t.name,
    emoji: mapEmoji(t.name),
    tier,
    price,
    description: t.reactivePhases ? `Interactive Anime Day/Night Cycle Theme. Updates live with device time!` : `Dynamic styling themed around ${t.name.replace(' Theme', '')}`,
    categories: ['Anime', 'Creator', 'Gaming'] as any,
    tags: t.tags as string[],
    bgGradient: t.art,
    bgColor: '#0B0E23',
    textColor: '#EDE7F6',
    btnBg: 'rgba(255,255,255,0.1)',
    reactivePhases: t.reactivePhases,
  };
});

const PRESET_THEMES: StoreTheme[] = [
  // ── FREE THEMES (10) ──────────────────────────────────────
  { id: 'light',      name: 'Clean Light',     emoji: '☀️',  tier: 'free', price: 0, description: 'Simple and clean light mode', categories: ['Minimal', 'Business'], tags: ['minimal', 'clean'], bgColor: '#fafafa', textColor: '#1a1a2e', btnBg: '#f3f4f6' },
  { id: 'dark',       name: 'Midnight Dark',   emoji: '🌑',  tier: 'free', price: 0, description: 'Sleek dark mode for night owls', categories: ['Minimal', 'Business'], tags: ['dark', 'minimal'], bgColor: '#0f172a', textColor: '#e2e8f0', btnBg: '#1e293b' },
  { id: 'sakura',     name: 'Sakura',          emoji: '🌸',  tier: 'free', price: 0, description: 'Cherry blossom pink with falling petals', categories: ['Anime', 'Creator'], tags: ['anime', 'pink', 'spring'], bgColor: '#FFF0F5', textColor: '#8C3A4F', btnBg: '#FFD6E0', effect: 'sakura', bgGradient: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%)' },
  { id: 'tsukiyo',    name: 'Tsukiyo Moon',    emoji: '🌙',  tier: 'free', price: 0, description: 'Moonlit night sky blues', categories: ['Anime', 'Minimal'], tags: ['dark', 'anime', 'blue'], bgColor: '#0B132B', textColor: '#F4F4F9', btnBg: '#1C2541', bgGradient: 'linear-gradient(135deg, #0B132B 0%, #1C2541 100%)' },
  { id: 'mizukaze',   name: 'Mizukaze Wave',   emoji: '🌊',  tier: 'free', price: 0, description: 'Cool ocean breeze gradient', categories: ['Minimal', 'Creator'], tags: ['blue', 'ocean', 'cool'], bgColor: '#E0F2FE', textColor: '#0369A1', btnBg: '#BAE6FD', bgGradient: 'linear-gradient(135deg, #E0F7FA 0%, #80DEEA 100%)' },
  { id: 'aozora',     name: 'Aozora Sky',      emoji: '☁️',  tier: 'free', price: 0, description: 'Blue sky with clouds', categories: ['Minimal', 'Creator'], tags: ['sky', 'blue', 'cloud'], bgColor: '#F0F9FF', textColor: '#075985', btnBg: '#ffffff', effect: 'clouds', bgGradient: 'linear-gradient(180deg, #BAE6FD 0%, #E0F2FE 100%)' },
  { id: 'kurohana',   name: 'Kurohana',        emoji: '🖤',  tier: 'free', price: 0, description: 'Dark black with sharp edges', categories: ['Minimal', 'Business', 'Luxury'], tags: ['dark', 'black', 'minimal'], bgColor: '#18181B', textColor: '#E4E4E7', btnBg: '#27272A' },
  { id: 'momiji',     name: 'Momiji Autumn',   emoji: '🍁',  tier: 'free', price: 0, description: 'Warm autumn red tones', categories: ['Anime', 'Creator'], tags: ['autumn', 'red', 'warm'], bgColor: '#FDF2F2', textColor: '#9B1C1C', btnBg: '#FDE8E8', effect: 'autumn', bgGradient: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)' },
  { id: 'ame',        name: 'Ame Rain',        emoji: '🌧',  tier: 'free', price: 0, description: 'Rainy day lo-fi vibes', categories: ['Minimal', 'Creator'], tags: ['rain', 'lo-fi', 'grey'], bgColor: '#ECF1F6', textColor: '#2F4F4F', btnBg: '#D5E1ED', effect: 'rain' },
  { id: 'zen',        name: 'Zen Stone',       emoji: '🪨',  tier: 'free', price: 0, description: 'Minimalist stone grey', categories: ['Minimal', 'Business'], tags: ['minimal', 'grey', 'zen'], bgColor: '#F5F5F4', textColor: '#44403C', btnBg: '#E7E5E4' },

  // ── PREMIUM THEMES ₹49 ────────────────────────────────────
  { id: 'galaxy_dream',     name: 'Galaxy Dream',      emoji: '✨',  tier: 'premium', price: 49, description: 'Deep space purple with shooting stars', categories: ['Anime', 'Creator', 'Luxury'], tags: ['space', 'dark', 'purple', 'anime'], bgColor: '#0B0014', textColor: '#DDD6FE', btnBg: '#1E0A3C', effect: 'shooting_stars', bgGradient: 'linear-gradient(135deg, #0B0014 0%, #1E0A3C 50%, #2D1B69 100%)' },
  { id: 'cyber_tokyo',      name: 'Cyber Tokyo',       emoji: '🌆',  tier: 'premium', price: 49, description: 'Neon cyberpunk city with rain', categories: ['Anime', 'Gaming', 'Creator'], tags: ['neon', 'dark', 'cyberpunk', 'anime'], bgColor: '#0D0221', textColor: '#00F0FF', btnBg: '#0F084B', effect: 'rain', bgGradient: 'linear-gradient(135deg, #0D0221 0%, #0F084B 100%)' },
  { id: 'moonlight_forest', name: 'Moonlight Forest',  emoji: '🌙',  tier: 'premium', price: 49, description: 'Dark forest with glowing fireflies', categories: ['Anime', 'Creator', 'Minimal'], tags: ['dark', 'forest', 'fireflies', 'anime'], bgColor: '#0A0E1A', textColor: '#B8D4F0', btnBg: '#111827', effect: 'fireflies', bgGradient: 'linear-gradient(180deg, #0A0E1A 0%, #0D1B2A 50%, #162032 100%)' },
  { id: 'wisteria',         name: 'Wisteria Bloom',    emoji: '💜',  tier: 'premium', price: 49, description: 'Soft lavender purple blossoms', categories: ['Minimal', 'Creator'], tags: ['purple', 'floral', 'soft'], bgColor: '#FAF5FF', textColor: '#5B21B6', btnBg: '#F3E8FF', bgGradient: 'linear-gradient(135deg, #FAF5FF 0%, #D8B4FE 100%)' },
  { id: 'hoshi',            name: 'Hoshi Stars',       emoji: '⭐',  tier: 'premium', price: 49, description: 'Gold stars on midnight black', categories: ['Minimal', 'Creator', 'Luxury'], tags: ['dark', 'gold', 'stars'], bgColor: '#090D16', textColor: '#FBBF24', btnBg: '#111827' },
  { id: 'shogun',           name: 'Shogun Gold',       emoji: '👑',  tier: 'premium', price: 49, description: 'Luxury gold accents on dark background', categories: ['Luxury', 'Business'], tags: ['dark', 'gold', 'shogun'], bgColor: '#1A1A1A', textColor: '#FFD700', btnBg: '#2D2D2D' },

  // ── EXCLUSIVE THEMES ₹99 ──────────────────────────────────
  { id: 'frieren',          name: 'Wandering Mage',    emoji: '🪄', tier: 'exclusive', price: 99, description: 'Mystic purple magic with drifting shooting stars', categories: ['Anime', 'Creator', 'Luxury'], tags: ['anime', 'magic', 'dark', 'purple'], bgColor: '#1A1220', textColor: '#E8D5F5', btnBg: '#2D1F40', effect: 'shooting_stars', bgGradient: 'linear-gradient(180deg, #1A1220 0%, #2D1F40 50%, #3D2960 100%)' },
  { id: 'demon_slayer',     name: 'Crimson Blade',     emoji: '⚔️', tier: 'exclusive', price: 99, description: 'Dark crimson battle-ready aesthetic with fierce energy', categories: ['Anime', 'Gaming', 'Luxury'], tags: ['anime', 'dark', 'red', 'action'], bgColor: '#0D0014', textColor: '#FFE4E6', btnBg: '#1A0022', effect: 'shooting_stars', bgGradient: 'linear-gradient(135deg, #0D0014 0%, #1A0022 40%, #2D0035 100%)' },
  { id: 'shrine_festival',  name: 'Shrine Festival',        emoji: '🏮', tier: 'exclusive', price: 99, description: 'Traditional Japanese shrine with floating lanterns & fireflies', categories: ['Anime', 'Creator', 'Luxury'], tags: ['anime', 'japanese', 'festival', 'warm'], bgColor: '#1A0500', textColor: '#FFE5C4', btnBg: '#7B1D00', effect: 'lanterns+fireflies', bgGradient: 'linear-gradient(135deg, #1A0500 0%, #7B1D00 100%)' },
  { id: 'ocean_sunset',     name: 'Ocean Sunset',           emoji: '🌅', tier: 'exclusive', price: 99, description: 'Cinematic ocean sunset with moving clouds', categories: ['Creator', 'Luxury'], tags: ['sunset', 'ocean', 'warm', 'beautiful'], bgColor: '#FFF3E0', textColor: '#7B341E', btnBg: '#FED7AA', effect: 'clouds', bgGradient: 'linear-gradient(180deg, #FF6B35 0%, #F7B731 40%, #3D9EFF 100%)' },
  { id: 'railway_sunset',   name: 'Railway Memories',       emoji: '🚉', tier: 'exclusive', price: 99, description: 'Anime train station at golden sunset', categories: ['Anime', 'Creator', 'Minimal'], tags: ['anime', 'nostalgic', 'sunset', 'warm'], bgColor: '#FFF7ED', textColor: '#92400E', btnBg: '#FDE68A', effect: 'clouds', bgGradient: 'linear-gradient(180deg, #F97316 0%, #FDE68A 60%, #FFF7ED 100%)' },
  { id: 'sky_kingdom',      name: 'Sky Kingdom',            emoji: '☁️',  tier: 'exclusive', price: 99, description: 'Floating islands in dynamic blue sky', categories: ['Creator', 'Minimal'], tags: ['sky', 'clouds', 'blue'], bgColor: '#E0F2FE', textColor: '#0C4A6E', btnBg: '#BAE6FD', effect: 'clouds', bgGradient: 'linear-gradient(180deg, #93C5FD 0%, #E0F2FE 60%, #BAE6FD 100%)' },
];

// Combine presets and user provided Japan + Anime themes, filtering out duplicates
const presetIds = new Set(PRESET_THEMES.map((t) => t.id));

export const EXTRA_THEMES: StoreTheme[] = [
  {
    "id": "crimson_love",
    "name": "Crimson Love",
    "emoji": "❤️",
    "tier": "free",
    "price": 0,
    "description": "Romantic Collection theme - Crimson Love",
    "categories": [
      "Romantic"
    ],
    "tags": [
      "romantic",
      "crimson_love"
    ],
    "bgColor": "#4A0E17",
    "textColor": "#FFEBEF",
    "btnBg": "rgba(255,255,255,0.12)",
    "btnBorder": "#FFEBEF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #4A0E17 0%, #8B1E2F 100%)"
  },
  {
    "id": "velvet_rose",
    "name": "Velvet Rose",
    "emoji": "🌹",
    "tier": "free",
    "price": 0,
    "description": "Romantic Collection theme - Velvet Rose",
    "categories": [
      "Romantic"
    ],
    "tags": [
      "romantic",
      "velvet_rose"
    ],
    "bgColor": "#1C0A10",
    "textColor": "#FFE4E6",
    "btnBg": "rgba(255,255,255,0.1)",
    "btnBorder": "#FFE4E622",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #1C0A10 0%, #5C0620 100%)"
  },
  {
    "id": "cherry_kiss",
    "name": "Cherry Kiss",
    "emoji": "💋",
    "tier": "free",
    "price": 0,
    "description": "Romantic Collection theme - Cherry Kiss",
    "categories": [
      "Romantic"
    ],
    "tags": [
      "romantic",
      "cherry_kiss"
    ],
    "bgColor": "#FFF0F3",
    "textColor": "#C2185B",
    "btnBg": "#FCE7F3",
    "btnBorder": "#C2185B22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "moonlit_romance",
    "name": "Moonlit Romance",
    "emoji": "🌙",
    "tier": "free",
    "price": 0,
    "description": "Romantic Collection theme - Moonlit Romance",
    "categories": [
      "Romantic"
    ],
    "tags": [
      "romantic",
      "moonlit_romance"
    ],
    "bgColor": "#0A0915",
    "textColor": "#FCE7F3",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#FCE7F322",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #0A0915 0%, #2E1A47 100%)",
    "effect": "shooting_stars"
  },
  {
    "id": "heartbeat",
    "name": "Heartbeat",
    "emoji": "❤️",
    "tier": "free",
    "price": 0,
    "description": "Romantic Collection theme - Heartbeat",
    "categories": [
      "Romantic"
    ],
    "tags": [
      "romantic",
      "heartbeat"
    ],
    "bgColor": "#7F1D1D",
    "textColor": "#FEF2F2",
    "btnBg": "#DC2626",
    "btnBorder": "#FEF2F222",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "red_velvet",
    "name": "Red Velvet",
    "emoji": "🌺",
    "tier": "free",
    "price": 0,
    "description": "Romantic Collection theme - Red Velvet",
    "categories": [
      "Romantic"
    ],
    "tags": [
      "romantic",
      "red_velvet"
    ],
    "bgColor": "#3F0712",
    "textColor": "#FEE2E2",
    "btnBg": "#991B1B",
    "btnBorder": "#FEE2E222",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "blushing_sakura",
    "name": "Blushing Sakura",
    "emoji": "🌸",
    "tier": "free",
    "price": 0,
    "description": "Romantic Collection theme - Blushing Sakura",
    "categories": [
      "Romantic"
    ],
    "tags": [
      "romantic",
      "blushing_sakura"
    ],
    "bgColor": "#FFF0F6",
    "textColor": "#A21CAF",
    "btnBg": "#FDF2F8",
    "btnBorder": "#A21CAF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #FFF0F6 0%, #FBCFE8 100%)",
    "effect": "sakura"
  },
  {
    "id": "pink_paradise",
    "name": "Pink Paradise",
    "emoji": "💖",
    "tier": "free",
    "price": 0,
    "description": "Romantic Collection theme - Pink Paradise",
    "categories": [
      "Romantic"
    ],
    "tags": [
      "romantic",
      "pink_paradise"
    ],
    "bgColor": "#FFF1F2",
    "textColor": "#BE123C",
    "btnBg": "#FFE4E6",
    "btnBorder": "#BE123C22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "love_letter",
    "name": "Love Letter",
    "emoji": "💌",
    "tier": "free",
    "price": 0,
    "description": "Romantic Collection theme - Love Letter",
    "categories": [
      "Romantic"
    ],
    "tags": [
      "romantic",
      "love_letter"
    ],
    "bgColor": "#FFFBFB",
    "textColor": "#9D174D",
    "btnBg": "#FCE7F3",
    "btnBorder": "#9D174D22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "eternal_rose",
    "name": "Eternal Rose",
    "emoji": "🌹",
    "tier": "free",
    "price": 0,
    "description": "Romantic Collection theme - Eternal Rose",
    "categories": [
      "Romantic"
    ],
    "tags": [
      "romantic",
      "eternal_rose"
    ],
    "bgColor": "#4C0519",
    "textColor": "#FFF1F2",
    "btnBg": "#9F1239",
    "btnBorder": "#FFF1F222",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "valentine_s_night",
    "name": "Valentine's Night",
    "emoji": "💘",
    "tier": "free",
    "price": 0,
    "description": "Romantic Collection theme - Valentine's Night",
    "categories": [
      "Romantic"
    ],
    "tags": [
      "romantic",
      "valentine_s_night"
    ],
    "bgColor": "#1E1B4B",
    "textColor": "#FDF2F8",
    "btnBg": "#4338CA",
    "btnBorder": "#FDF2F822",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)"
  },
  {
    "id": "scarlet_passion",
    "name": "Scarlet Passion",
    "emoji": "🔥",
    "tier": "free",
    "price": 0,
    "description": "Romantic Collection theme - Scarlet Passion",
    "categories": [
      "Romantic"
    ],
    "tags": [
      "romantic",
      "scarlet_passion"
    ],
    "bgColor": "#881337",
    "textColor": "#FFF1F2",
    "btnBg": "#BE123C",
    "btnBorder": "#FFF1F222",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "sweet_candy",
    "name": "Sweet Candy",
    "emoji": "🍬",
    "tier": "free",
    "price": 0,
    "description": "Romantic Collection theme - Sweet Candy",
    "categories": [
      "Romantic"
    ],
    "tags": [
      "romantic",
      "sweet_candy"
    ],
    "bgColor": "#FFF5F7",
    "textColor": "#DB2777",
    "btnBg": "#FCE7F3",
    "btnBorder": "#DB277722",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "wedding_white",
    "name": "Wedding White",
    "emoji": "🤍",
    "tier": "free",
    "price": 0,
    "description": "Romantic Collection theme - Wedding White",
    "categories": [
      "Romantic"
    ],
    "tags": [
      "romantic",
      "wedding_white"
    ],
    "bgColor": "#FFFFFF",
    "textColor": "#4F46E5",
    "btnBg": "#EEF2FF",
    "btnBorder": "#4F46E522",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #FFFFFF 0%, #F5F7FF 100%)"
  },
  {
    "id": "rose_garden",
    "name": "Rose Garden",
    "emoji": "🌹",
    "tier": "free",
    "price": 0,
    "description": "Romantic Collection theme - Rose Garden",
    "categories": [
      "Romantic"
    ],
    "tags": [
      "romantic",
      "rose_garden"
    ],
    "bgColor": "#FDF2F2",
    "textColor": "#15803D",
    "btnBg": "#F0FDF4",
    "btnBorder": "#15803D22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "inferno",
    "name": "Inferno",
    "emoji": "🔥",
    "tier": "free",
    "price": 0,
    "description": "Fire & Energy theme - Inferno",
    "categories": [
      "Fire"
    ],
    "tags": [
      "fire",
      "inferno"
    ],
    "bgColor": "#1A0500",
    "textColor": "#FF9900",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#FF990022",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #1A0500 0%, #5C1D00 100%)"
  },
  {
    "id": "volcano",
    "name": "Volcano",
    "emoji": "🌋",
    "tier": "free",
    "price": 0,
    "description": "Fire & Energy theme - Volcano",
    "categories": [
      "Fire"
    ],
    "tags": [
      "fire",
      "volcano"
    ],
    "bgColor": "#110B09",
    "textColor": "#FF5722",
    "btnBg": "#1B1412",
    "btnBorder": "#FF572222",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #110B09 0%, #3D120A 100%)"
  },
  {
    "id": "lava_flow",
    "name": "Lava Flow",
    "emoji": "🌋",
    "tier": "free",
    "price": 0,
    "description": "Fire & Energy theme - Lava Flow",
    "categories": [
      "Fire"
    ],
    "tags": [
      "fire",
      "lava_flow"
    ],
    "bgColor": "#F44336",
    "textColor": "#FFFFFF",
    "btnBg": "rgba(0,0,0,0.15)",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(90deg, #F44336 0%, #FF9800 100%)"
  },
  {
    "id": "burning_ember",
    "name": "Burning Ember",
    "emoji": "🔥",
    "tier": "free",
    "price": 0,
    "description": "Fire & Energy theme - Burning Ember",
    "categories": [
      "Fire"
    ],
    "tags": [
      "fire",
      "burning_ember"
    ],
    "bgColor": "#1E1614",
    "textColor": "#FF6F00",
    "btnBg": "#2E221E",
    "btnBorder": "#FF6F0022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "firestorm",
    "name": "Firestorm",
    "emoji": "🔥",
    "tier": "free",
    "price": 0,
    "description": "Fire & Energy theme - Firestorm",
    "categories": [
      "Fire"
    ],
    "tags": [
      "fire",
      "firestorm"
    ],
    "bgColor": "#B71C1C",
    "textColor": "#FFEB3B",
    "btnBg": "rgba(255,255,255,0.1)",
    "btnBorder": "#FFEB3B22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #B71C1C 0%, #E65100 100%)"
  },
  {
    "id": "phoenix_flame",
    "name": "Phoenix Flame",
    "emoji": "🦅",
    "tier": "free",
    "price": 0,
    "description": "Fire & Energy theme - Phoenix Flame",
    "categories": [
      "Fire"
    ],
    "tags": [
      "fire",
      "phoenix_flame"
    ],
    "bgColor": "#FF3D00",
    "textColor": "#1A0A00",
    "btnBg": "#FFF3E0",
    "btnBorder": "#1A0A0022",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(180deg, #FF3D00 0%, #FF9100 100%)"
  },
  {
    "id": "solar_flare",
    "name": "Solar Flare",
    "emoji": "☀️",
    "tier": "free",
    "price": 0,
    "description": "Fire & Energy theme - Solar Flare",
    "categories": [
      "Fire"
    ],
    "tags": [
      "fire",
      "solar_flare"
    ],
    "bgColor": "#FFF9C4",
    "textColor": "#E65100",
    "btnBg": "#FFE082",
    "btnBorder": "#E6510022",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #FFF9C4 0%, #FFF59D 100%)"
  },
  {
    "id": "molten_gold",
    "name": "Molten Gold",
    "emoji": "🟠",
    "tier": "free",
    "price": 0,
    "description": "Fire & Energy theme - Molten Gold",
    "categories": [
      "Fire"
    ],
    "tags": [
      "fire",
      "molten_gold"
    ],
    "bgColor": "#0A0A0A",
    "textColor": "#FFD700",
    "btnBg": "rgba(255,255,255,0.05)",
    "btnBorder": "#FFD70022",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #0A0A0A 0%, #2E250E 100%)"
  },
  {
    "id": "crimson_fire",
    "name": "Crimson Fire",
    "emoji": "❤️",
    "tier": "free",
    "price": 0,
    "description": "Fire & Energy theme - Crimson Fire",
    "categories": [
      "Fire"
    ],
    "tags": [
      "fire",
      "crimson_fire"
    ],
    "bgColor": "#540B0B",
    "textColor": "#FF4D4D",
    "btnBg": "#2C0606",
    "btnBorder": "#FF4D4D22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "hellfire",
    "name": "Hellfire",
    "emoji": "🔥",
    "tier": "free",
    "price": 0,
    "description": "Fire & Energy theme - Hellfire",
    "categories": [
      "Fire"
    ],
    "tags": [
      "fire",
      "hellfire"
    ],
    "bgColor": "#080101",
    "textColor": "#E60000",
    "btnBg": "#200202",
    "btnBorder": "#E6000022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "dragon_fire",
    "name": "Dragon Fire",
    "emoji": "🐉",
    "tier": "free",
    "price": 0,
    "description": "Fire & Energy theme - Dragon Fire",
    "categories": [
      "Fire"
    ],
    "tags": [
      "fire",
      "dragon_fire"
    ],
    "bgColor": "#1B0F1C",
    "textColor": "#FFA726",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#FFA72622",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #1B0F1C 0%, #4D0E17 100%)"
  },
  {
    "id": "red_eclipse",
    "name": "Red Eclipse",
    "emoji": "🌑",
    "tier": "free",
    "price": 0,
    "description": "Fire & Energy theme - Red Eclipse",
    "categories": [
      "Fire"
    ],
    "tags": [
      "fire",
      "red_eclipse"
    ],
    "bgColor": "#140003",
    "textColor": "#FF3B5C",
    "btnBg": "#2E0209",
    "btnBorder": "#FF3B5C22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "wild_blaze",
    "name": "Wild Blaze",
    "emoji": "🔥",
    "tier": "free",
    "price": 0,
    "description": "Fire & Energy theme - Wild Blaze",
    "categories": [
      "Fire"
    ],
    "tags": [
      "fire",
      "wild_blaze"
    ],
    "bgColor": "#E65100",
    "textColor": "#FFFDE7",
    "btnBg": "#FF6F00",
    "btnBorder": "#FFFDE722",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #E65100 0%, #FF8F00 100%)"
  },
  {
    "id": "ember_night",
    "name": "Ember Night",
    "emoji": "🌙",
    "tier": "free",
    "price": 0,
    "description": "Fire & Energy theme - Ember Night",
    "categories": [
      "Fire"
    ],
    "tags": [
      "fire",
      "ember_night"
    ],
    "bgColor": "#1C1512",
    "textColor": "#FFAB40",
    "btnBg": "#2C211C",
    "btnBorder": "#FFAB4022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "flame_core",
    "name": "Flame Core",
    "emoji": "🔥",
    "tier": "free",
    "price": 0,
    "description": "Fire & Energy theme - Flame Core",
    "categories": [
      "Fire"
    ],
    "tags": [
      "fire",
      "flame_core"
    ],
    "bgColor": "#000000",
    "textColor": "#FF3D00",
    "btnBg": "#212121",
    "btnBorder": "#FF3D0022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "milky_way",
    "name": "Milky Way",
    "emoji": "🌌",
    "tier": "free",
    "price": 0,
    "description": "Space Collection theme - Milky Way",
    "categories": [
      "Space"
    ],
    "tags": [
      "space",
      "milky_way"
    ],
    "bgColor": "#020208",
    "textColor": "#E0D7F5",
    "btnBg": "rgba(255,255,255,0.06)",
    "btnBorder": "#E0D7F522",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #020208 0%, #120C24 100%)",
    "effect": "shooting_stars"
  },
  {
    "id": "nebula",
    "name": "Nebula",
    "emoji": "💜",
    "tier": "free",
    "price": 0,
    "description": "Space Collection theme - Nebula",
    "categories": [
      "Space"
    ],
    "tags": [
      "space",
      "nebula"
    ],
    "bgColor": "#09011A",
    "textColor": "#F3E5F5",
    "btnBg": "rgba(255,255,255,0.07)",
    "btnBorder": "#F3E5F522",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #09011A 0%, #3D0A5A 50%, #15022D 100%)",
    "effect": "fireflies"
  },
  {
    "id": "deep_space",
    "name": "Deep Space",
    "emoji": "🌠",
    "tier": "free",
    "price": 0,
    "description": "Space Collection theme - Deep Space",
    "categories": [
      "Space"
    ],
    "tags": [
      "space",
      "deep_space"
    ],
    "bgColor": "#020205",
    "textColor": "#ECEFF1",
    "btnBg": "#101020",
    "btnBorder": "#ECEFF122",
    "btnStyle": "rounded-xl",
    "effect": "shooting_stars"
  },
  {
    "id": "black_hole",
    "name": "Black Hole",
    "emoji": "⚫",
    "tier": "free",
    "price": 0,
    "description": "Space Collection theme - Black Hole",
    "categories": [
      "Space"
    ],
    "tags": [
      "space",
      "black_hole"
    ],
    "bgColor": "#000000",
    "textColor": "#808080",
    "btnBg": "#121212",
    "btnBorder": "#80808022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "cosmic_dust",
    "name": "Cosmic Dust",
    "emoji": "✨",
    "tier": "free",
    "price": 0,
    "description": "Space Collection theme - Cosmic Dust",
    "categories": [
      "Space"
    ],
    "tags": [
      "space",
      "cosmic_dust"
    ],
    "bgColor": "#0C0F1D",
    "textColor": "#FFD54F",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#FFD54F22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(180deg, #0C0F1D 0%, #1A237E 100%)"
  },
  {
    "id": "meteor_shower",
    "name": "Meteor Shower",
    "emoji": "☄️",
    "tier": "free",
    "price": 0,
    "description": "Space Collection theme - Meteor Shower",
    "categories": [
      "Space"
    ],
    "tags": [
      "space",
      "meteor_shower"
    ],
    "bgColor": "#05070F",
    "textColor": "#90CAF9",
    "btnBg": "rgba(255,255,255,0.05)",
    "btnBorder": "#90CAF922",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #05070F 0%, #0F172A 100%)",
    "effect": "shooting_stars"
  },
  {
    "id": "saturn_rings",
    "name": "Saturn Rings",
    "emoji": "🪐",
    "tier": "free",
    "price": 0,
    "description": "Space Collection theme - Saturn Rings",
    "categories": [
      "Space"
    ],
    "tags": [
      "space",
      "saturn_rings"
    ],
    "bgColor": "#121118",
    "textColor": "#D7CCC8",
    "btnBg": "#2E2D38",
    "btnBorder": "#D7CCC822",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "mars_red",
    "name": "Mars Red",
    "emoji": "🔴",
    "tier": "free",
    "price": 0,
    "description": "Space Collection theme - Mars Red",
    "categories": [
      "Space"
    ],
    "tags": [
      "space",
      "mars_red"
    ],
    "bgColor": "#2E0B0B",
    "textColor": "#FF7043",
    "btnBg": "#421616",
    "btnBorder": "#FF704322",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "blue_planet",
    "name": "Blue Planet",
    "emoji": "🌍",
    "tier": "free",
    "price": 0,
    "description": "Space Collection theme - Blue Planet",
    "categories": [
      "Space"
    ],
    "tags": [
      "space",
      "blue_planet"
    ],
    "bgColor": "#0D47A1",
    "textColor": "#BBDEFB",
    "btnBg": "rgba(255,255,255,0.1)",
    "btnBorder": "#BBDEFB22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #0D47A1 0%, #002171 100%)"
  },
  {
    "id": "moon_surface",
    "name": "Moon Surface",
    "emoji": "🌙",
    "tier": "free",
    "price": 0,
    "description": "Space Collection theme - Moon Surface",
    "categories": [
      "Space"
    ],
    "tags": [
      "space",
      "moon_surface"
    ],
    "bgColor": "#212121",
    "textColor": "#E0E0E0",
    "btnBg": "#333333",
    "btnBorder": "#E0E0E022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "supernova",
    "name": "Supernova",
    "emoji": "💥",
    "tier": "free",
    "price": 0,
    "description": "Space Collection theme - Supernova",
    "categories": [
      "Space"
    ],
    "tags": [
      "space",
      "supernova"
    ],
    "bgColor": "#2D006B",
    "textColor": "#FFFFFF",
    "btnBg": "rgba(0,0,0,0.15)",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #2D006B 0%, #E040FB 60%, #FF5722 100%)",
    "effect": "shooting_stars"
  },
  {
    "id": "universe_glow",
    "name": "Universe Glow",
    "emoji": "✨",
    "tier": "free",
    "price": 0,
    "description": "Space Collection theme - Universe Glow",
    "categories": [
      "Space"
    ],
    "tags": [
      "space",
      "universe_glow"
    ],
    "bgColor": "#060B1E",
    "textColor": "#80DEEA",
    "btnBg": "rgba(255,255,255,0.06)",
    "btnBorder": "#80DEEA22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(180deg, #060B1E 0%, #000000 100%)"
  },
  {
    "id": "alien_world",
    "name": "Alien World",
    "emoji": "👽",
    "tier": "free",
    "price": 0,
    "description": "Space Collection theme - Alien World",
    "categories": [
      "Space"
    ],
    "tags": [
      "space",
      "alien_world"
    ],
    "bgColor": "#091C0E",
    "textColor": "#69F0AE",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#69F0AE22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #091C0E 0%, #1A522C 100%)"
  },
  {
    "id": "eclipse",
    "name": "Eclipse",
    "emoji": "🌑",
    "tier": "free",
    "price": 0,
    "description": "Space Collection theme - Eclipse",
    "categories": [
      "Space"
    ],
    "tags": [
      "space",
      "eclipse"
    ],
    "bgColor": "#030303",
    "textColor": "#FFFFFF",
    "btnBg": "#1A1A1A",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "aurora_borealis",
    "name": "Aurora Borealis",
    "emoji": "🌈",
    "tier": "free",
    "price": 0,
    "description": "Space Collection theme - Aurora Borealis",
    "categories": [
      "Space"
    ],
    "tags": [
      "space",
      "aurora_borealis"
    ],
    "bgColor": "#0B132B",
    "textColor": "#E0F2FE",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#E0F2FE22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(180deg, #0B132B 0%, #1C2541 40%, #1B5E20 100%)",
    "effect": "fireflies"
  },
  {
    "id": "glass_white",
    "name": "Glass White",
    "emoji": "💎",
    "tier": "free",
    "price": 0,
    "description": "Glass & Modern theme - Glass White",
    "categories": [
      "Glass"
    ],
    "tags": [
      "glass",
      "glass_white"
    ],
    "bgColor": "#F3F4F6",
    "textColor": "#1F2937",
    "btnBg": "rgba(255,255,255,0.65)",
    "btnBorder": "#1F293722",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)"
  },
  {
    "id": "glass_black",
    "name": "Glass Black",
    "emoji": "💎",
    "tier": "free",
    "price": 0,
    "description": "Glass & Modern theme - Glass Black",
    "categories": [
      "Glass"
    ],
    "tags": [
      "glass",
      "glass_black"
    ],
    "bgColor": "#111827",
    "textColor": "#F3F4F6",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#F3F4F622",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #111827 0%, #030712 100%)"
  },
  {
    "id": "frost_glass",
    "name": "Frost Glass",
    "emoji": "❄️",
    "tier": "free",
    "price": 0,
    "description": "Glass & Modern theme - Frost Glass",
    "categories": [
      "Glass"
    ],
    "tags": [
      "glass",
      "frost_glass"
    ],
    "bgColor": "#E0F2FE",
    "textColor": "#0369A1",
    "btnBg": "rgba(255,255,255,0.5)",
    "btnBorder": "#0369A122",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)"
  },
  {
    "id": "liquid_glass",
    "name": "Liquid Glass",
    "emoji": "💧",
    "tier": "free",
    "price": 0,
    "description": "Glass & Modern theme - Liquid Glass",
    "categories": [
      "Glass"
    ],
    "tags": [
      "glass",
      "liquid_glass"
    ],
    "bgColor": "#EEF2FF",
    "textColor": "#4338CA",
    "btnBg": "rgba(255,255,255,0.7)",
    "btnBorder": "#4338CA22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)"
  },
  {
    "id": "windows_glass",
    "name": "Windows Glass",
    "emoji": "🪟",
    "tier": "free",
    "price": 0,
    "description": "Glass & Modern theme - Windows Glass",
    "categories": [
      "Glass"
    ],
    "tags": [
      "glass",
      "windows_glass"
    ],
    "bgColor": "#EBEFFE",
    "textColor": "#1E3A8A",
    "btnBg": "rgba(255,255,255,0.5)",
    "btnBorder": "#1E3A8A22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #EBEFFE 0%, #C4D3FC 100%)"
  },
  {
    "id": "apple_frost",
    "name": "Apple Frost",
    "emoji": "🍎",
    "tier": "free",
    "price": 0,
    "description": "Glass & Modern theme - Apple Frost",
    "categories": [
      "Glass"
    ],
    "tags": [
      "glass",
      "apple_frost"
    ],
    "bgColor": "#FAFAFA",
    "textColor": "#111111",
    "btnBg": "rgba(255,255,255,0.85)",
    "btnBorder": "#11111122",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "crystal_blue",
    "name": "Crystal Blue",
    "emoji": "💎",
    "tier": "free",
    "price": 0,
    "description": "Glass & Modern theme - Crystal Blue",
    "categories": [
      "Glass"
    ],
    "tags": [
      "glass",
      "crystal_blue"
    ],
    "bgColor": "#F0F9FF",
    "textColor": "#0284C7",
    "btnBg": "rgba(255,255,255,0.75)",
    "btnBorder": "#0284C722",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)"
  },
  {
    "id": "ice_crystal",
    "name": "Ice Crystal",
    "emoji": "❄️",
    "tier": "free",
    "price": 0,
    "description": "Glass & Modern theme - Ice Crystal",
    "categories": [
      "Glass"
    ],
    "tags": [
      "glass",
      "ice_crystal"
    ],
    "bgColor": "#F8FAFC",
    "textColor": "#334155",
    "btnBg": "rgba(255,255,255,0.9)",
    "btnBorder": "#33415522",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "liquid_neon",
    "name": "Liquid Neon",
    "emoji": "🧪",
    "tier": "free",
    "price": 0,
    "description": "Glass & Modern theme - Liquid Neon",
    "categories": [
      "Glass"
    ],
    "tags": [
      "glass",
      "liquid_neon"
    ],
    "bgColor": "#0A0E1A",
    "textColor": "#39FF14",
    "btnBg": "rgba(255,255,255,0.06)",
    "btnBorder": "#39FF1422",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "minimal_white",
    "name": "Minimal White",
    "emoji": "⚪",
    "tier": "free",
    "price": 0,
    "description": "Glass & Modern theme - Minimal White",
    "categories": [
      "Glass"
    ],
    "tags": [
      "glass",
      "minimal_white"
    ],
    "bgColor": "#FFFFFF",
    "textColor": "#000000",
    "btnBg": "#F3F4F6",
    "btnBorder": "#00000022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "material_design",
    "name": "Material Design",
    "emoji": "🎨",
    "tier": "free",
    "price": 0,
    "description": "Glass & Modern theme - Material Design",
    "categories": [
      "Glass"
    ],
    "tags": [
      "glass",
      "material_design"
    ],
    "bgColor": "#EEEEEE",
    "textColor": "#212121",
    "btnBg": "#FFFFFF",
    "btnBorder": "#21212122",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "soft_ui",
    "name": "Soft UI",
    "emoji": "📱",
    "tier": "free",
    "price": 0,
    "description": "Glass & Modern theme - Soft UI",
    "categories": [
      "Glass"
    ],
    "tags": [
      "glass",
      "soft_ui"
    ],
    "bgColor": "#E0E0E0",
    "textColor": "#424242",
    "btnBg": "#EEEEEE",
    "btnBorder": "#42424222",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "frosted_purple",
    "name": "Frosted Purple",
    "emoji": "💜",
    "tier": "free",
    "price": 0,
    "description": "Glass & Modern theme - Frosted Purple",
    "categories": [
      "Glass"
    ],
    "tags": [
      "glass",
      "frosted_purple"
    ],
    "bgColor": "#FAF5FF",
    "textColor": "#7E22CE",
    "btnBg": "rgba(255,255,255,0.7)",
    "btnBorder": "#7E22CE22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)"
  },
  {
    "id": "transparent_dark",
    "name": "Transparent Dark",
    "emoji": "⚫",
    "tier": "free",
    "price": 0,
    "description": "Glass & Modern theme - Transparent Dark",
    "categories": [
      "Glass"
    ],
    "tags": [
      "glass",
      "transparent_dark"
    ],
    "bgColor": "#0E131F",
    "textColor": "#94A3B8",
    "btnBg": "rgba(255,255,255,0.05)",
    "btnBorder": "#94A3B822",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "elegant_glass",
    "name": "Elegant Glass",
    "emoji": "💎",
    "tier": "free",
    "price": 0,
    "description": "Glass & Modern theme - Elegant Glass",
    "categories": [
      "Glass"
    ],
    "tags": [
      "glass",
      "elegant_glass"
    ],
    "bgColor": "#1C1917",
    "textColor": "#E7E5E4",
    "btnBg": "rgba(255,255,255,0.06)",
    "btnBorder": "#E7E5E422",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #1C1917 0%, #0C0A09 100%)"
  },
  {
    "id": "vs_code",
    "name": "VS Code",
    "emoji": "💻",
    "tier": "free",
    "price": 0,
    "description": "Developer Collection theme - VS Code",
    "categories": [
      "Developer"
    ],
    "tags": [
      "developer",
      "vs_code"
    ],
    "bgColor": "#1E1E1E",
    "textColor": "#D4D4D4",
    "btnBg": "#252526",
    "btnBorder": "#D4D4D422",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "github_dark",
    "name": "GitHub Dark",
    "emoji": "💻",
    "tier": "free",
    "price": 0,
    "description": "Developer Collection theme - GitHub Dark",
    "categories": [
      "Developer"
    ],
    "tags": [
      "developer",
      "github_dark"
    ],
    "bgColor": "#0D1117",
    "textColor": "#C9D1D9",
    "btnBg": "#161B22",
    "btnBorder": "#C9D1D922",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "github_light",
    "name": "GitHub Light",
    "emoji": "💻",
    "tier": "free",
    "price": 0,
    "description": "Developer Collection theme - GitHub Light",
    "categories": [
      "Developer"
    ],
    "tags": [
      "developer",
      "github_light"
    ],
    "bgColor": "#FFFFFF",
    "textColor": "#24292F",
    "btnBg": "#F6F8FA",
    "btnBorder": "#24292F22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "hacker_green",
    "name": "Hacker Green",
    "emoji": "💻",
    "tier": "free",
    "price": 0,
    "description": "Developer Collection theme - Hacker Green",
    "categories": [
      "Developer"
    ],
    "tags": [
      "developer",
      "hacker_green"
    ],
    "bgColor": "#000000",
    "textColor": "#00FF00",
    "btnBg": "#051105",
    "btnBorder": "#00FF0022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "matrix",
    "name": "Matrix",
    "emoji": "💻",
    "tier": "free",
    "price": 0,
    "description": "Developer Collection theme - Matrix",
    "categories": [
      "Developer"
    ],
    "tags": [
      "developer",
      "matrix"
    ],
    "bgColor": "#020202",
    "textColor": "#00FF41",
    "btnBg": "#0A0A0A",
    "btnBorder": "#00FF4122",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "terminal",
    "name": "Terminal",
    "emoji": "💻",
    "tier": "free",
    "price": 0,
    "description": "Developer Collection theme - Terminal",
    "categories": [
      "Developer"
    ],
    "tags": [
      "developer",
      "terminal"
    ],
    "bgColor": "#151515",
    "textColor": "#FFFFFF",
    "btnBg": "#222222",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "monokai",
    "name": "Monokai",
    "emoji": "💻",
    "tier": "free",
    "price": 0,
    "description": "Developer Collection theme - Monokai",
    "categories": [
      "Developer"
    ],
    "tags": [
      "developer",
      "monokai"
    ],
    "bgColor": "#272822",
    "textColor": "#F8F8F2",
    "btnBg": "#3E3D32",
    "btnBorder": "#F8F8F222",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "dracula",
    "name": "Dracula",
    "emoji": "💻",
    "tier": "free",
    "price": 0,
    "description": "Developer Collection theme - Dracula",
    "categories": [
      "Developer"
    ],
    "tags": [
      "developer",
      "dracula"
    ],
    "bgColor": "#282A36",
    "textColor": "#F8F8F2",
    "btnBg": "#44475A",
    "btnBorder": "#F8F8F222",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "nord",
    "name": "Nord",
    "emoji": "💻",
    "tier": "free",
    "price": 0,
    "description": "Developer Collection theme - Nord",
    "categories": [
      "Developer"
    ],
    "tags": [
      "developer",
      "nord"
    ],
    "bgColor": "#2E3440",
    "textColor": "#D8DEE9",
    "btnBg": "#3B4252",
    "btnBorder": "#D8DEE922",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "solarized_dark",
    "name": "Solarized Dark",
    "emoji": "💻",
    "tier": "free",
    "price": 0,
    "description": "Developer Collection theme - Solarized Dark",
    "categories": [
      "Developer"
    ],
    "tags": [
      "developer",
      "solarized_dark"
    ],
    "bgColor": "#002B36",
    "textColor": "#839496",
    "btnBg": "#073642",
    "btnBorder": "#83949622",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "solarized_light",
    "name": "Solarized Light",
    "emoji": "💻",
    "tier": "free",
    "price": 0,
    "description": "Developer Collection theme - Solarized Light",
    "categories": [
      "Developer"
    ],
    "tags": [
      "developer",
      "solarized_light"
    ],
    "bgColor": "#FDF6E3",
    "textColor": "#657B83",
    "btnBg": "#EEE8D5",
    "btnBorder": "#657B8322",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "atom_one_dark",
    "name": "Atom One Dark",
    "emoji": "💻",
    "tier": "free",
    "price": 0,
    "description": "Developer Collection theme - Atom One Dark",
    "categories": [
      "Developer"
    ],
    "tags": [
      "developer",
      "atom_one_dark"
    ],
    "bgColor": "#282C34",
    "textColor": "#ABB2BF",
    "btnBg": "#21252B",
    "btnBorder": "#ABB2BF22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "catppuccin",
    "name": "Catppuccin",
    "emoji": "🐱",
    "tier": "free",
    "price": 0,
    "description": "Developer Collection theme - Catppuccin",
    "categories": [
      "Developer"
    ],
    "tags": [
      "developer",
      "catppuccin"
    ],
    "bgColor": "#1E1E2E",
    "textColor": "#CDD6F4",
    "btnBg": "#313244",
    "btnBorder": "#CDD6F422",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "tokyo_night_ide",
    "name": "Tokyo Night IDE",
    "emoji": "💻",
    "tier": "free",
    "price": 0,
    "description": "Developer Collection theme - Tokyo Night IDE",
    "categories": [
      "Developer"
    ],
    "tags": [
      "developer",
      "tokyo_night_ide"
    ],
    "bgColor": "#1A1B26",
    "textColor": "#A9B1D6",
    "btnBg": "#24283B",
    "btnBorder": "#A9B1D622",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "gruvbox",
    "name": "Gruvbox",
    "emoji": "💻",
    "tier": "free",
    "price": 0,
    "description": "Developer Collection theme - Gruvbox",
    "categories": [
      "Developer"
    ],
    "tags": [
      "developer",
      "gruvbox"
    ],
    "bgColor": "#282828",
    "textColor": "#EBDBB2",
    "btnBg": "#3C3836",
    "btnBorder": "#EBDBB222",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "sunset_orange",
    "name": "Sunset Orange",
    "emoji": "🌅",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Sunset Orange",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "sunset_orange"
    ],
    "bgColor": "#FF512F",
    "textColor": "#FFFFFF",
    "btnBg": "rgba(255,255,255,0.15)",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)"
  },
  {
    "id": "purple_dream",
    "name": "Purple Dream",
    "emoji": "💜",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Purple Dream",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "purple_dream"
    ],
    "bgColor": "#7F00FF",
    "textColor": "#FFFFFF",
    "btnBg": "rgba(255,255,255,0.15)",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)"
  },
  {
    "id": "ocean_blue",
    "name": "Ocean Blue",
    "emoji": "🌊",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Ocean Blue",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "ocean_blue"
    ],
    "bgColor": "#2193b0",
    "textColor": "#0F172A",
    "btnBg": "rgba(255,255,255,0.4)",
    "btnBorder": "#0F172A22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)"
  },
  {
    "id": "aqua_mint",
    "name": "Aqua Mint",
    "emoji": "🍃",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Aqua Mint",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "aqua_mint"
    ],
    "bgColor": "#11998e",
    "textColor": "#052E16",
    "btnBg": "rgba(255,255,255,0.3)",
    "btnBorder": "#052E1622",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
  },
  {
    "id": "candy_gradient",
    "name": "Candy Gradient",
    "emoji": "🍬",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Candy Gradient",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "candy_gradient"
    ],
    "bgColor": "#ee9ca7",
    "textColor": "#9C1C3A",
    "btnBg": "rgba(255,255,255,0.5)",
    "btnBorder": "#9C1C3A22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)"
  },
  {
    "id": "royal_purple",
    "name": "Royal Purple",
    "emoji": "👑",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Royal Purple",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "royal_purple"
    ],
    "bgColor": "#1A0B2E",
    "textColor": "#F3E8FF",
    "btnBg": "rgba(255,255,255,0.1)",
    "btnBorder": "#F3E8FF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #1A0B2E 0%, #632B9B 100%)"
  },
  {
    "id": "emerald_sea",
    "name": "Emerald Sea",
    "emoji": "🌲",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Emerald Sea",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "emerald_sea"
    ],
    "bgColor": "#022F1D",
    "textColor": "#E0F2FE",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#E0F2FE22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #022F1D 0%, #0575E6 100%)"
  },
  {
    "id": "tropical_beach",
    "name": "Tropical Beach",
    "emoji": "🏖",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Tropical Beach",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "tropical_beach"
    ],
    "bgColor": "#FFAFBD",
    "textColor": "#7C2D12",
    "btnBg": "rgba(255,255,255,0.6)",
    "btnBorder": "#7C2D1222",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #FFAFBD 0%, #ffc3a0 100%)"
  },
  {
    "id": "rainbow_sky",
    "name": "Rainbow Sky",
    "emoji": "🌈",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Rainbow Sky",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "rainbow_sky"
    ],
    "bgColor": "#F9A8D4",
    "textColor": "#1E293B",
    "btnBg": "rgba(255,255,255,0.4)",
    "btnBorder": "#1E293B22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(180deg, #F9A8D4 0%, #FDE047 50%, #93C5FD 100%)"
  },
  {
    "id": "peach_sunset",
    "name": "Peach Sunset",
    "emoji": "🍑",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Peach Sunset",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "peach_sunset"
    ],
    "bgColor": "#ED6EA0",
    "textColor": "#FAF0F5",
    "btnBg": "rgba(255,255,255,0.18)",
    "btnBorder": "#FAF0F522",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #ED6EA0 0%, #F78FAD 100%)"
  },
  {
    "id": "neon_pink",
    "name": "Neon Pink",
    "emoji": "💗",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Neon Pink",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "neon_pink"
    ],
    "bgColor": "#FF007F",
    "textColor": "#FFFFFF",
    "btnBg": "rgba(255,255,255,0.15)",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #FF007F 0%, #7F00FF 100%)"
  },
  {
    "id": "sky_lavender",
    "name": "Sky Lavender",
    "emoji": "☁️",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Sky Lavender",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "sky_lavender"
    ],
    "bgColor": "#C7D2FE",
    "textColor": "#4338CA",
    "btnBg": "rgba(255,255,255,0.6)",
    "btnBorder": "#4338CA22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #C7D2FE 0%, #F3E8FF 100%)"
  },
  {
    "id": "golden_hour",
    "name": "Golden Hour",
    "emoji": "☀️",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Golden Hour",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "golden_hour"
    ],
    "bgColor": "#FCE38A",
    "textColor": "#2A0808",
    "btnBg": "rgba(255,255,255,0.4)",
    "btnBorder": "#2A080822",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #FCE38A 0%, #F38181 100%)"
  },
  {
    "id": "ocean_breeze",
    "name": "Ocean Breeze",
    "emoji": "🌊",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Ocean Breeze",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "ocean_breeze"
    ],
    "bgColor": "#00C9FF",
    "textColor": "#052E16",
    "btnBg": "rgba(255,255,255,0.3)",
    "btnBorder": "#052E1622",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)"
  },
  {
    "id": "frozen_ice",
    "name": "Frozen Ice",
    "emoji": "❄️",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Frozen Ice",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "frozen_ice"
    ],
    "bgColor": "#2980B9",
    "textColor": "#1E3A8A",
    "btnBg": "rgba(255,255,255,0.3)",
    "btnBorder": "#1E3A8A22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #2980B9 0%, #6DD5FA 50%, #FFFFFF 100%)"
  },
  {
    "id": "cotton_candy",
    "name": "Cotton Candy",
    "emoji": "🍬",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Cotton Candy",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "cotton_candy"
    ],
    "bgColor": "#A8C0FF",
    "textColor": "#F3E8FF",
    "btnBg": "rgba(255,255,255,0.1)",
    "btnBorder": "#F3E8FF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #A8C0FF 0%, #3F2B96 100%)"
  },
  {
    "id": "blue_fire",
    "name": "Blue Fire",
    "emoji": "🔥",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Blue Fire",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "blue_fire"
    ],
    "bgColor": "#000428",
    "textColor": "#E0F2FE",
    "btnBg": "rgba(255,255,255,0.1)",
    "btnBorder": "#E0F2FE22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #000428 0%, #004e92 100%)"
  },
  {
    "id": "purple_galaxy",
    "name": "Purple Galaxy",
    "emoji": "🌌",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Purple Galaxy",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "purple_galaxy"
    ],
    "bgColor": "#3A1C71",
    "textColor": "#FFFFFF",
    "btnBg": "rgba(255,255,255,0.15)",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)"
  },
  {
    "id": "dream_sky",
    "name": "Dream Sky",
    "emoji": "☁️",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Dream Sky",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "dream_sky"
    ],
    "bgColor": "#E0C3FC",
    "textColor": "#1E293B",
    "btnBg": "rgba(255,255,255,0.5)",
    "btnBorder": "#1E293B22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(180deg, #E0C3FC 0%, #8EC5FC 100%)"
  },
  {
    "id": "mint_candy",
    "name": "Mint Candy",
    "emoji": "🍬",
    "tier": "free",
    "price": 0,
    "description": "Gradient Collection theme - Mint Candy",
    "categories": [
      "Gradient"
    ],
    "tags": [
      "gradient",
      "mint_candy"
    ],
    "bgColor": "#BFF0D4",
    "textColor": "#064E3B",
    "btnBg": "rgba(255,255,255,0.6)",
    "btnBorder": "#064E3B22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #BFF0D4 0%, #ECEBC5 100%)"
  },
  {
    "id": "spring_garden",
    "name": "Spring Garden",
    "emoji": "🌸",
    "tier": "free",
    "price": 0,
    "description": "Seasonal Collection theme - Spring Garden",
    "categories": [
      "Seasonal"
    ],
    "tags": [
      "seasonal",
      "spring_garden"
    ],
    "bgColor": "#FFF0F5",
    "textColor": "#2E7D32",
    "btnBg": "#E8F5E9",
    "btnBorder": "#2E7D3222",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #FFF0F5 0%, #E8F5E9 100%)",
    "effect": "sakura"
  },
  {
    "id": "summer_beach",
    "name": "Summer Beach",
    "emoji": "🏖",
    "tier": "free",
    "price": 0,
    "description": "Seasonal Collection theme - Summer Beach",
    "categories": [
      "Seasonal"
    ],
    "tags": [
      "seasonal",
      "summer_beach"
    ],
    "bgColor": "#FFE082",
    "textColor": "#0D47A1",
    "btnBg": "rgba(255,255,255,0.5)",
    "btnBorder": "#0D47A122",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(180deg, #FFE082 0%, #81D4FA 100%)",
    "effect": "clouds"
  },
  {
    "id": "monsoon_rain",
    "name": "Monsoon Rain",
    "emoji": "🌧",
    "tier": "free",
    "price": 0,
    "description": "Seasonal Collection theme - Monsoon Rain",
    "categories": [
      "Seasonal"
    ],
    "tags": [
      "seasonal",
      "monsoon_rain"
    ],
    "bgColor": "#B0BEC5",
    "textColor": "#263238",
    "btnBg": "#CFD8DC",
    "btnBorder": "#26323822",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(180deg, #B0BEC5 0%, #78909C 100%)",
    "effect": "rain"
  },
  {
    "id": "autumn_forest",
    "name": "Autumn Forest",
    "emoji": "🍁",
    "tier": "free",
    "price": 0,
    "description": "Seasonal Collection theme - Autumn Forest",
    "categories": [
      "Seasonal"
    ],
    "tags": [
      "seasonal",
      "autumn_forest"
    ],
    "bgColor": "#FFE0B2",
    "textColor": "#5D4037",
    "btnBg": "#FFE0B2",
    "btnBorder": "#5D403722",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #FFE0B2 0%, #D84315 100%)",
    "effect": "autumn"
  },
  {
    "id": "winter_snow",
    "name": "Winter Snow",
    "emoji": "❄️",
    "tier": "free",
    "price": 0,
    "description": "Seasonal Collection theme - Winter Snow",
    "categories": [
      "Seasonal"
    ],
    "tags": [
      "seasonal",
      "winter_snow"
    ],
    "bgColor": "#ECEFF1",
    "textColor": "#37474F",
    "btnBg": "#FFFFFF",
    "btnBorder": "#37474F22",
    "btnStyle": "rounded-xl",
    "effect": "winter"
  },
  {
    "id": "christmas",
    "name": "Christmas",
    "emoji": "🎄",
    "tier": "free",
    "price": 0,
    "description": "Seasonal Collection theme - Christmas",
    "categories": [
      "Seasonal"
    ],
    "tags": [
      "seasonal",
      "christmas"
    ],
    "bgColor": "#1B5E20",
    "textColor": "#FFFFFF",
    "btnBg": "rgba(255,255,255,0.1)",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #1B5E20 0%, #B71C1C 100%)"
  },
  {
    "id": "halloween",
    "name": "Halloween",
    "emoji": "🎃",
    "tier": "free",
    "price": 0,
    "description": "Seasonal Collection theme - Halloween",
    "categories": [
      "Seasonal"
    ],
    "tags": [
      "seasonal",
      "halloween"
    ],
    "bgColor": "#0A0500",
    "textColor": "#E65100",
    "btnBg": "#1A0E00",
    "btnBorder": "#E6510022",
    "btnStyle": "rounded-xl",
    "effect": "fireflies"
  },
  {
    "id": "new_year",
    "name": "New Year",
    "emoji": "🎆",
    "tier": "free",
    "price": 0,
    "description": "Seasonal Collection theme - New Year",
    "categories": [
      "Seasonal"
    ],
    "tags": [
      "seasonal",
      "new_year"
    ],
    "bgColor": "#00021A",
    "textColor": "#FFD700",
    "btnBg": "rgba(255,255,255,0.06)",
    "btnBorder": "#FFD70022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "holi_festival",
    "name": "Holi Festival",
    "emoji": "🌈",
    "tier": "free",
    "price": 0,
    "description": "Seasonal Collection theme - Holi Festival",
    "categories": [
      "Seasonal"
    ],
    "tags": [
      "seasonal",
      "holi_festival"
    ],
    "bgColor": "#FF4081",
    "textColor": "#FFFFFF",
    "btnBg": "rgba(0,0,0,0.15)",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #FF4081 0%, #00E676 50%, #2979FF 100%)"
  },
  {
    "id": "diwali_lights",
    "name": "Diwali Lights",
    "emoji": "🪔",
    "tier": "free",
    "price": 0,
    "description": "Seasonal Collection theme - Diwali Lights",
    "categories": [
      "Seasonal"
    ],
    "tags": [
      "seasonal",
      "diwali_lights"
    ],
    "bgColor": "#0E0900",
    "textColor": "#FFAB00",
    "btnBg": "#1C1300",
    "btnBorder": "#FFAB0022",
    "btnStyle": "rounded-xl",
    "effect": "fireflies"
  },
  {
    "id": "tanabata",
    "name": "Tanabata",
    "emoji": "🎋",
    "tier": "free",
    "price": 0,
    "description": "Seasonal Collection theme - Tanabata",
    "categories": [
      "Seasonal"
    ],
    "tags": [
      "seasonal",
      "tanabata"
    ],
    "bgColor": "#E0F2F1",
    "textColor": "#004D40",
    "btnBg": "#B2DFDB",
    "btnBorder": "#004D4022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "cherry_festival",
    "name": "Cherry Festival",
    "emoji": "🌸",
    "tier": "free",
    "price": 0,
    "description": "Seasonal Collection theme - Cherry Festival",
    "categories": [
      "Seasonal"
    ],
    "tags": [
      "seasonal",
      "cherry_festival"
    ],
    "bgColor": "#FFF3F3",
    "textColor": "#C2185B",
    "btnBg": "#FFEBEE",
    "btnBorder": "#C2185B22",
    "btnStyle": "rounded-xl",
    "effect": "sakura"
  },
  {
    "id": "japan",
    "name": "Japan",
    "emoji": "🇯🇵",
    "tier": "free",
    "price": 0,
    "description": "Country Collection theme - Japan",
    "categories": [
      "Country"
    ],
    "tags": [
      "country",
      "japan"
    ],
    "bgColor": "#FFFFFF",
    "textColor": "#BC002D",
    "btnBg": "#F5F5F5",
    "btnBorder": "#BC002D22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "korea",
    "name": "Korea",
    "emoji": "🇰🇷",
    "tier": "free",
    "price": 0,
    "description": "Country Collection theme - Korea",
    "categories": [
      "Country"
    ],
    "tags": [
      "country",
      "korea"
    ],
    "bgColor": "#FFFFFF",
    "textColor": "#0A2540",
    "btnBg": "#FFFFFF",
    "btnBorder": "#0A254022",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #FFFFFF 0%, #E8EFFF 100%)"
  },
  {
    "id": "china",
    "name": "China",
    "emoji": "🇨🇳",
    "tier": "free",
    "price": 0,
    "description": "Country Collection theme - China",
    "categories": [
      "Country"
    ],
    "tags": [
      "country",
      "china"
    ],
    "bgColor": "#DE2910",
    "textColor": "#FFDE00",
    "btnBg": "#B8200B",
    "btnBorder": "#FFDE0022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "india",
    "name": "India",
    "emoji": "🇮🇳",
    "tier": "free",
    "price": 0,
    "description": "Country Collection theme - India",
    "categories": [
      "Country"
    ],
    "tags": [
      "country",
      "india"
    ],
    "bgColor": "#FF9933",
    "textColor": "#000088",
    "btnBg": "rgba(255,255,255,0.7)",
    "btnBorder": "#00008822",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(180deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)"
  },
  {
    "id": "france",
    "name": "France",
    "emoji": "🇫🇷",
    "tier": "free",
    "price": 0,
    "description": "Country Collection theme - France",
    "categories": [
      "Country"
    ],
    "tags": [
      "country",
      "france"
    ],
    "bgColor": "#0055A5",
    "textColor": "#0A0A0A",
    "btnBg": "rgba(255,255,255,0.7)",
    "btnBorder": "#0A0A0A22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(90deg, #0055A5 0%, #FFFFFF 50%, #EF4135 100%)"
  },
  {
    "id": "italy",
    "name": "Italy",
    "emoji": "🇮🇹",
    "tier": "free",
    "price": 0,
    "description": "Country Collection theme - Italy",
    "categories": [
      "Country"
    ],
    "tags": [
      "country",
      "italy"
    ],
    "bgColor": "#009246",
    "textColor": "#111111",
    "btnBg": "rgba(255,255,255,0.7)",
    "btnBorder": "#11111122",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(90deg, #009246 0%, #FFFFFF 50%, #CE2B37 100%)"
  },
  {
    "id": "greece",
    "name": "Greece",
    "emoji": "🇬🇷",
    "tier": "free",
    "price": 0,
    "description": "Country Collection theme - Greece",
    "categories": [
      "Country"
    ],
    "tags": [
      "country",
      "greece"
    ],
    "bgColor": "#0D5EAF",
    "textColor": "#0D5EAF",
    "btnBg": "#FFFFFF",
    "btnBorder": "#0D5EAF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #0D5EAF 0%, #FFFFFF 100%)"
  },
  {
    "id": "iceland",
    "name": "Iceland",
    "emoji": "🇮🇸",
    "tier": "free",
    "price": 0,
    "description": "Country Collection theme - Iceland",
    "categories": [
      "Country"
    ],
    "tags": [
      "country",
      "iceland"
    ],
    "bgColor": "#003897",
    "textColor": "#FFFFFF",
    "btnBg": "#D7282F",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "norway",
    "name": "Norway",
    "emoji": "🇳🇴",
    "tier": "free",
    "price": 0,
    "description": "Country Collection theme - Norway",
    "categories": [
      "Country"
    ],
    "tags": [
      "country",
      "norway"
    ],
    "bgColor": "#EF2B2D",
    "textColor": "#FFFFFF",
    "btnBg": "#002868",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "switzerland",
    "name": "Switzerland",
    "emoji": "🇨🇭",
    "tier": "free",
    "price": 0,
    "description": "Country Collection theme - Switzerland",
    "categories": [
      "Country"
    ],
    "tags": [
      "country",
      "switzerland"
    ],
    "bgColor": "#D52B1E",
    "textColor": "#FFFFFF",
    "btnBg": "#A31E14",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "dubai",
    "name": "Dubai",
    "emoji": "🇦🇪",
    "tier": "free",
    "price": 0,
    "description": "Country Collection theme - Dubai",
    "categories": [
      "Country"
    ],
    "tags": [
      "country",
      "dubai"
    ],
    "bgColor": "#F9F6F0",
    "textColor": "#3E2723",
    "btnBg": "#FFFFFF",
    "btnBorder": "#3E272322",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #F9F6F0 0%, #D4AF37 100%)"
  },
  {
    "id": "singapore",
    "name": "Singapore",
    "emoji": "🇸🇬",
    "tier": "free",
    "price": 0,
    "description": "Country Collection theme - Singapore",
    "categories": [
      "Country"
    ],
    "tags": [
      "country",
      "singapore"
    ],
    "bgColor": "#ED2939",
    "textColor": "#FFFFFF",
    "btnBg": "#B01824",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "thailand",
    "name": "Thailand",
    "emoji": "🇹🇭",
    "tier": "free",
    "price": 0,
    "description": "Country Collection theme - Thailand",
    "categories": [
      "Country"
    ],
    "tags": [
      "country",
      "thailand"
    ],
    "bgColor": "#A51931",
    "textColor": "#2D2C4D",
    "btnBg": "rgba(255,255,255,0.7)",
    "btnBorder": "#2D2C4D22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(180deg, #A51931 0%, #F4F5F8 30%, #2D2C4D 50%, #F4F5F8 70%, #A51931 100%)"
  },
  {
    "id": "brazil",
    "name": "Brazil",
    "emoji": "🇧🇷",
    "tier": "free",
    "price": 0,
    "description": "Country Collection theme - Brazil",
    "categories": [
      "Country"
    ],
    "tags": [
      "country",
      "brazil"
    ],
    "bgColor": "#009C3B",
    "textColor": "#002776",
    "btnBg": "rgba(255,255,255,0.3)",
    "btnBorder": "#00277622",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #009C3B 0%, #FFDF00 100%)"
  },
  {
    "id": "canada",
    "name": "Canada",
    "emoji": "🇨🇦",
    "tier": "free",
    "price": 0,
    "description": "Country Collection theme - Canada",
    "categories": [
      "Country"
    ],
    "tags": [
      "country",
      "canada"
    ],
    "bgColor": "#FF0000",
    "textColor": "#FF0000",
    "btnBg": "#FFFFFF",
    "btnBorder": "#FF000022",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(90deg, #FF0000 0%, #FFFFFF 35%, #FFFFFF 65%, #FF0000 100%)"
  },
  {
    "id": "ferrari",
    "name": "Ferrari",
    "emoji": "🏎️",
    "tier": "free",
    "price": 0,
    "description": "Vehicle Collection theme - Ferrari",
    "categories": [
      "Vehicle"
    ],
    "tags": [
      "vehicle",
      "ferrari"
    ],
    "bgColor": "#FF2800",
    "textColor": "#000000",
    "btnBg": "#FFEB00",
    "btnBorder": "#00000022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "lamborghini",
    "name": "Lamborghini",
    "emoji": "🚗",
    "tier": "free",
    "price": 0,
    "description": "Vehicle Collection theme - Lamborghini",
    "categories": [
      "Vehicle"
    ],
    "tags": [
      "vehicle",
      "lamborghini"
    ],
    "bgColor": "#0A0A0A",
    "textColor": "#D4AF37",
    "btnBg": "#1C1C1C",
    "btnBorder": "#D4AF3722",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "porsche",
    "name": "Porsche",
    "emoji": "🏎️",
    "tier": "free",
    "price": 0,
    "description": "Vehicle Collection theme - Porsche",
    "categories": [
      "Vehicle"
    ],
    "tags": [
      "vehicle",
      "porsche"
    ],
    "bgColor": "#D1D5DB",
    "textColor": "#111827",
    "btnBg": "#9CA3AF",
    "btnBorder": "#11182722",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "nissan_gtr",
    "name": "Nissan GTR",
    "emoji": "🚗",
    "tier": "free",
    "price": 0,
    "description": "Vehicle Collection theme - Nissan GTR",
    "categories": [
      "Vehicle"
    ],
    "tags": [
      "vehicle",
      "nissan_gtr"
    ],
    "bgColor": "#1F2937",
    "textColor": "#EF4444",
    "btnBg": "#374151",
    "btnBorder": "#EF444422",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #1F2937 0%, #111827 100%)"
  },
  {
    "id": "bmw_m",
    "name": "BMW M",
    "emoji": "🚗",
    "tier": "free",
    "price": 0,
    "description": "Vehicle Collection theme - BMW M",
    "categories": [
      "Vehicle"
    ],
    "tags": [
      "vehicle",
      "bmw_m"
    ],
    "bgColor": "#FFFFFF",
    "textColor": "#1E40AF",
    "btnBg": "#93C5FD",
    "btnBorder": "#1E40AF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 100%)"
  },
  {
    "id": "mercedes_amg",
    "name": "Mercedes AMG",
    "emoji": "🚗",
    "tier": "free",
    "price": 0,
    "description": "Vehicle Collection theme - Mercedes AMG",
    "categories": [
      "Vehicle"
    ],
    "tags": [
      "vehicle",
      "mercedes_amg"
    ],
    "bgColor": "#1A1A1A",
    "textColor": "#00E5FF",
    "btnBg": "#2D2D2D",
    "btnBorder": "#00E5FF22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "tesla",
    "name": "Tesla",
    "emoji": "🚗",
    "tier": "free",
    "price": 0,
    "description": "Vehicle Collection theme - Tesla",
    "categories": [
      "Vehicle"
    ],
    "tags": [
      "vehicle",
      "tesla"
    ],
    "bgColor": "#FAFAFA",
    "textColor": "#CC0000",
    "btnBg": "#EEEEEE",
    "btnBorder": "#CC000022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "mclaren",
    "name": "McLaren",
    "emoji": "🏎️",
    "tier": "free",
    "price": 0,
    "description": "Vehicle Collection theme - McLaren",
    "categories": [
      "Vehicle"
    ],
    "tags": [
      "vehicle",
      "mclaren"
    ],
    "bgColor": "#FF9800",
    "textColor": "#000000",
    "btnBg": "#212121",
    "btnBorder": "#00000022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "formula_one",
    "name": "Formula One",
    "emoji": "🏎️",
    "tier": "free",
    "price": 0,
    "description": "Vehicle Collection theme - Formula One",
    "categories": [
      "Vehicle"
    ],
    "tags": [
      "vehicle",
      "formula_one"
    ],
    "bgColor": "#111827",
    "textColor": "#EF4444",
    "btnBg": "#1F2937",
    "btnBorder": "#EF444422",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "cyber_truck",
    "name": "Cyber Truck",
    "emoji": "📐",
    "tier": "free",
    "price": 0,
    "description": "Vehicle Collection theme - Cyber Truck",
    "categories": [
      "Vehicle"
    ],
    "tags": [
      "vehicle",
      "cyber_truck"
    ],
    "bgColor": "#374151",
    "textColor": "#F3F4F6",
    "btnBg": "#1F2937",
    "btnBorder": "#F3F4F622",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #374151 0%, #4B5563 100%)"
  },
  {
    "id": "minecraft",
    "name": "Minecraft",
    "emoji": "🧱",
    "tier": "free",
    "price": 0,
    "description": "Gaming Collection theme - Minecraft",
    "categories": [
      "Gaming"
    ],
    "tags": [
      "gaming",
      "minecraft"
    ],
    "bgColor": "#4A7A3B",
    "textColor": "#FFFFFF",
    "btnBg": "#5B8731",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #4A7A3B 0%, #2E4E24 100%)"
  },
  {
    "id": "valorant",
    "name": "Valorant",
    "emoji": "🔫",
    "tier": "free",
    "price": 0,
    "description": "Gaming Collection theme - Valorant",
    "categories": [
      "Gaming"
    ],
    "tags": [
      "gaming",
      "valorant"
    ],
    "bgColor": "#0F1923",
    "textColor": "#FF4655",
    "btnBg": "#1F2A38",
    "btnBorder": "#FF465522",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "cs2",
    "name": "CS2",
    "emoji": "💣",
    "tier": "free",
    "price": 0,
    "description": "Gaming Collection theme - CS2",
    "categories": [
      "Gaming"
    ],
    "tags": [
      "gaming",
      "cs2"
    ],
    "bgColor": "#10151D",
    "textColor": "#DE9B35",
    "btnBg": "#171D28",
    "btnBorder": "#DE9B3522",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #10151D 0%, #202735 100%)"
  },
  {
    "id": "gta_vi",
    "name": "GTA VI",
    "emoji": "🌴",
    "tier": "free",
    "price": 0,
    "description": "Gaming Collection theme - GTA VI",
    "categories": [
      "Gaming"
    ],
    "tags": [
      "gaming",
      "gta_vi"
    ],
    "bgColor": "#F39C12",
    "textColor": "#00FFCC",
    "btnBg": "rgba(255,255,255,0.1)",
    "btnBorder": "#00FFCC22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #F39C12 0%, #9B59B6 100%)"
  },
  {
    "id": "pubg",
    "name": "PUBG",
    "emoji": "🍳",
    "tier": "free",
    "price": 0,
    "description": "Gaming Collection theme - PUBG",
    "categories": [
      "Gaming"
    ],
    "tags": [
      "gaming",
      "pubg"
    ],
    "bgColor": "#111",
    "textColor": "#F2A900",
    "btnBg": "#222",
    "btnBorder": "#F2A90022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "fortnite",
    "name": "Fortnite",
    "emoji": "🏝️",
    "tier": "free",
    "price": 0,
    "description": "Gaming Collection theme - Fortnite",
    "categories": [
      "Gaming"
    ],
    "tags": [
      "gaming",
      "fortnite"
    ],
    "bgColor": "#00A6FF",
    "textColor": "#FFFFFF",
    "btnBg": "rgba(0,0,0,0.15)",
    "btnBorder": "#FFFFFF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #00A6FF 0%, #FF00F0 100%)"
  },
  {
    "id": "elden_ring",
    "name": "Elden Ring",
    "emoji": "💍",
    "tier": "free",
    "price": 0,
    "description": "Gaming Collection theme - Elden Ring",
    "categories": [
      "Gaming"
    ],
    "tags": [
      "gaming",
      "elden_ring"
    ],
    "bgColor": "#0A0805",
    "textColor": "#E5C158",
    "btnBg": "rgba(255,255,255,0.06)",
    "btnBorder": "#E5C15822",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #0A0805 0%, #1A130A 100%)"
  },
  {
    "id": "zelda",
    "name": "Zelda",
    "emoji": "🛡️",
    "tier": "free",
    "price": 0,
    "description": "Gaming Collection theme - Zelda",
    "categories": [
      "Gaming"
    ],
    "tags": [
      "gaming",
      "zelda"
    ],
    "bgColor": "#0A2E20",
    "textColor": "#FFE082",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#FFE08222",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #0A2E20 0%, #104A36 100%)"
  },
  {
    "id": "cyberpunk_2077",
    "name": "Cyberpunk 2077",
    "emoji": "🦾",
    "tier": "free",
    "price": 0,
    "description": "Gaming Collection theme - Cyberpunk 2077",
    "categories": [
      "Gaming"
    ],
    "tags": [
      "gaming",
      "cyberpunk_2077"
    ],
    "bgColor": "#FCE300",
    "textColor": "#000000",
    "btnBg": "#00F0FF",
    "btnBorder": "#00000022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "league_of_legends",
    "name": "League of Legends",
    "emoji": "🏆",
    "tier": "free",
    "price": 0,
    "description": "Gaming Collection theme - League of Legends",
    "categories": [
      "Gaming"
    ],
    "tags": [
      "gaming",
      "league_of_legends"
    ],
    "bgColor": "#050E17",
    "textColor": "#C8AA6E",
    "btnBg": "#1E2F3F",
    "btnBorder": "#C8AA6E22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #050E17 0%, #0F2030 100%)"
  },
  {
    "id": "dota_2",
    "name": "Dota 2",
    "emoji": "🔥",
    "tier": "free",
    "price": 0,
    "description": "Gaming Collection theme - Dota 2",
    "categories": [
      "Gaming"
    ],
    "tags": [
      "gaming",
      "dota_2"
    ],
    "bgColor": "#100D0B",
    "textColor": "#E32626",
    "btnBg": "#1B1411",
    "btnBorder": "#E3262622",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "genshin",
    "name": "Genshin",
    "emoji": "✨",
    "tier": "free",
    "price": 0,
    "description": "Gaming Collection theme - Genshin",
    "categories": [
      "Gaming"
    ],
    "tags": [
      "gaming",
      "genshin"
    ],
    "bgColor": "#EBF3FA",
    "textColor": "#1D3B5C",
    "btnBg": "rgba(255,255,255,0.6)",
    "btnBorder": "#1D3B5C22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(180deg, #EBF3FA 0%, #BACEE2 100%)"
  },
  {
    "id": "honkai",
    "name": "Honkai",
    "emoji": "☄️",
    "tier": "free",
    "price": 0,
    "description": "Gaming Collection theme - Honkai",
    "categories": [
      "Gaming"
    ],
    "tags": [
      "gaming",
      "honkai"
    ],
    "bgColor": "#0D0F21",
    "textColor": "#A2C2E8",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#A2C2E822",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #0D0F21 0%, #1A1F3E 100%)"
  },
  {
    "id": "apex_legends",
    "name": "Apex Legends",
    "emoji": "🏆",
    "tier": "free",
    "price": 0,
    "description": "Gaming Collection theme - Apex Legends",
    "categories": [
      "Gaming"
    ],
    "tags": [
      "gaming",
      "apex_legends"
    ],
    "bgColor": "#1F1B1A",
    "textColor": "#DA291C",
    "btnBg": "#312A29",
    "btnBorder": "#DA291C22",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "call_of_duty",
    "name": "Call of Duty",
    "emoji": "🔫",
    "tier": "free",
    "price": 0,
    "description": "Gaming Collection theme - Call of Duty",
    "categories": [
      "Gaming"
    ],
    "tags": [
      "gaming",
      "call_of_duty"
    ],
    "bgColor": "#1D1E1A",
    "textColor": "#D2D3C9",
    "btnBg": "#2D2E28",
    "btnBorder": "#D2D3C922",
    "btnStyle": "rounded-xl"
  }
];

export const STORE_THEMES: StoreTheme[] = [
  ...PRESET_THEMES,
  ...mappedJapanThemes.filter((t) => !presetIds.has(t.id)),
  ...mappedAnimeThemes.filter((t) => !presetIds.has(t.id)),
  ...EXTRA_THEMES,
];

export function getStoreThemeById(id: string) {
  return STORE_THEMES.find((t) => t.id === id);
}

export function getThemesByTier(tier: StoreTheme['tier']) {
  return STORE_THEMES.filter((t) => t.tier === tier);
}

export const TIER_PRICES = {
  free: 0,
  premium: 49,
  exclusive: 99,
};

export const BUNDLE_DEALS = [
  { id: 'bundle_premium', name: 'All Premium Themes', themes: ['galaxy_dream', 'cyber_tokyo', 'moonlight_forest', 'wisteria', 'hoshi', 'shogun'], price: 149, originalPrice: 294, emoji: '✨' },
  { id: 'bundle_exclusive', name: 'All Exclusive Themes', themes: ['frieren', 'demon_slayer', 'shrine_festival', 'ocean_sunset', 'railway_sunset', 'sky_kingdom'], price: 299, originalPrice: 594, emoji: '💎' },
  { id: 'bundle_all', name: 'Complete Collection', themes: ['galaxy_dream', 'cyber_tokyo', 'moonlight_forest', 'wisteria', 'hoshi', 'shogun', 'frieren', 'demon_slayer', 'shrine_festival', 'ocean_sunset', 'railway_sunset', 'sky_kingdom'], price: 399, originalPrice: 888, emoji: '👑' },
];

