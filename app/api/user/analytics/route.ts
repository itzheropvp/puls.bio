import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { page: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const profileViewsData: { day: string; views: number; }[] = [];
    const deviceTypesData = [
      { device: 'Desktop', count: 0 },
      { device: 'Mobile', count: 0 },
      { device: 'Tablet', count: 0 },
    ];

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const analytics = await prisma.pageAnalytics.findMany({
      where: {
        pageId: user.page?.id,
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const dayMap = new Map<string, number>();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < 7; i++) {
      dayMap.set(days[i], 0);
    }

    analytics.forEach((record: any) => {
      const date = new Date(record.createdAt);
      const dayIndex = date.getDay();
      const dayName = days[(dayIndex + 6) % 7];
      dayMap.set(dayName, (dayMap.get(dayName) || 0) + 1);
    });

    days.forEach((day) => {
      profileViewsData.push({
        day,
        views: dayMap.get(day) || 0,
      });
    });

    analytics.forEach((record) => {
      const device = deviceTypesData.find(
        (d) => d.device.toLowerCase() === record.deviceType.toLowerCase()
      );
      if (device) {
        device.count += 1;
      }
    });

    return NextResponse.json({
      profileViews: profileViewsData,
      deviceTypes: deviceTypesData,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
