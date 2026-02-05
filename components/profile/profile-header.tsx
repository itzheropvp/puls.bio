import DiscordPresence from './discord-presence';
import SocialIcons from './social-icons';
import UserBadge from './user-badge';

interface Connection {
  id: string;
  provider: string;
  username?: string | null;
  profileUrl?: string | null;
  avatarUrl?: string | null;
  status?: string | null;
}

interface User {
  username: string | null;
  avatarUrl?: string | null;
  avatarDecorationUrl?: string | null;
  bio?: string | null;
  badges?: string[];
  connections: Connection[];
}

interface ProfileHeaderProps {
  user: User;
  views: number;
  linksCount: number;
}

export default function ProfileHeader({ user, views, linksCount }: ProfileHeaderProps) {
  const discordConnection = user.connections.find(c => c.provider === 'discord');
  return (
    <div className="text-center mb-8">
      <div className="relative inline-block mb-6">
        {user.avatarUrl ? (
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.username ?? 'User avatar'}
              className="w-32 h-32 rounded-full relative z-10 border-4 border-black"
            />
            {user.avatarDecorationUrl && (
              <img
                src={user.avatarDecorationUrl}
                alt=""
                className="absolute inset-0 w-32 h-32 z-20 pointer-events-none select-none"
                aria-hidden="true"
              />
            )}
          </div>
        ) : (
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-purple-500 rounded-full relative z-10 border-4 border-black flex items-center justify-center text-5xl font-bold">
              {user.username?.[0].toUpperCase() || 'U'}
            </div>
            {user.avatarDecorationUrl && (
              <img
                src={user.avatarDecorationUrl}
                alt=""
                className="absolute inset-0 w-32 h-32 z-20 pointer-events-none select-none"
                aria-hidden="true"
              />
            )}
          </div>
        )}
      </div>

      <h1 className="text-4xl font-bold mb-2 tracking-tight">
        {user.username}
      </h1>
      {user.badges && user.badges.length > 0 && (
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          {user.badges.map((badge) => (
            <UserBadge key={badge} badge={badge} />
          ))}
        </div>
      )}
      
      {user.bio && (
        <p className="text-gray-400 mb-6 text-sm">
          {user.bio}
        </p>
      )}

      {discordConnection && (
        <DiscordPresence connection={discordConnection} />
      )}

      <SocialIcons connections={user.connections} />

      <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>{views}</span>
      </div>
    </div>
  );
}