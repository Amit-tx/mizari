'use client';

import { useState } from 'react';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

type TimeRange = '1d' | '7d' | '30d' | '90d';

export default function StatsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const timeRanges: { label: string; value: TimeRange }[] = [
    { label: 'Today', value: '1d' },
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-1">Track your profile performance</p>
        </div>

        {/* Time Range Buttons */}
        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                timeRange === range.value
                  ? 'bg-gradient-to-r from-[#111827] to-[#111827] text-white shadow-md'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard profileId={0} timeRange={timeRange} />
    </div>
  );
}
