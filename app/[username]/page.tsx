import { prisma } from '@/lib/db';
import { trackPageView } from '@/lib/analytics';
import NotFoundClaimPage from '@/components/profile/not-found-claim';
import LoggedInBanner from '@/components/profile/logged-in-banner';
import ProfileHeader from '@/components/profile/profile-header';
import LinksList from '@/components/profile/links-list';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { headers } from 'next/headers';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
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

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="fixed top-6 left-6 z-50">
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      </div>

      {session?.user && (
        <LoggedInBanner username={(session.user as any).username} />
      )}

      <div className="max-w-2xl mx-auto px-6 py-12 relative z-10">
        <ProfileHeader 
          user={user}
          views={user.page?.views || 0}
          linksCount={user.links.length}
        />
        <LinksList links={user.links} />
      </div>
    </div>
  );
}