'use server';

import { db } from '@/db';
import { wishes, profiles, profileReactions } from '@/db/schema';
import { eq, sql, desc, asc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import crypto from 'crypto';

const REACTION_COLUMNS: Record<string, 'reactionLike' | 'reactionLove' | 'reactionHaha' | 'reactionWow' | 'reactionSad' | 'reactionFire'> = {
  like: 'reactionLike',
  love: 'reactionLove',
  haha: 'reactionHaha',
  wow: 'reactionWow',
  sad: 'reactionSad',
  fire: 'reactionFire',
};

async function getVisitorHash(): Promise<string> {
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || '127.0.0.1';
  return crypto.createHash('sha256').update(ip).digest('hex');
}

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

// Change specific reaction on a profile (single active reaction model).
// The server — not the client — decides what the visitor's current
// reaction actually is, by looking it up via a hashed-IP record in
// profile_reactions. This closes the old trust gap where a client could
// claim any "oldReaction" value and inflate counters for free (e.g. by
// clearing localStorage, using a different browser, or calling the
// action directly).
export async function changeReaction(
  profileId: number,
  requestedReaction: string | null
) {
  const allowedTypes = ['like', 'love', 'haha', 'wow', 'sad', 'fire'];
  if (requestedReaction && !allowedTypes.includes(requestedReaction)) {
    throw new Error('Invalid reaction');
  }

  const visitorHash = await getVisitorHash();

  const [existing] = await db
    .select()
    .from(profileReactions)
    .where(and(eq(profileReactions.profileId, profileId), eq(profileReactions.visitorHash, visitorHash)))
    .limit(1);

  const oldReaction = existing?.reactionType ?? null;

  // Requesting the reaction you already have toggles it off. Requesting
  // a different one changes it. Either way, a visitor can only ever have
  // ONE active reaction recorded server-side — never more than one.
  const newReaction = oldReaction === requestedReaction ? null : requestedReaction;

  if (oldReaction === newReaction) {
    return { activeReaction: oldReaction };
  }

  const updateData: any = {};
  if (oldReaction) {
    const col = REACTION_COLUMNS[oldReaction];
    updateData[col] = sql`GREATEST(0, ${profiles[col]} - 1)`;
  }
  if (newReaction) {
    const col = REACTION_COLUMNS[newReaction];
    updateData[col] = sql`${profiles[col]} + 1`;
  }

  let likesDiff = 0;
  if (oldReaction) likesDiff -= 1;
  if (newReaction) likesDiff += 1;
  if (likesDiff !== 0) {
    updateData.likes = sql`GREATEST(0, ${profiles.likes} + ${likesDiff})`;
  }

  if (Object.keys(updateData).length > 0) {
    await db.update(profiles).set(updateData).where(eq(profiles.id, profileId));
  }

  if (newReaction) {
    if (existing) {
      await db
        .update(profileReactions)
        .set({ reactionType: newReaction, updatedAt: new Date() })
        .where(eq(profileReactions.id, existing.id));
    } else {
      await db.insert(profileReactions).values({ profileId, visitorHash, reactionType: newReaction });
    }
  } else if (existing) {
    await db.delete(profileReactions).where(eq(profileReactions.id, existing.id));
  }

  revalidatePath('/[username]', 'page');
  return { activeReaction: newReaction };
}

// Returns the current visitor's already-recorded reaction for a profile,
// if any — used to hydrate the button's initial state from the server
// instead of trusting localStorage alone.
export async function getMyReaction(profileId: number): Promise<string | null> {
  const visitorHash = await getVisitorHash();
  const [existing] = await db
    .select({ reactionType: profileReactions.reactionType })
    .from(profileReactions)
    .where(and(eq(profileReactions.profileId, profileId), eq(profileReactions.visitorHash, visitorHash)))
    .limit(1);
  return existing?.reactionType ?? null;
}
