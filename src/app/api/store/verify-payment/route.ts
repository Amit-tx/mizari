import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { themePurchases, profiles } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';
import { BUNDLE_DEALS } from '@/components/StoreThemes';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      themeId,
      bundleId,
    } = await req.json();

    const userId = parseInt(session.user.id);

    // Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    if (bundleId) {
      const bundle = BUNDLE_DEALS.find((b) => b.id === bundleId);
      if (!bundle) return NextResponse.json({ error: 'Bundle not found' }, { status: 404 });

      // Save purchase for all themes in bundle
      const purchasePromises = bundle.themes.map((tid) =>
        db
          .insert(themePurchases)
          .values({
            userId,
            themeId: tid,
            pricePaid: Math.round((bundle.price / bundle.themes.length) * 100),
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            status: 'paid',
          })
          // If they already bought one of the themes in the bundle, we can overwrite or ignore conflict
          .onConflictDoNothing()
      );
      await Promise.all(purchasePromises);
    } else if (themeId) {
      const isMarketTheme = String(themeId).startsWith('market_') || !isNaN(Number(themeId));
      
      if (isMarketTheme) {
        const marketThemeIdStr = String(themeId).replace('market_', '');
        const marketThemeId = parseInt(marketThemeIdStr);

        const { marketplaceThemes, marketplaceTransactions, creatorBalances } = await import('@/db/schema');
        
        // 1. Fetch community theme details
        const [mTheme] = await db
          .select()
          .from(marketplaceThemes)
          .where(eq(marketplaceThemes.id, marketThemeId))
          .limit(1);

        if (!mTheme) return NextResponse.json({ error: 'Community theme not found' }, { status: 404 });

        const totalAmount = mTheme.price * 100; // in paise
        const creatorEarnings = Math.round(totalAmount * 0.85); // 85% creator split
        const platformFee = totalAmount - creatorEarnings; // 15% platform split

        // 2. Update buyer's purchase record
        const formattedThemeId = `market_${mTheme.id}`;
        await db
          .update(themePurchases)
          .set({
            paymentId: razorpay_payment_id,
            status: 'paid',
            purchasedAt: new Date(),
          })
          .where(
            and(
              eq(themePurchases.userId, userId),
              eq(themePurchases.orderId, razorpay_order_id),
              eq(themePurchases.themeId, formattedThemeId)
            )
          );

        // 3. Record marketplace transaction
        await db.insert(marketplaceTransactions).values({
          themeId: mTheme.id,
          buyerId: userId,
          orderId: razorpay_order_id,
          totalAmount,
          creatorEarnings,
          platformFee,
          status: 'paid',
        });

        // 4. Credit creator balance
        const [creatorBal] = await db
          .select()
          .from(creatorBalances)
          .where(eq(creatorBalances.userId, mTheme.creatorId))
          .limit(1);

        if (creatorBal) {
          await db
            .update(creatorBalances)
            .set({
              totalEarned: creatorBal.totalEarned + creatorEarnings,
            })
            .where(eq(creatorBalances.userId, mTheme.creatorId));
        } else {
          await db.insert(creatorBalances).values({
            userId: mTheme.creatorId,
            totalEarned: creatorEarnings,
            pendingWithdrawal: 0,
            paidOut: 0,
          });
        }

        // 5. Update theme sales count
        await db
          .update(marketplaceThemes)
          .set({
            salesCount: mTheme.salesCount + 1,
          })
          .where(eq(marketplaceThemes.id, mTheme.id));

        // 6. Award 500 XP to the theme creator's profile
        const [creatorProfile] = await db
          .select()
          .from(profiles)
          .where(eq(profiles.userId, mTheme.creatorId))
          .limit(1);

        if (creatorProfile) {
          const { grantXp } = require('@/utils/xp');
          await grantXp(creatorProfile.id, 500);
        }
      } else {
        // Update existing pending preset purchase
        await db
          .update(themePurchases)
          .set({
            paymentId: razorpay_payment_id,
            status: 'paid',
            purchasedAt: new Date(),
          })
          .where(
            and(
              eq(themePurchases.userId, userId),
              eq(themePurchases.orderId, razorpay_order_id),
              eq(themePurchases.themeId, themeId)
            )
          );
      }
    } else {
      return NextResponse.json({ error: 'themeId or bundleId required' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Verify payment error:', err);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
