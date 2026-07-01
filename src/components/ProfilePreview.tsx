import { getPlatformIcon } from './LinkIcons';
import { getThemeById } from './Themes';

interface ProfilePreviewProps {
  username: string;
  bio: string;
  avatarUrl: string;
  links: Array<{ 
    id: number; 
    title: string; 
    url: string;
    isProduct?: number;
    price?: string | null;
    discount?: string | null;
    productImage?: string | null;
  }>;
  themeType?: string;
  themeBgColor?: string;
  themeTextColor?: string;
  themeBgImage?: string;
  themeButtonStyle?: string;
  themeBackdrop?: string;
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
  themeBackdrop = 'glass-light',
}: ProfilePreviewProps) {
  const isPreset = !['light', 'dark', 'custom'].includes(themeType);
  const preset = isPreset ? getThemeById(themeType) : undefined;

  // Separate standard links and product cards
  const standardLinks = links.filter((l) => !l.isProduct || l.isProduct === 0);
  const productLinks = links.filter((l) => l.isProduct === 1);

  let bgStyle: React.CSSProperties = {};
  if (preset) {
    if (preset.bgGradient) bgStyle = { backgroundImage: preset.bgGradient };
    else bgStyle = { backgroundColor: preset.bgColor };
  } else if (themeType === 'custom') {
    if (themeBgImage) bgStyle = { backgroundImage: `url(${themeBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    else bgStyle = { backgroundColor: themeBgColor };
  }

  const textStyle: React.CSSProperties = {};
  if (preset) textStyle.color = preset.textColor;
  else if (themeType === 'custom') textStyle.color = themeTextColor;

  const getButtonClass = () => {
    if (!preset && themeType !== 'custom') {
      return 'border border-gray-200 bg-gray-50 text-gray-700 rounded-xl';
    }
    if (preset) {
      let base = 'transition-all duration-200 border ';
      if (preset.btnStyle === 'shadow') base += 'bg-white shadow-sm ';
      else if (preset.btnStyle === 'rounded-full') base += 'rounded-full ';
      else if (preset.btnStyle === 'rounded-none') base += 'rounded-none ';
      else base += 'rounded-xl ';
      return base;
    }
    let base = 'transition-all duration-200 border ';
    if (themeButtonStyle === 'shadow') {
      base += 'bg-white/95 border-transparent shadow-md text-slate-800 ';
    } else {
      base += 'bg-white/10 backdrop-blur-sm border-white/20 ';
    }
    if (themeButtonStyle === 'rounded-full') base += 'rounded-full ';
    else if (themeButtonStyle === 'rounded-none') base += 'rounded-none ';
    else base += 'rounded-xl ';
    return base;
  };

  const getButtonStyle = (): React.CSSProperties => {
    if (preset) {
      return {
        backgroundColor: preset.btnBg,
        color: preset.btnText,
        borderColor: preset.btnBorder,
      };
    }
    if (themeType === 'custom' && themeButtonStyle !== 'shadow') {
      return { color: themeTextColor };
    }
    return {};
  };

  const getBackdropClass = () => {
    if (themeType === 'light') return 'bg-white border-gray-100 shadow-xl text-[#1a1a2e]';
    if (themeType === 'dark') return 'bg-slate-900 border-slate-800 shadow-xl text-slate-100';
    if (themeType === 'custom') {
      if (themeBackdrop === 'none') return 'bg-transparent border-transparent shadow-none';
      if (themeBackdrop === 'glass-dark') return 'bg-black/30 dark:bg-slate-950/40 backdrop-blur-md border-white/10 dark:border-slate-800/30 shadow-xl';
      if (themeBackdrop === 'solid-light') return 'bg-white border-gray-100 shadow-xl text-slate-900';
      if (themeBackdrop === 'solid-dark') return 'bg-slate-900 border-slate-800 shadow-xl text-slate-100';
      return 'bg-white/30 dark:bg-slate-950/35 backdrop-blur-md border-white/20 dark:border-slate-800/40 shadow-xl';
    }
    return '';
  };

  return (
    <div
      className={`mx-auto w-full max-w-sm overflow-hidden rounded-3xl border transition-all duration-300 ${getBackdropClass()}`}
      style={bgStyle}
    >
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
          <h2 className="text-xl font-bold" style={textStyle}>@{username}</h2>
          {bio && <p className="mt-2 text-sm opacity-90 leading-relaxed" style={textStyle}>{bio}</p>}
        </div>
        
        {/* Standard Links */}
        <div className="mt-8 space-y-3.5">
          {standardLinks.map((link) => (
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

        {/* Affiliate Product Cards Section */}
        {productLinks.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100/30">
            <h3 className="text-xs font-extrabold uppercase tracking-wider mb-4 opacity-75" style={textStyle}>
              🛍️ Featured Products
            </h3>
            <div className="grid gap-4 grid-cols-2">
              {productLinks.map((product) => (
                <div 
                  key={product.id}
                  className="group/prod flex flex-col rounded-2xl border border-gray-100 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-350"
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
                      <span className="absolute top-2 left-2 rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white">
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
                      className="mt-3 w-full rounded-xl bg-[#FF6B6B] py-1.5 text-center text-[10px] font-extrabold text-white hover:brightness-115 transition-all"
                      style={preset ? { backgroundColor: preset.btnBg, color: preset.btnText } : {}}
                    >
                      Shop Now
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
