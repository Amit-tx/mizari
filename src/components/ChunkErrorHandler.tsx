'use client';

import { useEffect } from 'react';

// After a new deployment, a tab that's been open since before the deploy
// still references the OLD build's JS chunk URLs. Clicking a link (client-side
// navigation) then fails to fetch that chunk — Next.js throws a ChunkLoadError
// (or a dynamic-import failure) and the page appears broken, even though a
// hard refresh (which loads the new build's HTML) fixes it instantly.
//
// This listens globally for that specific failure and auto-reloads once,
// so the user never has to manually refresh. A sessionStorage guard stops
// an infinite reload loop if the app is broken for some other reason.
export function ChunkErrorHandler() {
  useEffect(() => {
    const RELOAD_GUARD_KEY = 'mizari_chunk_reload_guard';

    const isChunkError = (message: string | undefined | null) => {
      if (!message) return false;
      return (
        message.includes('ChunkLoadError') ||
        message.includes('Loading chunk') ||
        message.includes('Failed to fetch dynamically imported module') ||
        message.includes('error loading dynamically imported module')
      );
    };

    const reloadOnce = () => {
      const alreadyReloaded = sessionStorage.getItem(RELOAD_GUARD_KEY);
      if (alreadyReloaded) return; // avoid infinite reload loop
      sessionStorage.setItem(RELOAD_GUARD_KEY, '1');
      window.location.reload();
    };

    const handleError = (event: ErrorEvent) => {
      if (isChunkError(event?.message) || isChunkError(event?.error?.message)) {
        reloadOnce();
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event?.reason;
      const message = typeof reason === 'string' ? reason : reason?.message;
      if (isChunkError(message)) {
        reloadOnce();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    // Clear the guard once the app has loaded successfully for a bit, so a
    // *future* deploy can still trigger one auto-reload rather than being
    // silently blocked by a guard flag left over from an earlier session.
    const clearGuardTimer = setTimeout(() => {
      sessionStorage.removeItem(RELOAD_GUARD_KEY);
    }, 15000);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      clearTimeout(clearGuardTimer);
    };
  }, []);

  return null;
}
