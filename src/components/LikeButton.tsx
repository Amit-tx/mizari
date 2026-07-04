'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { changeReaction } from '@/app/[username]/actions';

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
  serverActiveReaction?: string | null;
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
  serverActiveReaction = null,
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
  const [activeReaction, setActiveReaction] = useState<string | null>(serverActiveReaction);
  const [isPending, startTransition] = useTransition();
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; left: number }[]>([]);

  // localStorage is kept only as a fast-paint hint for repeat visitors on
  // the SAME browser; the server's answer (serverActiveReaction, passed
  // in as a prop from the page render) always wins as the source of truth.
  useEffect(() => {
    try {
      if (serverActiveReaction) {
        localStorage.setItem(`mizari_reacted_${profileId}`, serverActiveReaction);
      } else {
        localStorage.removeItem(`mizari_reacted_${profileId}`);
      }
    } catch (e) {
      console.error(e);
    }
  }, [profileId, serverActiveReaction]);

  const handleReact = (type: string, emoji: string) => {
    if (isPending) return;

    const oldReaction = activeReaction;
    const isTogglingOff = oldReaction === type;
    const newReaction = isTogglingOff ? null : type;

    // Snapshot so we can fully roll back if the server disagrees or fails
    // — previously only `activeReaction` was reverted on failure while
    // `counts` stayed bumped forever, so every failed/blocked click still
    // permanently inflated the visible number (looked "unlimited").
    const prevActiveReaction = activeReaction;
    const prevCounts = counts;

    // 1. Update localStorage (optimistic hint only — server re-verifies)
    if (newReaction) {
      localStorage.setItem(`mizari_reacted_${profileId}`, newReaction);
    } else {
      localStorage.removeItem(`mizari_reacted_${profileId}`);
    }
    setActiveReaction(newReaction);

    // 2. Optimistically update UI counts
    setCounts((prev) => {
      const next = { ...prev };
      if (oldReaction && next[oldReaction] !== undefined) {
        next[oldReaction] = Math.max(0, next[oldReaction] - 1);
      }
      if (newReaction && next[newReaction] !== undefined) {
        next[newReaction] = next[newReaction] + 1;
      }
      return next;
    });

    // 3. Spawn floating emoji particle if adding a reaction
    if (newReaction) {
      const particle = {
        id: Date.now() + Math.random(),
        emoji,
        left: Math.random() * 80 - 40,
      };
      setFloatingEmojis((prev) => [...prev, particle]);
      setTimeout(() => {
        setFloatingEmojis((prev) => prev.filter((item) => item.id !== particle.id));
      }, 1200);
    }

    // 4. Trigger server action — server looks up the visitor's real
    // stored reaction itself and reconciles; it doesn't trust our
    // "oldReaction" guess. If the server's result differs from our
    // optimistic guess, OR the call fails outright (e.g. a migration
    // hasn't been applied yet), fully roll back to the last confirmed
    // state — both the active reaction AND the counts — instead of
    // leaving the bumped count in place.
    startTransition(async () => {
      try {
        const result = await changeReaction(profileId, type);
        if (result.activeReaction !== newReaction) {
          setActiveReaction(result.activeReaction);
          setCounts(prevCounts);
          localStorage.removeItem(`mizari_reacted_${profileId}`);
        }
      } catch (err) {
        console.error('Failed to update reaction:', err);
        setActiveReaction(prevActiveReaction);
        setCounts(prevCounts);
        if (prevActiveReaction) {
          localStorage.setItem(`mizari_reacted_${profileId}`, prevActiveReaction);
        } else {
          localStorage.removeItem(`mizari_reacted_${profileId}`);
        }
      }
    });
  };

  const totalLikes = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div
      className="fixed right-3 z-50 flex flex-col items-end sm:right-4"
      style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
    >
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

      {/* Expanded Reaction Panel — wraps onto a second row instead of
          overflowing off-screen on narrow phones (6 icons don't reliably
          fit in one row under ~360px). */}
      {isOpen && (
        <div
          className="mb-3 flex flex-wrap items-center justify-end gap-1 rounded-3xl border border-white/20 bg-slate-900/90 p-2 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 animate-scale-up mr-2"
          style={{ maxWidth: 'calc(100vw - 2rem)' }}
        >
          {REACTION_OPTIONS.map((opt) => {
            const hasReacted = activeReaction === opt.type;
            return (
              <button
                key={opt.type}
                onClick={() => handleReact(opt.type, opt.emoji)}
                disabled={isPending}
                className={`flex flex-col items-center rounded-full p-1.5 sm:p-2 transition-all active:scale-90 ${
                  hasReacted
                    ? 'bg-indigo-600/30 border border-indigo-400/50 text-indigo-400 font-black'
                    : 'hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
                title={`${opt.label} (${counts[opt.type]})`}
              >
                <span className="text-lg sm:text-xl transition-transform hover:scale-125">{opt.emoji}</span>
                <span className="mt-0.5 text-[9px] font-bold opacity-80">{counts[opt.type]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Trigger Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border shadow-lg transition-all active:scale-95 ${
          isOpen
            ? 'border-indigo-400 bg-indigo-600 text-white scale-100'
            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:scale-105 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
        title="React to this profile"
      >
        <span className="text-xl">{isOpen ? '✕' : (activeReaction ? REACTION_OPTIONS.find(o => o.type === activeReaction)?.emoji : '✨')}</span>
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

