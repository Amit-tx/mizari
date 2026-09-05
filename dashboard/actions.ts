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
  if (!process.env.DATABASE_URL) return true;
  const session = await auth();
  return session?.user?.id === String(userId);
}

async function verifyProfileOwnership(profileId: number, userId: number): Promise<boolean> {
  if (!process.env.DATABASE_URL) return true;
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
  if (!process.env.DATABASE_URL) return { success: true };
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
  if (!process.env.DATABASE_URL) return;
  if (!(await verifyOwnership(userId))) throw new Error('Unauthorized');

  await db
    .update(profiles)
    .set({ bio })
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)));
}

// Save Bio Page Extras: tagline, dual CTA buttons, Info Card, Contact block
export async function updateProfileExtras(
  profileId: number,
  userId: number,
  data: {
    tagline: string;
    ctaPrimaryText: string;
    ctaPrimaryLink: string;
    ctaSecondaryText: string;
    ctaSecondaryLink: string;
    infoCardEnabled: boolean;
    infoCardTitle: string;
    infoCardItems: { label: string; value: string }[];
    contactEnabled: boolean;
    contactPhone: string;
    contactEmail: string;
    birthday: string;
  }
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.DATABASE_URL) return { success: true };
  if (!(await verifyOwnership(userId))) return { success: false, error: 'Unauthorized' };
  if (!(await verifyProfileOwnership(profileId, userId))) return { success: false, error: 'Unauthorized' };

  // Cap Info Card to 8 items and trim empty rows
  const cleanItems = data.infoCardItems
    .filter((item) => item.label.trim() || item.value.trim())
    .slice(0, 8)
    .map((item) => ({ label: item.label.trim().slice(0, 40), value: item.value.trim().slice(0, 100) }));

  // Basic email sanity check (don't hard-fail, just skip if invalid)
  const emailValid = !data.contactEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail);
  if (!emailValid) return { success: false, error: 'Invalid contact email address.' };

  await db
    .update(profiles)
    .set({
      tagline: data.tagline.trim().slice(0, 150),
      ctaPrimaryText: data.ctaPrimaryText.trim().slice(0, 60),
      ctaPrimaryLink: data.ctaPrimaryLink.trim(),
      ctaSecondaryText: data.ctaSecondaryText.trim().slice(0, 60),
      ctaSecondaryLink: data.ctaSecondaryLink.trim(),
      infoCardEnabled: data.infoCardEnabled ? 1 : 0,
      infoCardTitle: data.infoCardTitle.trim().slice(0, 60) || 'Profile',
      infoCardItems: JSON.stringify(cleanItems),
      contactEnabled: data.contactEnabled ? 1 : 0,
      contactPhone: data.contactPhone.trim().slice(0, 30),
      contactEmail: data.contactEmail.trim().slice(0, 255),
      birthday: data.birthday.trim().slice(0, 10),
    })
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)));

  revalidatePath('/dashboard', 'page');
  return { success: true };
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
  if (!process.env.DATABASE_URL) return;
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
  if (!process.env.DATABASE_URL) return;
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
  if (!process.env.DATABASE_URL) return { success: true };
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

  return { success: true, token: resendApiKey ? undefined : token };
}

// Confirm and execute Account Deletion
export async function confirmAccountDeletion(token: string): Promise<{ success: boolean; error?: string }> {
  if (!process.env.DATABASE_URL) return { success: true };
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
  if (!process.env.DATABASE_URL) {
    return {
      id: Math.floor(Math.random() * 10000),
      profileId,
      title,
      url,
      order,
      clicks: 0,
      isProduct,
      price,
      discount,
      productImage,
      scheduledStart: scheduledStart ? new Date(scheduledStart) : null,
      scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : null,
      productCategory,
      isSensitive
    } as any;
  }
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

// Add many links at once (bulk paste)
export async function bulkAddLinks(
  profileId: number,
  userId: number,
  items: { title: string; url: string }[]
): Promise<{ added: number; skipped: { title: string; reason: string }[]; newLinks: Link[] }> {
  if (!process.env.DATABASE_URL) return { added: items.length, skipped: [], newLinks: [] };
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

    if (!title && !url) continue;
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

// Add many product cards at once
export async function bulkAddProducts(
  profileId: number,
  userId: number,
  items: { title: string; url: string; price: string }[]
): Promise<{ added: number; skipped: { title: string; reason: string }[]; newLinks: Link[] }> {
  if (!process.env.DATABASE_URL) return { added: items.length, skipped: [], newLinks: [] };
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
  if (!process.env.DATABASE_URL) return;
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
  if (!process.env.DATABASE_URL) return;
  if (!(await verifyProfileOwnership(profileId, userId))) throw new Error('Unauthorized');

  await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.profileId, profileId)));
}

// Reorder links in a profile
export async function reorderLinks(linkIds: number[], profileId: number, userId: number) {
  if (!process.env.DATABASE_URL) return;
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
  if (!process.env.DATABASE_URL) return;
  if (!(await verifyOwnership(userId)) || ![0, 1].includes(showWishes)) throw new Error('Unauthorized');

  await db
    .update(profiles)
    .set({ showWishes })
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)));
}

// Change account email address
export async function changeUserEmail(userId: number, newEmail: string): Promise<{ success: boolean; error?: string }> {
  if (!process.env.DATABASE_URL) return { success: true };
  if (!(await verifyOwnership(userId))) return { success: false, error: 'Unauthorized' };

  const emailLower = newEmail.toLowerCase().trim();
  if (!emailLower || !emailLower.includes('@')) {
    return { success: false, error: 'Invalid email address.' };
  }

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
  if (!process.env.DATABASE_URL) return { success: true };
  if (!(await verifyOwnership(userId))) return { success: false, error: 'Unauthorized' };

  const [profile] = await db
    .select()
    .from(profiles)
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)))
    .limit(1);

  if (!profile) return { success: false, error: 'Profile not found.' };

  const currentXp = profile.xp || 0;
  if (currentXp < 450000) {
    return { success: false, error: 'Insufficent XP. You must reach 450,000 XP (Level 30) to ascend!' };
  }

  const nextPrestige = (profile.prestige || 0) + 1;

  await db
    .update(profiles)
    .set({
      xp: 0,
      prestige: nextPrestige,
    })
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)));

  revalidatePath('/dashboard', 'page');
  return { success: true, newPrestige: nextPrestige };
}

// Update announcement settings
function validateAnnouncementMessage(text: string, link: string): { valid: boolean; error?: string; warning?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  if (text.length > 200) {
    return { valid: false, error: 'Announcement message must be 200 characters or less' };
  }
  const urlPattern = /(https?:\/\/|www\.)[^\s]+/gi;
  const urlMatches = text.match(urlPattern) || [];
  if (urlMatches.length > 1) {
    return { valid: false, error: 'Only one URL link is allowed per message' };
  }
  const emojiPattern = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
  const emojiCount = (text.match(emojiPattern) || []).length;
  if (emojiCount > 10) {
    return { valid: false, error: 'Too many emojis - keep it simple' };
  }
  const words = text.split(/\s+/);
  if (words.length > 0) {
    const wordCounts: { [key: string]: number } = {};
    for (const word of words) {
      const lower = word.toLowerCase().replace(/[^\w]/g, '');
      if (lower.length > 2) {
        wordCounts[lower] = (wordCounts[lower] || 0) + 1;
      }
    }
    const maxRepeat = Math.max(...Object.values(wordCounts));
    if (maxRepeat >= 5) {
      return { valid: false, error: 'Announcement looks like spam (repeated text)' };
    }
  }
  const upperCount = (text.match(/[A-Z]/g) || []).length;
  if (text.length > 10 && upperCount > text.length * 0.85) {
    return { valid: false, error: 'Announcement contains excessive UPPERCASE text' };
  }
  const specialCount = (text.match(/[!@#$%^&*~0-9]/g) || []).length;
  if (text.length > 20 && specialCount > text.length * 0.25) {
    return { valid: false, error: 'Too many numbers/special characters - keep it natural' };
  }
  if (link && link.trim().length > 0) {
    if (isAdultContent(link, text)) {
      return { valid: false, error: 'Adult/NSFW/illegal links are not allowed' };
    }
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
  return { valid: true };
}

async function checkAnnouncementRateLimit(profileId: number): Promise<{ allowed: boolean; nextAllowedAt?: Date }> {
  return { allowed: true };
}

export async function updateAnnouncementSettings(
  profileId: number,
  userId: number,
  messages: { text: string; link: string }[],
  active: number,
  color: string
) {
  if (!process.env.DATABASE_URL) return;
  if (!(await verifyProfileOwnership(profileId, userId))) throw new Error('Unauthorized');

  const rateLimit = await checkAnnouncementRateLimit(profileId);
  if (!rateLimit.allowed) {
    throw new Error('Too many announcement updates. Please wait before updating again.');
  }

  const cleaned = messages
    .map((m) => ({ text: (m.text || '').trim(), link: (m.link || '').trim() }))
    .filter((m) => m.text)
    .slice(0, 5);

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
  if (!process.env.DATABASE_URL) return;
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

// Delete a guestbook wish
export async function deleteGuestbookWish(wishId: number, profileId: number, userId: number) {
  if (!process.env.DATABASE_URL) return;
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
  if (!process.env.DATABASE_URL) return;
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
