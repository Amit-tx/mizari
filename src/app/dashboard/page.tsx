import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users, profiles, links } from '@/db/schema';
import { eq, asc, and } from 'drizzle-orm';
import { DashboardClient } from './DashboardClient';

interface DashboardPageProps {
  searchParams: Promise<{ profileId?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const userId = parseInt(session.user.id);

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) redirect('/login');

  // Fetch all profiles of this user
  const userProfiles = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .orderBy(asc(profiles.id));

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
  }

  // Fetch links for active profile
  const profileLinks = await db
    .select()
    .from(links)
    .where(eq(links.profileId, activeProfile.id))
    .orderBy(asc(links.order));

  // Calculate stats for all user profiles (for creator level calculation)
  let totalClicks = 0;
  for (const prof of userProfiles) {
    const [clicksRes] = await db
      .select()
      .from(links)
      .where(eq(links.profileId, prof.id));
    // Sum clicks
    const profLinks = await db
      .select()
      .from(links)
      .where(eq(links.profileId, prof.id));
    totalClicks += profLinks.reduce((sum, link) => sum + link.clicks, 0);
  }

  const { themePurchases } = await import('@/db/schema');
  const purchases = await db
    .select()
    .from(themePurchases)
    .where(and(eq(themePurchases.userId, userId), eq(themePurchases.status, 'paid')));
  const purchasedThemeIds = purchases.map((p) => p.themeId);

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
        likes: activeProfile.likes,
        showWishes: activeProfile.showWishes,
        xp: activeProfile.xp,
        prestige: activeProfile.prestige,
      }}
      userEmail={user.email}
      initialLinks={profileLinks}
      totalClicks={totalClicks}
      purchasedThemeIds={purchasedThemeIds}
    />
  );
}
