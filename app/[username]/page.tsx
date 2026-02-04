import { prisma } from '@/lib/db';
import { trackPageView } from '@/lib/analytics';
import NotFoundClaimPage from '@/components/profile/not-found-claim';
import LoggedInBanner from '@/components/profile/logged-in-banner';
import ProfileHeader from '@/components/profile/profile-header';
import LinksList from '@/components/profile/links-list';
import ProfileAudio from '@/components/profile/profile-audio';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { headers } from 'next/headers';
import type { CSSProperties } from 'react';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return {
      title: 'User Not Found - puls.pw',
    };
  }

  return {
    title: `@${user.username} - puls.pw`,
    description: user.bio || `Check out ${user.username}'s profile on puls.pw`,
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      links: {
        where: { visible: true },
        orderBy: { order: 'asc' },
      },
      connections: {
        where: { visible: true },
      },
      page: true,
    },
  });

  if (!user) {
    return <NotFoundClaimPage username={username} currentUser={session?.user as any} />;
  }

  const headersList = await headers();
  trackPageView(user.id, {
    userAgent: headersList.get('user-agent') || undefined,
    referer: headersList.get('referer') || undefined,
  }).catch(console.error);

  const themeData =
    typeof user.theme === 'object' && user.theme !== null && !Array.isArray(user.theme)
      ? (user.theme as Record<string, unknown>)
      : {};

  const musicData =
    typeof user.music === 'object' && user.music !== null && !Array.isArray(user.music)
      ? (user.music as Record<string, unknown>)
      : {};

  const theme = {
    background: '#000000',
    text: '#ffffff',
    accent: '#a855f7',
    ...(themeData || {}),
  } as {
    background: string;
    text: string;
    accent: string;
  };

  const musicUrl = typeof musicData.url === 'string' ? musicData.url.trim() : '';
  const musicEnabled = Boolean(musicData.enabled) && musicUrl.length > 0;
  const musicTitle = typeof musicData.title === 'string' ? musicData.title : 'Unknown title';
  const musicArtist = typeof musicData.artist === 'string' ? musicData.artist : '';
  const musicAutoplay = typeof musicData.autoplay === 'boolean' ? musicData.autoplay : true;

  const isBackgroundUrl =
    typeof theme.background === 'string' &&
    (theme.background.startsWith('http://') ||
      theme.background.startsWith('https://') ||
      theme.background.startsWith('data:'));

  const pageStyle: CSSProperties = {
    color: theme.text,
    ['--accent' as keyof CSSProperties]: theme.accent,
    ...(isBackgroundUrl
      ? {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${theme.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }
      : {
          backgroundColor: theme.background,
        }),
  };

  return (
    <div className="min-h-screen bg-black text-white relative" style={pageStyle}>

      {session?.user && (
        <LoggedInBanner username={(session.user as any).username} />
      )}

      <div className="max-w-2xl mx-auto px-6 py-12 relative z-10">
        <ProfileHeader 
          user={user}
          views={user.page?.views || 0}
          linksCount={user.links.length}
        />
        {musicEnabled && (
          <ProfileAudio
            url={musicUrl}
            title={musicTitle}
            artist={musicArtist}
            autoplay={musicAutoplay}
          />
        )}
        <LinksList links={user.links} />
      </div>
    </div>
  );
}