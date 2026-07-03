'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (error?.message?.includes('NEXT_REDIRECT') || error?.digest?.includes('NEXT_REDIRECT')) {
    throw error;
  }

  useEffect(() => {
    console.error('[dashboard error boundary]', {
      name: error?.name,
      message: error?.message,
      digest: error?.digest,
      stack: error?.stack,
    });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-red-500">
        Dashboard Error
      </h1>
      <div className="w-full max-w-2xl rounded-2xl bg-gray-50 border border-gray-200 p-6 text-left dark:bg-slate-900 dark:border-slate-800">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Technical Details</p>
        <p className="text-sm font-mono text-gray-800 dark:text-slate-200 break-words font-semibold">
          Error: {error?.message || 'An unexpected error occurred.'}
        </p>
        {error?.digest && (
          <p className="mt-1 text-xs font-mono text-gray-500 dark:text-slate-400">
            Digest: {error.digest}
          </p>
        )}
        {error?.stack && (
          <pre className="mt-4 text-[10px] font-mono text-gray-500 dark:text-slate-400 overflow-auto max-h-48 p-3 bg-gray-100 dark:bg-slate-950 rounded-xl leading-relaxed whitespace-pre-wrap">
            {error.stack}
          </pre>
        )}
      </div>
      <p className="max-w-md text-xs text-gray-400 dark:text-slate-500">
        Please share this screen or error code to help identify the issue.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="rounded-xl bg-[#FF6B6B] px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-gray-200 px-5 py-2.5 text-sm font-bold text-gray-900 hover:bg-gray-300 dark:bg-slate-800 dark:text-white transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
