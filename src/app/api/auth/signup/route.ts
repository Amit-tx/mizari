import { db } from '@/db';
import { users, profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

const RESERVED_USERNAMES = [
  'mizari',
  'admin',
  'dashboard',
  'login',
  'signup',
  'api',
  'wishes',
  'links',
  'support',
  'help',
  'terms',
  'privacy',
];

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (username.length < 3 || username.length > 30) {
      return NextResponse.json({ error: 'Username must be 3-30 characters' }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return NextResponse.json({ error: 'Username can only contain letters, numbers, hyphens, and underscores' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const usernameLower = username.toLowerCase().trim();
    const emailLower = email.toLowerCase().trim();

    // Brand protection: Only amit_trillion@proton.me can register @mizari username
    if (usernameLower === 'mizari' && emailLower !== 'amit_trillion@proton.me') {
      return NextResponse.json(
        { error: 'This username is reserved for brand protection.' },
        { status: 403 }
      );
    }

    // Block other system keywords
    if (RESERVED_USERNAMES.includes(usernameLower) && usernameLower !== 'mizari') {
      return NextResponse.json(
        { error: 'This username is reserved and cannot be used.' },
        { status: 403 }
      );
    }

    // Check if email already exists
    const [existingEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, emailLower))
      .limit(1);

    if (existingEmail) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
    }

    // Check if username is already taken in profiles
    const [existingProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.username, usernameLower))
      .limit(1);

    if (existingProfile) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Insert User
    const [newUser] = await db
      .insert(users)
      .values({
        email: emailLower,
        passwordHash,
      })
      .returning();

    // Insert Default Personal Profile
    await db.insert(profiles).values({
      userId: newUser.id,
      username: usernameLower,
      profileType: 'personal',
      bio: 'Welcome to my Mizari profile!',
      themeType: 'light',
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
