'use client';

import { useState, ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  icon?: string;
  subtitle?: string;
  defaultOpen?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  danger?: boolean;
  children: ReactNode;
}

// Accordion-style card: clicking the header toggles this section open,
// and (via the shared `isOpen`/`onToggle` props, driven by the parent)
// closes whichever other section was previously open — so only the one
// the person is actively working on stays expanded. Keeps the dashboard
// from being one giant everything-visible-at-once scroll.
export function CollapsibleSection({
  title,
  icon,
  subtitle,
  isOpen,
  onToggle,
  danger = false,
  children,
}: CollapsibleSectionProps) {
  return (
    <div
      className={`rounded-3xl border bg-white shadow-sm transition-all dark:bg-slate-900 ${
        danger
          ? 'border-red-200 dark:border-red-900/20'
          : 'border-gray-100 dark:border-slate-800'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 p-6 text-left"
        aria-expanded={isOpen}
      >
        <div className="min-w-0">
          <h2 className={`text-xl font-bold ${danger ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
            {icon && <span className="mr-1.5">{icon}</span>}
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
        <span
          className={`shrink-0 text-lg text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          ⌄
        </span>
      </button>

      {isOpen && (
        <div className="min-w-0 overflow-hidden px-6 pb-6">
          {children}
        </div>
      )}
    </div>
  );
}
