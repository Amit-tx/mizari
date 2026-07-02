import React from 'react';

// Returns a beautiful SVG icon for popular platforms based on URL
export function getPlatformIcon(url: string) {
  const lowercaseUrl = url.toLowerCase();

  // Youtube
  if (lowercaseUrl.includes('youtube.com') || lowercaseUrl.includes('youtu.be')) {
    return (
      <span className="text-red-500 text-lg mr-2">📺</span>
    );
  }
  // Instagram
  if (lowercaseUrl.includes('instagram.com')) {
    return (
      <span className="text-pink-500 text-lg mr-2">📸</span>
    );
  }
  // Twitter / X
  if (lowercaseUrl.includes('twitter.com') || lowercaseUrl.includes('x.com')) {
    return (
      <span className="text-slate-900 dark:text-white text-lg mr-2">🐦</span>
    );
  }
  // Facebook
  if (lowercaseUrl.includes('facebook.com') || lowercaseUrl.includes('fb.com')) {
    return (
      <span className="text-blue-600 text-lg mr-2">📘</span>
    );
  }
  // Spotify
  if (lowercaseUrl.includes('spotify.com')) {
    return (
      <span className="text-green-500 text-lg mr-2">🎵</span>
    );
  }
  // GitHub
  if (lowercaseUrl.includes('github.com')) {
    return (
      <span className="text-gray-900 dark:text-white text-lg mr-2">💻</span>
    );
  }
  // LinkedIn
  if (lowercaseUrl.includes('linkedin.com')) {
    return (
      <span className="text-blue-700 text-lg mr-2">👔</span>
    );
  }
  // TikTok
  if (lowercaseUrl.includes('tiktok.com')) {
    return (
      <span className="text-black dark:text-white text-lg mr-2">🎵</span>
    );
  }
  // WhatsApp
  if (lowercaseUrl.includes('wa.me') || lowercaseUrl.includes('whatsapp.com')) {
    return (
      <span className="text-emerald-500 text-lg mr-2">💬</span>
    );
  }

  // Default link icon
  return (
    <span className="text-gray-400 text-lg mr-2">🔗</span>
  );
}
