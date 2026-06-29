import { db } from '@/db';
import { users, links } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { AdSlot } from '@/components/AdSlot';
import type { Metadata } from 'next';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username} — Mizari`,
    description: `Check out ${username}'s links on Mizari`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) {
    notFound();
  }

  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, user.id))
    .orderBy(asc(links.order));

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Profile card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl transition-colors dark:border-slate-700 dark:bg-slate-800">
          {/* Gradient header */}
          <div className="h-24 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24]" />
          <div className="px-6 pb-8">
            {/* Avatar */}
            <div className="-mt-12 flex justify-center">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg dark:border-slate-800 dark:bg-slate-700">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-gray-400 dark:text-slate-500">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* User info */}
            <div className="mt-4 text-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">@{user.username}</h1>
              {user.bio && (
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-slate-400">{user.bio}</p>
              )}
            </div>

            {/* Links */}
            <div className="mt-8 space-y-3">
              {userLinks.length === 0 && (
                <p className="text-center text-sm text-gray-400 dark:text-slate-500">
                  No links yet.
                </p>
              )}
              {userLinks.map((link) => (
                <a
                  key={link.id}
                  href={`/api/click/${link.id}`}
                  className="group block w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-center text-sm font-medium text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF6B6B]/40 hover:bg-[#FF6B6B]/5 hover:text-[#FF6B6B] hover:shadow-md dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:border-[#FF6B6B]/40 dark:hover:bg-[#FF6B6B]/10 dark:hover:text-[#FF6B6B]"
                >
                  {link.icon && <span className="mr-2">{link.icon}</span>}
                  {link.title}
                  <svg className="ml-1.5 inline-block h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Ad slot below links (free tier) */}
        <div className="mt-8">
          <AdSlot slot="profile-footer" size="responsive" />
        </div>

        {/* Powered by */}
        <p className="mt-6 text-center text-xs text-gray-400 dark:text-slate-500">
          Powered by{' '}
          <a href="/" className="font-medium text-[#FF6B6B] hover:text-[#EE5A24] transition-colors">
            Mizari
          </a>
        </p>
      </div>
    </div>
  );
}
