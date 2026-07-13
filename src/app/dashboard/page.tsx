import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users, profiles, links, wishes, clickLogs } from '@/db/schema';
import { eq, asc, and, inArray, or, desc } from 'drizzle-orm';
import { DashboardClient } from './DashboardClient';

// Neon's serverless HTTP driver occasionally has a transient network blip
// (cold start, brief timeout). One retry avoids turning that into a full
// page crash for the user.
async function withRetry<T>(fn: () => Promise<T>, attempts = 2): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      console.warn(`[dashboard] query attempt ${i + 1} failed, retrying:`, err);
    }
  }
  throw lastErr;
}

function safeIsoString(val: any): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Date) return val.toISOString();
  try {
    return new Date(val).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

interface DashboardPageProps {
  searchParams: Promise<{ profileId?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const userId = parseInt(session.user.id);

  const [user] = await withRetry(() =>
    db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
  );

  if (!user) redirect('/login');

  // Fetch all profiles of this user
  const userProfiles = await withRetry(() =>
    db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .orderBy(asc(profiles.id))
  );

  // Determine active profile from query param, fallback to first profile
  const parsedParams = await searchParams;
  const targetProfileId = parsedParams.profileId ? parseInt(parsedParams.profileId) : null;

  let activeProfile = userProfiles.find((p) => p.id === targetProfileId);
  if (!activeProfile && userProfiles.length > 0) {
    activeProfile = userProfiles[0];
  }

  // If user has no profiles (safety fallback, should not happen due to signup creation)
  if (!activeProfile) {
    // Generate username from email prefix (e.g. amit@gmail.com -> amit)
    const emailPrefix = user.email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '');
    const fallbackUsername = `${emailPrefix}_${Math.floor(Math.random() * 100)}`;
    
    // Automatically create a default one
    const [newProfile] = await db
      .insert(profiles)
      .values({
        userId,
        username: fallbackUsername.toLowerCase(),
        profileType: 'personal',
        themeType: 'light',
      })
      .returning();
    activeProfile = newProfile;
    userProfiles.push(newProfile);
  }

  // Daily Active check-in (10 XP per calendar day)
  if (activeProfile) {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const lastActiveStr = activeProfile.lastActiveAt
        ? new Date(activeProfile.lastActiveAt).toISOString().split('T')[0]
        : null;

      if (todayStr !== lastActiveStr) {
        await db
          .update(profiles)
          .set({
            dailyActiveDays: (activeProfile.dailyActiveDays || 0) + 1,
            lastActiveAt: new Date(),
            xp: (activeProfile.xp || 0) + 10,
          })
          .where(eq(profiles.id, activeProfile.id));

        activeProfile.dailyActiveDays = (activeProfile.dailyActiveDays || 0) + 1;
        activeProfile.lastActiveAt = new Date();
        activeProfile.xp = (activeProfile.xp || 0) + 10;
      }
    } catch (xpErr) {
      console.warn('[dashboard] XP daily check-in failed (migration pending?):', xpErr);
    }
  }

  // Fetch links for active profile
  const profileLinks = await withRetry(() =>
    db
      .select()
      .from(links)
      .where(eq(links.profileId, activeProfile.id))
      .orderBy(asc(links.order))
  );

  // Fetch wishes for active profile guestbook moderation
  const profileWishes = await withRetry(() =>
    db
      .select()
      .from(wishes)
      .where(eq(wishes.profileId, activeProfile.id))
      .orderBy(desc(wishes.id))
  );

  // Fetch click logs for rich analytics
  const linkIds = profileLinks.map((l) => l.id);
  let profileClickLogs: any[] = [];
  try {
    const conditions = [
      and(eq(clickLogs.targetType, 'view'), eq(clickLogs.targetId, activeProfile.id))
    ];
    if (linkIds.length > 0) {
      conditions.push(and(eq(clickLogs.targetType, 'click'), inArray(clickLogs.targetId, linkIds)));
    }
    
    profileClickLogs = await db
      .select()
      .from(clickLogs)
      .where(or(...conditions))
      .orderBy(desc(clickLogs.id))
      .limit(1000);
  } catch (logErr) {
    console.warn('[dashboard] click_logs query failed:', logErr);
  }

  // Calculate stats for all user profiles (for creator level calculation)
  let totalClicks = 0;
  if (userProfiles.length > 0) {
    const profileIds = userProfiles.map((p) => p.id);
    const allLinks = await withRetry(() =>
      db
        .select({ clicks: links.clicks })
        .from(links)
        .where(inArray(links.profileId, profileIds))
    );
    totalClicks = allLinks.reduce((sum, link) => sum + link.clicks, 0);
  }

  let purchasedThemeIds: string[] = [];
  try {
    const { themePurchases } = await import('@/db/schema');
    const purchases = await db
      .select()
      .from(themePurchases)
      .where(and(eq(themePurchases.userId, userId), eq(themePurchases.status, 'paid')));
    purchasedThemeIds = purchases.map((p) => p.themeId);
  } catch (purchaseErr) {
    console.warn('[dashboard] theme_purchases query failed (migration pending?):', purchaseErr);
  }

  return (
    <DashboardClient
      userId={userId}
      userProfiles={userProfiles.map((p) => ({
        id: p.id,
        username: p.username,
        profileType: p.profileType as 'personal' | 'business' | 'gaming',
      }))}
      activeProfile={{
        id: activeProfile.id,
        username: activeProfile.username,
        profileType: activeProfile.profileType as 'personal' | 'business' | 'gaming',
        bio: activeProfile.bio || '',
        avatarUrl: activeProfile.avatarUrl || '',
        themeType: activeProfile.themeType,
        themeBgColor: activeProfile.themeBgColor,
        themeTextColor: activeProfile.themeTextColor,
        themeBgImage: activeProfile.themeBgImage || '',
        themeButtonStyle: activeProfile.themeButtonStyle as 'rounded-xl' | 'rounded-full' | 'rounded-none' | 'shadow',
        themeBackdrop: activeProfile.themeBackdrop,
        themeRotateInterval: activeProfile.themeRotateInterval,
        likes: activeProfile.likes,
        showWishes: activeProfile.showWishes,
        xp: activeProfile.xp,
        prestige: activeProfile.prestige,
        guestbookStyle: activeProfile.guestbookStyle as 'tanabata' | 'classic',
        guestbookHeading: activeProfile.guestbookHeading || 'Guestbook',
        announcementText: activeProfile.announcementText || '',
        announcementLink: activeProfile.announcementLink || '',
        announcementMessages: activeProfile.announcementMessages || '[]',
        announcementActive: activeProfile.announcementActive,
        announcementColor: activeProfile.announcementColor || '#FF6B6B',
        birthday: activeProfile.birthday || '',
        enableDynamicTheme: activeProfile.enableDynamicTheme,
        tagline: activeProfile.tagline || '',
        ctaPrimaryText: activeProfile.ctaPrimaryText || '',
        ctaPrimaryLink: activeProfile.ctaPrimaryLink || '',
        ctaSecondaryText: activeProfile.ctaSecondaryText || '',
        ctaSecondaryLink: activeProfile.ctaSecondaryLink || '',
        infoCardEnabled: activeProfile.infoCardEnabled,
        infoCardTitle: activeProfile.infoCardTitle || 'Profile',
        infoCardItems: activeProfile.infoCardItems || '[]',
        contactEnabled: activeProfile.contactEnabled,
        contactPhone: activeProfile.contactPhone || '',
        contactEmail: activeProfile.contactEmail || '',
      }}
      userEmail={user.email}
      initialLinks={profileLinks as any}
      totalClicks={totalClicks}
      purchasedThemeIds={purchasedThemeIds}
      profileWishes={profileWishes.map((w) => ({ id: w.id, sender: w.sender, text: w.text, color: w.color, createdAt: safeIsoString(w.createdAt) }))}
      profileClickLogs={profileClickLogs.map((l) => ({ id: l.id, visitorIp: l.visitorIp, targetId: l.targetId, targetType: l.targetType, referrer: l.referrer, device: l.device, browser: l.browser, country: l.country, createdAt: safeIsoString(l.createdAt) }))}
    />
  );
}
