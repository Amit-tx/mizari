'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { addReaction } from '@/app/[username]/actions';

interface LikeButtonProps {
  profileId: number;
  initialLikes?: number; // fallback
  themeTextColor?: string;
  initialLike?: number;
  initialLove?: number;
  initialHaha?: number;
  initialWow?: number;
  initialSad?: number;
  initialFire?: number;
}

interface ReactionOption {
  type: string;
  emoji: string;
  label: string;
}

const REACTION_OPTIONS: ReactionOption[] = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'haha', emoji: '😂', label: 'Haha' },
  { type: 'wow', emoji: '🎉', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
];

export function LikeButton({
  profileId,
  initialLikes = 0,
  themeTextColor,
  initialLike = 0,
  initialLove = 0,
  initialHaha = 0,
  initialWow = 0,
  initialSad = 0,
  initialFire = 0,
}: LikeButtonProps) {
  // Store reaction counts in state
  const [counts, setCounts] = useState<Record<string, number>>({
    like: initialLike,
    love: initialLove,
    fire: initialFire,
    haha: initialHaha,
    wow: initialWow,
    sad: initialSad,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [reactedTypes, setReactedTypes] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; left: number }[]>([]);

  // Load reacted states from localStorage
  useEffect(() => {
    try {
      const reacted = JSON.parse(localStorage.getItem(`mizari_reacted_${profileId}`) || '[]');
      setReactedTypes(reacted);
    } catch (e) {
      console.error(e);
    }
  }, [profileId]);

  const handleReact = (type: string, emoji: string) => {
    if (reactedTypes.includes(type)) return; // prevent duplicate clicks for this reaction type

    // Save state in localStorage
    const updated = [...reactedTypes, type];
    localStorage.setItem(`mizari_reacted_${profileId}`, JSON.stringify(updated));
    setReactedTypes(updated);

    // Spawn floating emoji particle
    const particle = {
      id: Date.now() + Math.random(),
      emoji,
      left: Math.random() * 80 - 40, // random dispersion
    };
    setFloatingEmojis((prev) => [...prev, particle]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== particle.id));
    }, 1200);

    // Optimistically update count
    setCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));

    // Trigger server action
    startTransition(async () => {
      try {
        await addReaction(profileId, type);
      } catch (err) {
        console.error('Failed to react:', err);
      }
    });
  };

  const totalLikes = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Floating Particle Container */}
      <div className="relative w-0 h-0 self-center">
        {floatingEmojis.map((item) => (
          <span
            key={item.id}
            className="absolute bottom-12 text-3xl animate-float-emoji pointer-events-none"
            style={{
              left: `${item.left}px`,
              animationDuration: '1.2s',
              animationTimingFunction: 'ease-out',
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Expanded Reaction Panel */}
      {isOpen && (
        <div className="mb-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/90 p-2 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 animate-scale-up mr-2">
          {REACTION_OPTIONS.map((opt) => {
            const hasReacted = reactedTypes.includes(opt.type);
            return (
              <button
                key={opt.type}
                onClick={() => handleReact(opt.type, opt.emoji)}
                disabled={hasReacted || isPending}
                className={`flex flex-col items-center rounded-full p-2 transition-all active:scale-90 ${
                  hasReacted
                    ? 'bg-white/10 text-white cursor-default'
                    : 'hover:bg-white/10 text-slate-350 hover:text-white'
                }`}
                title={`${opt.label} (${counts[opt.type]})`}
              >
                <span className="text-xl transition-transform hover:scale-125">{opt.emoji}</span>
                <span className="mt-0.5 text-[9px] font-bold opacity-80">{counts[opt.type]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Trigger Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition-all active:scale-95 ${
          isOpen
            ? 'border-indigo-400 bg-indigo-600 text-white scale-100'
            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:scale-105 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
        title="React to this profile"
      >
        <span className="text-xl">{isOpen ? '✕' : '✨'}</span>
      </button>

      {/* Total Reactions Count Badge */}
      <span
        className="mt-1 mr-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/10 dark:bg-white/10 select-none"
        style={themeTextColor ? { color: themeTextColor } : {}}
      >
        {totalLikes} reactions
      </span>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatEmoji {
          0% { transform: translateY(0) scale(0.8); opacity: 1; }
          100% { transform: translateY(-140px) scale(1.5); opacity: 0; }
        }
        .animate-float-emoji {
          animation: floatEmoji 1.2s forwards;
        }
      `}} />
    </div>
  );
}
