import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        avatarDecorationUrl: true,
        createdAt: true,
        alias: true,
        page: {
          select: {
            views: true,
          },
        },
        links: {
          select: {
            id: true,
            title: true,
            visible: true,
          },
        },
        connections: {
          select: {
            id: true,
            provider: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const totalUsers = await prisma.user.count();
    const usersBeforeThisUser = await prisma.user.count({
      where: {
        createdAt: {
          lt: user.createdAt,
        },
      },
    });
    const percentile = Math.round(((usersBeforeThisUser + 1) / totalUsers) * 100);

    return NextResponse.json({
      ...user,
      percentile,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const avatarDecorationUrlRaw = body?.avatarDecorationUrl;
    const avatarDecorationUrl =
      typeof avatarDecorationUrlRaw === 'string' && avatarDecorationUrlRaw.trim().length > 0
        ? avatarDecorationUrlRaw.trim()
        : null;

    // Handle bio updates
    const bioRaw = body?.bio;
    const bio =
      typeof bioRaw === 'string' && bioRaw.trim().length > 0 && bioRaw.length <= 160
        ? bioRaw.trim()
        : bioRaw === '' ? null : undefined;

    const updateData: any = { avatarDecorationUrl };
    if (bio !== undefined) {
      updateData.bio = bio;
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: { avatarDecorationUrl: true, bio: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
