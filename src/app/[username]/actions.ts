'use server';

import { db } from '@/db';
import { wishes, profiles } from '@/db/schema';
import { eq, sql, desc, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Add a wish to a profile's tree with automatic spam prevention & cleanup
export async function addWish(profileId: number, sender: string, text: string, color: string) {
  const cleanText = text.trim();
  if (!cleanText) throw new Error('Wish text cannot be empty');
  if (cleanText.length > 155) throw new Error('Wish too long');

  const cleanSender = sender.trim().slice(0, 30) || 'Anonymous';
  const finalWishText = cleanText.slice(0, 150);

  // Auto-cleanup: Fetch existing wishes for this profile
  const existingWishes = await db
    .select({ id: wishes.id })
    .from(wishes)
    .where(eq(wishes.profileId, profileId))
    .orderBy(asc(wishes.id));

  // If there are already 50 wishes, delete the oldest ones to prevent database spam
  if (existingWishes.length >= 50) {
    const toDeleteCount = existingWishes.length - 49;
    const idsToDelete = existingWishes.slice(0, toDeleteCount).map((w) => w.id);
    for (const id of idsToDelete) {
      await db.delete(wishes).where(eq(wishes.id, id));
    }
  }

  // Insert the new wish
  await db.insert(wishes).values({
    profileId,
    sender: cleanSender,
    text: finalWishText,
    color,
  });

  revalidatePath('/[username]', 'page');
}

// Increment specific reaction or general likes on a profile
export async function addReaction(profileId: number, reactionType: string) {
  const allowedTypes = ['like', 'love', 'haha', 'wow', 'sad', 'fire'];
  if (!allowedTypes.includes(reactionType)) throw new Error('Invalid reaction type');

  // We map the string reactionType to corresponding columns in profiles schema
  await db
    .update(profiles)
    .set({
      reactionLike: reactionType === 'like' ? sql`${profiles.reactionLike} + 1` : undefined,
      reactionLove: reactionType === 'love' ? sql`${profiles.reactionLove} + 1` : undefined,
      reactionHaha: reactionType === 'haha' ? sql`${profiles.reactionHaha} + 1` : undefined,
      reactionWow: reactionType === 'wow' ? sql`${profiles.reactionWow} + 1` : undefined,
      reactionSad: reactionType === 'sad' ? sql`${profiles.reactionSad} + 1` : undefined,
      reactionFire: reactionType === 'fire' ? sql`${profiles.reactionFire} + 1` : undefined,
      likes: sql`${profiles.likes} + 1`, // increment total likes for fallback/levels calculation
    })
    .where(eq(profiles.id, profileId));

  revalidatePath('/[username]', 'page');
}

export async function incrementLikes(profileId: number) {
  await addReaction(profileId, 'love');
}
