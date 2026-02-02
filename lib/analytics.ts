import { prisma } from './db';

/**
 * Increment page view count for a user
 * This runs asynchronously and doesn't block the page render
 */
export async function incrementPageView(userId: string): Promise<void> {
  try {
    await prisma.page.update({
      where: { userId },
      data: { 
        views: { increment: 1 },
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to increment page view:', error);
    // Don't throw - we don't want to break the page if analytics fail
  }
}

/**
 * Track detailed page view with metadata (optional)
 */
export async function trackPageView(
  userId: string,
  metadata?: {
    userAgent?: string;
    referer?: string;
    country?: string;
  }
): Promise<void> {
  try {
    // First increment the counter
    await incrementPageView(userId);

    // Optionally track detailed analytics if you have a PageView model
    // await prisma.pageView.create({
    //   data: {
    //     userId,
    //     userAgent: metadata?.userAgent,
    //     referer: metadata?.referer,
    //     country: metadata?.country,
    //     timestamp: new Date(),
    //   },
    // });
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
}