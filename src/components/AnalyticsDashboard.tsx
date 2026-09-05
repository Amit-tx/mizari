'use client';

import { useState, useEffect } from 'react';
import { AnalyticsData } from '@/lib/analytics-service';

interface AnalyticsDashboardProps {
  profileId: number;
  timeRange: '1d' | '7d' | '30d' | '90d';
}

export function AnalyticsDashboard({ profileId, timeRange }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [profileId, timeRange]);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        profileId: String(profileId),
        timeRange,
      });

      const res = await fetch(`/api/analytics?${params}`);

      if (!res.ok) {
        console.error(`Analytics API error: ${res.status}`);
        setAnalytics(null);
        return;
      }

      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-600 dark:text-slate-400">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="text-center py-8 text-gray-600 dark:text-slate-400">No data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard label="Total Views" value={analytics.totalViews} icon="👁️" />
        <MetricCard label="Unique Visitors" value={analytics.uniqueVisitors} icon="👥" />
        <MetricCard label="Total Clicks" value={analytics.totalClicks} icon="👆" />
        <MetricCard label="CTR" value={`${analytics.clickThroughRate.toFixed(2)}%`} icon="📊" />
      </div>

      {/* Daily Trend - Simple Bar Chart */}
      {analytics.dailyViews.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Daily Views Trend</h3>
          <div className="space-y-3">
            {analytics.dailyViews.slice(-7).map((day) => {
              const maxViews = Math.max(...analytics.dailyViews.map(d => d.views || 1), 1);
              const viewsPercent = (day.views / maxViews) * 100;

              return (
                <div key={day.date} className="flex items-end gap-4">
                  <span className="text-xs font-semibold text-gray-600 dark:text-slate-400 w-16">
                    {day.date}
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-md h-8 flex items-end overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#111827] to-[#111827] h-full rounded-md transition-all"
                      style={{ width: `${Math.max(viewsPercent, 5)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white w-12 text-right">
                    {day.views}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        {analytics.deviceBreakdown.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Device Breakdown</h3>
            <div className="space-y-3">
              {analytics.deviceBreakdown.map((device) => (
                <div key={device.device} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {device.device}
                  </span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 max-w-xs bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#111827] to-[#111827] h-2 rounded-full"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-slate-300 w-10 text-right">
                      {device.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Browser Breakdown */}
        {analytics.browserBreakdown.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Browser Breakdown</h3>
            <div className="space-y-3">
              {analytics.browserBreakdown.map((browser) => (
                <div key={browser.browser} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {browser.browser}
                  </span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 max-w-xs bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#4ECDC4] to-[#45B7D1] h-2 rounded-full"
                        style={{ width: `${browser.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-slate-300 w-10 text-right">
                      {browser.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Top Countries */}
      {analytics.topCountries.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🌍 Top Countries</h3>
          <div className="space-y-2">
            {analytics.topCountries.map((country, index) => (
              <div key={country.country} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{index + 1}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{country.country}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-slate-300">
                  {country.views} views • {country.uniqueVisitors} visitors
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Traffic Sources */}
      {analytics.referrerBreakdown.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🔗 Traffic Sources</h3>
          <div className="space-y-2">
            {analytics.referrerBreakdown.map((referrer) => (
              <div key={referrer.referrer} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {referrer.referrer}
                </span>
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <div className="flex-1 max-w-xs bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#FFA07A] to-[#FF8C42] h-2 rounded-full"
                      style={{ width: `${referrer.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-600 dark:text-slate-300 w-10 text-right">
                    {referrer.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}
