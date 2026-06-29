import { db } from '@/db';
import { users, links } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { AdSlot } from '@/components/AdSlot';
import { getPlatformIcon } from '@/components/LinkIcons';
import { getThemeById } from '@/components/Themes';
import { SakuraEffect } from '@/components/SakuraEffect';
import { ShareButton } from '@/components/ShareButton';
import { Branding } from '@/components/Branding';
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

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) {
    notFound();
  }

  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, user.id))
    .orderBy(asc(links.order));

  // Check if preset theme
  const isPreset = !['light', 'dark', 'custom'].includes(user.themeType);
  const preset = isPreset ? getThemeById(user.themeType) : undefined;

  // Determine background style
  let bgStyle: React.CSSProperties = {};
  if (preset) {
    if (preset.bgGradient) {
      bgStyle = { backgroundImage: preset.bgGradient };
    } else {
      bgStyle = { backgroundColor: preset.bgColor };
    }
  } else if (user.themeType === 'custom') {
    if (user.themeBgImage) {
      bgStyle = { backgroundImage: `url(${user.themeBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' };
    } else {
      bgStyle = { backgroundColor: user.themeBgColor };
    }
  } else if (user.themeType === 'dark') {
    bgStyle = { backgroundColor: '#0f172a' };
  } else {
    bgStyle = { backgroundColor: '#fafafa' };
  }

  const textStyle: React.CSSProperties = {};
  if (preset) {
    textStyle.color = preset.textColor;
  } else if (user.themeType === 'custom') {
    textStyle.color = user.themeTextColor;
  } else if (user.themeType === 'dark') {
    textStyle.color = '#e2e8f0';
  } else {
    textStyle.color = '#1a1a2e';
  }

  // Custom button styles
  const getButtonClass = () => {
    if (!preset && user.themeType !== 'custom') {
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
    if (user.themeButtonStyle === 'shadow') {
      base += 'bg-white/95 border-transparent shadow-md hover:shadow-lg hover:-translate-y-0.5 text-slate-800 ';
    } else {
      base += 'bg-white/10 backdrop-blur-sm border-white/25 hover:bg-white/20 ';
    }

    // Border Radius
    if (user.themeButtonStyle === 'rounded-full') {
      base += 'rounded-full ';
    } else if (user.themeButtonStyle === 'rounded-none') {
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
    if (user.themeType === 'custom' && user.themeButtonStyle !== 'shadow') {
      return {
        color: user.themeTextColor,
      };
    }
    return {};
  };

  return (
    <div 
      className="relative flex min-h-[calc(100vh-4rem)] items-start justify-center px-4 py-12 transition-all duration-300 bg-cover bg-center overflow-hidden"
      style={bgStyle}
    >
      {/* Sakura falling animation only for Sakura theme */}
      {user.themeType === 'sakura' && <SakuraEffect />}
      
      {/* Share Button */}
      <ShareButton username={user.username} themeTextColor={preset?.textColor || user.themeTextColor} />

      <div className="w-full max-w-md z-10">
        {/* Profile card */}
        <div className={`overflow-hidden rounded-3xl border border-gray-100 shadow-xl transition-all duration-300 dark:border-slate-800 ${
          user.themeType === 'light' ? 'bg-white text-[#1a1a2e]' : user.themeType === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-transparent border-transparent shadow-none'
        }`}>
          {/* Gradient header (only if not custom/preset background) */}
          {!preset && user.themeType !== 'custom' && (
            <div className="h-24 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24]" />
          )}
          
          <div className={`px-6 pb-8 ${preset || user.themeType === 'custom' ? 'pt-8' : ''}`}>
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg dark:border-slate-800">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-gray-400 dark:text-slate-500">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* User info */}
            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold" style={textStyle}>@{user.username}</h1>
              {user.bio && (
                <p className="mt-2 text-sm leading-relaxed opacity-90" style={textStyle}>{user.bio}</p>
              )}
            </div>

            {/* Links */}
            <div className="mt-8 space-y-3.5">
              {userLinks.length === 0 && (
                <p className="text-center text-sm text-gray-400 dark:text-slate-500 py-4">
                  No links yet.
                </p>
              )}
              {userLinks.map((link) => (
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
          </div>
        </div>

        {/* Ad slot below links */}
        <div className="mt-8">
          <AdSlot slot="profile-footer" size="responsive" />
        </div>

        {/* Made with Mizari Branding banner */}
        <Branding />
      </div>
    </div>
  );
}
