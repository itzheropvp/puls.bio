import { prisma } from './db';

/**
 * Detect device type from user agent
 */
function getDeviceType(userAgent?: string): string {
  if (!userAgent) return 'desktop';
  
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|webos|blackberry/.test(ua)) {
    return 'mobile';
  }
  if (/ipad|tablet|playbook|silk/.test(ua)) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Track page view with deduplication
 * Prevents same user from inflating view counts by refreshing
 * Only counts a new view if there hasn't been one from this device type in the last 5 minutes
 */
export async function trackPageView(
  userId: number,
  metadata?: {
    userAgent?: string;
    referer?: string;
    country?: string;
  }
): Promise<void> {
  try {
    // Get the user's page
    const page = await prisma.page.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!page) {
      console.error(`Page not found for user ${userId}`);
      return;
    }

    const deviceType = getDeviceType(metadata?.userAgent);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Check if there's a recent view from this device type (within 5 minutes)
    const recentView = await prisma.pageAnalytics.findFirst({
      where: {
        pageId: page.id,
        deviceType,
        createdAt: {
          gte: fiveMinutesAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Only create a new analytics record and increment views if there's no recent view
    if (!recentView) {
      // Create analytics record
      await prisma.pageAnalytics.create({
        data: {
          pageId: page.id,
          deviceType,
        },
      });

      // Increment page views
      await prisma.page.update({
        where: { id: page.id },
        data: {
          views: { increment: 1 },
          updatedAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error('Failed to track page view:', error);
    // Don't throw - we don't want to break the page if analytics fail
  }
}