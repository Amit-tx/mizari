'use client';

import React from 'react';

interface SensitiveWarningModalProps {
  isOpen: boolean;
  targetUrl: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SensitiveWarningModal({
  isOpen,
  targetUrl,
  onConfirm,
  onCancel,
}: SensitiveWarningModalProps) {
  if (!isOpen) return null;

  // Clean URL to show to the user
  let displayDomain = '';
  try {
    const parsed = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
    displayDomain = parsed.hostname;
  } catch (e) {
    displayDomain = targetUrl;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md transition-all duration-300">
      {/* Outer Card with Accent Glow */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-500/20 bg-slate-950 p-8 text-center shadow-2xl shadow-red-500/10">
        
        {/* Top Glow Ornament */}
        <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl" />
        
        {/* Warning Icon Container */}
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl text-red-500 animate-pulse border border-red-500/20">
          ⚠️
        </div>

        {/* Heading */}
        <h3 className="relative mt-6 text-xl font-extrabold tracking-tight text-white">
          Sensitive Content Warning
        </h3>
        
        {/* Description */}
        <p className="relative mt-3 text-sm leading-relaxed text-slate-400">
          This link leads to an external website (<span className="font-semibold text-slate-200">{displayDomain}</span>) that may contain sensitive or age-restricted (18+) material.
        </p>

        <p className="relative mt-2 text-xs text-red-400/80 font-medium">
          Do you wish to proceed?
        </p>

        {/* Buttons */}
        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 py-3 text-xs font-bold text-white shadow-lg shadow-red-600/35 transition-all hover:brightness-110 hover:shadow-red-600/50"
          >
            Yes, Continue
          </button>
          
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/60 py-3 text-xs font-bold text-slate-300 transition-all hover:bg-slate-900 hover:text-white"
          >
            No, Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
