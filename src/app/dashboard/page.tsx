import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users, links } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)))
    .limit(1);

  if (!user) redirect('/login');

  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, user.id))
    .orderBy(asc(links.order));

  return (
    <DashboardClient
      user={{
        id: user.id,
        username: user.username,
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
        themeType: (user.themeType || 'light') as 'light' | 'dark' | 'custom',
        themeBgColor: user.themeBgColor || '#fafafa',
        themeTextColor: user.themeTextColor || '#1a1a2e',
        themeBgImage: user.themeBgImage || '',
        themeButtonStyle: (user.themeButtonStyle || 'rounded-xl') as 'rounded-xl' | 'rounded-full' | 'rounded-none' | 'shadow',
      }}
      initialLinks={userLinks}
    />
  );
}
