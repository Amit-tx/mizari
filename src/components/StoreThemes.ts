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
    id: t.slug.replace(/-/g, '_'),
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
    id: t.slug.replace(/-/g, '_'),
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
  // ── FREE THEMES (11) ──────────────────────────────────────
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
  { id: 'yakutsk',    name: 'Yakutsk Frost',   emoji: '❄️',  tier: 'free', price: 0, description: 'Siberian ice palace with aurora borealis', categories: ['Minimal', 'Creator'], tags: ['ice', 'siberia', 'aurora', 'frozen'], bgColor: '#E8F6F9', textColor: '#0A5F7F', btnBg: '#B8EBF5', effect: 'aurora', bgGradient: 'linear-gradient(135deg, #E8F6F9 0%, #9FE2E9 50%, #4FBAE8 100%)' },

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
    "id": "neon_horizon",
    "name": "Neon Horizon",
    "emoji": "🌅",
    "tier": "free",
    "price": 0,
    "description": "Cyberpunk & Synthwave theme - Neon Horizon",
    "categories": [
      "Cyberpunk"
    ],
    "tags": [
      "cyberpunk",
      "neon_horizon"
    ],
    "bgColor": "#0F051D",
    "textColor": "#00F0FF",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#00F0FF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #0F051D 0%, #3B0066 100%)"
  },
  {
    "id": "synthwave_sun",
    "name": "Synthwave Sun",
    "emoji": "☀️",
    "tier": "free",
    "price": 0,
    "description": "Cyberpunk & Synthwave theme - Synthwave Sun",
    "categories": [
      "Cyberpunk"
    ],
    "tags": [
      "cyberpunk",
      "synthwave_sun"
    ],
    "bgColor": "#1A0826",
    "textColor": "#FF007F",
    "btnBg": "rgba(255,255,255,0.1)",
    "btnBorder": "#FF007F22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(180deg, #1A0826 0%, #8A005B 50%, #FF8A00 100%)"
  },
  {
    "id": "retro_grid",
    "name": "Retro Grid",
    "emoji": "📟",
    "tier": "free",
    "price": 0,
    "description": "Cyberpunk & Synthwave theme - Retro Grid",
    "categories": [
      "Cyberpunk"
    ],
    "tags": [
      "cyberpunk",
      "retro_grid"
    ],
    "bgColor": "#05050A",
    "textColor": "#39FF14",
    "btnBg": "rgba(57,255,20,0.06)",
    "btnBorder": "#39FF1422",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "laser_purple",
    "name": "Laser Purple",
    "emoji": "🔮",
    "tier": "free",
    "price": 0,
    "description": "Cyberpunk & Synthwave theme - Laser Purple",
    "categories": [
      "Cyberpunk"
    ],
    "tags": [
      "cyberpunk",
      "laser_purple"
    ],
    "bgColor": "#120224",
    "textColor": "#BD00FF",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#BD00FF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #120224 0%, #4A0082 100%)"
  },
  {
    "id": "electric_blue",
    "name": "Electric Blue",
    "emoji": "⚡",
    "tier": "free",
    "price": 0,
    "description": "Cyberpunk & Synthwave theme - Electric Blue",
    "categories": [
      "Cyberpunk"
    ],
    "tags": [
      "cyberpunk",
      "electric_blue"
    ],
    "bgColor": "#000B1E",
    "textColor": "#00E5FF",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#00E5FF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #000B1E 0%, #002244 100%)"
  },
  {
    "id": "chrome_pink",
    "name": "Chrome Pink",
    "emoji": "💗",
    "tier": "free",
    "price": 0,
    "description": "Cyberpunk & Synthwave theme - Chrome Pink",
    "categories": [
      "Cyberpunk"
    ],
    "tags": [
      "cyberpunk",
      "chrome_pink"
    ],
    "bgColor": "#1E0014",
    "textColor": "#FF00A8",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#FF00A822",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #1E0014 0%, #5E003E 100%)"
  },
  {
    "id": "grid_runner",
    "name": "Grid Runner",
    "emoji": "🏃",
    "tier": "free",
    "price": 0,
    "description": "Cyberpunk & Synthwave theme - Grid Runner",
    "categories": [
      "Cyberpunk"
    ],
    "tags": [
      "cyberpunk",
      "grid_runner"
    ],
    "bgColor": "#08080C",
    "textColor": "#FFFF00",
    "btnBg": "rgba(255,255,0,0.06)",
    "btnBorder": "#FFFF0022",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "outrun",
    "name": "Outrun",
    "emoji": "🏎️",
    "tier": "free",
    "price": 0,
    "description": "Cyberpunk & Synthwave theme - Outrun",
    "categories": [
      "Cyberpunk"
    ],
    "tags": [
      "cyberpunk",
      "outrun"
    ],
    "bgColor": "#15001C",
    "textColor": "#00FFCC",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#00FFCC22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #15001C 0%, #4A005C 100%)"
  },
  {
    "id": "sunset_neon",
    "name": "Sunset Neon",
    "emoji": "🌆",
    "tier": "free",
    "price": 0,
    "description": "Cyberpunk & Synthwave theme - Sunset Neon",
    "categories": [
      "Cyberpunk"
    ],
    "tags": [
      "cyberpunk",
      "sunset_neon"
    ],
    "bgColor": "#20011C",
    "textColor": "#FFA600",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#FFA60022",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #20011C 0%, #8C005F 100%)"
  },
  {
    "id": "vaporwave_grid",
    "name": "Vaporwave Grid",
    "emoji": "🌆",
    "tier": "free",
    "price": 0,
    "description": "Cyberpunk & Synthwave theme - Vaporwave Grid",
    "categories": [
      "Cyberpunk"
    ],
    "tags": [
      "cyberpunk",
      "vaporwave_grid"
    ],
    "bgColor": "#EAEAEA",
    "textColor": "#FF77BC",
    "btnBg": "rgba(255,255,255,0.18)",
    "btnBorder": "#FF77BC22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #FFC2E2 0%, #B2E5FC 100%)"
  },
  {
    "id": "enchanted_forest",
    "name": "Enchanted Forest",
    "emoji": "🌲",
    "tier": "free",
    "price": 0,
    "description": "Mystic & Fantasy theme - Enchanted Forest",
    "categories": [
      "Mystic"
    ],
    "tags": [
      "mystic",
      "enchanted_forest"
    ],
    "bgColor": "#051A0E",
    "textColor": "#81C784",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#81C78422",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #051A0E 0%, #0D3E20 100%)",
    "effect": "fireflies"
  },
  {
    "id": "magic_spell",
    "name": "Magic Spell",
    "emoji": "🪄",
    "tier": "free",
    "price": 0,
    "description": "Mystic & Fantasy theme - Magic Spell",
    "categories": [
      "Mystic"
    ],
    "tags": [
      "mystic",
      "magic_spell"
    ],
    "bgColor": "#1A0B2E",
    "textColor": "#E040FB",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#E040FB22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #1A0B2E 0%, #4A148C 100%)",
    "effect": "shooting_stars"
  },
  {
    "id": "ether_space",
    "name": "Ether Space",
    "emoji": "🌌",
    "tier": "free",
    "price": 0,
    "description": "Mystic & Fantasy theme - Ether Space",
    "categories": [
      "Mystic"
    ],
    "tags": [
      "mystic",
      "ether_space"
    ],
    "bgColor": "#070614",
    "textColor": "#80DEEA",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#80DEEA22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #070614 0%, #15103C 100%)",
    "effect": "shooting_stars"
  },
  {
    "id": "elf_wood",
    "name": "Elf Wood",
    "emoji": "🧝",
    "tier": "free",
    "price": 0,
    "description": "Mystic & Fantasy theme - Elf Wood",
    "categories": [
      "Mystic"
    ],
    "tags": [
      "mystic",
      "elf_wood"
    ],
    "bgColor": "#0F1C12",
    "textColor": "#A5D6A7",
    "btnBg": "rgba(165,214,167,0.06)",
    "btnBorder": "#A5D6A722",
    "btnStyle": "rounded-xl"
  },
  {
    "id": "fairy_dust",
    "name": "Fairy Dust",
    "emoji": "✨",
    "tier": "free",
    "price": 0,
    "description": "Mystic & Fantasy theme - Fairy Dust",
    "categories": [
      "Mystic"
    ],
    "tags": [
      "mystic",
      "fairy_dust"
    ],
    "bgColor": "#FAF4FF",
    "textColor": "#D946EF",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#D946EF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #FAF4FF 0%, #F5D0FE 100%)",
    "effect": "sakura"
  },
  {
    "id": "dark_magic",
    "name": "Dark Magic",
    "emoji": "🔮",
    "tier": "free",
    "price": 0,
    "description": "Mystic & Fantasy theme - Dark Magic",
    "categories": [
      "Mystic"
    ],
    "tags": [
      "mystic",
      "dark_magic"
    ],
    "bgColor": "#0D001A",
    "textColor": "#FF007F",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#FF007F22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #0D001A 0%, #22003D 100%)",
    "effect": "shooting_stars"
  },
  {
    "id": "crystal_cave",
    "name": "Crystal Cave",
    "emoji": "💎",
    "tier": "free",
    "price": 0,
    "description": "Mystic & Fantasy theme - Crystal Cave",
    "categories": [
      "Mystic"
    ],
    "tags": [
      "mystic",
      "crystal_cave"
    ],
    "bgColor": "#0A131C",
    "textColor": "#00E5FF",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#00E5FF22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #0A131C 0%, #1B354C 100%)"
  },
  {
    "id": "celestial_spark",
    "name": "Celestial Spark",
    "emoji": "✨",
    "tier": "free",
    "price": 0,
    "description": "Mystic & Fantasy theme - Celestial Spark",
    "categories": [
      "Mystic"
    ],
    "tags": [
      "mystic",
      "celestial_spark"
    ],
    "bgColor": "#04040A",
    "textColor": "#FFD54F",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#FFD54F22",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(180deg, #04040A 0%, #121224 100%)",
    "effect": "shooting_stars"
  },
  {
    "id": "dragon_lair",
    "name": "Dragon Lair",
    "emoji": "🐉",
    "tier": "free",
    "price": 0,
    "description": "Mystic & Fantasy theme - Dragon Lair",
    "categories": [
      "Mystic"
    ],
    "tags": [
      "mystic",
      "dragon_lair"
    ],
    "bgColor": "#1A0404",
    "textColor": "#FF3D00",
    "btnBg": "rgba(255,255,255,0.08)",
    "btnBorder": "#FF3D0022",
    "btnStyle": "rounded-xl",
    "bgGradient": "linear-gradient(135deg, #1A0404 0%, #4D0E0E 100%)"
  },
  {
    "id": "witch_craft",
    "name": "Witch Craft",
    "emoji": "🧹",
    "tier": "free",
    "price": 0,
    "description": "Mystic & Fantasy theme - Witch Craft",
    "categories": [
      "Mystic"
    ],
    "tags": [
      "mystic",
      "witch_craft"
    ],
    "bgColor": "#12091F",
    "textColor": "#BA68C8",
    "btnBg": "rgba(186,104,200,0.06)",
    "btnBorder": "#BA68C822",
    "btnStyle": "rounded-xl"
  }
];

// Combine presets and user provided Japan + Anime themes, filtering out duplicates
const rawCombinedThemes = [
  ...PRESET_THEMES,
  ...mappedJapanThemes.filter((t) => !presetIds.has(t.id)),
  ...mappedAnimeThemes.filter((t) => !presetIds.has(t.id)),
  ...EXTRA_THEMES,
];

// Deduplicate themes by normalized name to prevent duplicate entries
const seenThemeNames = new Set();
const deduplicatedThemes = [];

for (const t of rawCombinedThemes) {
  const normalized = t.name.toLowerCase().replace(/\btheme\b/g, '').replace(/[^a-z0-9]/g, '').trim();
  if (!seenThemeNames.has(normalized)) {
    seenThemeNames.add(normalized);
    deduplicatedThemes.push(t);
  }
}

export const STORE_THEMES: StoreTheme[] = deduplicatedThemes;

export function getStoreThemeById(id: string) {
  return STORE_THEMES.find((t) => t.id === id);
}

export function getThemesByTier(tier: 'free' | 'premium' | 'exclusive') {
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
