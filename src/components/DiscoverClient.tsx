'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getLevelInfo } from '@/utils/xp-client';

interface Profile {
  id: number;
  username: string;
  profileType: string;
  bio: string | null;
  avatarUrl: string | null;
  themeType: string;
  xp: number;
  prestige: number;
  likes: number;
  views: number;
}

interface DiscoverClientProps {
  initialProfiles: Profile[];
}

export function DiscoverClient({ initialProfiles }: DiscoverClientProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  // Filter profiles
  const filtered = initialProfiles.filter((p) => {
    // Search query
    const matchSearch =
      p.username.toLowerCase().includes(search.toLowerCase()) ||
      (p.bio && p.bio.toLowerCase().includes(search.toLowerCase()));

    // Tab filter
    if (activeTab === 'All') return matchSearch;
    return matchSearch && p.profileType.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Discover{' '}
          <span className="bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] bg-clip-text text-transparent">
            Creators & Brands
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 dark:text-slate-400">
          Search through creators on Mizari, explore beautiful theme aesthetics, and find inspiration for your own page.
        </p>
      </div>

      {/* Search and Tabs Panel */}
      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-6 sm:flex-row">
        {/* Category Tabs */}
        <div className="flex gap-2">
          {['All', 'Personal', 'Business', 'Gaming'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] border-transparent text-white shadow-md shadow-[#FF6B6B]/20'
                  : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-350 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="🔍 Search creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-xs focus:outline-none focus:border-[#FF6B6B] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-sm text-gray-400">
            No creators found matching your search.
          </div>
        ) : (
          filtered.map((profile) => {
            const levelInfo = getLevelInfo(profile.xp, profile.prestige);
            return (
              <Link
                key={profile.id}
                href={`/${profile.username}`}
                className="group relative flex flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#FF6B6B]/30 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-[#FF6B6B]/30"
              >
                {/* Profile Card Header */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="h-16 w-16 overflow-hidden rounded-full border border-gray-100 bg-gray-50 dark:border-slate-800 dark:bg-slate-850">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt={profile.username} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[#FF6B6B]/70 bg-[#FF6B6B]/5">
                        {profile.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-base font-extrabold text-gray-900 group-hover:text-[#FF6B6B] transition-colors dark:text-white">
                        @{profile.username}
                      </h3>
                      {/* Level Tag */}
                      {levelInfo.level > 1 && (
                        <span 
                          className="rounded bg-slate-100 dark:bg-slate-850 px-1 py-0.5 text-[8px] font-extrabold"
                          title={levelInfo.category}
                        >
                          LVL {levelInfo.level}
                        </span>
                      )}
                    </div>
                    {/* Badges */}
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="rounded bg-[#FF6B6B]/10 px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-[#FF6B6B] tracking-wider">
                        {profile.profileType}
                      </span>
                      {levelInfo.isPrestige && (
                        <span className="rounded bg-purple-100 dark:bg-purple-950/40 px-1.5 py-0.5 text-[8px] font-extrabold text-purple-600 dark:text-purple-400">
                          {levelInfo.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="mt-4 flex-1 text-xs text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {profile.bio || 'No bio yet.'}
                </p>

                {/* Footer metrics */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-4 text-[10px] font-bold text-gray-450 dark:text-slate-400">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                      👁️ {profile.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      ❤️ {profile.likes} likes
                    </span>
                  </div>
                  <span className="text-[#FF6B6B] group-hover:translate-x-1 transition-transform">
                    View profile &rarr;
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
