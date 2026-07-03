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

// Change specific reaction on a profile (single active reaction model)
export async function changeReaction(
  profileId: number,
  oldReaction: string | null,
  newReaction: string | null
) {
  const allowedTypes = ['like', 'love', 'haha', 'wow', 'sad', 'fire'];
  if (oldReaction && !allowedTypes.includes(oldReaction)) throw new Error('Invalid old reaction');
  if (newReaction && !allowedTypes.includes(newReaction)) throw new Error('Invalid new reaction');

  const updateData: any = {};

  if (oldReaction) {
    // Decrement old
    const col = oldReaction === 'like' ? 'reactionLike' :
                oldReaction === 'love' ? 'reactionLove' :
                oldReaction === 'haha' ? 'reactionHaha' :
                oldReaction === 'wow' ? 'reactionWow' :
                oldReaction === 'sad' ? 'reactionSad' : 'reactionFire';
    updateData[col] = sql`GREATEST(0, ${profiles[col]} - 1)`;
  }

  if (newReaction) {
    // Increment new
    const col = newReaction === 'like' ? 'reactionLike' :
                newReaction === 'love' ? 'reactionLove' :
                newReaction === 'haha' ? 'reactionHaha' :
                newReaction === 'wow' ? 'reactionWow' :
                newReaction === 'sad' ? 'reactionSad' : 'reactionFire';
    updateData[col] = sql`${profiles[col]} + 1`;
  }

  // Adjust total likes
  let likesDiff = 0;
  if (oldReaction) likesDiff -= 1;
  if (newReaction) likesDiff += 1;
  if (likesDiff !== 0) {
    updateData.likes = sql`GREATEST(0, ${profiles.likes} + ${likesDiff})`;
  }

  if (Object.keys(updateData).length > 0) {
    await db
      .update(profiles)
      .set(updateData)
      .where(eq(profiles.id, profileId));
  }

  revalidatePath('/[username]', 'page');
}

export async function incrementLikes(profileId: number) {
  await changeReaction(profileId, null, 'love');
}
