/**
 * Lightweight in-memory rate limiter.
 *
 * Good enough as a first line of defense against scripted brute-force /
 * signup-spam attacks. It resets whenever a serverless function instance
 * cold-starts, so it is NOT a hard guarantee under heavy distributed
 * traffic — for that you'd want a shared store (e.g. Upstash Redis, which
 * has a free tier and would be a drop-in replacement for this module).
 * Until Mizari has that kind of traffic, this stops the common case:
 * a single script hammering /login or /signup from one IP.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodically clear out stale buckets so this Map doesn't grow forever
// on a long-lived warm serverless instance.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

/**
 * Returns true if the action is allowed, false if the caller is rate-limited.
 * @param key   unique identifier, e.g. `login:<ip>` or `signup:<ip>`
 * @param limit max attempts allowed within the window
 * @param windowMs window size in milliseconds
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true };
}

/** Extracts a best-effort client IP from a Request/NextRequest's headers. */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}
