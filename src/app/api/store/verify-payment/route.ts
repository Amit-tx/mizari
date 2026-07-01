import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { themePurchases } from '@/db/schema';
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
      // Update existing pending purchase
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
    } else {
      return NextResponse.json({ error: 'themeId or bundleId required' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Verify payment error:', err);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
