import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (type !== 'avatar' && type !== 'background') {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 });
    }

    // Fetch existing user to get old image URL for deletion
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
      const oldUrl = type === 'avatar' ? user.avatarUrl : user.themeBgImage;
      if (oldUrl && oldUrl.includes('public.blob.vercel-storage.com')) {
        try {
          await del(oldUrl);
        } catch (e) {
          console.error('Failed to delete old image from blob storage:', e);
        }
      }

      // Upload new image to Vercel Blob
      const filename = `${userId}-${type}-${Date.now()}.${file.name.split('.').pop()}`;
      const blob = await put(filename, file, {
        access: 'public',
      });
      imageUrl = blob.url;
    }

    // Update database
    if (type === 'avatar') {
      await db
        .update(users)
        .set({ avatarUrl: imageUrl })
        .where(eq(users.id, userId));
    } else {
      await db
        .update(users)
        .set({ themeBgImage: imageUrl, themeType: 'custom' })
        .where(eq(users.id, userId));
    }

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
