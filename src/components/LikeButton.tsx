'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { incrementLikes } from '@/app/[username]/actions';

interface LikeButtonProps {
  profileId: number;
  initialLikes: number;
  themeTextColor?: string;
}

export function LikeButton({ profileId, initialLikes, themeTextColor }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([]);
  const [hasLiked, setHasLiked] = useState(false);

  // Check localStorage on mount to see if this device already liked this profile
  useEffect(() => {
    const likedProfiles = JSON.parse(localStorage.getItem('mizari_liked') || '[]');
    if (likedProfiles.includes(profileId)) {
      setHasLiked(true);
    }
  }, [profileId]);

  const handleLike = () => {
    if (hasLiked) return; // Already liked from this device

    // Mark as liked in localStorage
    const likedProfiles = JSON.parse(localStorage.getItem('mizari_liked') || '[]');
    likedProfiles.push(profileId);
    localStorage.setItem('mizari_liked', JSON.stringify(likedProfiles));
    setHasLiked(true);

    // Spawn a floating heart animation
    const newHeart = {
      id: Date.now(),
      left: Math.random() * 40 - 20,
    };
    setHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1000);

    // Optimistically update UI
    setLikes((prev) => prev + 1);

    // Run Server Action
    startTransition(async () => {
      try {
        await incrementLikes(profileId);
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center">
      {/* Floating Hearts Animation Container */}
      <div className="relative w-0 h-0">
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className="absolute bottom-6 text-2xl animate-float-heart pointer-events-none"
            style={{ 
              left: `${heart.left}px`,
              animationDuration: '1s',
              animationTimingFunction: 'ease-out',
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Main Floating Like Button */}
      <button
        onClick={handleLike}
        disabled={isPending || hasLiked}
        className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition-all active:scale-95 ${
          hasLiked 
            ? 'border-pink-400 bg-pink-500 text-white cursor-default scale-100' 
            : 'border-pink-200 bg-pink-50 text-pink-600 hover:bg-pink-100 hover:scale-105 dark:border-pink-900/30 dark:bg-pink-950/20 dark:text-pink-400 dark:hover:bg-pink-950/40'
        }`}
        title={hasLiked ? 'You already liked this!' : 'Send Love ❤️'}
      >
        <span className="text-xl">{hasLiked ? '💖' : '❤️'}</span>
      </button>

      {/* Likes Count Badge */}
      <span 
        className="mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/10 dark:bg-white/10"
        style={themeTextColor ? { color: themeTextColor } : {}}
      >
        {likes}
      </span>
    </div>
  );
}
