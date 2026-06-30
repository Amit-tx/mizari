'use client';

import React, { useState, useTransition } from 'react';
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

  const handleLike = () => {
    // Spawn a floating heart animation
    const newHeart = {
      id: Date.now(),
      left: Math.random() * 40 - 20, // random sway
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
        disabled={isPending}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-pink-200 bg-pink-50 text-pink-600 shadow-lg transition-all hover:bg-pink-100 dark:border-pink-900/30 dark:bg-pink-950/20 dark:text-pink-400 dark:hover:bg-pink-950/40 hover:scale-105 active:scale-95"
        title="Send Love ❤️"
      >
        <span className="text-xl">❤️</span>
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
