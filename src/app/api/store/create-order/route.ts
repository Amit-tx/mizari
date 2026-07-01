import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { users, themePurchases } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getStoreThemeById, BUNDLE_DEALS } from '@/components/StoreThemes';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { themeId, bundleId } = await req.json();

    const userId = parseInt(session.user.id);
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Check if it's a bundle or single theme
    let amountInPaise = 0;
    let label = '';

    if (bundleId) {
      const bundle = BUNDLE_DEALS.find((b) => b.id === bundleId);
      if (!bundle) return NextResponse.json({ error: 'Bundle not found' }, { status: 404 });
      amountInPaise = bundle.price * 100;
      label = bundle.name;
    } else if (themeId) {
      const theme = getStoreThemeById(themeId);
      if (!theme) return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
      if (theme.tier === 'free') return NextResponse.json({ error: 'Theme is free' }, { status: 400 });

      // Check if already purchased
      const [existing] = await db
        .select()
        .from(themePurchases)
        .where(and(eq(themePurchases.userId, userId), eq(themePurchases.themeId, themeId), eq(themePurchases.status, 'paid')))
        .limit(1);
      if (existing) return NextResponse.json({ error: 'Already purchased' }, { status: 400 });

      amountInPaise = theme.price * 100;
      label = theme.name;
    } else {
      return NextResponse.json({ error: 'themeId or bundleId required' }, { status: 400 });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `mizari_${userId}_${Date.now()}`,
      notes: { userId: String(userId), themeId: themeId || '', bundleId: bundleId || '', label },
    });

    // Save pending purchase record
    if (themeId) {
      await db.insert(themePurchases).values({
        userId,
        themeId,
        pricePaid: amountInPaise,
        orderId: order.id,
        status: 'pending',
      });
    }

    return NextResponse.json({
      orderId: order.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      label,
      email: user.email,
    });
  } catch (err) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
