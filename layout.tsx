import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SessionProvider } from '@/components/SessionProvider';
import { ChunkErrorHandler } from '@/components/ChunkErrorHandler';
import { ConditionalChrome } from '@/components/ConditionalChrome';

export const metadata: Metadata = {
  metadataBase: new URL('https://mizari.cc'),
  title: 'mizari.cc — Your Link in Bio',
  description:
    'One link for everything. Share your content, social profiles, and more with a single, beautiful mizari.cc page.',
  keywords: ['link in bio', 'linktree alternative', 'social links', 'mizari', 'mizari.cc'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: apply dark class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('mizari-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--bg-primary)] font-sans text-[var(--text-primary)] antialiased">
        <ChunkErrorHandler />
        <SessionProvider>
          <ThemeProvider>
            <ConditionalChrome>{children}</ConditionalChrome>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
// Cache-bust: 1787875422
