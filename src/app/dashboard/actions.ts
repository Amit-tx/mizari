'use server';

import { db } from '@/db';
import { users, links, type Link } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';
import { del } from '@vercel/blob';

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

export async function addLink(
  userId: number,
  title: string,
  url: string,
  order: number
): Promise<Link | null> {
  if (!(await verifyOwnership(userId))) throw new Error('Unauthorized');

  const [newLink] = await db
    .insert(links)
    .values({ userId, title, url, order })
    .returning();

  return newLink || null;
}

export async function updateLink(id: number, userId: number, title: string, url: string) {
  if (!(await verifyOwnership(userId))) throw new Error('Unauthorized');

  await db
    .update(links)
    .set({ title, url })
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
