'use client';

import { useState, useEffect } from 'react';
import { STORE_THEMES, BUNDLE_DEALS, StoreTheme } from '@/components/StoreThemes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProfilePreview } from '@/components/ProfilePreview';

const MOCK_LINKS = [
  { id: 1, title: "✨ Follow my Instagram", url: "https://instagram.com", isProduct: 0 },
  { id: 2, title: "🎥 Subscribe to my YouTube", url: "https://youtube.com", isProduct: 0 },
  { id: 3, title: "🛍️ Check out my Store", url: "https://mizari.co", isProduct: 1, price: "₹499", discount: "20% OFF" }
];

interface StoreClientProps {
  userId: number | null;
  purchasedThemeIds: string[];
  userEmail: string;
  communityThemes: StoreTheme[];
}

export default function StoreClient({ userId, purchasedThemeIds, userEmail, communityThemes = [] }: StoreClientProps) {
  const router = useRouter();
  const [purchased, setPurchased] = useState<string[]>(purchasedThemeIds);
  const [filter, setFilter] = useState<'all' | 'premium' | 'exclusive' | 'bundles'>('all');
  const [category, setCategory] = useState<'All' | 'Anime' | 'Minimal' | 'Luxury' | 'Gaming' | 'Creator' | 'Business'>('All');
  const [loadingTheme, setLoadingTheme] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreviewTheme, setActivePreviewTheme] = useState<StoreTheme | null>(null);

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePurchase = async (themeId?: string, bundleId?: string) => {
    if (!userId) {
      router.push('/login?callbackUrl=/store');
      return;
    }
    const id = themeId || bundleId;
    if (!id) return;

    setLoadingTheme(id);
    setMessage(null);

    try {
      // 1. Create order on the server
      const res = await fetch('/api/store/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId, bundleId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Mizari Themes',
        description: `Purchase ${data.label}`,
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            // 3. Verify payment on server
            const verifyRes = await fetch('/api/store/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                themeId,
                bundleId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || 'Verification failed');

            // Success! Update local state
            if (bundleId) {
              const bundle = BUNDLE_DEALS.find((b) => b.id === bundleId);
              if (bundle) {
                setPurchased((prev) => [...new Set([...prev, ...bundle.themes])]);
              }
            } else if (themeId) {
              setPurchased((prev) => [...prev, themeId]);
            }

            setMessage({ type: 'success', text: `🎉 Successfully purchased ${data.label}! You can now use it in your Dashboard.` });
          } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Payment verification failed.' });
          }
        },
        prefill: {
          email: userEmail,
        },
        theme: {
          color: '#FF6B6B',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Payment initiation failed.' });
    } finally {
      setLoadingTheme(null);
    }
  };

  const allThemes = [...STORE_THEMES, ...communityThemes];

  const filteredThemes = allThemes.filter((theme) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matches = 
        theme.name.toLowerCase().includes(q) ||
        theme.description.toLowerCase().includes(q) ||
        theme.categories.some(cat => cat.toLowerCase().includes(q)) ||
        theme.tags.some(tag => tag.toLowerCase().includes(q));
      if (!matches) return false;
    }

    // Tier check
    if (filter === 'premium' && theme.tier !== 'premium') return false;
    if (filter === 'exclusive' && theme.tier !== 'exclusive') return false;
    
    // Category check
    if (category !== 'All' && !theme.categories.includes(category)) return false;

    return true;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            🎭 Theme Store
          </h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-slate-400">
            Customize your pages with premium animated aesthetics. Buy once, keep forever.
          </p>
        </div>

        {/* Global Messages */}
        {message && (
          <div className={`mb-8 p-4 rounded-2xl border text-sm font-semibold flex items-center justify-between ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-900/30 dark:text-green-400' 
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400'
          }`}>
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-xs underline hover:no-underline">Dismiss</button>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 relative max-w-md w-full">
          <input
            type="text"
            placeholder="🔍 Search themes by name, description, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 text-gray-800 dark:text-slate-100 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tier & Bundle Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Tiers */}
          <div className="flex justify-center space-x-2 bg-gray-200/55 dark:bg-slate-900 p-1.5 rounded-2xl w-max">
            {(['all', 'premium', 'exclusive', 'bundles'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setFilter(t);
                  if (t === 'bundles') setCategory('All'); // Bundles don't have categories
                }}
                className={`px-4 py-2 text-sm font-bold capitalize rounded-xl transition-all duration-200 ${
                  filter === t 
                    ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Categories Filter (Only show when not in Bundles tab) */}
          {filter !== 'bundles' && (
            <div className="flex flex-wrap justify-center gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-slate-900/50">
              {(['All', 'Anime', 'Minimal', 'Luxury', 'Gaming', 'Creator', 'Business'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 ${
                    category === cat
                      ? 'bg-[#FF6B6B] text-white shadow-sm'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bundles View */}
        {filter === 'bundles' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {BUNDLE_DEALS.map((bundle) => {
              const allPurchased = bundle.themes.every((tid) => purchased.includes(tid));
              return (
                <div key={bundle.id} className="relative flex flex-col rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{bundle.emoji}</span>
                    <div>
                      <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">{bundle.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{bundle.themes.length} Premium Themes Included</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-6 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 line-through">₹{bundle.originalPrice}</span>
                      <span className="text-2xl font-black text-gray-900 dark:text-white ml-1.5">₹{bundle.price}</span>
                    </div>
                    <button
                      onClick={() => handlePurchase(undefined, bundle.id)}
                      disabled={allPurchased || loadingTheme === bundle.id}
                      className={`px-5 py-2 text-xs font-extrabold rounded-xl transition-all ${
                        allPurchased
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white hover:shadow-md'
                      }`}
                    >
                      {allPurchased ? 'Owned ✅' : loadingTheme === bundle.id ? 'Processing...' : 'Unlock Bundle 🔓'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Themes Grid */}
        {filter !== 'bundles' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredThemes.map((theme) => {
              const isFree = theme.tier === 'free';
              const themeKey = isNaN(Number(theme.id)) ? theme.id : `market_${theme.id}`;
              const isOwned = isFree || purchased.includes(themeKey);

              return (
                <div key={theme.id} className="relative flex flex-col rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  {/* Theme Live Preview Box */}
                  <div 
                    className="h-36 w-full flex items-center justify-center relative overflow-hidden"
                    style={{
                      backgroundColor: theme.bgColor,
                      backgroundImage: theme.bgGradient,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="text-center z-10">
                      <span className="text-4xl block mb-2">{theme.emoji}</span>
                      <span className="font-black tracking-wide text-lg drop-shadow" style={{ color: theme.textColor }}>
                        @{theme.id}
                      </span>
                    </div>
                    {/* Visual indicators for animations */}
                    {theme.effect && (
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/40 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                        ✨ Animated ({theme.effect.replace('_', ' ')})
                      </span>
                    )}
                  </div>

                  {/* Body info */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-extrabold text-gray-900 dark:text-white">{theme.name}</h3>
                        <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                          isFree 
                            ? 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400' 
                            : theme.tier === 'exclusive' 
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                            : 'bg-[#FF6B6B]/10 text-[#FF6B6B]'
                        }`}>
                          {theme.tier}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">{theme.description}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-lg font-black text-gray-900 dark:text-white">
                        {isFree ? 'Free' : `₹${theme.price}`}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActivePreviewTheme(theme)}
                          className="px-3.5 py-2 text-xs font-bold rounded-xl border border-gray-250 dark:border-slate-750 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          Preview 👁️
                        </button>
                        <button
                          onClick={() => !isOwned && handlePurchase(theme.id)}
                          disabled={isOwned || loadingTheme === theme.id}
                          className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
                            isOwned
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-default'
                              : 'bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white hover:shadow-md'
                          }`}
                        >
                          {isOwned ? 'Owned ✅' : loadingTheme === theme.id ? 'Processing...' : 'Buy Theme 🔒'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {activePreviewTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] max-w-sm w-full p-4 border border-gray-150 dark:border-slate-800 shadow-2xl relative flex flex-col max-h-[90vh]">
            <button
              onClick={() => setActivePreviewTheme(null)}
              className="absolute top-4 right-4 z-50 h-8 w-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/20 transition-all font-bold text-gray-805 dark:text-slate-100"
            >
              ✕
            </button>
            <h3 className="text-center font-black text-xs text-gray-500 dark:text-slate-400 mb-3 tracking-wide uppercase">
              ✨ Live Theme Preview: {activePreviewTheme.name}
            </h3>
            <div className="flex-1 overflow-y-auto rounded-2xl border border-gray-100 dark:border-slate-850 relative bg-slate-50 dark:bg-slate-950">
              <ProfilePreview
                username="demouser"
                bio="This is a live preview of how your page will look with this theme applied!"
                avatarUrl=""
                links={MOCK_LINKS as any}
                themeType={activePreviewTheme.id}
                themeBgColor={activePreviewTheme.bgColor}
                themeTextColor={activePreviewTheme.textColor}
                themeBgImage={activePreviewTheme.bgGradient || ''}
                themeButtonStyle={activePreviewTheme.btnStyle || 'rounded-xl'}
                themeBackdrop="glass-dark"
              />
            </div>
            <div className="mt-4">
              <button
                onClick={() => setActivePreviewTheme(null)}
                className="w-full py-3 rounded-2xl bg-[#FF6B6B] hover:bg-[#FF5555] text-white text-xs font-black transition-all shadow-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
