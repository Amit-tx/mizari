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

interface LinksAndProductsProps {
  standardLinks: Link[];
  productLinks: Link[];
  profileId: number;
  buttonClass: string;
  buttonStyle: React.CSSProperties;
  textStyle: React.CSSProperties;
  preset?: any;
}

export function LinksAndProducts({
  standardLinks,
  productLinks,
  profileId,
  buttonClass,
  buttonStyle,
  textStyle,
  preset,
}: LinksAndProductsProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [warningOpen, setWarningOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');
  const [pendingLinkId, setPendingLinkId] = useState<number | null>(null);

  // Extract unique product categories that are not empty
  const categories = ['All', ...Array.from(new Set(
    productLinks
      .map(p => p.productCategory)
      .filter(cat => cat && cat.trim() !== '')
  ))];

  // Check if a link is sensitive (Always disabled/false)
  const checkIsSensitive = (link: Link) => {
    return false;
  };

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
      // Redirect to tracking URL which will take them to targetUrl
      window.open(`/api/click/${pendingLinkId}`, '_blank');
      setPendingLinkId(null);
      setPendingUrl('');
    }
  };

  // Filter products by active category
  const filteredProducts = activeCategory === 'All'
    ? productLinks
    : productLinks.filter(p => p.productCategory === activeCategory);

  return (
    <>
      {/* Standard Links */}
      <div className="mt-8 space-y-3.5">
        {standardLinks.map((link) => (
          <a
            key={link.id}
            href={`/api/click/${link.id}`}
            onClick={(e) => handleLinkClick(e, link)}
            className={`group block w-full px-5 py-3.5 text-center text-sm font-bold ${buttonClass}`}
            style={buttonStyle}
          >
            <div className="flex items-center justify-center gap-2">
              {getPlatformIcon(link.url)}
              <span>{link.title}</span>
              {checkIsSensitive(link) && (
                <span className="text-[10px] bg-red-500/20 text-red-500 border border-red-500/30 px-1.5 py-0.5 rounded" title="18+ Sensitive Content">
                  18+
                </span>
              )}
              <svg className="ml-1 inline-block h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>
        ))}
      </div>

      {/* Affiliate Product Cards Section */}
      {productLinks.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200/20">
          <h3 className="text-xs font-extrabold uppercase tracking-wider mb-4 opacity-75" style={textStyle}>
            🛍️ Featured Products
          </h3>

          {/* Category Tabs */}
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                    activeCategory === cat
                      ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900 dark:border-white'
                      : 'bg-white/10 border-white/20 text-slate-700 dark:text-slate-350 hover:bg-white/20 dark:hover:bg-white/15'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Product Cards Grid */}
          <div className="grid gap-4 grid-cols-2">
            {filteredProducts.map((product) => (
              <a 
                key={product.id}
                href={`/api/click/${product.id}`}
                onClick={(e) => handleLinkClick(e, product)}
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
                    <span className="absolute top-2 left-2 rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white">
                      {product.discount}
                    </span>
                  )}
                  {/* Sensitive tag */}
                  {checkIsSensitive(product) && (
                    <span className="absolute top-2 right-2 rounded bg-red-600/90 px-1 py-0.5 text-[8px] font-bold text-white uppercase tracking-wider">
                      18+
                    </span>
                  )}
                </div>
                {/* Product Info */}
                <div className="p-3 flex-1 flex flex-col justify-between text-left">
                  <div>
                    {product.productCategory && (
                      <span className="text-[8px] font-extrabold uppercase text-slate-400 block mb-1">
                        {product.productCategory}
                      </span>
                    )}
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

      {/* Sensitive warning confirmation modal */}
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
