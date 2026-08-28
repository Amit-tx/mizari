'use client';

import { useState } from 'react';

interface ShareModalProps {
  username: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ username, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `https://mizari.vercel.app/${username}`;

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: '🔗',
      action: () => {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
    {
      name: 'X (Twitter)',
      icon: '𝕏',
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=Check%20out%20my%20link%20in%20bio&url=${encodeURIComponent(profileUrl)}`,
          '_blank'
        ),
    },
    {
      name: 'Facebook',
      icon: 'f',
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
          '_blank'
        ),
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      action: () =>
        window.open(
          `https://wa.me/?text=Check%20out%20my%20link%20in%20bio:%20${encodeURIComponent(profileUrl)}`,
          '_blank'
        ),
    },
    {
      name: 'LinkedIn',
      icon: 'in',
      action: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
          '_blank'
        ),
    },
    {
      name: 'Email',
      icon: '✉️',
      action: () =>
        (window.location.href = `mailto:?body=Check%20out%20my%20link%20in%20bio:%20${encodeURIComponent(profileUrl)}`),
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50 sm:items-center sm:justify-center">
      <div className="w-full bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 sm:max-w-md shadow-2xl animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Share Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile Card Preview */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 mb-6 text-white text-center">
          <div className="text-4xl mb-3">👤</div>
          <p className="text-lg font-bold">@{username}</p>
          <p className="text-sm text-slate-300 mt-1">mizari.vercel.app</p>
        </div>

        {/* Share Buttons Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              title={option.name}
            >
              <span className="text-2xl">{option.icon}</span>
              <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 text-center">
                {option.name}
              </span>
            </button>
          ))}
        </div>

        {/* Link Copy Section */}
        <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4 mb-4">
          <p className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">
            Direct Link
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              readOnly
              className="flex-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(profileUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
