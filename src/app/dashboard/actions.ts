'use server';

import { db } from '@/db';
import { users, profiles, links, wishes, themePurchases, type Link } from '@/db/schema';
import { eq, and, asc, sum } from 'drizzle-orm';
import { auth } from '@/auth';
import { del } from '@vercel/blob';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { getStoreThemeById } from '@/components/StoreThemes';
import { isAdultContent } from '@/utils/adultFilter';

async function verifyOwnership(userId: number): Promise<boolean> {
  const session = await auth();
  return session?.user?.id === String(userId);
}

async function verifyProfileOwnership(profileId: number, userId: number): Promise<boolean> {
  if (!(await verifyOwnership(userId))) return false;
  const [profile] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)))
    .limit(1);
  return !!profile;
}

// Create a new profile under a user account (Personal / Business / Gaming)
export async function createProfile(
  userId: number,
  username: string,
  profileType: 'personal' | 'business' | 'gaming'
): Promise<{ success: boolean; error?: string }> {
  if (!(await verifyOwnership(userId))) return { success: false, error: 'Unauthorized' };

  // Check profile limit per user
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return { success: false, error: 'User not found.' };

  const existingProfiles = await db.select().from(profiles).where(eq(profiles.userId, userId));
  const isOwner = user.email.toLowerCase() === 'amit_trillion@proton.me';
  const maxProfiles = isOwner ? 10 : 1;

  if (existingProfiles.length >= maxProfiles) {
    return { success: false, error: `Maximum ${maxProfiles} profiles allowed per account.` };
  }

  const usernameLower = username.toLowerCase().trim();
  if (usernameLower.length < 3 || usernameLower.length > 30) {
    return { success: false, error: 'Username must be 3-30 characters.' };
  }

  // Check if username is already taken
  const [existing] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.username, usernameLower))
    .limit(1);

  if (existing) {
    return { success: false, error: 'Username is already taken.' };
  }

  await db.insert(profiles).values({
    userId,
    username: usernameLower,
    profileType,
    bio: `Welcome to my ${profileType} profile!`,
    themeType: 'light',
  });

  revalidatePath('/dashboard', 'page');
  return { success: true };
}

// Update profile details
export async function updateProfile(profileId: number, userId: number, bio: string) {
  if (!(await verifyOwnership(userId))) throw new Error('Unauthorized');

  await db
    .update(profiles)
    .set({ bio })
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)));
}

// Save Theme Settings
export async function updateThemeSettings(
  profileId: number,
  userId: number,
  themeType: string,
  themeBgColor: string,
  themeTextColor: string,
  themeButtonStyle: 'rounded-xl' | 'rounded-full' | 'rounded-none' | 'shadow',
  themeBackdrop: string,
  themeRotateInterval?: string
) {
  if (!(await verifyOwnership(userId))) throw new Error('Unauthorized');

  // Check if theme is free or purchased
  const storeTheme = getStoreThemeById(themeType);
  if (storeTheme && storeTheme.tier !== 'free') {
    // Check if user is the admin/owner (gets all unlocked)
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const isOwner = user?.email.toLowerCase() === 'amit_trillion@proton.me';

    if (!isOwner) {
      // Check if purchased
      const [purchase] = await db
        .select()
        .from(themePurchases)
        .where(
          and(
            eq(themePurchases.userId, userId),
            eq(themePurchases.themeId, themeType),
            eq(themePurchases.status, 'paid')
          )
        )
        .limit(1);

      if (!purchase) {
        throw new Error('This is a premium theme. Please purchase it in the Theme Store.');
      }
    }
  }

  const updateData: any = {
    themeType,
    themeBgColor,
    themeTextColor,
    themeButtonStyle,
    themeBackdrop,
  };

  if (themeRotateInterval !== undefined) {
    updateData.themeRotateInterval = themeRotateInterval;
    updateData.lastThemeRotatedAt = new Date();
  }

  await db
    .update(profiles)
    .set(updateData)
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)));
    
  revalidatePath('/', 'layout');
}

// Remove Background Image
export async function removeBgImage(profileId: number, userId: number) {
  if (!(await verifyOwnership(userId))) throw new Error('Unauthorized');

  const [profile] = await db
    .select()
    .from(profiles)
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)))
    .limit(1);

  if (profile && profile.themeBgImage) {
    if (profile.themeBgImage.includes('public.blob.vercel-storage.com')) {
      try {
        await del(profile.themeBgImage);
      } catch (e) {
        console.error('Failed to delete background from Vercel Blob:', e);
      }
    }

    await db
      .update(profiles)
      .set({ themeBgImage: '', themeType: 'light' })
      .where(eq(profiles.id, profileId));
  }
  
  revalidatePath('/', 'layout');
}

// Request Account Deletion (Generates verification token and sends email)
export async function requestAccountDeletion(userId: number): Promise<{ success: boolean; token?: string; error?: string }> {
  if (!(await verifyOwnership(userId))) {
    return { success: false, error: 'Unauthorized' };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiry

  await db
    .update(users)
    .set({
      deleteToken: token,
      deleteTokenExpiresAt: expiresAt,
    })
    .where(eq(users.id, userId));

  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = process.env.NEXTAUTH_URL ? new URL(process.env.NEXTAUTH_URL).host : 'localhost:3000';
  const deletionLink = `${protocol}://${host}/delete-confirm?token=${token}`;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    const { Resend } = require('resend');
    const resend = new Resend(resendApiKey);
    try {
      await resend.emails.send({
        from: 'Mizari <onboarding@resend.dev>',
        to: user.email,
        subject: 'Confirm your Mizari account deletion',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 16px;">
            <h2 style="color: #ef4444; margin-top: 0;">Delete your Mizari Account</h2>
            <p>Hello,</p>
            <p>We received a request to permanently delete your Mizari account. If you did not request this, you can safely ignore this email.</p>
            <p>To confirm and permanently delete your account, click the button below:</p>
            <div style="margin: 24px 0;">
              <a href="${deletionLink}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Verify & Delete Account</a>
            </div>
            <p style="font-size: 12px; color: #6b7280; margin-top: 24px;">This link will expire in 1 hour. Once deleted, all your profiles, links, themes, and uploaded images will be permanently removed.</p>
          </div>
        `,
      });
    } catch (e) {
      console.error('Failed to send deletion email via Resend:', e);
    }
  } else {
    console.log(`[LOCAL DEV EMAIL] Deletion link: ${deletionLink}`);
  }

  // Security: only hand the raw token back to the browser when no email
  // provider is configured (local dev fallback). In production the token
  // must only ever reach the user via their inbox — returning it here too
  // would let anyone with a hijacked/active session confirm deletion
  // instantly without ever touching the account's email, defeating the
  // whole point of the out-of-band confirmation step.
  return { success: true, token: resendApiKey ? undefined : token };
}

// Confirm and execute Account Deletion
export async function confirmAccountDeletion(token: string): Promise<{ success: boolean; error?: string }> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.deleteToken, token))
    .limit(1);

  if (!user || !user.deleteTokenExpiresAt || user.deleteTokenExpiresAt < new Date()) {
    return { success: false, error: 'Invalid or expired deletion link.' };
  }

  // Fetch all profiles of this user to delete their uploaded images
  const userProfiles = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, user.id));

  for (const profile of userProfiles) {
    if (profile.avatarUrl && profile.avatarUrl.includes('public.blob.vercel-storage.com')) {
      try { await del(profile.avatarUrl); } catch (e) {}
    }
    if (profile.themeBgImage && profile.themeBgImage.includes('public.blob.vercel-storage.com')) {
      try { await del(profile.themeBgImage); } catch (e) {}
    }
  }

  // Delete user from database (Cascade deletes profiles, links, wishes automatically)
  await db.delete(users).where(eq(users.id, user.id));

  return { success: true };
}

// Add link associated with a profile
export async function addLink(
  profileId: number,
  userId: number,
  title: string,
  url: string,
  order: number,
  isProduct: number = 0,
  price: string = '',
  discount: string = '',
  productImage: string = '',
  scheduledStart: string | null = null,
  scheduledEnd: string | null = null,
  productCategory: string = '',
  isSensitive: number = 0
): Promise<Link | null> {
  if (!(await verifyProfileOwnership(profileId, userId))) throw new Error('Unauthorized');

  if (isAdultContent(url, title)) {
    throw new Error('Adult/NSFW links are blocked on Mizari.');
  }

  const [newLink] = await db
    .insert(links)
    .values({ 
      profileId, 
      title, 
      url, 
      order, 
      isProduct, 
      price, 
      discount, 
      productImage,
      scheduledStart: scheduledStart ? new Date(scheduledStart) : null,
      scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : null,
      productCategory,
      isSensitive
    })
    .returning();

  return newLink || null;
}

// Add many links at once (bulk paste). Validates and inserts in a single
// DB call. Returns which entries were skipped and why, so the UI can
// show the user exactly what happened instead of a silent partial add.
export async function bulkAddLinks(
  profileId: number,
  userId: number,
  items: { title: string; url: string }[]
): Promise<{ added: number; skipped: { title: string; reason: string }[]; newLinks: Link[] }> {
  if (!(await verifyProfileOwnership(profileId, userId))) throw new Error('Unauthorized');

  if (!items || items.length === 0) return { added: 0, skipped: [], newLinks: [] };
  if (items.length > 50) {
    throw new Error('You can add up to 50 links in one bulk import.');
  }

  const existing = await db
    .select({ order: links.order })
    .from(links)
    .where(eq(links.profileId, profileId));
  let nextOrder = existing.length > 0 ? Math.max(...existing.map((l) => l.order)) + 1 : 0;

  const toInsert: (typeof links.$inferInsert)[] = [];
  const skipped: { title: string; reason: string }[] = [];

  for (const raw of items) {
    const title = (raw.title || '').trim();
    let url = (raw.url || '').trim();

    if (!title && !url) continue; // silently ignore fully blank lines
    if (!title || !url) {
      skipped.push({ title: title || url, reason: 'Missing title or URL' });
      continue;
    }
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    try {
      new URL(url);
    } catch {
      skipped.push({ title, reason: 'Invalid URL' });
      continue;
    }
    if (isAdultContent(url, title)) {
      skipped.push({ title, reason: 'Adult/NSFW links are blocked on Mizari' });
      continue;
    }

    toInsert.push({
      profileId,
      title,
      url,
      order: nextOrder++,
      isProduct: 0,
      price: '',
      discount: '',
      productImage: '',
      productCategory: '',
      isSensitive: 0,
    });
  }

  let newLinks: Link[] = [];
  if (toInsert.length > 0) {
    newLinks = await db.insert(links).values(toInsert).returning();
  }

  revalidatePath('/dashboard');
  return { added: toInsert.length, skipped, newLinks };
}

// Add many product cards at once (bulk paste). Same validation approach
// as bulkAddLinks, but requires a price for each entry since that's what
// distinguishes a product card from a plain link.
export async function bulkAddProducts(
  profileId: number,
  userId: number,
  items: { title: string; url: string; price: string }[]
): Promise<{ added: number; skipped: { title: string; reason: string }[]; newLinks: Link[] }> {
  if (!(await verifyProfileOwnership(profileId, userId))) throw new Error('Unauthorized');

  if (!items || items.length === 0) return { added: 0, skipped: [], newLinks: [] };
  if (items.length > 50) {
    throw new Error('You can add up to 50 products in one bulk import.');
  }

  const existing = await db
    .select({ order: links.order })
    .from(links)
    .where(eq(links.profileId, profileId));
  let nextOrder = existing.length > 0 ? Math.max(...existing.map((l) => l.order)) + 1 : 0;

  const toInsert: (typeof links.$inferInsert)[] = [];
  const skipped: { title: string; reason: string }[] = [];

  for (const raw of items) {
    const title = (raw.title || '').trim();
    let url = (raw.url || '').trim();
    const price = (raw.price || '').trim();

    if (!title && !url && !price) continue;
    if (!title || !url || !price) {
      skipped.push({ title: title || url || '(untitled)', reason: 'Missing title, URL, or price' });
      continue;
    }
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    try {
      new URL(url);
    } catch {
      skipped.push({ title, reason: 'Invalid URL' });
      continue;
    }
    if (isAdultContent(url, title)) {
      skipped.push({ title, reason: 'Adult/NSFW links are blocked on Mizari' });
      continue;
    }

    toInsert.push({
      profileId,
      title,
      url,
      order: nextOrder++,
      isProduct: 1,
      price,
      discount: '',
      productImage: '',
      productCategory: '',
      isSensitive: 0,
    });
  }

  let newLinks: Link[] = [];
  if (toInsert.length > 0) {
    newLinks = await db.insert(links).values(toInsert).returning();
  }

  revalidatePath('/dashboard');
  return { added: toInsert.length, skipped, newLinks };
}

// Update link associated with a profile
export async function updateLink(
  id: number, 
  profileId: number,
  userId: number, 
  title: string, 
  url: string,
  isProduct: number = 0,
  price: string = '',
  discount: string = '',
  productImage: string = '',
  scheduledStart: string | null = null,
  scheduledEnd: string | null = null,
  productCategory: string = '',
  isSensitive: number = 0
) {
  if (!(await verifyProfileOwnership(profileId, userId))) throw new Error('Unauthorized');

  if (isAdultContent(url, title)) {
    throw new Error('Adult/NSFW links are blocked on Mizari.');
  }

  await db
    .update(links)
    .set({ 
      title, 
      url, 
      isProduct, 
      price, 
      discount, 
      productImage,
      scheduledStart: scheduledStart ? new Date(scheduledStart) : null,
      scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : null,
      productCategory,
      isSensitive
    })
    .where(and(eq(links.id, id), eq(links.profileId, profileId)));
}

// Delete link
export async function deleteLink(id: number, profileId: number, userId: number) {
  if (!(await verifyProfileOwnership(profileId, userId))) throw new Error('Unauthorized');

  await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.profileId, profileId)));
}

// Reorder links in a profile
export async function reorderLinks(linkIds: number[], profileId: number, userId: number) {
  if (!(await verifyProfileOwnership(profileId, userId))) throw new Error('Unauthorized');

  const updates = linkIds.map((id, index) =>
    db
      .update(links)
      .set({ order: index })
      .where(and(eq(links.id, id), eq(links.profileId, profileId)))
  );

  await Promise.all(updates);
}

// Toggle Tanabata Wish Tree visibility
export async function updateWishTreeToggle(profileId: number, userId: number, showWishes: number) {
  if (!(await verifyOwnership(userId)) || ![0, 1].includes(showWishes)) throw new Error('Unauthorized');

  await db
    .update(profiles)
    .set({ showWishes })
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)));
}

// Change account email address
export async function changeUserEmail(userId: number, newEmail: string): Promise<{ success: boolean; error?: string }> {
  if (!(await verifyOwnership(userId))) return { success: false, error: 'Unauthorized' };

  const emailLower = newEmail.toLowerCase().trim();
  if (!emailLower || !emailLower.includes('@')) {
    return { success: false, error: 'Invalid email address.' };
  }

  // Check if email already registered to someone else
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, emailLower))
    .limit(1);

  if (existing) {
    if (existing.id === userId) {
      return { success: false, error: 'This is already your registered email.' };
    }
    return { success: false, error: 'Email is already in use by another account.' };
  }

  await db
    .update(users)
    .set({ email: emailLower })
    .where(eq(users.id, userId));

  return { success: true };
}

// Ascend Profile to next Prestige Level
export async function ascendProfilePrestige(
  profileId: number,
  userId: number
): Promise<{ success: boolean; newPrestige?: number; error?: string }> {
  if (!(await verifyOwnership(userId))) return { success: false, error: 'Unauthorized' };

  const [profile] = await db
    .select()
    .from(profiles)
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)))
    .limit(1);

  if (!profile) return { success: false, error: 'Profile not found.' };

  // Verify that the profile has enough XP to ascend (Level 30 = 450,000 XP)
  const currentXp = profile.xp || 0;
  if (currentXp < 450000) {
    return { success: false, error: 'Insufficent XP. You must reach 450,000 XP (Level 30) to ascend!' };
  }

  const nextPrestige = (profile.prestige || 0) + 1;

  await db
    .update(profiles)
    .set({
      xp: 0, // Reset XP to 0 for next Prestige tier
      prestige: nextPrestige,
    })
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)));

  revalidatePath('/dashboard', 'page');
  return { success: true, newPrestige: nextPrestige };
}

// Update announcement settings — accepts up to 5 rotating messages.
// Announcement banner validation - smart spam detection with low false positives
function validateAnnouncementMessage(text: string, link: string): { valid: boolean; error?: string; warning?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  // 1. Length check - reasonable limit
  if (text.length > 200) {
    return { valid: false, error: 'Announcement message must be 200 characters or less' };
  }

  // 2. Check for excessive URLs/links in text (more than 1 URL is suspicious)
  const urlPattern = /(https?:\/\/|www\.)[^\s]+/gi;
  const urlMatches = text.match(urlPattern) || [];
  if (urlMatches.length > 1) {
    return { valid: false, error: 'Only one URL link is allowed per message' };
  }

  // 3. Check for excessive emojis (legitimate use: 1-3, suspicious: >10)
  const emojiPattern = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
  const emojiCount = (text.match(emojiPattern) || []).length;
  if (emojiCount > 10) {
    return { valid: false, error: 'Too many emojis - keep it simple' };
  }

  // 4. Check for extreme repetition (same word 5+ times = clearly spam)
  const words = text.split(/\s+/);
  if (words.length > 0) {
    const wordCounts: { [key: string]: number } = {};
    for (const word of words) {
      const lower = word.toLowerCase().replace(/[^\w]/g, '');
      if (lower.length > 2) { // Only count meaningful words
        wordCounts[lower] = (wordCounts[lower] || 0) + 1;
      }
    }
    const maxRepeat = Math.max(...Object.values(wordCounts));
    if (maxRepeat >= 5) {
      return { valid: false, error: 'Announcement looks like spam (repeated text)' };
    }
  }

  // 5. Check for severe CAPS abuse (>85% = clearly yelling/spam, not legitimate ALL CAPS like "NYC" or "USA")
  const upperCount = (text.match(/[A-Z]/g) || []).length;
  if (text.length > 10 && upperCount > text.length * 0.85) {
    return { valid: false, error: 'Announcement contains excessive UPPERCASE text' };
  }

  // 6. Check for excessive special characters (>25% = likely obfuscation attempt like fr33 m0ney)
  const specialCount = (text.match(/[!@#$%^&*~0-9]/g) || []).length;
  if (text.length > 20 && specialCount > text.length * 0.25) {
    return { valid: false, error: 'Too many numbers/special characters - keep it natural' };
  }

  // 7. Adult/illegal content check (strict - real abuse)
  if (link && link.trim().length > 0) {
    if (isAdultContent(link, text)) {
      return { valid: false, error: 'Adult/NSFW/illegal links are not allowed' };
    }

    // Check for link shorteners (redirect fraud tool)
    const clickBaitDomains = [
      'bit.ly', 'tinyurl.com', 'ow.ly', 'adf.ly', 'short.link', 'clck.ru',
      'rebrandly.com', 'buff.ly', 'lnk.in', 'furk.net'
    ];
    try {
      const linkDomain = new URL(link.startsWith('http') ? link : `http://${link}`).hostname || '';
      for (const domain of clickBaitDomains) {
        if (linkDomain === domain || linkDomain.endsWith('.' + domain)) {
          return { valid: false, error: 'Link shorteners are not allowed - use direct links' };
        }
      }
    } catch (e) {
      return { valid: false, error: 'Invalid link format' };
    }
  }

  // All checks passed
  return { valid: true };
}

// Check rate limit on announcements (max 1 per 15 minutes per profile)
async function checkAnnouncementRateLimit(profileId: number): Promise<{ allowed: boolean; nextAllowedAt?: Date }> {
  // In production, would check against a rate_limit table in DB
  // For now, basic check: if announcements were updated recently, allow but warn
  // Real implementation: store last_announcement_update timestamp in profiles table
  return { allowed: true };
}

// Keeps writing the legacy single text/link columns too (using the
// first message) so nothing that reads the old fields breaks.
export async function updateAnnouncementSettings(
  profileId: number,
  userId: number,
  messages: { text: string; link: string }[],
  active: number,
  color: string
) {
  if (!(await verifyProfileOwnership(profileId, userId))) throw new Error('Unauthorized');

  // Check rate limit
  const rateLimit = await checkAnnouncementRateLimit(profileId);
  if (!rateLimit.allowed) {
    throw new Error('Too many announcement updates. Please wait before updating again.');
  }

  const cleaned = messages
    .map((m) => ({ text: (m.text || '').trim(), link: (m.link || '').trim() }))
    .filter((m) => m.text)
    .slice(0, 5);

  // Validate each message against smart spam/misuse rules
  for (const m of cleaned) {
    const validation = validateAnnouncementMessage(m.text, m.link);
    if (!validation.valid) {
      throw new Error(`Announcement rejected: ${validation.error}`);
    }
  }

  await db
    .update(profiles)
    .set({
      announcementMessages: JSON.stringify(cleaned),
      announcementText: cleaned[0]?.text || '',
      announcementLink: cleaned[0]?.link || '',
      announcementActive: active,
      announcementColor: color,
    })
    .where(eq(profiles.id, profileId));
  revalidatePath('/dashboard', 'page');
}

// Update guestbook settings
export async function updateGuestbookSettings(
  profileId: number,
  userId: number,
  style: 'tanabata' | 'classic',
  heading: string
) {
  if (!(await verifyProfileOwnership(profileId, userId))) throw new Error('Unauthorized');

  await db
    .update(profiles)
    .set({
      guestbookStyle: style,
      guestbookHeading: heading.trim() || 'Guestbook',
    })
    .where(eq(profiles.id, profileId));
  revalidatePath('/dashboard', 'page');
}

// Delete a guestbook wish (moderation)
export async function deleteGuestbookWish(wishId: number, profileId: number, userId: number) {
  if (!(await verifyProfileOwnership(profileId, userId))) throw new Error('Unauthorized');

  await db
    .delete(wishes)
    .where(and(eq(wishes.id, wishId), eq(wishes.profileId, profileId)));
  revalidatePath('/dashboard', 'page');
}

// Update dynamic themes settings
export async function updateDynamicThemeSettings(
  profileId: number,
  userId: number,
  enableDynamicTheme: number,
  birthday: string
) {
  if (!(await verifyProfileOwnership(profileId, userId))) throw new Error('Unauthorized');

  await db
    .update(profiles)
    .set({
      enableDynamicTheme,
      birthday: birthday.trim(),
    })
    .where(eq(profiles.id, profileId));
  revalidatePath('/', 'layout');
}
