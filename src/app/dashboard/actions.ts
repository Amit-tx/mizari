'use server';

import { db } from '@/db';
import { users, links, type Link } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';

async function verifyOwnership(userId: number): Promise<boolean> {
  const session = await auth();
  return session?.user?.id === String(userId);
}

export async function updateProfile(userId: number, bio: string, avatarUrl: string) {
  if (!(await verifyOwnership(userId))) throw new Error('Unauthorized');

  await db
    .update(users)
    .set({ bio, avatarUrl })
    .where(eq(users.id, userId));
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
