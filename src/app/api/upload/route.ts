import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { checkImageSafety } from '@/lib/moderateImage';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as 'avatar' | 'background';
    const profileIdStr = formData.get('profileId') as string;

    if (!file || !profileIdStr) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const profileId = parseInt(profileIdStr);
    if (type !== 'avatar' && type !== 'background') {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 });
    }

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, WEBP, and GIF images are allowed.' },
        { status: 400 }
      );
    }

    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Screen for nudity/explicit content before it's stored or shown
    // publicly on a profile or theme background.
    const moderation = await checkImageSafety(file);
    if (!moderation.safe) {
      return NextResponse.json(
        { error: 'This image was flagged as inappropriate and cannot be uploaded.' },
        { status: 400 }
      );
    }

    // Fetch existing profile to verify ownership and get old image URL
    const [profile] = await db
      .select()
      .from(profiles)
      .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)))
      .limit(1);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found or unauthorized' }, { status: 404 });
    }

    // Check if Vercel Blob Token is configured
    let imageUrl = '';

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Local development fallback: convert to base64 data URL
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = file.type || 'image/jpeg';
      imageUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
    } else {
      // Delete old image from Vercel Blob if exists
      const oldUrl = type === 'avatar' ? profile.avatarUrl : profile.themeBgImage;
      if (oldUrl && oldUrl.includes('public.blob.vercel-storage.com')) {
        try {
          await del(oldUrl);
        } catch (e) {
          console.error('Failed to delete old image from blob storage:', e);
        }
      }

      // Upload new image to Vercel Blob
      const filename = `${profileId}-${type}-${Date.now()}.${file.name.split('.').pop()}`;
      const blob = await put(filename, file, {
        access: 'public',
      });
      imageUrl = blob.url;
    }

    // Update database
    if (type === 'avatar') {
      await db
        .update(profiles)
        .set({ avatarUrl: imageUrl })
        .where(eq(profiles.id, profileId));
    } else {
      await db
        .update(profiles)
        .set({ themeBgImage: imageUrl, themeType: 'custom' })
        .where(eq(profiles.id, profileId));
    }

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
