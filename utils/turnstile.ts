/**
 * Cloudflare Turnstile CAPTCHA verification.
 *
 * Free, unlimited, privacy-friendly — get a site key + secret key at
 * https://dash.cloudflare.com/?to=/:account/turnstile (no billing needed).
 * Set TURNSTILE_SECRET_KEY (server) and NEXT_PUBLIC_TURNSTILE_SITE_KEY
 * (client) in your env vars.
 *
 * If the env vars aren't set yet, verification is skipped (dev fallback)
 * so local development / early testing isn't blocked before you've set up
 * a Turnstile account. This means signup/login CAPTCHA is NOT actually
 * enforced until you add the keys — do that before real launch.
 */
export async function verifyTurnstileToken(token: string | undefined | null, ip: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // Dev fallback: no key configured yet, don't block local testing.
  if (!secretKey) return true;

  if (!token) return false;

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: secretKey, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return data.success === true;
  } catch (e) {
    console.error('Turnstile verification error:', e);
    return false;
  }
}
