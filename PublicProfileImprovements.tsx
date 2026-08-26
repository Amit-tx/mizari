/**
 * Mizari Public Profile - Improved Components
 * Dark Mode + Share Cleanup + Better Styling
 * 
 * File Location: src/components/PublicProfileImprovements/
 * Created: August 25, 2026
 */

// ============================================================================
// 1. DARK MODE CONFIGURATION
// ============================================================================

export const darkModeConfig = {
  // Text Colors - Better contrast
  text: {
    heading: 'text-gray-900 dark:text-white', // Primary headings
    subheading: 'text-gray-800 dark:text-gray-100', // Secondary headings
    body: 'text-gray-700 dark:text-gray-200', // Body text
    secondary: 'text-gray-600 dark:text-gray-300', // Secondary text
    tertiary: 'text-gray-500 dark:text-gray-400', // Labels
    muted: 'text-gray-400 dark:text-gray-500', // Placeholder
  },

  // Background Colors
  bg: {
    primary: 'bg-white dark:bg-slate-900',
    secondary: 'bg-gray-50 dark:bg-slate-800/50',
    tertiary: 'bg-gray-100 dark:bg-slate-700/50',
    card: 'bg-white dark:bg-slate-800/70',
    dark: 'bg-slate-900 dark:bg-slate-950',
  },

  // Border Colors
  border: {
    light: 'border-gray-200 dark:border-slate-700',
    medium: 'border-gray-300 dark:border-slate-600',
    hover: 'hover:border-[#FF6B6B] dark:hover:border-[#FF6B6B]',
  },

  // Gradients
  gradient: {
    profile: 'from-slate-900 via-purple-900/20 to-slate-900',
    card: 'from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-slate-800/30',
    accent: 'from-[#FF6B6B] to-pink-500',
  },
};

// ============================================================================
// 2. IMPROVED LINK CARD COMPONENT
// ============================================================================

interface PublicLinkCardProps {
  id: number;
  title: string;
  url: string;
  icon?: string;
  description?: string;
  isProduct: boolean;
  clicks: number;
}

export function PublicLinkCard({
  title,
  url,
  icon = '🔗',
  description,
  isProduct,
  clicks = 0,
}: PublicLinkCardProps) {
  if (isProduct) {
    // Products handled separately
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group block p-4 rounded-2xl
        ${darkModeConfig.bg.card}
        border-2 ${darkModeConfig.border.light}
        ${darkModeConfig.border.hover}
        transition-all duration-200
        hover:shadow-lg dark:hover:shadow-pink-500/10
        active:scale-95
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className="text-2xl flex-shrink-0">{icon}</span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
              font-bold ${darkModeConfig.text.heading}
              group-hover:text-[#FF6B6B] transition-colors
              truncate
            `}
          >
            {title}
          </h3>

          {description && (
            <p className={`text-xs ${darkModeConfig.text.secondary} mt-1`}>
              {description}
            </p>
          )}

          {clicks > 0 && (
            <p className={`text-[10px] ${darkModeConfig.text.muted} mt-2`}>
              {clicks} clicks
            </p>
          )}
        </div>

        {/* Arrow */}
        <span className={`
          text-xl opacity-0 group-hover:opacity-100
          transition-opacity flex-shrink-0
          ${darkModeConfig.text.tertiary}
        `}>
          →
        </span>
      </div>
    </a>
  );
}

// ============================================================================
// 3. IMPROVED CONTACT CARD COMPONENT
// ============================================================================

interface PublicContactCardProps {
  phone?: string;
  email?: string;
  whatsapp?: string;
  responseTime?: string;
}

export function PublicContactCard({
  phone,
  email,
  whatsapp,
  responseTime = 'Within 24 hours',
}: PublicContactCardProps) {
  const hasAnyContact = phone || email || whatsapp;

  if (!hasAnyContact) {
    return null;
  }

  return (
    <div
      className={`
        mt-8 p-6 rounded-3xl
        ${darkModeConfig.bg.dark}
        border border-slate-700 dark:border-slate-600
        shadow-lg dark:shadow-black/20
      `}
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className={`text-xl font-bold ${darkModeConfig.text.heading}`}>
          💌 Let's get in touch!
        </h2>
        <p className={`text-sm ${darkModeConfig.text.secondary} mt-2`}>
          Have a question or just want to say hello? Reach out directly.
        </p>
      </div>

      {/* Contact Options */}
      <div className="space-y-3">
        {/* Phone */}
        {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className={`
              flex items-center gap-3 p-3 rounded-xl
              bg-slate-700/50 hover:bg-slate-700/80
              transition-colors duration-200
              group active:scale-95
            `}
          >
            <span className="text-lg flex-shrink-0">📞</span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold ${darkModeConfig.text.muted}`}>
                PHONE
              </p>
              <p className={`
                text-white font-semibold
                group-hover:text-[#FF6B6B] transition-colors
                truncate
              `}>
                {phone}
              </p>
            </div>
            <span className={`
              text-gray-400 group-hover:text-white
              transition-colors flex-shrink-0
            `}>
              →
            </span>
          </a>
        )}

        {/* Email */}
        {email && (
          <a
            href={`mailto:${email}`}
            className={`
              flex items-center gap-3 p-3 rounded-xl
              bg-slate-700/50 hover:bg-slate-700/80
              transition-colors duration-200
              group active:scale-95
            `}
          >
            <span className="text-lg flex-shrink-0">📧</span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold ${darkModeConfig.text.muted}`}>
                EMAIL
              </p>
              <p className={`
                text-white font-semibold
                group-hover:text-[#FF6B6B] transition-colors
                truncate
              `}>
                {email}
              </p>
            </div>
            <span className={`
              text-gray-400 group-hover:text-white
              transition-colors flex-shrink-0
            `}>
              →
            </span>
          </a>
        )}

        {/* WhatsApp */}
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center gap-3 p-3 rounded-xl
              bg-slate-700/50 hover:bg-slate-700/80
              transition-colors duration-200
              group active:scale-95
            `}
          >
            <span className="text-lg flex-shrink-0">💬</span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold ${darkModeConfig.text.muted}`}>
                WHATSAPP
              </p>
              <p className={`
                text-white font-semibold
                group-hover:text-[#FF6B6B] transition-colors
              `}>
                Send a message
              </p>
            </div>
            <span className={`
              text-gray-400 group-hover:text-white
              transition-colors flex-shrink-0
            `}>
              →
            </span>
          </a>
        )}
      </div>

      {/* Footer */}
      <div className={`
        mt-4 pt-4 border-t border-slate-600
        text-xs ${darkModeConfig.text.muted}
      `}>
        ⏱️ Typical response: {responseTime}
      </div>
    </div>
  );
}

// ============================================================================
// 4. IMPROVED FEATURED PRODUCTS COMPONENT
// ============================================================================

interface ProductData {
  id: number;
  title: string;
  url: string;
  price: string;
  discount?: string;
  productImage?: string;
  category?: string;
}

interface PublicFeaturedProductsProps {
  products: ProductData[];
}

export function PublicFeaturedProducts({
  products,
}: PublicFeaturedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🛍️</span>
        <h2 className={`text-lg font-bold ${darkModeConfig.text.heading}`}>
          Featured Products
        </h2>
        {products.length > 1 && (
          <span className={`ml-auto text-xs font-semibold ${darkModeConfig.text.muted}`}>
            {products.length} items
          </span>
        )}
      </div>

      {/* Product Grid */}
      <div className={`grid gap-4 ${products.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {products.map((product) => (
          <a
            key={product.id}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              group rounded-2xl overflow-hidden
              ${darkModeConfig.bg.card}
              border-2 ${darkModeConfig.border.light}
              ${darkModeConfig.border.hover}
              transition-all duration-200
              hover:shadow-lg dark:hover:shadow-pink-500/10
              active:scale-95
            `}
          >
            {/* Image */}
            {product.productImage && (
              <div className={`
                relative h-40
                ${darkModeConfig.bg.tertiary}
                overflow-hidden
              `}>
                <img
                  src={product.productImage}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Discount Badge */}
                {product.discount && (
                  <div className={`
                    absolute top-2 right-2
                    bg-[#FF6B6B] text-white
                    px-2 py-1 rounded-lg
                    text-xs font-bold
                    shadow-md
                  `}>
                    {product.discount}
                  </div>
                )}
              </div>
            )}

            {/* Details */}
            <div className="p-4">
              <h3 className={`
                font-bold ${darkModeConfig.text.heading}
                group-hover:text-[#FF6B6B] transition-colors
                line-clamp-2
              `}>
                {product.title}
              </h3>

              {product.category && (
                <p className={`text-xs ${darkModeConfig.text.muted} mt-1`}>
                  {product.category}
                </p>
              )}

              {/* Price Footer */}
              <div className="flex items-end justify-between mt-3">
                <p className="text-lg font-bold text-[#FF6B6B]">
                  {product.price}
                </p>
                <span className={`
                  text-gray-400 group-hover:text-[#FF6B6B]
                  transition-colors
                `}>
                  →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 5. IMPROVED PROFILE INFO COMPONENT
// ============================================================================

interface ProfileInfoData {
  role?: string;
  focus?: string;
  location?: string;
  community?: string;
  stats?: {
    clicks: number;
    views: number;
    wishes: number;
  };
}

export function PublicProfileInfo({ data }: { data: ProfileInfoData }) {
  const infoItems = [
    { icon: '💼', label: 'Role', value: data.role },
    { icon: '🎯', label: 'Focus', value: data.focus },
    { icon: '📍', label: 'Location', value: data.location },
    { icon: '🤝', label: 'Community', value: data.community },
  ].filter((item) => item.value);

  if (infoItems.length === 0 && !data.stats) {
    return null;
  }

  return (
    <div
      className={`
        mt-8 p-6 rounded-3xl
        ${darkModeConfig.bg.card}
        border-2 ${darkModeConfig.border.light}
      `}
    >
      {/* Profile Info */}
      {infoItems.length > 0 && (
        <>
          <h2 className={`text-lg font-bold ${darkModeConfig.text.heading} mb-4`}>
            📋 Profile
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {infoItems.map((item) => (
              <div key={item.label}>
                <p className={`
                  text-xs font-bold ${darkModeConfig.text.muted}
                  uppercase tracking-wider
                `}>
                  {item.icon} {item.label}
                </p>
                <p className={`text-sm ${darkModeConfig.text.body} mt-1`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Stats */}
      {data.stats && (
        <>
          <div className={`
            ${infoItems.length > 0 ? 'mt-6 pt-6' : ''}
            border-t-2 ${darkModeConfig.border.light}
          `}>
            <p className={`
              text-xs font-bold ${darkModeConfig.text.muted}
              uppercase tracking-wider
            `}>
              📊 Quick Stats
            </p>

            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="text-center">
                <p className="text-xl font-bold text-[#FF6B6B]">
                  {data.stats.clicks.toLocaleString()}
                </p>
                <p className={`text-xs ${darkModeConfig.text.secondary} mt-1`}>
                  Clicks
                </p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#FF6B6B]">
                  {data.stats.views.toLocaleString()}
                </p>
                <p className={`text-xs ${darkModeConfig.text.secondary} mt-1`}>
                  Views
                </p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#FF6B6B]">
                  {data.stats.wishes.toLocaleString()}
                </p>
                <p className={`text-xs ${darkModeConfig.text.secondary} mt-1`}>
                  Wishes
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// 6. SHARE PREVIEW MODE HELPER
// ============================================================================

/**
 * USE IN YOUR ROUTE:
 * 
 * export default async function UserProfilePage({ 
 *   params, 
 *   searchParams 
 * }: {
 *   params: { username: string };
 *   searchParams: { preview?: string };
 * }) {
 *   const isSharePreview = searchParams.preview === 'true';
 *   
 *   return (
 *     <div>
 *       {!isSharePreview && <Header />}
 *       <UserProfile username={params.username} />
 *       {!isSharePreview && <Footer />}
 *     </div>
 *   );
 * }
 * 
 * URLS:
 * Normal: mizari.cc/@amit
 * Clean Share: mizari.cc/@amit?preview=true
 */

export function useSharePreviewMode(searchParams?: Record<string, string>) {
  return searchParams?.preview === 'true';
}

// ============================================================================
// 7. COLOR CONSTANTS FOR CONSISTENCY
// ============================================================================

export const colors = {
  primary: '#FF6B6B',
  primaryLight: '#FF8A8A',
  primaryDark: '#E85555',
  accent: '#FF6B6B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
};

// ============================================================================
// 8. EXPORT ALL
// ============================================================================

export default {
  darkModeConfig,
  PublicLinkCard,
  PublicContactCard,
  PublicFeaturedProducts,
  PublicProfileInfo,
  useSharePreviewMode,
  colors,
};
