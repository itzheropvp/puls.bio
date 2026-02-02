interface Connection {
    username?: string | null;
    avatarUrl?: string | null;
    status?: string | null;
  }
  
  interface DiscordPresenceProps {
    connection: Connection;
  }
  
  export default function DiscordPresence({ connection }: DiscordPresenceProps) {
    return (
      <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
        <img
          src={connection.avatarUrl || '/discord-icon.png'}
          alt="Discord"
          className="w-8 h-8 rounded-full"
        />
        <div className="text-left">
          <p className="text-sm font-medium">{connection.username || 'Discord User'}</p>
          <p className="text-xs text-gray-400 italic">
            {connection.status || 'last seen unknown'}
          </p>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <div className="w-2 h-2 bg-purple-500 rounded-full" />
        </div>
      </div>
    );
  }