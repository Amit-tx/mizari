'use server';

import { db } from '@/db';
import { users, profiles, marketplaceThemes, creatorBalances, marketplaceTransactions } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

async function verifyOwnership(userId: number): Promise<boolean> {
  const session = await auth();
  return session?.user?.id === String(userId);
}

// 1. Publish theme to marketplace
export async function publishTheme(
  profileId: number,
  userId: number,
  themeName: string,
  price: number
): Promise<{ success: boolean; error?: string }> {
  if (!(await verifyOwnership(userId))) return { success: false, error: 'Unauthorized' };

  if (price < 10 || price > 500) {
    return { success: false, error: 'Price must be between ₹10 and ₹500.' };
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)))
    .limit(1);

  if (!profile) return { success: false, error: 'Profile not found.' };

  // Insert into marketplace themes
  await db.insert(marketplaceThemes).values({
    creatorId: userId,
    name: themeName,
    price,
    bgColor: profile.themeBgColor,
    textColor: profile.themeTextColor,
    bgImage: profile.themeBgImage || '',
    buttonStyle: profile.themeButtonStyle,
    backdropStyle: profile.themeBackdrop,
    status: 'active', // Direct active!
  });

  revalidatePath('/dashboard', 'page');
  revalidatePath('/store', 'page');
  return { success: true };
}

// 2. Request Payout / Withdrawal
export async function requestPayout(
  userId: number,
  upiId: string,
  amountInINR: number
): Promise<{ success: boolean; error?: string }> {
  if (!(await verifyOwnership(userId))) return { success: false, error: 'Unauthorized' };

  if (!upiId.trim() || !upiId.includes('@')) {
    return { success: false, error: 'Please enter a valid UPI ID (e.g. name@upi).' };
  }

  const amountInPaise = amountInINR * 100;
  if (amountInPaise < 50000) {
    return { success: false, error: 'Minimum payout withdrawal is ₹500.' };
  }

  const [balance] = await db
    .select()
    .from(creatorBalances)
    .where(eq(creatorBalances.userId, userId))
    .limit(1);

  const availableBalance = balance 
    ? balance.totalEarned - balance.pendingWithdrawal - balance.paidOut 
    : 0;

  if (availableBalance < amountInPaise) {
    return { success: false, error: 'Insufficient balance for this payout request.' };
  }

  // Update balance record
  if (balance) {
    await db
      .update(creatorBalances)
      .set({
        pendingWithdrawal: balance.pendingWithdrawal + amountInPaise,
        upiId,
      })
      .where(eq(creatorBalances.userId, userId));
  } else {
    await db.insert(creatorBalances).values({
      userId,
      pendingWithdrawal: amountInPaise,
      totalEarned: 0,
      paidOut: 0,
      upiId,
    });
  }

  revalidatePath('/dashboard', 'page');
  return { success: true };
}

// 3. Fetch Creator Balance and Transactions
export async function getCreatorStats(userId: number) {
  if (!(await verifyOwnership(userId))) throw new Error('Unauthorized');

  const [balance] = await db
    .select()
    .from(creatorBalances)
    .where(eq(creatorBalances.userId, userId))
    .limit(1);

  const sales = await db
    .select({
      id: marketplaceTransactions.id,
      amount: marketplaceTransactions.totalAmount,
      earnings: marketplaceTransactions.creatorEarnings,
      createdAt: marketplaceTransactions.createdAt,
      themeName: marketplaceThemes.name,
    })
    .from(marketplaceTransactions)
    .innerJoin(marketplaceThemes, eq(marketplaceTransactions.themeId, marketplaceThemes.id))
    .where(eq(marketplaceThemes.creatorId, userId))
    .orderBy(desc(marketplaceTransactions.createdAt));

  return {
    totalEarned: balance?.totalEarned || 0,
    pendingWithdrawal: balance?.pendingWithdrawal || 0,
    paidOut: balance?.paidOut || 0,
    upiId: balance?.upiId || '',
    sales,
  };
}
