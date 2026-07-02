import { db } from '@/db';
import { clickLogs, profiles } from '@/db/schema';
import { and, eq, gte, sql } from 'drizzle-orm';
import crypto from 'crypto';

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

/**
 * Checks User-Agent header to ignore web crawlers and search index bots.
 */
export function isBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return /bot|googlebot|crawler|spider|robot|crawling|headless|curl|wget/i.test(userAgent);
}

/**
 * Validates IP rate-limiting logs to prevent views/clicks spam.
 * Cooldown: 1 hour for clicks, 2 hours for profile views.
 */
export async function validateIpCooldown(
  ipAddress: string,
  targetId: number,
  targetType: 'click' | 'view'
): Promise<boolean> {
  const hashedIp = crypto.createHash('sha256').update(ipAddress).digest('hex');
  const cooldownDuration = targetType === 'view' ? 2 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000; // 2h views, 1h clicks
  const cutoffTime = new Date(Date.now() - cooldownDuration);

  const [existingLog] = await db
    .select()
    .from(clickLogs)
    .where(and(
      eq(clickLogs.visitorIp, hashedIp),
      eq(clickLogs.targetId, targetId),
      eq(clickLogs.targetType, targetType),
      gte(clickLogs.createdAt, cutoffTime)
    ))
    .limit(1);

  if (existingLog) {
    return false; // cooldown active (spam detected)
  }

  // Cooldown passed, save click log record
  await db.insert(clickLogs).values({
    visitorIp: hashedIp,
    targetId,
    targetType,
  });

  return true; // allowed
}

/**
 * Adds XP dynamically to a profile.
 */
export async function grantXp(profileId: number, amount: number) {
  await db
    .update(profiles)
    .set({ xp: sql`${profiles.xp} + ${amount}` })
    .where(eq(profiles.id, profileId));
}
