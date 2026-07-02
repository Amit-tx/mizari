'use client';

import React, { useState, useEffect } from 'react';

interface AnnouncementBannerProps {
  profileId: number;
  text: string;
  link?: string;
  bgColor?: string;
  textColor?: string;
}

export function AnnouncementBanner({
  profileId,
  text,
  link,
  bgColor = '#FF6B6B',
  textColor = '#ffffff',
}: AnnouncementBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed for this profile
    const dismissed = localStorage.getItem(`mizari_banner_dismissed_${profileId}`);
    if (!dismissed) {
      setVisible(true);
    }
  }, [profileId]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem(`mizari_banner_dismissed_${profileId}`, 'true');
    setVisible(false);
  };

  if (!visible || !text) return null;

  const BannerContent = () => (
    <div className="flex items-center justify-between px-6 py-2.5 text-center text-xs font-bold transition-all shadow-md">
      <div className="mx-auto flex items-center justify-center gap-2">
        <span className="animate-bounce">📢</span>
        <span className="line-clamp-1">{text}</span>
        {link && (
          <span className="underline ml-1 hover:brightness-90 transition-all">
            Learn More &rarr;
          </span>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="ml-3 p-1 rounded-full hover:bg-black/10 transition-colors text-sm font-extrabold focus:outline-none"
        title="Dismiss Banner"
      >
        ✕
      </button>
    </div>
  );

  return (
    <div 
      className="w-full z-40 transition-all select-none"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {link ? (
        <a 
          href={link.startsWith('http') ? link : `https://${link}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block"
        >
          <BannerContent />
        </a>
      ) : (
        <BannerContent />
      )}
    </div>
  );
}
