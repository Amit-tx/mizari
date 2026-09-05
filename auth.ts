import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { users, profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { authConfig } from './auth.config';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';
import { verifyTurnstileToken } from '@/utils/turnstile';

/**
 * Full auth configuration with Node.js-only dependencies (Drizzle, bcrypt).
 * Used for API routes and Server Components — NOT for proxy.ts (Edge).
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    // Keep the non-Credentials providers from authConfig
    ...authConfig.providers.filter(
      (p) => (p as { id?: string }).id !== 'credentials'
    ),
    // Override Credentials with the real authorize function
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        turnstileToken: { label: 'Turnstile Token', type: 'text' },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;
        const ip = getClientIp(request.headers);

        // Max 8 login attempts per IP+email per 15 minutes — slows down
        // brute-force password guessing without locking out real users
        // who just fat-fingered their password a couple of times.
        const { allowed } = checkRateLimit(`login:${ip}:${email.toLowerCase()}`, 8, 15 * 60 * 1000);
        if (!allowed) {
          throw new Error('Too many login attempts. Please wait a few minutes and try again.');
        }

        const captchaOk = await verifyTurnstileToken(credentials.turnstileToken as string, ip);
        if (!captchaOk) {
          throw new Error('CAPTCHA verification failed. Please try again.');
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        // Fetch first profile username
        let [profile] = await db
          .select()
          .from(profiles)
          .where(eq(profiles.userId, user.id))
          .limit(1);

        // Fallback: If no profile exists for this legacy user, create a default one on the fly
        if (!profile) {
          const defaultUsername = `user_${user.id}_${Math.floor(Math.random() * 1000)}`;
          const [newProfile] = await db
            .insert(profiles)
            .values({
              userId: user.id,
              username: defaultUsername,
              profileType: 'personal',
              themeType: 'light',
            })
            .returning();
          profile = newProfile;
        }

        return {
          id: String(user.id),
          email: user.email,
          name: profile.username,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        const email = user.email!.toLowerCase();

        // Find or create user by email in our users table
        let [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!dbUser) {
          const [newUser] = await db
            .insert(users)
            .values({
              email,
            })
            .returning();
          dbUser = newUser;
        }

        const dbUserId = dbUser.id;
        token.id = String(dbUserId);

        // Fetch username from profiles table
        let [profile] = await db
          .select()
          .from(profiles)
          .where(eq(profiles.userId, dbUserId))
          .limit(1);
          
        if (!profile) {
          // Create fallback profile if missing
          const emailPrefix = email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '');
          const fallbackUsername = `${emailPrefix}_${Math.floor(Math.random() * 100)}`;
          
          const [newProfile] = await db
            .insert(profiles)
            .values({
              userId: dbUserId,
              username: fallbackUsername.toLowerCase(),
              profileType: 'personal',
              themeType: 'light',
            })
            .returning();
          profile = newProfile;
        }
        
        token.username = profile.username;
      }
      return token;
    },
  },
});
