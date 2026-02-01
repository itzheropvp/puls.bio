import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;

  // Fetch user with their links and connections
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
    notFound();
  }

  // Increment page views
  await prisma.page.update({
    where: { userId: user.id },
    data: { views: { increment: 1 } },
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Profile Header */}
        <div className="text-center mb-12 mt-8">
          {/* Avatar */}
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.username ?? 'User avatar'}
              className="w-24 h-24 rounded-full mx-auto mb-6 border-2 border-purple-500/50"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold">
              {user.username?.[0].toUpperCase() || 'U'}
            </div>
          )}

          <h1 className="text-4xl font-black mb-2">
            {user.username}
          </h1>
          <p className="text-gray-400 mb-6">
            @{user.username}
          </p>
          {user.bio && (
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              {user.bio}
            </p>
          )}

          {/* Social Connections */}
          {user.connections.length > 0 && (
            <div className="flex justify-center gap-4 mb-8">
              {user.connections.map((connection) => (
                <a
                  key={connection.id}
                  href={connection.profileUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  title={connection.provider}
                >
                  {connection.avatarUrl ? (
                    <img
                      src={connection.avatarUrl}
                      alt={connection.provider}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <span className="text-sm">{connection.provider[0]}</span>
                  )}
                </a>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8 max-w-xs mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Profile Views</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {user.page?.views || 0}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Links</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {user.links.length}
              </p>
            </div>
          </div>
        </div>

        {/* Links Section */}
        {user.links.length > 0 && (
          <div className="space-y-4">
            {user.links.map((link, index) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl p-6 transition-all duration-300 cursor-pointer transform group-hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {link.icon && (
                        <span className="text-3xl">{link.icon}</span>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          {link.title}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* No Links Message */}
        {user.links.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No links yet. Check back soon!
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-white/10">
          <p className="text-xs text-gray-500">
            Created with{' '}
            <Link href="/" className="text-purple-400 hover:text-purple-300">
              puls.bio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
