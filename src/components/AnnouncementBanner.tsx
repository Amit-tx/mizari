'use client';

import React, { useState, useEffect } from 'react';

interface BannerMessage {
  text: string;
  link?: string;
}

interface AnnouncementBannerProps {
  profileId: number;
  messages: BannerMessage[];
  bgColor?: string;
  textColor?: string;
  rotateMs?: number;
}

export function AnnouncementBanner({
  profileId,
  messages,
  bgColor = '#FF6B6B',
  textColor = '#ffffff',
  rotateMs = 3000,
}: AnnouncementBannerProps) {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const validMessages = (messages || []).filter((m) => m.text && m.text.trim());

  useEffect(() => {
    const dismissed = localStorage.getItem(`mizari_banner_dismissed_${profileId}`);
    if (!dismissed) {
      setVisible(true);
    }
  }, [profileId]);

  // Cycle through messages every `rotateMs` — only when there's more
  // than one, with a quick fade so the swap isn't jarring.
  useEffect(() => {
    if (validMessages.length <= 1) return;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % validMessages.length);
        setFading(false);
      }, 200);
    }, rotateMs);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validMessages.length, rotateMs]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem(`mizari_banner_dismissed_${profileId}`, 'true');
    setVisible(false);
  };

  if (!visible || validMessages.length === 0) return null;

  const current = validMessages[activeIndex % validMessages.length];
  const link = current.link?.trim();

  const BannerContent = () => (
    <div className="flex items-center justify-between px-6 py-2.5 text-center text-xs font-bold transition-all shadow-md">
      <div
        className={`mx-auto flex items-center justify-center gap-2 transition-opacity duration-200 ${fading ? 'opacity-0' : 'opacity-100'}`}
      >
        <span className="animate-bounce">📢</span>
        <span className="line-clamp-1">{current.text}</span>
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

      {validMessages.length > 1 && (
        <div className="flex justify-center gap-1 pb-1.5">
          {validMessages.map((_, i) => (
            <span
              key={i}
              className="h-1 w-1 rounded-full transition-all"
              style={{
                backgroundColor: textColor,
                opacity: i === activeIndex % validMessages.length ? 0.9 : 0.35,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
