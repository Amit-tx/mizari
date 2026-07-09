'use client';

import { useState } from 'react';

interface DashboardNavProps {
  activeSection: string | null;
  onNavigate: (section: string) => void;
}

export function DashboardNav({ activeSection, onNavigate }: DashboardNavProps) {
  const navItems = [
    { id: 'profile', icon: '👤', label: 'Profile', color: 'blue' },
    { id: 'links', icon: '🔗', label: 'Links', color: 'purple' },
    { id: 'add-link', icon: '➕', label: 'Add', color: 'red' },
    { id: 'analytics', icon: '📊', label: 'Analytics', color: 'orange' },
    { id: 'themes', icon: '🎨', label: 'Themes', color: 'pink' },
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 z-50">
        <div className="mx-auto max-w-md flex justify-around items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                // Scroll to section
                setTimeout(() => {
                  const el = document.querySelector(`[data-section="${item.id}"]`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className={`flex-1 flex flex-col items-center justify-center py-3 transition-all ${
                activeSection === item.id
                  ? 'text-[#FF6B6B] bg-[#FF6B6B]/5'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Safe area padding at bottom so content doesn't hide under nav */}
      <div className="h-24" />
    </>
  );
}
