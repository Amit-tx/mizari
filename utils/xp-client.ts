export interface LevelInfo {
  level: number;
  name: string;
  emoji: string;
  xpRequired: number;
  category: string;
}

export const LEVEL_MAP: LevelInfo[] = [
  { level: 1,  name: 'New Sprout',        emoji: '🍃', xpRequired: 0,        category: 'New User' },
  { level: 2,  name: 'Matcha Apprentice', emoji: '🍵', xpRequired: 30,       category: 'Beginner' },
  { level: 3,  name: 'Koinobori Explorer',emoji: '🎏', xpRequired: 150,      category: 'Explorer' },
  { level: 5,  name: 'Kitsune Illusionist',emoji: '🦊', xpRequired: 750,      category: 'Creator' },
  { level: 10, name: 'Kabuki Star',       emoji: '🎭', xpRequired: 4500,     category: 'Skilled' },
  { level: 15, name: 'Ronin Pathfinder',  emoji: '🗡️', xpRequired: 15000,    category: 'Elite' },
  { level: 20, name: 'Kami Guardian',     emoji: '⛩️', xpRequired: 45000,    category: 'Advanced' },
  { level: 25, name: 'Ryū Legend',        emoji: '🐉', xpRequired: 150000,   category: 'Legendary' },
  { level: 30, name: 'Aesthetic Shogun',  emoji: '👑', xpRequired: 450000,   category: 'Mythic' },
];

export const PRESTIGE_RANKS = [
  { rank: 1, name: 'Golden Shogun', emoji: '✨', xpRequired: 1500000, category: 'Rare Rank' },
  { rank: 2, name: 'Celestial Shogun', emoji: '🌌', xpRequired: 5000000, category: 'Rare Rank' },
  { rank: 3, name: 'Eternal Origin', emoji: '♾️', xpRequired: 25000000, category: 'Mythic Rank' },
];

export function getLevelInfo(xp: number = 0, prestige: number = 0) {
  const safeXp = xp || 0;
  const safePrestige = prestige || 0;

  // If prestige is active, prestige ranks override normal levels
  if (safePrestige > 0) {
    const rankIndex = Math.min(safePrestige - 1, PRESTIGE_RANKS.length - 1);
    const prestigeRank = PRESTIGE_RANKS[rankIndex];
    
    // Find next rank requirements
    const nextRank = PRESTIGE_RANKS[rankIndex + 1] || null;
    return {
      level: 30 + safePrestige,
      name: `${prestigeRank.emoji} ${prestigeRank.name}`,
      category: prestigeRank.category,
      currentXp: safeXp,
      nextLevelXp: nextRank ? nextRank.xpRequired : 999999999,
      isPrestige: true,
      prestigeLevel: prestige,
    };
  }

  // Normal Level Progression
  let activeLevel = LEVEL_MAP[0];
  let nextLevel = LEVEL_MAP[1];

  for (let i = 0; i < LEVEL_MAP.length; i++) {
    if (xp >= LEVEL_MAP[i].xpRequired) {
      activeLevel = LEVEL_MAP[i];
      nextLevel = LEVEL_MAP[i + 1] || null;
    }
  }

  return {
    level: activeLevel.level,
    name: `${activeLevel.emoji} ${activeLevel.name}`,
    category: activeLevel.category,
    currentXp: xp,
    nextLevelXp: nextLevel ? nextLevel.xpRequired : 450000, // max level threshold to trigger prestige
    isPrestige: false,
    prestigeLevel: 0,
  };
}
