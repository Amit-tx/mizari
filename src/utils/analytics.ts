export function parseUserAgent(ua: string | null) {
  if (!ua) return { device: 'desktop', browser: 'unknown' };

  let device = 'desktop';
  const lowercaseUa = ua.toLowerCase();
  if (/mobile|android|iphone|ipad|phone/i.test(lowercaseUa)) {
    device = 'mobile';
  } else if (/tablet|playbook|silk/i.test(lowercaseUa)) {
    device = 'tablet';
  }

  let browser = 'other';
  if (lowercaseUa.includes('chrome') || lowercaseUa.includes('crios')) {
    if (lowercaseUa.includes('edge') || lowercaseUa.includes('edg')) {
      browser = 'Edge';
    } else if (lowercaseUa.includes('opr') || lowercaseUa.includes('opera')) {
      browser = 'Opera';
    } else {
      browser = 'Chrome';
    }
  } else if (lowercaseUa.includes('safari') && !lowercaseUa.includes('android')) {
    browser = 'Safari';
  } else if (lowercaseUa.includes('firefox') || lowercaseUa.includes('fxios')) {
    browser = 'Firefox';
  } else if (lowercaseUa.includes('msie') || lowercaseUa.includes('trident')) {
    browser = 'IE';
  }

  return { device, browser };
}

export function parseReferrer(referrerUrl: string | null): string {
  if (!referrerUrl) return 'direct';
  
  try {
    const url = new URL(referrerUrl);
    const host = url.hostname.toLowerCase();
    
    if (host.includes('instagram.com')) return 'Instagram';
    if (host.includes('facebook.com') || host.includes('fb.com')) return 'Facebook';
    if (host.includes('twitter.com') || host.includes('x.com') || host.includes('t.co')) return 'Twitter/X';
    if (host.includes('tiktok.com')) return 'TikTok';
    if (host.includes('youtube.com') || host.includes('youtu.be')) return 'YouTube';
    if (host.includes('google.com')) return 'Google Search';
    if (host.includes('bing.com')) return 'Bing Search';
    if (host.includes('yahoo.com')) return 'Yahoo Search';
    if (host.includes('linkedin.com')) return 'LinkedIn';
    if (host.includes('pinterest.com')) return 'Pinterest';
    
    // Clean domain (remove www.)
    return host.replace(/^www\./, '') || 'other';
  } catch (e) {
    return 'other';
  }
}

export function isAdultPlatform(url: string): boolean {
  if (!url) return false;
  const lowercaseUrl = url.toLowerCase();
  const adultDomains = [
    'onlyfans.com',
    'fansly.com',
    'manyvids.com',
    'pornhub.com',
    'xvideos.com',
    'xnxx.com',
    'chaturbate.com',
    'camsoda.com',
    'myfreecams.com',
    'adultfinder.com'
  ];
  return adultDomains.some(domain => lowercaseUrl.includes(domain));
}
