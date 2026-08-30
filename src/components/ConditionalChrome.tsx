'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';

// Dashboard and app routes — have their own chrome
const APP_ROUTES = ['/dashboard'];

// Marketing pages that SHOULD show the header
const MARKETING_ROUTES = new Set([
  '/', '/login', '/signup', '/pricing', '/privacy',
  '/terms', '/discover', '/contact', '/store', '/delete-confirm',
]);

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/';

  const isAppRoute = APP_ROUTES.some((r) => pathname.startsWith(r));

  // /f/:username/:slug — public form share page
  const isFormShareRoute = pathname.startsWith('/f/');

  // /:username — public profile page (single segment, not a known route)
  const segments = pathname.split('/').filter(Boolean);
  const isProfileRoute =
    segments.length === 1 &&
    !MARKETING_ROUTES.has(pathname) &&
    !pathname.startsWith('/api/') &&
    !pathname.startsWith('/f/');

  if (isAppRoute || isFormShareRoute || isProfileRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
    </>
  );
}
