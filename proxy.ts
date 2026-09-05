import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

/**
 * Next.js 16 proxy (replaces middleware.ts).
 * Runs on the Edge runtime — must only import Edge-compatible modules.
 * Uses auth.config.ts (no DB/bcrypt imports).
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ['/dashboard/:path*'],
};
