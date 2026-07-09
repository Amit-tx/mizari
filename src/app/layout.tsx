import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SessionProvider } from '@/components/SessionProvider';
import { ChunkErrorHandler } from '@/components/ChunkErrorHandler';
import { ConditionalChrome } from '@/components/ConditionalChrome';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Mizari — Your Link in Bio',
  description:
    'One link for everything. Share your content, social profiles, and more with a single, beautiful Mizari page.',
  keywords: ['link in bio', 'linktree alternative', 'social links', 'mizari'],
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
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
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
