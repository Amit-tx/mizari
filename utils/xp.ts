import { db } from '@/db';
import { clickLogs, profiles } from '@/db/schema';
import { and, eq, gte, sql } from 'drizzle-orm';
import crypto from 'crypto';

export { type LevelInfo, LEVEL_MAP, PRESTIGE_RANKS, getLevelInfo } from './xp-client';

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
  targetType: 'click' | 'view',
  referrer: string = 'direct',
  device: string = 'desktop',
  browser: string = 'unknown',
  country: string = 'unknown'
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
    referrer,
    device,
    browser,
    country,
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
