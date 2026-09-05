'use client';

import React, { useState } from 'react';
import { getPlatformIcon } from '@/components/LinkIcons';

interface Link {
  id: number;
  title: string;
  url: string;
  clicks: number;
  isProduct: number;
  price: string | null;
  discount: string | null;
  productImage: string | null;
  productCategory: string;
}

interface ProfileForm {
  id: number;
  title: string;
  description: string;
  slug: string;
}

interface CreatorCardThemeProps {
  username: string;
  avatarUrl?: string | null;
  tagline?: string | null;
  bio?: string | null;
  profileType?: string | null;
  views: number;
  standardLinks: Link[];
  productLinks: Link[];
  profileForms?: ProfileForm[];
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `${n}`;
}

export function CreatorCardTheme({
  username,
  avatarUrl,
  tagline,
  bio,
  profileType,
  views,
  standardLinks,
  productLinks,
  profileForms = [],
}: CreatorCardThemeProps) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);

  const dark = mode === 'dark';

  const k = {
    bg: dark
      ? 'bg-[#121212]'
      : 'bg-gradient-to-br from-violet-200 via-pink-100 to-orange-100',
    card: dark ? 'bg-white/[0.04] border border-white/10' : 'bg-white border border-black/[0.06] shadow-sm',
    text: dark ? 'text-white' : 'text-black',
    muted: dark ? 'text-white/60' : 'text-black/50',
    pill: dark ? 'bg-white/10 border border-white/10' : 'bg-black/[0.04] border border-black/[0.04]',
    itemBg: dark
      ? 'bg-white/10 border-white/10 hover:bg-white/15 text-white'
      : 'bg-white border-black/10 hover:border-black/20 hover:shadow-sm text-black',
    iconBg: dark ? 'bg-white/10 group-hover:bg-white/15' : 'bg-black/[0.04] group-hover:bg-black/[0.06]',
  };

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/${username}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked — silently ignore, link is still visible in the address bar
    }
  };

  const subtitle = [tagline, profileType && profileType !== 'personal' ? profileType : null]
    .filter(Boolean)
    .join(' • ');

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-300 ${k.bg}`}>
      <div className="mx-auto w-full max-w-md pb-16 pt-6">
        {/* Top bar: light/dark pill toggle */}
        <div className="mx-3 sm:mx-0 mb-4 flex items-center justify-between">
          <span className={`text-[11px] font-semibold tracking-wide ${k.muted}`}>mizari.cc/{username}</span>
          <div className={`flex items-center gap-1 rounded-full p-1 ${k.pill}`}>
            <button
              type="button"
              onClick={() => setMode('light')}
              className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                mode === 'light' ? 'bg-black text-white shadow-sm' : `${dark ? 'text-white/70' : 'text-black/60'} hover:text-black`
              }`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => setMode('dark')}
              className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                mode === 'dark' ? 'bg-white text-black shadow-sm' : `${dark ? 'text-white/70' : 'text-black/60'} hover:text-black`
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Profile card */}
        <div className={`mx-3 sm:mx-0 rounded-[28px] ${k.card} p-6 sm:p-7`}>
          <div className="flex flex-col items-center text-center">
            <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-black/5 bg-gray-200 shadow">
              {avatarUrl ? (
                <img src={avatarUrl} alt={username} className="h-full w-full object-cover" />
              ) : (
                <div className={`flex h-full w-full items-center justify-center text-2xl font-bold ${dark ? 'bg-white/10 text-white/60' : 'bg-black/5 text-black/40'}`}>
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h1 className={`mt-3 text-lg font-bold ${k.text}`}>@{username}</h1>
            {subtitle && <p className={`mt-1 text-[12px] ${k.muted}`}>{subtitle}</p>}
            {bio && <p className={`mt-2 text-[13px] leading-snug ${k.muted}`}>{bio}</p>}

            <div className="mt-4 flex items-center gap-4">
              <div className="text-center">
                <span className={`block text-sm font-semibold ${k.text}`}>{formatCount(views)}</span>
                <span className={`text-[10px] uppercase tracking-wide ${k.muted}`}>views</span>
              </div>
              <div className={`h-6 w-px ${dark ? 'bg-white/10' : 'bg-black/10'}`} />
              <div className="text-center">
                <span className={`block text-sm font-semibold ${k.text}`}>
                  {formatCount(standardLinks.reduce((sum, l) => sum + (l.clicks || 0), 0))}
                </span>
                <span className={`text-[10px] uppercase tracking-wide ${k.muted}`}>clicks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Standard links */}
        {standardLinks.length > 0 && (
          <div className="mx-3 sm:mx-0 mt-3 space-y-2">
            {standardLinks.map((link) => (
              <a
                key={link.id}
                href={`/api/click/${link.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200 ${k.itemBg}`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg transition-colors ${k.iconBg}`}>
                  {getPlatformIcon(link.url) ?? <span>🔗</span>}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-semibold">{link.title}</span>
                  <span className={`text-[11px] ${k.muted}`}>{formatCount(link.clicks || 0)} clicks</span>
                </div>
                <svg className={`h-4 w-4 shrink-0 opacity-40 transition-transform group-hover:translate-x-0.5 ${k.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        )}

        {/* Forms */}
        {profileForms.length > 0 && (
          <div className="mx-3 sm:mx-0 mt-2 space-y-2">
            {profileForms.map((form) => (
              <a
                key={form.id}
                href={`/f/${username}/${form.slug}`}
                className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200 ${k.itemBg}`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg ${k.iconBg}`}>📋</div>
                <div className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-semibold">{form.title}</span>
                  {form.description && <span className={`block truncate text-[11px] ${k.muted}`}>{form.description}</span>}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Product cards */}
        {productLinks.length > 0 && (
          <div className="mx-3 sm:mx-0 mt-4">
            <p className={`mb-2 text-[11px] font-semibold uppercase tracking-wider ${k.muted}`}>Shop</p>
            <div className="grid grid-cols-2 gap-2.5">
              {productLinks.map((product) => (
                <a
                  key={product.id}
                  href={`/api/click/${product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`overflow-hidden rounded-[20px] ${k.card} transition-transform hover:-translate-y-0.5`}
                >
                  <div className="relative h-24 w-full overflow-hidden bg-black/5">
                    {product.productImage ? (
                      <img src={product.productImage} alt={product.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">🛍️</div>
                    )}
                    {product.discount && (
                      <span className="absolute top-2 left-2 rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        {product.discount}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className={`line-clamp-2 text-[12px] font-semibold leading-snug ${k.text}`}>{product.title}</h4>
                    {product.price && <p className={`mt-1 text-[12px] font-bold ${k.text}`}>{product.price}</p>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Share / copy link */}
        <div className="mx-3 sm:mx-0 mt-4">
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full rounded-[20px] p-4 text-center text-[13px] font-bold transition-all ${
              dark ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white' : 'bg-[#121212] text-white'
            }`}
          >
            {copied ? 'Link copied to clipboard' : 'Copy Link'}
          </button>
        </div>

        {/* Footer */}
        <div className="mx-3 sm:mx-0 mt-6 flex items-center justify-center gap-2">
          <a href="/privacy" className={`text-[11px] ${k.muted} hover:underline`}>Privacy policy</a>
          <span className={`h-1 w-1 rounded-full ${dark ? 'bg-white/20' : 'bg-black/20'}`} />
          <span className={`text-[11px] opacity-60 ${k.muted}`}>© {new Date().getFullYear()} mizari.cc</span>
        </div>
      </div>
    </div>
  );
}
