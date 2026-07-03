'use client';

import React, { useState } from 'react';
import { addWish } from '@/app/[username]/actions';

interface Wish {
  id: number;
  sender: string;
  text: string;
  color: string;
}

interface ClassicGuestbookProps {
  profileId: number;
  initialWishes: Wish[];
  guestbookHeading: string;
  textColor?: string;
}

const CARD_COLORS = [
  { name: 'Warm Cream', bg: 'bg-[#FFFDF9] dark:bg-slate-900 border-orange-100 dark:border-slate-800' },
  { name: 'Soft Rose', bg: 'bg-[#FFF5F5] dark:bg-slate-900 border-red-100 dark:border-slate-800' },
  { name: 'Mint Green', bg: 'bg-[#F4FBF7] dark:bg-slate-900 border-emerald-100 dark:border-slate-800' },
  { name: 'Ocean Breeze', bg: 'bg-[#F0F9FF] dark:bg-slate-900 border-sky-100 dark:border-slate-800' },
];

export function ClassicGuestbook({ profileId, initialWishes, guestbookHeading, textColor }: ClassicGuestbookProps) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [sender, setSender] = useState('');
  const [text, setText] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Cooldown check (5 minutes = 300000ms)
    const lastWishTime = localStorage.getItem(`last_wish_time_${profileId}`);
    if (lastWishTime) {
      const timePassed = Date.now() - parseInt(lastWishTime);
      if (timePassed < 300000) {
        const secondsLeft = Math.ceil((300000 - timePassed) / 1000);
        alert(`Please wait ${secondsLeft} seconds before writing another note! ✍️`);
        return;
      }
    }

    setSubmitting(true);
    const chosenColor = String(selectedColorIndex); // Save index as string in color column for Classic mode
    try {
      await addWish(profileId, sender, text, chosenColor);
      
      // Save submission time to localStorage to prevent spamming
      localStorage.setItem(`last_wish_time_${profileId}`, String(Date.now()));

      // Update local state for instant feedback
      const newWish: Wish = {
        id: Date.now(),
        sender: sender.trim() || 'Anonymous',
        text: text.trim(),
        color: chosenColor,
      };
      setWishes([newWish, ...wishes]);
      
      // Clear form
      setText('');
      setSender('');
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert('Failed to submit message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getBgClass = (colorStr: string) => {
    // If it's a number/index
    const index = parseInt(colorStr);
    if (!isNaN(index) && CARD_COLORS[index]) {
      return CARD_COLORS[index].bg;
    }
    // Fallback if it contains standard hex (from Tanabata style)
    return 'bg-white/70 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800';
  };

  return (
    <div className="mt-8 rounded-3xl border border-white/20 bg-white/20 p-6 shadow-xl backdrop-blur-md dark:border-slate-800/40 dark:bg-slate-950/20">
      <div className="text-center">
        <span className="text-3xl">📖</span>
        <h3 className="mt-2 text-lg font-extrabold" style={textColor ? { color: textColor } : {}}>
          {guestbookHeading}
        </h3>
        <p className="mt-1 text-xs opacity-75" style={textColor ? { color: textColor } : {}}>
          Leave a public message or signature on my wall!
        </p>
      </div>

      {/* Wishes Message Board */}
      <div className="mt-6 space-y-4 max-h-72 overflow-y-auto pr-1">
        {wishes.length === 0 && (
          <p className="text-center text-xs text-slate-400 py-8">
            No messages yet. Leave the first note!
          </p>
        )}
        {wishes.map((wish) => (
          <div
            key={wish.id}
            className={`p-4 rounded-2xl border shadow-sm transition-all duration-300 ${getBgClass(wish.color)}`}
          >
            <p className="text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
              &ldquo;{wish.text}&rdquo;
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-slate-200/40 dark:border-slate-700/30 pt-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
              <span>— {wish.sender}</span>
              <span>• Just now</span>
            </div>
          </div>
        ))}
      </div>

      {/* Form Section */}
      <div className="mt-6 flex justify-center">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-2.5 text-xs font-bold shadow-md hover:opacity-90 transition-all"
          >
            ✍️ Sign the Guestbook
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-4 animate-fade-in">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Your Name (optional)"
                maxLength={30}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs focus:outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400">Theme:</span>
                <div className="flex gap-1.5">
                  {CARD_COLORS.map((color, idx) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`h-5 w-5 rounded-full border border-black/10 transition-transform ${
                        selectedColorIndex === idx ? 'scale-125 ring-2 ring-slate-800 dark:ring-white' : ''
                      }`}
                      style={{
                        backgroundColor: idx === 0 ? '#FFFDF9' : idx === 1 ? '#FFF5F5' : idx === 2 ? '#F4FBF7' : '#F0F9FF',
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              placeholder="Leave a message or sign the wall..."
              maxLength={150}
              rows={2}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs focus:outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-2 text-xs font-bold shadow-md hover:opacity-90 transition-all disabled:opacity-60"
              >
                {submitting ? 'Writing...' : 'Post Message ✍️'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
