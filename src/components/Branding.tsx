import React from 'react';

export function Branding() {
  return (
    <div className="mt-8 flex justify-center">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/85 px-4 py-2.5 text-xs font-bold text-gray-800 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
      >
        <span className="text-[#FF6B6B]">🚀</span>
        <span>Made with</span>
        <span className="bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] bg-clip-text font-extrabold text-transparent">
          Mizari
        </span>
      </a>
    </div>
  );
}
