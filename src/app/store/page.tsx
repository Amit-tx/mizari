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
  const userId = session?.user?.id ? parseInt(session.user.id) : null;

  const { themePurchases, marketplaceThemes } = await import('@/db/schema');
  
  let purchasedThemeIds: string[] = [];
  if (userId) {
    const purchases = await db
      .select()
      .from(themePurchases)
      .where(eq(themePurchases.userId, userId));

    purchasedThemeIds = purchases
      .filter((p) => p.status === 'paid')
      .map((p) => p.themeId);
  }

  // Fetch active marketplace community themes
  const mThemes = await db
    .select()
    .from(marketplaceThemes)
    .where(eq(marketplaceThemes.status, 'active'));

  const communityThemes = mThemes.map((ct) => {
    // Determine tags/categories based on styling config
    const cats: ('Anime' | 'Minimal' | 'Luxury' | 'Gaming' | 'Creator' | 'Business')[] = ['Creator'];
    if (ct.price >= 99) cats.push('Luxury');
    if (ct.backdropStyle.includes('solid')) cats.push('Minimal');
    else cats.push('Anime');

    return {
      id: String(ct.id),
      name: ct.name,
      emoji: '🎨',
      tier: (ct.price >= 99 ? 'exclusive' : 'premium') as 'premium' | 'exclusive',
      price: ct.price,
      description: `Created by a Mizari Creator. Features custom colors and backdrop elements.`,
      categories: cats,
      tags: ['creator', 'community'],
      bgColor: ct.bgColor,
      textColor: ct.textColor,
      btnBg: ct.bgColor,
      bgGradient: ct.bgImage ? `url(${ct.bgImage})` : undefined,
    };
  });

  return (
    <StoreClient 
      userId={userId} 
      purchasedThemeIds={purchasedThemeIds} 
      userEmail={session?.user?.email || ''} 
      communityThemes={communityThemes}
    />
  );
}
