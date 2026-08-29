import { getProfileAnalytics, getLinkAnalytics } from '@/lib/analytics-service';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');
    const linkId = searchParams.get('linkId');
    const timeRange = (searchParams.get('timeRange') || '7d') as '1d' | '7d' | '30d' | '90d';

    if (!profileId && !linkId) {
      return new Response(
        JSON.stringify({ error: 'profileId or linkId required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Calculate date range based on timeRange parameter
    const endDate = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '90d':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    let analytics;

    if (profileId) {
      // Get profile analytics
      analytics = await getProfileAnalytics(parseInt(profileId), {
        profileId: parseInt(profileId),
        startDate,
        endDate,
      });
    } else if (linkId) {
      // Get link-specific analytics
      analytics = await getLinkAnalytics(parseInt(linkId), {
        profileId: 0,
        linkId: parseInt(linkId),
        startDate,
        endDate,
      });
    }

    // Add metadata to response
    const response = {
      ...analytics,
      metadata: {
        timeRange,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        generatedAt: new Date().toISOString(),
      },
    };

    return Response.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
