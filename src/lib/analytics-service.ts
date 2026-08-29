import { db } from '@/db';
import { clickLogs } from '@/db/schema';
import { eq, gte, and, count, sql } from 'drizzle-orm';

export interface AnalyticsFilters {
  profileId?: number;
  linkId?: number;
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  clickThroughRate: number;
  topLinks: TopLink[];
  topCountries: TopCountry[];
  deviceBreakdown: DeviceBreakdown[];
  browserBreakdown: BrowserBreakdown[];
  referrerBreakdown: ReferrerBreakdown[];
  dailyViews: DailyData[];
  hourlyViews: HourlyData[];
}

export interface TopLink {
  linkId: number;
  title: string;
  clicks: number;
  views: number;
  ctr: number;
}

export interface TopCountry {
  country: string;
  views: number;
  clicks: number;
  uniqueVisitors: number;
}

export interface DeviceBreakdown {
  device: string;
  views: number;
  clicks: number;
  percentage: number;
}

export interface BrowserBreakdown {
  browser: string;
  views: number;
  clicks: number;
  percentage: number;
}

export interface ReferrerBreakdown {
  referrer: string;
  views: number;
  clicks: number;
  percentage: number;
}

export interface DailyData {
  date: string;
  views: number;
  clicks: number;
  uniqueVisitors: number;
}

export interface HourlyData {
  hour: number;
  views: number;
  clicks: number;
}

// Get analytics for a profile
export async function getProfileAnalytics(
  profileId: number,
  filters: AnalyticsFilters
): Promise<AnalyticsData> {
  const profileClicks = await db
    .select()
    .from(clickLogs)
    .where(
      and(
        eq(clickLogs.targetId, profileId),
        eq(clickLogs.targetType, 'view'),
        gte(clickLogs.createdAt, filters.startDate)
      )
    );

  const totalViews = profileClicks.length;
  const uniqueVisitors = new Set(profileClicks.map(c => c.visitorIp)).size;

  // Get device breakdown
  const deviceBreakdown = await getDeviceBreakdown(profileId, 'view', filters);

  // Get browser breakdown
  const browserBreakdown = await getBrowserBreakdown(profileId, 'view', filters);

  // Get referrer breakdown
  const referrerBreakdown = await getReferrerBreakdown(profileId, 'view', filters);

  // Get top countries
  const topCountries = await getTopCountries(profileId, 'view', filters);

  // Get daily views
  const dailyViews = await getDailyData(profileId, 'view', filters);

  // Get hourly views
  const hourlyViews = await getHourlyData(profileId, 'view', filters);

  return {
    totalViews,
    totalClicks: 0,
    uniqueVisitors,
    clickThroughRate: totalViews > 0 ? (uniqueVisitors / totalViews) * 100 : 0,
    topLinks: [],
    topCountries,
    deviceBreakdown,
    browserBreakdown,
    referrerBreakdown,
    dailyViews,
    hourlyViews: hourlyViews,
  };
}

// Get analytics for a specific link
export async function getLinkAnalytics(
  linkId: number,
  filters: AnalyticsFilters
): Promise<AnalyticsData> {
  const linkClicks = await db
    .select()
    .from(clickLogs)
    .where(
      and(
        eq(clickLogs.targetId, linkId),
        eq(clickLogs.targetType, 'click'),
        gte(clickLogs.createdAt, filters.startDate)
      )
    );

  const totalClicks = linkClicks.length;
  const uniqueVisitors = new Set(linkClicks.map(c => c.visitorIp)).size;

  const deviceBreakdown = await getDeviceBreakdown(linkId, 'click', filters);
  const browserBreakdown = await getBrowserBreakdown(linkId, 'click', filters);
  const referrerBreakdown = await getReferrerBreakdown(linkId, 'click', filters);
  const topCountries = await getTopCountries(linkId, 'click', filters);
  const dailyViews = await getDailyData(linkId, 'click', filters);
  const hourlyViews = await getHourlyData(linkId, 'click', filters);

  return {
    totalViews: 0,
    totalClicks,
    uniqueVisitors,
    clickThroughRate: totalClicks > 0 ? ((uniqueVisitors / totalClicks) * 100) : 0,
    topLinks: [],
    topCountries,
    deviceBreakdown,
    browserBreakdown,
    referrerBreakdown,
    dailyViews,
    hourlyViews,
  };
}

async function getDeviceBreakdown(
  targetId: number,
  targetType: string,
  filters: AnalyticsFilters
): Promise<DeviceBreakdown[]> {
  const results = await db
    .select({
      device: clickLogs.device,
      count: count(),
    })
    .from(clickLogs)
    .where(
      and(
        eq(clickLogs.targetId, targetId),
        eq(clickLogs.targetType, targetType),
        gte(clickLogs.createdAt, filters.startDate)
      )
    )
    .groupBy(clickLogs.device);

  const total = results.reduce((sum, r) => sum + r.count, 0);

  return results.map(r => ({
    device: r.device || 'Unknown',
    views: r.count,
    clicks: r.count,
    percentage: total > 0 ? (r.count / total) * 100 : 0,
  }));
}

async function getBrowserBreakdown(
  targetId: number,
  targetType: string,
  filters: AnalyticsFilters
): Promise<BrowserBreakdown[]> {
  const results = await db
    .select({
      browser: clickLogs.browser,
      count: count(),
    })
    .from(clickLogs)
    .where(
      and(
        eq(clickLogs.targetId, targetId),
        eq(clickLogs.targetType, targetType),
        gte(clickLogs.createdAt, filters.startDate)
      )
    )
    .groupBy(clickLogs.browser);

  const total = results.reduce((sum, r) => sum + r.count, 0);

  return results.map(r => ({
    browser: r.browser || 'Unknown',
    views: r.count,
    clicks: r.count,
    percentage: total > 0 ? (r.count / total) * 100 : 0,
  }));
}

async function getReferrerBreakdown(
  targetId: number,
  targetType: string,
  filters: AnalyticsFilters
): Promise<ReferrerBreakdown[]> {
  const results = await db
    .select({
      referrer: clickLogs.referrer,
      count: count(),
    })
    .from(clickLogs)
    .where(
      and(
        eq(clickLogs.targetId, targetId),
        eq(clickLogs.targetType, targetType),
        gte(clickLogs.createdAt, filters.startDate)
      )
    )
    .groupBy(clickLogs.referrer)
    .orderBy(sql`count desc`)
    .limit(10);

  const total = results.reduce((sum, r) => sum + r.count, 0);

  return results.map(r => ({
    referrer: r.referrer || 'Direct',
    views: r.count,
    clicks: r.count,
    percentage: total > 0 ? (r.count / total) * 100 : 0,
  }));
}

async function getTopCountries(
  targetId: number,
  targetType: string,
  filters: AnalyticsFilters
): Promise<TopCountry[]> {
  const results = await db
    .select({
      country: clickLogs.country,
      count: count(),
    })
    .from(clickLogs)
    .where(
      and(
        eq(clickLogs.targetId, targetId),
        eq(clickLogs.targetType, targetType),
        gte(clickLogs.createdAt, filters.startDate)
      )
    )
    .groupBy(clickLogs.country)
    .orderBy(sql`count desc`)
    .limit(10);

  return results.map(r => ({
    country: r.country || 'Unknown',
    views: r.count,
    clicks: r.count,
    uniqueVisitors: r.count, // Simplified - will show visitor count per country
  }));
}

async function getDailyData(
  targetId: number,
  targetType: string,
  filters: AnalyticsFilters
): Promise<DailyData[]> {
  const results = await db
    .select({
      date: sql`DATE(${clickLogs.createdAt})`,
      count: count(),
    })
    .from(clickLogs)
    .where(
      and(
        eq(clickLogs.targetId, targetId),
        eq(clickLogs.targetType, targetType),
        gte(clickLogs.createdAt, filters.startDate)
      )
    )
    .groupBy(sql`DATE(${clickLogs.createdAt})`)
    .orderBy(sql`DATE(${clickLogs.createdAt}) asc`);

  return results.map(r => ({
    date: r.date instanceof Date ? r.date.toISOString().split('T')[0] : String(r.date),
    views: r.count,
    clicks: r.count,
    uniqueVisitors: r.count, // Simplified
  }));
}

async function getHourlyData(
  targetId: number,
  targetType: string,
  filters: AnalyticsFilters
): Promise<HourlyData[]> {
  const results = await db
    .select({
      hour: sql`EXTRACT(HOUR FROM ${clickLogs.createdAt})`,
      count: count(),
    })
    .from(clickLogs)
    .where(
      and(
        eq(clickLogs.targetId, targetId),
        eq(clickLogs.targetType, targetType),
        gte(clickLogs.createdAt, filters.startDate)
      )
    )
    .groupBy(sql`EXTRACT(HOUR FROM ${clickLogs.createdAt})`)
    .orderBy(sql`EXTRACT(HOUR FROM ${clickLogs.createdAt}) asc`);

  return results.map(r => ({
    hour: Number(r.hour) || 0,
    views: r.count,
    clicks: r.count,
  }));
}
