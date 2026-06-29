'use server';

import { db } from '@/db';
import { users, links, type Link } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';
import { del } from '@vercel/blob';
import crypto from 'crypto';

async function verifyOwnership(userId: number): Promise<boolean> {
  const session = await auth();
  return session?.user?.id === String(userId);
}

export async function updateProfile(userId: number, bio: string) {
  if (!(await verifyOwnership(userId))) throw new Error('Unauthorized');

  await db
    .update(users)
    .set({ bio })
    .where(eq(users.id, userId));
}

export async function updateThemeSettings(
  userId: number,
  themeType: string,
  themeBgColor: string,
  themeTextColor: string,
  themeButtonStyle: 'rounded-xl' | 'rounded-full' | 'rounded-none' | 'shadow'
) {
  if (!(await verifyOwnership(userId))) throw new Error('Unauthorized');

  await db
    .update(users)
    .set({
      themeType,
      themeBgColor,
      themeTextColor,
      themeButtonStyle,
    })
    .where(eq(users.id, userId));
}

export async function removeBgImage(userId: number) {
  if (!(await verifyOwnership(userId))) throw new Error('Unauthorized');

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (user && user.themeBgImage) {
    if (user.themeBgImage.includes('public.blob.vercel-storage.com')) {
      try {
        await del(user.themeBgImage);
      } catch (e) {
        console.error('Failed to delete background from Vercel Blob:', e);
      }
    }

    await db
      .update(users)
      .set({ themeBgImage: '', themeType: 'light' })
      .where(eq(users.id, userId));
  }
}

// Request Account Deletion (Generates verification token)
export async function requestAccountDeletion(userId: number): Promise<{ success: boolean; token?: string; error?: string }> {
  if (!(await verifyOwnership(userId))) {
    return { success: false, error: 'Unauthorized' };
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiry

  await db
    .update(users)
    .set({
      deleteToken: token,
      deleteTokenExpiresAt: expiresAt,
    })
    .where(eq(users.id, userId));

  return { success: true, token };
}

// Confirm and execute Account Deletion
export async function confirmAccountDeletion(token: string): Promise<{ success: boolean; error?: string }> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.deleteToken, token))
    .limit(1);

  if (!user || !user.deleteTokenExpiresAt || user.deleteTokenExpiresAt < new Date()) {
    return { success: false, error: 'Invalid or expired deletion link.' };
  }

  // Delete user avatar from Vercel Blob if exists
  if (user.avatarUrl && user.avatarUrl.includes('public.blob.vercel-storage.com')) {
    try {
      await del(user.avatarUrl);
    } catch (e) {
      console.error('Error deleting avatar on account deletion:', e);
    }
  }

  // Delete user background image from Vercel Blob if exists
  if (user.themeBgImage && user.themeBgImage.includes('public.blob.vercel-storage.com')) {
    try {
      await del(user.themeBgImage);
    } catch (e) {
      console.error('Error deleting background image on account deletion:', e);
    }
  }

  // Delete user from database (Cascade deletes links automatically due to FK constraint)
  await db.delete(users).where(eq(users.id, user.id));

  return { success: true };
}

export async function addLink(
  userId: number,
  title: string,
  url: string,
  order: number,
  isProduct: number = 0,
  price: string = '',
  discount: string = '',
  productImage: string = ''
): Promise<Link | null> {
  if (!(await verifyOwnership(userId))) throw new Error('Unauthorized');

  const [newLink] = await db
    .insert(links)
    .values({ userId, title, url, order, isProduct, price, discount, productImage })
    .returning();

  return newLink || null;
}

export async function updateLink(
  id: number, 
  userId: number, 
  title: string, 
  url: string,
  isProduct: number = 0,
  price: string = '',
  discount: string = '',
  productImage: string = ''
) {
  if (!(await verifyOwnership(userId))) throw new Error('Unauthorized');

  await db
    .update(links)
    .set({ title, url, isProduct, price, discount, productImage })
    .where(and(eq(links.id, id), eq(links.userId, userId)));
}

export async function deleteLink(id: number, userId: number) {
  if (!(await verifyOwnership(userId))) throw new Error('Unauthorized');

  await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)));
}

export async function reorderLinks(linkIds: number[], userId: number) {
  if (!(await verifyOwnership(userId))) throw new Error('Unauthorized');

  const updates = linkIds.map((id, index) =>
    db
      .update(links)
      .set({ order: index })
      .where(and(eq(links.id, id), eq(links.userId, userId)))
  );

  await Promise.all(updates);
}
