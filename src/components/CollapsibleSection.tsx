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
      className={`rounded-[20px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.06)] transition-all dark:bg-[#17171A] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] ${
        danger ? 'ring-1 ring-red-200 dark:ring-red-900/30' : ''
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
            <h2 className={`text-xl font-bold ${danger ? 'text-red-600' : 'text-[#111827] dark:text-[#F8F7F5]'}`}>
              {icon && <span className="mr-1.5">{icon}</span>}
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
          <span
            className={`shrink-0 flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300 text-base font-semibold ${
              isOpen
                ? 'bg-[#111827] dark:bg-[#F8F7F5] text-white dark:text-[#111827] rotate-180 shadow-sm'
                : 'bg-black/[0.04] dark:bg-white/10 text-gray-500 dark:text-slate-400 hover:bg-black/[0.08] dark:hover:bg-white/15'
            }`}
          >
            ▼
          </span>
        </button>
      ) : (
        <div className="p-6 pb-4">
          <h2 className={`text-xl font-bold ${danger ? 'text-red-600' : 'text-[#111827] dark:text-[#F8F7F5]'}`}>
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
