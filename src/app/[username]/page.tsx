import { db } from '@/db';
import { profiles, links, wishes } from '@/db/schema';
import { eq, asc, desc, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getPlatformIcon } from '@/components/LinkIcons';
import { getThemeById } from '@/components/Themes';
import { SakuraEffect } from '@/components/SakuraEffect';
import { AutumnEffect } from '@/components/AutumnEffect';
import { WinterEffect } from '@/components/WinterEffect';
import { LanternEffect } from '@/components/LanternEffect';
import { FirefliesEffect } from '@/components/FirefliesEffect';
import { ShootingStarsEffect } from '@/components/ShootingStarsEffect';
import { RainEffect } from '@/components/RainEffect';
import { CloudsEffect } from '@/components/CloudsEffect';
import { ShareButton } from '@/components/ShareButton';
import { LikeButton } from '@/components/LikeButton';
import { getMyReaction } from './actions';
import { Branding } from '@/components/Branding';
import { TanabataTree } from '@/components/TanabataTree';
import { ClassicGuestbook } from '@/components/ClassicGuestbook';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { BirthdayConfetti } from '@/components/BirthdayConfetti';
import { LinksAndProducts } from '@/components/LinksAndProducts';
import { AmbientPlayer } from '@/components/AmbientPlayer';
import { getStoreThemeById } from '@/components/StoreThemes';
import AnimeReactiveSky from '@/components/AnimeReactiveSky';
import LivingSky from '@/components/LivingSky';
import type { Metadata } from 'next';
import { getLevelInfo } from '@/utils/xp';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username} — Mizari`,
    description: `Check out ${username}'s links on Mizari`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  // Query profile instead of user
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1);

  if (!profile) {
    notFound();
  }

  // View tracking and anti-spam XP logic
  const { headers } = await import('next/headers');
  const { isBotUserAgent, validateIpCooldown, grantXp } = await import('@/utils/xp');
  const { sql } = await import('drizzle-orm');
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1';

  if (!isBotUserAgent(userAgent)) {
    const isAllowed = await validateIpCooldown(ipAddress, profile.id, 'view');
    if (isAllowed) {
      // Increment views count and grant 1 XP
      await db
        .update(profiles)
        .set({ views: sql`COALESCE(${profiles.views}, 0) + 1` })
        .where(eq(profiles.id, profile.id));
      await grantXp(profile.id, 1);
    }
  }

  // Fetch links belonging to this profile
  const allLinks = await db
    .select()
    .from(links)
    .where(eq(links.profileId, profile.id))
    .orderBy(asc(links.order));

  // Apply scheduling filter
  const nowTime = new Date();
  const activeLinks = allLinks.filter((link) => {
    if (link.scheduledStart && nowTime < new Date(link.scheduledStart)) return false;
    if (link.scheduledEnd && nowTime > new Date(link.scheduledEnd)) return false;
    return true;
  });

  // Fetch latest 10 wishes for the Guestbook/Tanabata Tree
  const profileWishes = await db
    .select()
    .from(wishes)
    .where(eq(wishes.profileId, profile.id))
    .orderBy(desc(wishes.id))
    .limit(10);

  // Separate standard links and product cards
  const standardLinks = activeLinks.filter((l) => !l.isProduct || l.isProduct === 0);
  const productLinks = activeLinks.filter((l) => l.isProduct === 1);

  // Dynamic Theme Shifts: Day/Night, Festivals, and Birthday
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayMmDd = `${mm}-${dd}`;
  const isBirthday = profile.birthday === todayMmDd;
  let activeBirthdayConfetti = false;

  if (false && profile.enableDynamicTheme === 1) {
    let dynamicTheme = profile.themeType;
    if (isBirthday) {
      activeBirthdayConfetti = true;
      dynamicTheme = 'haru_spring'; // Pink birthday theme
    } else if (todayMmDd === '10-31') {
      dynamicTheme = 'demon_slayer'; // Spooky Halloween theme
    } else if (todayMmDd === '12-24' || todayMmDd === '12-25') {
      dynamicTheme = 'fuyu_winter'; // Winter theme
    } else if (todayMmDd === '03-20') {
      dynamicTheme = 'sakura'; // Cherry blossom/spring
    } else if (todayMmDd === '11-01' || todayMmDd === '11-12') {
      dynamicTheme = 'natsu_matsuri'; // Lanterns/Diwali
    } else {
      // Hour-based shift
      const currentHour = today.getHours();
      if (currentHour >= 6 && currentHour < 18) {
        dynamicTheme = 'aozora'; // Sunrise -> Sunset: light sky
      } else {
        dynamicTheme = 'tsukiyo'; // Sunset -> Sunrise: dark sky
      }
    }
    profile.themeType = dynamicTheme;
  }

  // Check if theme rotation is enabled and has elapsed
  if (profile.themeRotateInterval && profile.themeRotateInterval !== 'none') {
    const now = new Date();
    const lastRotated = profile.lastThemeRotatedAt ? new Date(profile.lastThemeRotatedAt) : new Date(profile.createdAt);
    const diffMs = now.getTime() - lastRotated.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);

    let intervalHrs = 5;
    if (profile.themeRotateInterval === '3h') intervalHrs = 3;
    else if (profile.themeRotateInterval === '5h') intervalHrs = 5;
    else if (profile.themeRotateInterval === '6h') intervalHrs = 6;
    else if (profile.themeRotateInterval === '12h') intervalHrs = 12;
    else if (profile.themeRotateInterval === '24h') intervalHrs = 24;

    if (diffHrs >= intervalHrs) {
      // Fetch user to check if amit_trillion
      const { users, themePurchases } = await import('@/db/schema');
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, profile.userId))
        .limit(1);
      const isOwner = user?.email.toLowerCase() === 'amit_trillion@proton.me';

      // Fetch theme purchases
      const purchases = await db
        .select()
        .from(themePurchases)
        .where(
          and(
            eq(themePurchases.userId, profile.userId),
            eq(themePurchases.status, 'paid')
          )
        );
      const purchasedIds = purchases.map((p) => p.themeId);

      // Load STORE_THEMES
      const { STORE_THEMES } = await import('@/components/StoreThemes');
      const eligibleThemes = STORE_THEMES.filter(
        (t) => t.price === 0 || isOwner || purchasedIds.includes(t.id)
      );

      if (eligibleThemes.length > 0) {
        let nextTheme = eligibleThemes[Math.floor(Math.random() * eligibleThemes.length)];
        if (eligibleThemes.length > 1 && nextTheme.id === profile.themeType) {
          const others = eligibleThemes.filter((t) => t.id !== profile.themeType);
          nextTheme = others[Math.floor(Math.random() * others.length)];
        }

        // Update database
        await db
          .update(profiles)
          .set({
            themeType: nextTheme.id,
            lastThemeRotatedAt: now,
          })
          .where(eq(profiles.id, profile.id));

        // Update local memory reference
        profile.themeType = nextTheme.id;
        profile.lastThemeRotatedAt = now;
      }
    }
  }

  // Check if marketplace community theme
  const isMarketTheme = profile.themeType.startsWith('market_');
  if (isMarketTheme) {
    const marketThemeId = parseInt(profile.themeType.replace('market_', ''));
    if (!isNaN(marketThemeId)) {
      const { marketplaceThemes } = await import('@/db/schema');
      const [mTheme] = await db
        .select()
        .from(marketplaceThemes)
        .where(eq(marketplaceThemes.id, marketThemeId))
        .limit(1);
      if (mTheme) {
        profile.themeBgColor = mTheme.bgColor;
        profile.themeTextColor = mTheme.textColor;
        profile.themeBgImage = mTheme.bgImage;
        profile.themeButtonStyle = mTheme.buttonStyle as any;
        profile.themeBackdrop = mTheme.backdropStyle;
        profile.themeType = 'custom';
      }
    }
  }

  // Check if preset theme
  const isPreset = !['light', 'dark', 'custom'].includes(profile.themeType);
  const storeTheme = isPreset ? getStoreThemeById(profile.themeType) : undefined;
  
  const preset = storeTheme ? {
    id: storeTheme.id,
    name: storeTheme.name,
    emoji: storeTheme.emoji,
    bgColor: storeTheme.bgColor,
    textColor: storeTheme.textColor,
    btnBg: storeTheme.btnBg,
    btnText: storeTheme.textColor,
    btnBorder: `${storeTheme.textColor}22`,
    bgGradient: storeTheme.bgGradient,
    effect: storeTheme.effect,
    btnStyle: 'rounded-xl',
  } : undefined;

  const { japanThemes, animeThemes } = await import('@/data/themes');
  const rawJapanTheme = japanThemes.find((jt) => jt.slug.replace(/-/g, '_') === profile.themeType);
  const rawAnimeTheme = animeThemes.find((at) => at.slug.replace(/-/g, '_') === profile.themeType);

  // The themes are static, they do not dynamically change colors based on time of day.
  // We keep corePhases, JapanDynamicEngine, and AnimeReactiveSky components for stars/rain animations without color override.
  const SKY_WORTHY_CORE_THEMES = new Set([
    'galaxy_dream', 'cyber_tokyo', 'tsukiyo', 'hoshi', 'sky_kingdom',
    'ocean_sunset', 'railway_sunset', 'shrine_festival', 'frieren',
    'demon_slayer', 'moonlight_forest', 'ame',
  ]);
  let corePhases: import('@/data/themes').AnimeReactivePhase[] | null = null;
  if (!rawJapanTheme && !rawAnimeTheme && preset && SKY_WORTHY_CORE_THEMES.has(profile.themeType)) {
    const { buildAutoPhases } = await import('@/data/themes');
    corePhases = buildAutoPhases(preset.name || 'Mizari', preset.btnBg || preset.textColor || '#7C3AED');
  }

  // Determine background style
  let bgStyle: React.CSSProperties = {};
  if (rawJapanTheme || rawAnimeTheme) {
    bgStyle = {};
  } else if (preset) {
    if (preset.bgGradient) {
      bgStyle = { backgroundImage: preset.bgGradient };
    } else {
      bgStyle = { backgroundColor: preset.bgColor };
    }
  } else if (profile.themeType === 'custom') {
    if (profile.themeBgImage) {
      bgStyle = { backgroundImage: `url(${profile.themeBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' };
    } else {
      bgStyle = { backgroundColor: profile.themeBgColor };
    }
  } else if (profile.themeType === 'dark') {
    bgStyle = { backgroundColor: '#0f172a' };
  } else {
    bgStyle = { backgroundColor: '#fafafa' };
  }

  const textStyle: React.CSSProperties = {};
  if (preset) {
    textStyle.color = preset.textColor;
  } else if (profile.themeType === 'custom') {
    textStyle.color = profile.themeTextColor;
  } else if (profile.themeType === 'dark') {
    textStyle.color = '#e2e8f0';
  } else {
    textStyle.color = '#1a1a2e';
  }

  // Auto text-legibility scrim: only relevant when the background is an
  // arbitrary uploaded/marketplace photo (profile.themeBgImage), since
  // gradient presets are pre-matched with a text color by their creator.
  // A photo can be light in some areas and dark in others, so instead of
  // trying to sample pixel colors, we always place a soft backdrop behind
  // the text — and pick that backdrop's shade (light vs dark) based on
  // the text color itself, so it always contrasts no matter what's
  // underneath.
  const isLightText = (() => {
    const hex = (textStyle.color as string || '#1a1a2e').replace('#', '');
    if (hex.length !== 6) return true;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
  })();
  const legibilityScrimClass = isLightText ? 'bg-black/35' : 'bg-white/45';

  // Custom button styles
  const getButtonClass = () => {
    if (!preset && profile.themeType !== 'custom') {
      return 'border border-gray-200 bg-gray-50 text-gray-700 hover:border-[#FF6B6B]/40 hover:bg-[#FF6B6B]/5 hover:text-[#FF6B6B] hover:shadow-md dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:border-[#FF6B6B]/40 dark:hover:bg-[#FF6B6B]/10 dark:hover:text-[#FF6B6B] rounded-xl';
    }

    if (preset) {
      let base = 'transition-all duration-200 border ';
      if (preset.btnStyle === 'shadow') {
        base += 'bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 ';
      } else if (preset.btnStyle === 'rounded-full') {
        base += 'rounded-full ';
      } else if (preset.btnStyle === 'rounded-none') {
        base += 'rounded-none ';
      } else {
        base += 'rounded-xl ';
      }
      return base;
    }

    let base = 'transition-all duration-200 border ';
    
    // Borders & Backgrounds
    if (profile.themeButtonStyle === 'shadow') {
      base += 'bg-white/95 border-transparent shadow-md hover:shadow-lg hover:-translate-y-0.5 text-slate-800 ';
    } else {
      base += 'bg-white/10 backdrop-blur-sm border-white/25 hover:bg-white/20 ';
    }

    // Border Radius
    if (profile.themeButtonStyle === 'rounded-full') {
      base += 'rounded-full ';
    } else if (profile.themeButtonStyle === 'rounded-none') {
      base += 'rounded-none ';
    } else {
      base += 'rounded-xl ';
    }

    return base;
  };

  // Custom button inline style
  const getButtonStyle = (): React.CSSProperties => {
    if (preset) {
      return {
        backgroundColor: preset.btnBg,
        color: preset.btnText,
        borderColor: preset.btnBorder,
      };
    }
    if (profile.themeType === 'custom') {
      return {
        backgroundColor: profile.themeBgImage ? profile.themeBgColor : undefined,
        color: profile.themeTextColor,
        borderColor: profile.themeBgImage ? `${profile.themeTextColor}33` : undefined,
      };
    }
    return {};
  };

  return (
    <div 
      className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-start bg-cover bg-center overflow-y-auto w-full transition-all duration-300"
      style={bgStyle}
    >
      {/* Announcement Banner */}
      {profile.announcementActive === 1 && (() => {
        let bannerMessages: { text: string; link?: string }[] = [];
        try {
          bannerMessages = JSON.parse(profile.announcementMessages || '[]');
        } catch {
          bannerMessages = [];
        }
        // Fall back to the legacy single text/link fields for profiles
        // that haven't re-saved their banner since this feature shipped.
        if (bannerMessages.length === 0 && profile.announcementText) {
          bannerMessages = [{ text: profile.announcementText, link: profile.announcementLink || undefined }];
        }
        if (bannerMessages.length === 0) return null;
        return (
          <AnnouncementBanner
            profileId={profile.id}
            messages={bannerMessages}
            bgColor={profile.announcementColor}
          />
        );
      })()}

      {/* Birthday Confetti animations */}
      {activeBirthdayConfetti && <BirthdayConfetti />}

      {/* Main page body */}
      <div className="relative flex w-full items-start justify-center px-4 py-12 bg-cover bg-center">
      {/* Living / Reactive Day/Night Cycle Skies */}
      {rawJapanTheme && (
        <div className="absolute inset-0 z-0">
          <LivingSky particle={rawJapanTheme.particle} showContent={false} />
        </div>
      )}
      {rawAnimeTheme && rawAnimeTheme.reactivePhases && (
        <div className="absolute inset-0 z-0">
          <AnimeReactiveSky phases={rawAnimeTheme.reactivePhases} showContent={false} />
        </div>
      )}
      {corePhases && (
        <div className="absolute inset-0 z-0">
          <AnimeReactiveSky phases={corePhases} showContent={false} />
        </div>
      )}

      {/* Seasonal Background Animations */}
      {(profile.themeType === 'sakura' || profile.themeType === 'haru_spring') && <SakuraEffect />}
      {(profile.themeType === 'momiji' || profile.themeType === 'aki_autumn') && <AutumnEffect />}
      {(profile.themeType === 'yuki' || profile.themeType === 'fuyu_winter') && <WinterEffect />}
      {(profile.themeType === 'matsuri' || profile.themeType === 'natsu_matsuri' || profile.themeType === 'shrine_festival') && <LanternEffect />}

      {/* New Anime Effects */}
      {(profile.themeType === 'moonlight_forest' || profile.themeType === 'shrine_festival' || profile.themeType === 'bamboo_zen') && <FirefliesEffect />}
      {(profile.themeType === 'galaxy_dream' || profile.themeType === 'tsukiyo' || profile.themeType === 'frieren' || profile.themeType === 'demon_slayer') && <ShootingStarsEffect />}
      {(profile.themeType === 'ame' || profile.themeType === 'cyber_tokyo') && <RainEffect />}
      {(profile.themeType === 'sky_kingdom' || profile.themeType === 'ocean_sunset' || profile.themeType === 'aozora' || profile.themeType === 'railway_sunset') && <CloudsEffect />}

      {/* Floating Ambient Sound Player */}
      <AmbientPlayer />

      {/* Floating Like / Reaction Button */}
      <LikeButton 
        profileId={profile.id} 
        initialLikes={profile.likes} 
        themeTextColor={preset?.textColor || profile.themeTextColor} 
        initialLike={profile.reactionLike}
        initialLove={profile.reactionLove}
        initialHaha={profile.reactionHaha}
        initialWow={profile.reactionWow}
        initialSad={profile.reactionSad}
        initialFire={profile.reactionFire}
        serverActiveReaction={await getMyReaction(profile.id)}
      />
      
      {/* Share Button */}
      <ShareButton username={profile.username} themeTextColor={preset?.textColor || profile.themeTextColor} />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Profile card */}
        <div className={`overflow-hidden rounded-3xl border transition-all duration-300 ${
          profile.themeType === 'light' 
            ? 'bg-white border-gray-100 shadow-xl text-[#1a1a2e]' 
            : profile.themeType === 'dark' 
            ? 'bg-slate-900 border-slate-800 shadow-xl text-slate-100' 
            : profile.themeBackdrop === 'none'
            ? 'bg-transparent border-transparent shadow-none'
            : profile.themeBackdrop === 'glass-dark'
            ? 'bg-black/30 dark:bg-slate-950/40 backdrop-blur-md border-white/10 dark:border-slate-800/30 shadow-xl'
            : profile.themeBackdrop === 'solid-light'
            ? 'bg-white border-gray-100 shadow-xl text-slate-900'
            : profile.themeBackdrop === 'solid-dark'
            ? 'bg-slate-900 border-slate-800 shadow-xl text-slate-100'
            : 'bg-white/30 dark:bg-slate-950/35 backdrop-blur-md border-white/20 dark:border-slate-800/40 shadow-xl'
        }`}>
          {/* Gradient header (only if not custom/preset background) */}
          {!preset && profile.themeType !== 'custom' && (
            <div className="h-24 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24]" />
          )}
          
          <div className={`px-6 pb-8 ${preset || profile.themeType === 'custom' ? 'pt-8' : ''}`}>
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg dark:border-slate-800">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.username} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-gray-400 dark:text-slate-500">
                    {profile.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* User info */}
            <div className={`mt-4 text-center ${profile.themeBgImage ? `inline-flex flex-col items-center gap-0 rounded-2xl ${legibilityScrimClass} backdrop-blur-md px-4 py-2.5 mx-auto` : ''}`}>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <h1 className="text-2xl font-bold drop-shadow-lg" style={{...textStyle, textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>@{profile.username}</h1>
                
                {/* Level / Prestige Achievement Badge */}
                {(() => {
                  const levelInfo = getLevelInfo(profile.xp || 0, profile.prestige || 0);
                  if (levelInfo.isPrestige) {
                    return (
                      <span className="rounded-md bg-purple-600/80 backdrop-blur-sm text-white px-2 py-0.5 text-[9px] font-extrabold flex items-center gap-1 shadow-sm shadow-purple-500/30" title={`Prestige ${levelInfo.prestigeLevel} Rank`}>
                        {levelInfo.name}
                      </span>
                    );
                  }
                  if (levelInfo.level > 1) {
                    return (
                      <span className="rounded-md bg-slate-900/50 backdrop-blur-sm text-white px-1.5 py-0.5 text-[9px] font-extrabold flex items-center gap-1" title={levelInfo.category}>
                        LVL {levelInfo.level} {levelInfo.name.split(' ')[0]}
                      </span>
                    );
                  }
                  return null;
                })()}

                {/* Profile Type Badge */}
                {profile.profileType && profile.profileType !== 'personal' && (
                  <span className="rounded-md bg-slate-900/40 backdrop-blur-sm text-white px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider">
                    {profile.profileType}
                  </span>
                )}
              </div>
              {profile.bio && (
                <p className="mt-2 text-sm leading-relaxed drop-shadow-md" style={{...textStyle, textShadow: '0 1px 6px rgba(0,0,0,0.5)'}}>{profile.bio}</p>
              )}
            </div>

            {/* Links and Products Section */}
            <LinksAndProducts
              standardLinks={standardLinks}
              productLinks={productLinks}
              profileId={profile.id}
              buttonClass={getButtonClass()}
              buttonStyle={getButtonStyle()}
              textStyle={textStyle}
              preset={preset}
            />
          </div>
        </div>

        {/* Guestbook Section */}
        {profile.showWishes === 1 && (
          profile.guestbookStyle === 'classic' ? (
            <ClassicGuestbook
              profileId={profile.id}
              initialWishes={profileWishes.map((w) => ({ id: w.id, sender: w.sender, text: w.text, color: w.color }))}
              guestbookHeading={profile.guestbookHeading || 'Guestbook'}
              textColor={preset?.textColor || profile.themeTextColor}
            />
          ) : (
            <TanabataTree 
              userId={profile.id} 
              initialWishes={profileWishes.map((w) => ({ id: w.id, sender: w.sender, text: w.text, color: w.color }))} 
              textColor={preset?.textColor || profile.themeTextColor}
            />
          )
        )}

        {/* Branding */}
        <Branding />
      </div>
      </div>
    </div>
  );
}
