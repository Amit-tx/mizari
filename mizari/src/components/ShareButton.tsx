'use client';

import React, { useState } from 'react';

interface ShareButtonProps {
  username: string;
  themeTextColor?: string;
}

export function ShareButton({ username, themeTextColor }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/${username}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `@${username} on Mizari`,
          text: `Check out my links on Mizari!`,
          url: shareUrl,
        });
      } catch (e) {
        console.error('Error sharing:', e);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('Error copying to clipboard:', e);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      style={themeTextColor ? { color: themeTextColor, borderColor: `${themeTextColor}30` } : {}}
      className="absolute top-4 right-4 flex items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white/60 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-white/85"
      aria-label="Share profile"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.622-2.312m0 7.14l-4.622-2.312M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9zm-13.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm10.5-4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
      <span>{copied ? 'Copied!' : 'Share'}</span>
    </button>
  );
}
