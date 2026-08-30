export interface ThemeConfig {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  textColor: string;
  btnBg: string;
  btnText: string;
  btnBorder: string;
  btnStyle: 'rounded-xl' | 'rounded-full' | 'rounded-none' | 'shadow';
  bgGradient?: string;
}

export const JAPANESE_THEMES: ThemeConfig[] = [

  // ── LIGHT / CLEAN ──────────────────────────────────────────────────────────
  {
    id: 'yuki',
    name: 'Yuki',
    emoji: '❄️',
    bgColor: '#F8FAFC',
    textColor: '#475569',
    btnBg: '#ffffff',
    btnText: '#475569',
    btnBorder: '#E2E8F0',
    btnStyle: 'rounded-xl',
  },
  {
    id: 'zen',
    name: 'Zen',
    emoji: '🪨',
    bgColor: '#F5F5F4',
    textColor: '#44403C',
    btnBg: '#E7E5E4',
    btnText: '#44403C',
    btnBorder: '#D6D3D1',
    btnStyle: 'rounded-xl',
  },
  {
    id: 'sakura',
    name: 'Sakura',
    emoji: '🌸',
    bgColor: '#FFF5F5',
    textColor: '#8C3A4F',
    btnBg: '#FFD6E0',
    btnText: '#8C3A4F',
    btnBorder: '#FFB3C6',
    btnStyle: 'rounded-full',
    bgGradient: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%)',
  },

  // ── DARK / ELEGANT ─────────────────────────────────────────────────────────
  {
    id: 'tsukiyo',
    name: 'Tsukiyo',
    emoji: '🌙',
    bgColor: '#0B132B',
    textColor: '#F4F4F9',
    btnBg: '#1C2541',
    btnText: '#F4F4F9',
    btnBorder: '#5BC0BE',
    btnStyle: 'rounded-xl',
    bgGradient: 'linear-gradient(135deg, #0B132B 0%, #1C2541 100%)',
  },
  {
    id: 'kurohana',
    name: 'Kurohana',
    emoji: '🖤',
    bgColor: '#18181B',
    textColor: '#E4E4E7',
    btnBg: '#27272A',
    btnText: '#E4E4E7',
    btnBorder: '#3F3F46',
    btnStyle: 'rounded-none',
  },
  {
    id: 'hoshi',
    name: 'Hoshi',
    emoji: '⭐',
    bgColor: '#090D16',
    textColor: '#FBBF24',
    btnBg: '#111827',
    btnText: '#FBBF24',
    btnBorder: '#1F2937',
    btnStyle: 'shadow',
  },

  // ── GRADIENT / COLORFUL ────────────────────────────────────────────────────
  {
    id: 'ocean_sunset',
    name: 'Ocean Sunset',
    emoji: '🌅',
    bgColor: '#FFF3E0',
    textColor: '#7B341E',
    btnBg: '#FED7AA',
    btnText: '#7B341E',
    btnBorder: '#F97316',
    btnStyle: 'rounded-xl',
    bgGradient: 'linear-gradient(180deg, #FF6B35 0%, #F7B731 40%, #3D9EFF 100%)',
  },
  {
    id: 'galaxy_dream',
    name: 'Galaxy Dream',
    emoji: '✨',
    bgColor: '#0B0014',
    textColor: '#DDD6FE',
    btnBg: '#1E0A3C',
    btnText: '#DDD6FE',
    btnBorder: '#7C3AED',
    btnStyle: 'rounded-xl',
    bgGradient: 'linear-gradient(135deg, #0B0014 0%, #1E0A3C 50%, #2D1B69 100%)',
  },
  {
    id: 'fuji_sunset',
    name: 'Fuji Sunset',
    emoji: '🗻',
    bgColor: '#FFF3E0',
    textColor: '#4A148C',
    btnBg: '#FFE0B2',
    btnText: '#4A148C',
    btnBorder: '#D1C4E9',
    btnStyle: 'rounded-xl',
    bgGradient: 'linear-gradient(180deg, #FF7043 0%, #9C27B0 100%)',
  },

  // ── BOLD / SPECIAL ─────────────────────────────────────────────────────────
  {
    id: 'cyber_tokyo',
    name: 'Cyber Tokyo',
    emoji: '🌆',
    bgColor: '#0D0221',
    textColor: '#00F0FF',
    btnBg: '#0F084B',
    btnText: '#00F0FF',
    btnBorder: '#FF007F',
    btnStyle: 'rounded-xl',
    bgGradient: 'linear-gradient(135deg, #0D0221 0%, #0F084B 100%)',
  },
  {
    id: 'matcha',
    name: 'Matcha',
    emoji: '🍵',
    bgColor: '#F1F8E9',
    textColor: '#33691E',
    btnBg: '#DCEDC8',
    btnText: '#33691E',
    btnBorder: '#AED581',
    btnStyle: 'rounded-xl',
  },
  {
    id: 'fire',
    name: 'Fire',
    emoji: '🔥',
    bgColor: '#000000',
    textColor: '#F97316',
    btnBg: '#1A1A1A',
    btnText: '#F97316',
    btnBorder: '#EA580C',
    btnStyle: 'rounded-none',
  },
];

export function getThemeById(id: string): ThemeConfig | undefined {
  return JAPANESE_THEMES.find((t) => t.id === id);
}
