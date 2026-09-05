'use client';

import React, { useState } from 'react';
import { getPlatformIcon } from '@/components/LinkIcons';
import { isAdultPlatform } from '@/utils/analytics';
import { SensitiveWarningModal } from '@/components/SensitiveWarningModal';

interface Link {
  id: number;
  profileId: number;
  title: string;
  url: string;
  icon: string | null;
  order: number;
  clicks: number;
  isProduct: number;
  price: string | null;
  discount: string | null;
  productImage: string | null;
  productCategory: string;
  isSensitive: number;
}

interface ProfileForm {
  id: number;
  title: string;
  description: string;
  slug: string;
  isEnabled: number;
}

interface LinksAndProductsProps {
  standardLinks: Link[];
  productLinks: Link[];
  profileId: number;
  buttonClass: string;
  buttonStyle: React.CSSProperties;
  textStyle: React.CSSProperties;
  preset?: any;
  profileForms?: ProfileForm[];
  username?: string;
}

export function LinksAndProducts({
  standardLinks,
  productLinks,
  profileId,
  buttonClass,
  buttonStyle,
  textStyle,
  preset,
  profileForms = [],
  username = '',
}: LinksAndProductsProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [warningOpen, setWarningOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');
  const [pendingLinkId, setPendingLinkId] = useState<number | null>(null);

  const checkIsSensitive = (_link: Link) => false;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: Link) => {
    if (checkIsSensitive(link)) {
      e.preventDefault();
      setPendingUrl(link.url);
      setPendingLinkId(link.id);
      setWarningOpen(true);
    }
  };

  const handleConfirmWarning = () => {
    if (pendingLinkId) {
      setWarningOpen(false);
      window.open(`/api/click/${pendingLinkId}`, '_blank');
      setPendingLinkId(null);
      setPendingUrl('');
    }
  };

  const categories = ['All', ...Array.from(new Set(
    productLinks.map(p => p.productCategory).filter(cat => cat && cat.trim() !== '')
  ))];

  const filteredProducts = activeCategory === 'All'
    ? productLinks
    : productLinks.filter(p => p.productCategory === activeCategory);

  // Detect if we're on a dark or glass preset to style cards properly
  const isDarkPreset = preset && (
    parseInt(preset.bgColor?.replace('#', '') || 'ffffff', 16) < 0x888888
  );

  // Glass card style that respects the theme
  const glassCard = preset
    ? {
        background: isDarkPreset ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.55)',
        borderColor: isDarkPreset ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }
    : {};

  const iconBoxStyle = preset
    ? {
        background: isDarkPreset ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.07)',
        borderColor: isDarkPreset ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.10)',
      }
    : {};

  return (
    <>
      {/* ── Standard Links ───────────────────────────────────────────── */}
      {standardLinks.length > 0 && (
        <div className="mt-6 space-y-2.5">
          {standardLinks.map((link) => (
            <a
              key={link.id}
              href={`/api/click/${link.id}`}
              onClick={(e) => handleLinkClick(e, link)}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5
                         transition-all duration-200
                         hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]
                         backdrop-blur-md"
              style={{
                ...buttonStyle,
                ...glassCard,
              }}
            >
              {/* Platform icon pill */}
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-lg"
                style={iconBoxStyle}
              >
                {getPlatformIcon(link.url) ?? <span>🔗</span>}
              </div>

              {/* Title */}
              <span
                className="flex-1 text-center text-sm font-bold tracking-wide"
                style={textStyle}
              >
                {link.title}
              </span>

              {/* Arrow */}
              <svg
                className="h-4 w-4 shrink-0 opacity-30 transition-all duration-200
                           group-hover:opacity-80 group-hover:translate-x-0.5"
                style={textStyle}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>

              {/* 18+ badge */}
              {checkIsSensitive(link) && (
                <span className="absolute top-1.5 right-1.5 rounded bg-red-500/20 px-1.5 py-0.5
                                 text-[8px] font-extrabold text-red-400 border border-red-500/30">
                  18+
                </span>
              )}
            </a>
          ))}
        </div>
      )}

      {/* ── Published Forms ──────────────────────────────────────────── */}
      {profileForms.length > 0 && (
        <div className="mt-2.5 space-y-2.5">
          {profileForms.map((form) => (
            <a
              key={form.id}
              href={`/f/${username}/${form.slug}`}
              className="group relative flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5
                         transition-all duration-200
                         hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]
                         backdrop-blur-md"
              style={{
                ...buttonStyle,
                ...glassCard,
              }}
            >
              {/* Form icon pill */}
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-lg"
                style={iconBoxStyle}
              >
                📋
              </div>

              {/* Text */}
              <div className="flex-1 text-center">
                <span className="block text-sm font-bold tracking-wide" style={textStyle}>
                  {form.title}
                </span>
                {form.description && (
                  <span
                    className="block text-xs opacity-50 mt-0.5 truncate"
                    style={textStyle}
                  >
                    {form.description}
                  </span>
                )}
              </div>

              {/* Arrow */}
              <svg
                className="h-4 w-4 shrink-0 opacity-30 transition-all duration-200
                           group-hover:opacity-80 group-hover:translate-x-0.5"
                style={textStyle}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>
      )}

      {/* ── Product Cards ─────────────────────────────────────────────── */}
      {productLinks.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-center text-[10px] font-extrabold uppercase tracking-widest opacity-50"
             style={textStyle}>
            🛍️ Featured Products
          </p>

          {/* Category tabs */}
          {categories.length > 2 && (
            <div className="mb-3 flex flex-wrap justify-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3 py-1 text-[10px] font-bold border transition-all ${
                    activeCategory === cat
                      ? 'bg-white/90 text-slate-900 border-white/80 shadow'
                      : 'border-white/20 text-white/70 hover:border-white/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            {filteredProducts.map((product) => (
              <a
                key={product.id}
                href={`/api/click/${product.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-2xl border
                           transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl
                           active:scale-[0.98] backdrop-blur-md"
                style={{ ...glassCard, borderColor: glassCard.borderColor }}
              >
                {/* Product image */}
                <div className="relative h-28 w-full overflow-hidden bg-white/5">
                  {product.productImage ? (
                    <img
                      src={product.productImage}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-300
                                 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl">🛍️</div>
                  )}
                  {product.discount && (
                    <span className="absolute top-2 left-2 rounded-lg bg-red-500 px-2 py-0.5
                                     text-[9px] font-extrabold text-white shadow">
                      {product.discount}
                    </span>
                  )}
                </div>

                {/* Product info */}
                <div className="flex flex-1 flex-col gap-2 p-3">
                  {product.productCategory && (
                    <span className="text-[8px] font-extrabold uppercase tracking-wider opacity-50"
                          style={textStyle}>
                      {product.productCategory}
                    </span>
                  )}
                  <h4 className="line-clamp-2 text-xs font-bold leading-snug" style={textStyle}>
                    {product.title}
                  </h4>
                  {product.price && (
                    <p className="text-xs font-extrabold" style={{ color: preset?.btnBg ?? '#111827' }}>
                      {product.price}
                    </p>
                  )}
                  <div
                    className="mt-auto w-full rounded-xl py-1.5 text-center text-[10px]
                               font-extrabold transition-all hover:brightness-110"
                    style={{
                      backgroundColor: preset?.btnBg ?? '#111827',
                      color: preset?.btnText ?? '#ffffff',
                    }}
                  >
                    Shop Now
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Sensitive warning modal */}
      <SensitiveWarningModal
        isOpen={warningOpen}
        targetUrl={pendingUrl}
        onConfirm={handleConfirmWarning}
        onCancel={() => {
          setWarningOpen(false);
          setPendingUrl('');
          setPendingLinkId(null);
        }}
      />
    </>
  );
}
