'use server';

import { db } from '@/db';
import { wishes } from '@/db/schema';
import { revalidatePath } from 'next/cache';

// Add a wish to a user's tree
export async function addWish(userId: number, sender: string, text: string, color: string) {
  if (!text.trim()) throw new Error('Wish text cannot be empty');
  
  const cleanSender = sender.trim() || 'Anonymous';
  const cleanText = text.trim();

  await db.insert(wishes).values({
    userId,
    sender: cleanSender,
    text: cleanText,
    color,
  });

  // Revalidate the profile page to show the new wish instantly
  revalidatePath('/[username]', 'page');
}
