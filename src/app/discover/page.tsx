import { db } from '@/db';
import { profiles } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { DiscoverClient } from '@/components/DiscoverClient';

export const metadata = {
  title: 'Discover Creators — Mizari',
  description: 'Explore popular links-in-bio and creators on Mizari.',
};

export default async function DiscoverPage() {
  const allProfiles = await db
    .select({
      id: profiles.id,
      username: profiles.username,
      profileType: profiles.profileType,
      bio: profiles.bio,
      avatarUrl: profiles.avatarUrl,
      themeType: profiles.themeType,
      xp: profiles.xp,
      prestige: profiles.prestige,
      likes: profiles.likes,
      views: profiles.views,
    })
    .from(profiles)
    .orderBy(desc(profiles.views))
    .limit(100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <DiscoverClient initialProfiles={allProfiles as any} />
    </div>
  );
}
