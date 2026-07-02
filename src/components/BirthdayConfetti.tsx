'use client';

import React, { useEffect, useState } from 'react';

interface ConfettiItem {
  id: number;
  emoji: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

const BIRTHDAY_EMOJIS = ['🎈', '🎉', '🎂', '🥳', '🎁', '✨', '🌟'];

export function BirthdayConfetti() {
  const [elements, setElements] = useState<ConfettiItem[]>([]);

  useEffect(() => {
    // Generate 40 falling birthday elements
    const items = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      emoji: BIRTHDAY_EMOJIS[Math.floor(Math.random() * BIRTHDAY_EMOJIS.length)],
      left: Math.random() * 100,
      size: 16 + Math.random() * 24, // 16px to 40px
      duration: 6 + Math.random() * 6, // 6s to 12s
      delay: Math.random() * 4,
    }));
    setElements(items);
  }, []);

  return (
    <>
      {/* Falling Emojis Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {elements.map((item) => (
          <span
            key={item.id}
            className="absolute -top-[10%] select-none animate-fall-confetti"
            style={{
              left: `${item.left}%`,
              fontSize: `${item.size}px`,
              animationDuration: `${item.duration}s`,
              animationDelay: `${item.delay}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Greeting Banner */}
      <div className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 py-3 text-center text-xs font-black text-white shadow-md z-45 animate-pulse relative">
        <span>🎉 IT'S MY BIRTHDAY TODAY! HANG A WISH IN THE GUESTBOOK! 🎂🥳</span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fall-confetti {
          0% {
            transform: translateY(-10vh) rotate(0deg) translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(25px);
            opacity: 0.9;
          }
          100% {
            transform: translateY(110vh) rotate(360deg) translateX(-25px);
            opacity: 0;
          }
        }
        .animate-fall-confetti {
          animation: fall-confetti linear infinite;
        }
      `}} />
    </>
  );
}
