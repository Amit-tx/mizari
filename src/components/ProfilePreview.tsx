import { getPlatformIcon } from './LinkIcons';
import { getThemeById } from './Themes';

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
  // Check if it is a pre-defined Japanese theme
  const isPreset = !['light', 'dark', 'custom'].includes(themeType);
  const preset = isPreset ? getThemeById(themeType) : undefined;

  // Determine background style
  let bgStyle: React.CSSProperties = {};
  if (preset) {
    if (preset.bgGradient) {
      bgStyle = { backgroundImage: preset.bgGradient };
    } else {
      bgStyle = { backgroundColor: preset.bgColor };
    }
  } else if (themeType === 'custom') {
    if (themeBgImage) {
      bgStyle = { backgroundImage: `url(${themeBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    } else {
      bgStyle = { backgroundColor: themeBgColor };
    }
  }

  // Determine text color style
  const textStyle: React.CSSProperties = {};
  if (preset) {
    textStyle.color = preset.textColor;
  } else if (themeType === 'custom') {
    textStyle.color = themeTextColor;
  }

  // Custom button styles
  const getButtonClass = () => {
    if (!preset && themeType !== 'custom') {
      return 'border border-gray-200 bg-gray-50 text-gray-700 hover:border-[#FF6B6B]/40 hover:bg-[#FF6B6B]/5 hover:text-[#FF6B6B] dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:border-[#FF6B6B]/40 dark:hover:bg-[#FF6B6B]/10 dark:hover:text-[#FF6B6B] rounded-xl';
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
    if (themeButtonStyle === 'shadow') {
      base += 'bg-white/95 border-transparent shadow-md hover:shadow-lg hover:-translate-y-0.5 text-slate-800 ';
    } else {
      base += 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 ';
    }

    // Border Radius
    if (themeButtonStyle === 'rounded-full') {
      base += 'rounded-full ';
    } else if (themeButtonStyle === 'rounded-none') {
      base += 'rounded-none ';
    } else {
      base += 'rounded-xl ';
    }

    return base;
  };

  // Custom button inline style (for custom theme color overrides)
  const getButtonStyle = (): React.CSSProperties => {
    if (preset) {
      return {
        backgroundColor: preset.btnBg,
        color: preset.btnText,
        borderColor: preset.btnBorder,
      };
    }
    if (themeType === 'custom' && themeButtonStyle !== 'shadow') {
      return {
        color: themeTextColor,
      };
    }
    return {};
  };

  return (
    <div
      className={`mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-gray-100 shadow-xl transition-all duration-300 dark:border-slate-800 ${
        themeType === 'light' ? 'bg-white text-[#1a1a2e]' : themeType === 'dark' ? 'bg-slate-900 text-slate-100' : ''
      }`}
      style={bgStyle}
    >
      {/* Top bar gradient decoration — only for default themes */}
      {!preset && themeType !== 'custom' && (
        <div className="h-20 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24]" />
      )}
      
      <div className={`px-6 pb-8 ${preset || themeType === 'custom' ? 'pt-8' : ''}`}>
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md dark:border-slate-800">
            {avatarUrl ? (
              <img src={avatarUrl} alt={username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-3xl font-bold text-gray-400 dark:bg-slate-700 dark:text-slate-500">
                {username?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
        </div>
        
        {/* Info */}
        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold" style={textStyle}>
            @{username}
          </h2>
          {bio && (
            <p className="mt-2 text-sm opacity-90 leading-relaxed" style={textStyle}>
              {bio}
            </p>
          )}
        </div>
        
        {/* Links */}
        <div className="mt-8 space-y-3.5">
          {links.length === 0 && (
            <p className="text-center text-sm text-gray-400 dark:text-slate-500 py-4">
              No links yet. Add your first link!
            </p>
          )}
          {links.map((link) => (
            <div
              key={link.id}
              className={`block w-full px-4 py-3.5 text-center text-sm font-semibold ${getButtonClass()}`}
              style={getButtonStyle()}
            >
              <div className="flex items-center justify-center gap-2">
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
