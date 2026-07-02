// Checks an uploaded image for nudity/explicit content before it's allowed
// to be stored and shown publicly on a profile or theme background.
//
// Uses Sightengine (https://sightengine.com) — free tier gives 2,000
// checks/month, which is plenty for a small/early-stage app. Sign up and
// set these two env vars for this to actually run:
//   SIGHTENGINE_API_USER
//   SIGHTENGINE_API_SECRET
//
// If the keys aren't set, moderation is skipped (fail-open) so local dev
// and early testing don't break — but this means uploads are UNPROTECTED
// until the keys are configured. Set them before opening uploads to real
// users beyond your small trusted test group.

interface ModerationResult {
  safe: boolean;
  reason?: string;
}

const NUDITY_THRESHOLD = 0.5; // 0-1, higher = more explicit. Tune as needed.

export async function checkImageSafety(file: File): Promise<ModerationResult> {
  const apiUser = process.env.SIGHTENGINE_API_USER;
  const apiSecret = process.env.SIGHTENGINE_API_SECRET;

  if (!apiUser || !apiSecret) {
    console.warn(
      '[moderateImage] SIGHTENGINE_API_USER/SECRET not set — skipping nudity check. ' +
      'Uploaded images are NOT being screened right now.'
    );
    return { safe: true };
  }

  try {
    const form = new FormData();
    form.append('media', file);
    form.append('models', 'nudity-2.1');
    form.append('api_user', apiUser);
    form.append('api_secret', apiSecret);

    const res = await fetch('https://api.sightengine.com/1.0/check.json', {
      method: 'POST',
      body: form,
    });

    if (!res.ok) {
      console.error('[moderateImage] Sightengine API error:', res.status);
      // Fail-open on API/network errors so a third-party outage doesn't
      // take down uploads entirely. Revisit if abuse becomes a problem.
      return { safe: true };
    }

    const data = await res.json();
    const nudity = data?.nudity;
    if (!nudity) return { safe: true };

    const explicitScore = Math.max(
      nudity.sexual_activity || 0,
      nudity.sexual_display || 0,
      nudity.erotica || 0
    );

    if (explicitScore >= NUDITY_THRESHOLD) {
      return { safe: false, reason: 'Image flagged as explicit/nude content.' };
    }

    return { safe: true };
  } catch (err) {
    console.error('[moderateImage] Moderation check failed:', err);
    return { safe: true }; // fail-open — see note above
  }
}
