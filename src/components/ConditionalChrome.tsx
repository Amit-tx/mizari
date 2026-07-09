'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Routes that are "app" screens (logged-in experience) — these get
// their own self-contained header/nav and should NEVER show the
// public marketing Header or Footer.
const APP_ROUTES = ['/dashboard'];

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute = APP_ROUTES.some((route) => pathname?.startsWith(route));

  if (isAppRoute) {
    // Dashboard renders its own complete header + bottom nav.
    // No marketing Header, no Footer — just the app content.
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
