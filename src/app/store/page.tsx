import { auth } from '@/auth';
import { db } from '@/db';
import { themePurchases } from '@/db/schema';
import { eq } from 'drizzle-orm';
import StoreClient from './StoreClient';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Mizari Theme Store — Premium Anime Themes',
  description: 'Customize your Mizari link-in-bio page with premium animated themes. Buy once, use on any profile.',
};

export default async function StorePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/store');
  }

  const userId = parseInt(session.user.id);
  const purchases = await db
    .select()
    .from(themePurchases)
    .where(eq(themePurchases.userId, userId));

  // Get list of paid theme IDs
  const purchasedThemeIds = purchases
    .filter((p) => p.status === 'paid')
    .map((p) => p.themeId);

  return (
    <StoreClient 
      userId={userId} 
      purchasedThemeIds={purchasedThemeIds} 
      userEmail={session.user.email || ''} 
    />
  );
}
