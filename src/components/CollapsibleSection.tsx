'use client';

import { ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  icon?: string;
  subtitle?: string;
  defaultOpen?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  danger?: boolean;
  // When false, renders as a plain static card — no chevron, header isn't
  // clickable, and content is always visible. Use this for tabs that only
  // have one section (Add, Your Links, Analytics) where a collapse/expand
  // step just adds an extra click with nothing else to make room for.
  collapsible?: boolean;
  children: ReactNode;
}

// Accordion-style card: clicking the header toggles this section open,
// and (via the shared `isOpen`/`onToggle` props, driven by the parent)
// closes whichever other section was previously open — so only the one
// the person is actively working on stays expanded. Keeps the dashboard
// from being one giant everything-visible-at-once scroll.
//
// Set `collapsible={false}` for single-section tabs — the card still looks
// the same, but there's no header click required to see its content.
export function CollapsibleSection({
  title,
  icon,
  subtitle,
  isOpen,
  onToggle,
  danger = false,
  collapsible = true,
  children,
}: CollapsibleSectionProps) {
  const contentVisible = collapsible ? isOpen : true;

  return (
    <div
      className={`rounded-3xl border bg-white shadow-sm transition-all dark:bg-slate-900 ${
        danger
          ? 'border-red-200 dark:border-red-900/20'
          : 'border-gray-100 dark:border-slate-800'
      }`}
    >
      {collapsible ? (
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
            className={`shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-300 text-base transition-all duration-200 hover:bg-gray-200 dark:hover:bg-slate-700 hover:scale-110 ${isOpen ? 'rotate-180 bg-[#FF6B6B]/10 text-[#FF6B6B]' : ''}`}
          >
            ⌄
          </span>
        </button>
      ) : (
        <div className="p-6 pb-4">
          <h2 className={`text-xl font-bold ${danger ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
            {icon && <span className="mr-1.5">{icon}</span>}
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
      )}

      {contentVisible && (
        <div className={`min-w-0 overflow-hidden px-6 pb-6 ${collapsible ? '' : 'pt-0'}`}>
          {children}
        </div>
      )}
    </div>
  );
}
