import { getPlatformIcon } from './LinkIcons';

interface ProfilePreviewProps {
  username: string;
  bio: string;
  avatarUrl: string;
  links: Array<{ id: number; title: string; url: string }>;
  themeType?: string;
  themeBgColor?: string;
  themeTextColor?: string;
  themeBgImage?: string;
  themeButtonStyle?: string;
}

export function ProfilePreview({
  username,
  bio,
  avatarUrl,
  links,
  themeType = 'light',
  themeBgColor = '#fafafa',
  themeTextColor = '#1a1a2e',
  themeBgImage = '',
  themeButtonStyle = 'rounded-xl',
}: ProfilePreviewProps) {
  // Determine background style
  const bgStyle =
    themeType === 'custom'
      ? themeBgImage
        ? { backgroundImage: `url(${themeBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { backgroundColor: themeBgColor }
      : {};

  const textStyle = themeType === 'custom' ? { color: themeTextColor } : {};

  // Custom button styles
  const getButtonClass = () => {
    if (themeType !== 'custom') {
      return 'border border-gray-200 bg-gray-50 text-gray-700 hover:border-[#FF6B6B]/40 hover:bg-[#FF6B6B]/5 hover:text-[#FF6B6B] dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:border-[#FF6B6B]/40 dark:hover:bg-[#FF6B6B]/10 dark:hover:text-[#FF6B6B]';
    }

    let base = 'transition-all duration-200 border ';
    
    // Borders & Backgrounds
    if (themeButtonStyle === 'shadow') {
      base += 'bg-white/90 border-transparent shadow-md hover:shadow-lg hover:-translate-y-0.5 text-slate-800 ';
    } else {
      base += 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 ';
    }

    // Border Radius
    if (themeButtonStyle === 'rounded-full') {
      base += 'rounded-full ';
    } else if (themeButtonStyle === 'rounded-none') {
      base += 'rounded-none ';
    } else {
      base += 'rounded-xl '; // rounded-xl (default)
    }

    return base;
  };

  return (
    <div
      className={`mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 shadow-xl transition-colors dark:border-slate-700 ${
        themeType !== 'custom' ? 'bg-white dark:bg-slate-800' : ''
      }`}
      style={bgStyle}
    >
      {/* Gradient top bar (only if not custom background image) */}
      {(!themeBgImage || themeType !== 'custom') && (
        <div className="h-20 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24]" />
      )}
      
      <div className={`px-6 pb-8 ${themeBgImage && themeType === 'custom' ? 'pt-8' : ''}`}>
        {/* Avatar */}
        <div className={`${themeBgImage && themeType === 'custom' ? 'mt-0' : '-mt-10'} flex justify-center`}>
          <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-gray-200 dark:border-slate-800 dark:bg-slate-700">
            {avatarUrl ? (
              <img src={avatarUrl} alt={username} className="h-full w-full object-cover animate-fade-in" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-400 dark:text-slate-500">
                {username?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
        </div>
        
        {/* Info */}
        <div className="mt-3 text-center">
          <h2 className="text-lg font-bold" style={textStyle}>
            @{username}
          </h2>
          {bio && (
            <p className="mt-1 text-sm opacity-80" style={textStyle}>
              {bio}
            </p>
          )}
        </div>
        
        {/* Links */}
        <div className="mt-6 space-y-3">
          {links.length === 0 && (
            <p className="text-center text-sm text-gray-400 dark:text-slate-500">
              No links yet. Add your first link!
            </p>
          )}
          {links.map((link) => (
            <div
              key={link.id}
              className={`block w-full px-4 py-3 text-center text-sm font-medium ${getButtonClass()}`}
              style={themeType === 'custom' && themeButtonStyle !== 'shadow' ? { color: themeTextColor } : {}}
            >
              <div className="flex items-center justify-center gap-1">
                {getPlatformIcon(link.url)}
                <span>{link.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
