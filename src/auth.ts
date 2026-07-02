import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { users, profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { authConfig } from './auth.config';

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
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

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
        token.id = user.id;
        // Fetch username from profiles table
        let [profile] = await db
          .select()
          .from(profiles)
          .where(eq(profiles.userId, parseInt(user.id!)))
          .limit(1);
          
        if (!profile) {
          // Create fallback profile if missing
          const [newProfile] = await db
            .insert(profiles)
            .values({
              userId: parseInt(user.id!),
              username: `user_${user.id}`,
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
