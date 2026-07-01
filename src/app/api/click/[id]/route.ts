import { db } from '@/db';
import { links } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { isBotUserAgent, validateIpCooldown, grantXp } from '@/utils/xp';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const linkId = parseInt(id, 10);

  if (isNaN(linkId)) {
    return NextResponse.json({ error: 'Invalid link ID' }, { status: 400 });
  }

  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.id, linkId))
    .limit(1);

  if (!link) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }

  const userAgent = request.headers.get('user-agent');
  const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

  // Apply anti-spam filtering (block bots and enforce 1-hour IP cooldown per link)
  if (!isBotUserAgent(userAgent)) {
    const isAllowed = await validateIpCooldown(ipAddress, linkId, 'click');
    if (isAllowed) {
      // 1. Increment click count in links table
      await db
        .update(links)
        .set({ clicks: sql`${links.clicks} + 1` })
        .where(eq(links.id, linkId));

      // 2. Grant 3 XP to profile
      await grantXp(link.profileId, 3);
    }
  }

  // Ensure URL has a protocol (http/https) prefix, otherwise NextResponse.redirect will fail or treat it as relative path
  let targetUrl = link.url;
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  return NextResponse.redirect(targetUrl, 302);
}
