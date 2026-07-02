import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

/**
 * Edge-compatible auth configuration.
 * This file must NOT import anything that requires Node.js runtime
 * (no Drizzle, no bcrypt, no DB imports).
 * Used by proxy.ts (runs on Edge) and re-exported from auth.ts (runs on Node.js).
 */
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    // Credentials provider is declared here but the authorize function
    // is overridden in auth.ts where we can use Node.js APIs
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: () => null, // Overridden in auth.ts
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isDashboard && !isLoggedIn) {
        return false; // Redirect to signIn page
      }

      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as unknown as Record<string, unknown>).username = token.username as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
