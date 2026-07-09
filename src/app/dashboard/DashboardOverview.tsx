'use client';

import { useState } from 'react';

interface DashboardOverviewProps {
  username: string;
  profileBio: string;
  avatarUrl: string;
  linksCount: number;
  totalClicks: number;
  weeklyViews: number;
  weeklyClickRate: number;
}

export function DashboardOverview({
  username,
  profileBio,
  avatarUrl,
  linksCount,
  totalClicks,
  weeklyViews,
  weeklyClickRate,
}: DashboardOverviewProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back,<br />
          <span className="text-[#FF6B6B]">{username}</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Here is your dashboard overview for today.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={username}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#FF6B6B]/20"
            />
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{username}</h2>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{profileBio}</p>
            <button className="mt-3 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition">
              ✏️
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Links Card */}
        <div
          className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all hover:shadow-md cursor-pointer"
          onMouseEnter={() => setHoveredCard('links')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <span className="text-xl">🔗</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Links</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{linksCount}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Managed</p>
        </div>

        {/* Analytics Card */}
        <div
          className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all hover:shadow-md cursor-pointer"
          onMouseEnter={() => setHoveredCard('analytics')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/30">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Analytics</h3>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-slate-400">Last 7 Days</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">Page Views</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{weeklyViews.toLocaleString()}</p>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">↑ 12%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">Click Rate</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{weeklyClickRate.toFixed(1)}%</p>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">↑ 2.1%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Clicks */}
      <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/30">
            <span className="text-xl">👆</span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Total Clicks</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalClicks.toLocaleString()}</p>
      </div>
    </div>
  );
}
