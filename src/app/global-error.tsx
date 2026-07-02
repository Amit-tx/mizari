'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error boundary caught:', error);

    // Same stale-chunk detection as ChunkErrorHandler — if a render error
    // happened because of a stale chunk after a deploy, just reload once
    // instead of showing an error screen.
    const message = error?.message || '';
    const isChunkError =
      message.includes('ChunkLoadError') ||
      message.includes('Loading chunk') ||
      message.includes('Failed to fetch dynamically imported module');

    if (isChunkError) {
      const guardKey = 'mizari_chunk_reload_guard';
      if (!sessionStorage.getItem(guardKey)) {
        sessionStorage.setItem(guardKey, '1');
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center text-white">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="max-w-sm text-sm text-slate-400">
          This usually fixes itself with a refresh — especially right after we ship an update.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 hover:opacity-90"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-700"
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}
