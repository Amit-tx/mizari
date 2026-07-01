// Theme Store catalog — defines which themes are free vs paid and their categories
export interface StoreTheme {
  id: string;
  name: string;
  emoji: string;
  tier: 'free' | 'premium' | 'exclusive';
  price: number; // in INR (0 = free)
  description: string;
  categories: ('Anime' | 'Minimal' | 'Luxury' | 'Gaming' | 'Creator' | 'Business')[];
  tags: string[];
  effect?: string; // animation effect name
  bgGradient?: string;
  bgColor: string;
  textColor: string;
  btnBg: string;
}

export const STORE_THEMES: StoreTheme[] = [
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
  { id: 'frieren',          name: 'Frieren: Journey\'s End', emoji: '🪄', tier: 'exclusive', price: 99, description: 'Magic purple inspired by Frieren anime — with shooting stars', categories: ['Anime', 'Creator', 'Luxury'], tags: ['anime', 'magic', 'dark', 'purple'], bgColor: '#1A1220', textColor: '#E8D5F5', btnBg: '#2D1F40', effect: 'shooting_stars', bgGradient: 'linear-gradient(180deg, #1A1220 0%, #2D1F40 50%, #3D2960 100%)' },
  { id: 'demon_slayer',     name: 'Demon Slayer',           emoji: '⚔️', tier: 'exclusive', price: 99, description: 'Dark crimson battle theme from Demon Slayer', categories: ['Anime', 'Gaming', 'Luxury'], tags: ['anime', 'dark', 'red', 'action'], bgColor: '#0D0014', textColor: '#FFE4E6', btnBg: '#1A0022', effect: 'shooting_stars', bgGradient: 'linear-gradient(135deg, #0D0014 0%, #1A0022 40%, #2D0035 100%)' },
  { id: 'shrine_festival',  name: 'Shrine Festival',        emoji: '🏮', tier: 'exclusive', price: 99, description: 'Traditional Japanese shrine with floating lanterns & fireflies', categories: ['Anime', 'Creator', 'Luxury'], tags: ['anime', 'japanese', 'festival', 'warm'], bgColor: '#1A0500', textColor: '#FFE5C4', btnBg: '#7B1D00', effect: 'lanterns+fireflies', bgGradient: 'linear-gradient(135deg, #1A0500 0%, #7B1D00 100%)' },
  { id: 'ocean_sunset',     name: 'Ocean Sunset',           emoji: '🌅', tier: 'exclusive', price: 99, description: 'Cinematic ocean sunset with moving clouds', categories: ['Creator', 'Luxury'], tags: ['sunset', 'ocean', 'warm', 'beautiful'], bgColor: '#FFF3E0', textColor: '#7B341E', btnBg: '#FED7AA', effect: 'clouds', bgGradient: 'linear-gradient(180deg, #FF6B35 0%, #F7B731 40%, #3D9EFF 100%)' },
  { id: 'railway_sunset',   name: 'Railway Memories',       emoji: '🚉', tier: 'exclusive', price: 99, description: 'Anime train station at golden sunset', categories: ['Anime', 'Creator', 'Minimal'], tags: ['anime', 'nostalgic', 'sunset', 'warm'], bgColor: '#FFF7ED', textColor: '#92400E', btnBg: '#FDE68A', effect: 'clouds', bgGradient: 'linear-gradient(180deg, #F97316 0%, #FDE68A 60%, #FFF7ED 100%)' },
  { id: 'sky_kingdom',      name: 'Sky Kingdom',            emoji: '☁️',  tier: 'exclusive', price: 99, description: 'Floating islands in dynamic blue sky', categories: ['Creator', 'Minimal'], tags: ['sky', 'clouds', 'blue'], bgColor: '#E0F2FE', textColor: '#0C4A6E', btnBg: '#BAE6FD', effect: 'clouds', bgGradient: 'linear-gradient(180deg, #93C5FD 0%, #E0F2FE 60%, #BAE6FD 100%)' },
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
