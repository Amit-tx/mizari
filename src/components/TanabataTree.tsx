'use client';

import React, { useState } from 'react';
import { addWish } from '@/app/[username]/actions';

interface Wish {
  id: number;
  sender: string;
  text: string;
  color: string;
}

interface TanabataTreeProps {
  userId: number;
  initialWishes: Wish[];
  textColor?: string;
}

const TANZAKU_COLORS = [
  { name: 'Sakura Pink', value: '#FFD6E0' },
  { name: 'Aozora Blue', value: '#BAE6FD' },
  { name: 'Tanabata Green', value: '#D1FAE5' },
  { name: 'Kaminari Gold', value: '#FEF3C7' },
];

export function TanabataTree({ userId, initialWishes, textColor }: TanabataTreeProps) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [sender, setSender] = useState('');
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FFD6E0');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Cooldown check (5 minutes = 300000ms)
    const lastWishTime = localStorage.getItem(`last_wish_time_${userId}`);
    if (lastWishTime) {
      const timePassed = Date.now() - parseInt(lastWishTime);
      if (timePassed < 300000) {
        const secondsLeft = Math.ceil((300000 - timePassed) / 1000);
        alert(`Please wait ${secondsLeft} seconds before hanging another wish! 🎋`);
        return;
      }
    }

    setSubmitting(true);
    try {
      await addWish(userId, sender, text, selectedColor);
      
      // Save submission time to localStorage to prevent spamming
      localStorage.setItem(`last_wish_time_${userId}`, String(Date.now()));

      // Update local state for instant feedback
      const newWish: Wish = {
        id: Date.now(),
        sender: sender.trim() || 'Anonymous',
        text: text.trim(),
        color: selectedColor,
      };
      setWishes([newWish, ...wishes]);
      
      // Clear form
      setText('');
      setSender('');
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert('Failed to hang wish. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 rounded-3xl border border-emerald-100 bg-emerald-50/20 p-6 shadow-md backdrop-blur-md dark:border-emerald-900/30 dark:bg-emerald-950/10">
      <div className="text-center">
        <span className="text-3xl">🎋</span>
        <h3 className="mt-2 text-lg font-extrabold text-emerald-800 dark:text-emerald-400">
          Tanabata Wish Tree
        </h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
          Hang a colorful Tanzaku (wish slip) on my bamboo tree!
        </p>
      </div>

      {/* Hanging Wishes (Tanzaku Paper Slips) */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 max-h-60 overflow-y-auto p-2">
        {wishes.length === 0 && (
          <p className="text-center text-xs text-gray-400 dark:text-slate-500 py-6">
            The tree is empty. Be the first to hang a wish!
          </p>
        )}
        {wishes.map((wish) => (
          <div
            key={wish.id}
            className="w-24 p-2 text-center rounded-md shadow-sm border border-black/5 animate-sway origin-top transform rotate-2 text-slate-800 transition-transform duration-300"
            style={{ 
              backgroundColor: wish.color,
              fontFamily: 'Georgia, serif',
              minHeight: '110px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Thread loop decoration at the top */}
            <div className="mx-auto h-1.5 w-1.5 rounded-full bg-slate-600/60 -mt-1 mb-1" />
            
            <p className="text-[10px] leading-tight font-semibold italic break-words flex-1 overflow-hidden line-clamp-4">
              &quot;{wish.text}&quot;
            </p>
            <p className="text-[9px] font-bold border-t border-black/10 pt-1 mt-1 truncate">
              — {wish.sender}
            </p>
          </div>
        ))}
      </div>

      {/* Wish Form Toggle */}
      <div className="mt-6 flex justify-center">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all"
          >
            ✍️ Hang a Tanzaku Wish
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
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400">Slip Color:</span>
                <div className="flex gap-1.5">
                  {TANZAKU_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`h-5 w-5 rounded-full border border-black/10 transition-transform ${
                        selectedColor === color.value ? 'scale-125 ring-2 ring-emerald-500' : ''
                      }`}
                      style={{ backgroundColor: color.value }}
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
              placeholder="Type your wish or message here..."
              maxLength={150}
              rows={2}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all disabled:opacity-60"
              >
                {submitting ? 'Hanging...' : 'Hang Wish 🎋'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
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
