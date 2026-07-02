'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logs the REAL error (name, message, stack, Vercel digest) to the
    // server function logs so we can see exactly what broke, instead of
    // only ever seeing the generic global-error screen.
    console.error('[dashboard error boundary]', {
      name: error?.name,
      message: error?.message,
      digest: error?.digest,
      stack: error?.stack,
    });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard couldn&apos;t load
      </h1>
      <p className="max-w-md text-sm text-gray-500 dark:text-slate-400">
        This is usually a temporary database hiccup. Try again — if it keeps
        happening, check the Vercel function logs for the message above.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="rounded-xl bg-[#FF6B6B] px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-gray-200 px-5 py-2.5 text-sm font-bold text-gray-900 hover:bg-gray-300 dark:bg-slate-800 dark:text-white"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
