const ADULT_KEYWORDS = [
  'porn', 'xxx', 'sex', 'nsfw', 'onlyfans', 'naked', 'erotic', 'adult', 'nude',
  'hentai', 'camgirl', 'playboy', 'milf', 'slut', 'strip', 'sensual', 'escort',
  'hookup', 'bdsm', 'erotica', 'sensuel', 'bastard', 'prostitute', 'redlight',
  'jerkoff', 'orgasm', 'penis', 'vagina', 'boobs', 'tits', 'asshole', 'fuck',
  'dick', 'pussy', 'clitoris', 'blowjob', 'gangbang', 'anal', 'lesbian', 'gayporn'
];

const ADULT_DOMAINS = [
  'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com', 'onlyfans.com',
  'chaturbate.com', 'bongacams.com', 'camsoda.com', 'livejasmin.com', 'stripchat.com',
  'cams.com', 'faphouse.com', 'youporn.com', 'redtube.com', 'tube8.com',
  'spankbang.com', 'rt.com', 'beeg.com', 'eporner.com', 'txxx.com',
  'hqpornportal.com', 'brazzers.com', 'naughtyamerica.com', 'realitykings.com',
  'bangbros.com', 'mofos.com', 'twistys.com', 'evilangel.com', 'digitalplayground.com',
  'private.com', 'penthouse.com', 'hustler.com', 'playboy.com', 'fansly.com',
  'manyvids.com', 'subscribestar.club', 'loyalfans.com', 'redgifs.com'
];

export function isAdultContent(url: string, title?: string): boolean {
  if (!url) return false;
  const urlLower = url.toLowerCase().trim();
  const titleLower = title ? title.toLowerCase().trim() : '';

  // 1. Check popular domains
  try {
    const domain = new URL(urlLower.startsWith('http') ? urlLower : `http://${urlLower}`).hostname;
    // Check if domain or any parent domain is in blocklist
    if (ADULT_DOMAINS.some(d => domain === d || domain.endsWith('.' + d))) {
      return true;
    }
  } catch (e) {
    // If URL parsing fails, fallback to string checks
  }

  // 2. Check keywords in URL string
  if (ADULT_KEYWORDS.some(kw => urlLower.includes(kw))) {
    return true;
  }

  // 3. Check keywords in title string
  if (titleLower && ADULT_KEYWORDS.some(kw => titleLower.includes(kw))) {
    return true;
  }

  return false;
}
