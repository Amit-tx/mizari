import { db } from '@/db';
import { profiles, links, wishes } from '@/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { AdSlot } from '@/components/AdSlot';
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
import { Branding } from '@/components/Branding';
import { TanabataTree } from '@/components/TanabataTree';
import { AmbientPlayer } from '@/components/AmbientPlayer';
import type { Metadata } from 'next';

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

  // Fetch links belonging to this profile
  const allLinks = await db
    .select()
    .from(links)
    .where(eq(links.profileId, profile.id))
    .orderBy(asc(links.order));

  // Fetch latest 10 wishes for the Tanabata Tree
  const profileWishes = await db
    .select()
    .from(wishes)
    .where(eq(wishes.profileId, profile.id))
    .orderBy(desc(wishes.id))
    .limit(10);

  // Separate standard links and product cards
  const standardLinks = allLinks.filter((l) => !l.isProduct || l.isProduct === 0);
  const productLinks = allLinks.filter((l) => l.isProduct === 1);

  // Check if preset theme
  const isPreset = !['light', 'dark', 'custom'].includes(profile.themeType);
  const preset = isPreset ? getThemeById(profile.themeType) : undefined;

  // Determine background style
  let bgStyle: React.CSSProperties = {};
  if (preset) {
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
    if (profile.themeType === 'custom' && profile.themeButtonStyle !== 'shadow') {
      return {
        color: profile.themeTextColor,
      };
    }
    return {};
  };

  return (
    <div 
      className="relative flex min-h-[calc(100vh-4rem)] items-start justify-center px-4 py-12 transition-all duration-300 bg-cover bg-center overflow-y-auto"
      style={bgStyle}
    >
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
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <h1 className="text-2xl font-bold drop-shadow-lg" style={{...textStyle, textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>@{profile.username}</h1>
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

            {/* Standard Links */}
            <div className="mt-8 space-y-3.5">
              {standardLinks.map((link) => (
                <a
                  key={link.id}
                  href={`/api/click/${link.id}`}
                  className={`group block w-full px-5 py-3.5 text-center text-sm font-bold ${getButtonClass()}`}
                  style={getButtonStyle()}
                >
                  <div className="flex items-center justify-center gap-2">
                    {getPlatformIcon(link.url)}
                    <span>{link.title}</span>
                    <svg className="ml-1 inline-block h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>

            {/* Affiliate Product Cards Section */}
            {productLinks.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-250/20">
                <h3 className="text-xs font-extrabold uppercase tracking-wider mb-4 opacity-75" style={textStyle}>
                  🛍 Seymous Featured Products
                </h3>
                <div className="grid gap-4 grid-cols-2">
                  {productLinks.map((product) => (
                    <a 
                      key={product.id}
                      href={`/api/click/${product.id}`}
                      className="group/prod flex flex-col rounded-2xl border border-gray-100 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                      style={preset ? { borderColor: `${preset.btnBorder}25` } : {}}
                    >
                      {/* Product Image */}
                      <div className="relative h-28 w-full bg-gray-50 dark:bg-slate-800 overflow-hidden">
                        {product.productImage ? (
                          <img src={product.productImage} alt={product.title} className="h-full w-full object-cover group-hover/prod:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl">🛍️</div>
                        )}
                        {/* Discount Tag */}
                        {product.discount && (
                          <span className="absolute top-2 left-2 rounded bg-red-550 px-1.5 py-0.5 text-[9px] font-extrabold text-white">
                            {product.discount}
                          </span>
                        )}
                      </div>
                      {/* Product Info */}
                      <div className="p-3 flex-1 flex flex-col justify-between text-left">
                        <div>
                          <h4 className="line-clamp-1 text-xs font-bold text-gray-800 dark:text-gray-200">{product.title}</h4>
                          {product.price && (
                            <p className="mt-1 text-xs font-extrabold text-[#FF6B6B]">{product.price}</p>
                          )}
                        </div>
                        {/* Buy Button */}
                        <div 
                          className="mt-3 w-full rounded-xl bg-[#FF6B6B] py-1.5 text-center text-[10px] font-extrabold text-white hover:brightness-110 transition-all"
                          style={preset ? { backgroundColor: preset.btnBg, color: preset.btnText, borderColor: preset.btnBorder } : {}}
                        >
                          Shop Now
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tanabata Wish Tree */}
        {profile.showWishes === 1 && (
          <TanabataTree 
            userId={profile.id} 
            initialWishes={profileWishes.map((w) => ({ id: w.id, sender: w.sender, text: w.text, color: w.color }))} 
            textColor={preset?.textColor || profile.themeTextColor}
          />
        )}

        {/* Ad slot */}
        <div className="mt-4">
          <AdSlot slot="profile-footer" size="responsive" />
        </div>

        {/* Branding */}
        <Branding />
      </div>
    </div>
  );
}
