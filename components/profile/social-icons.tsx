import SocialIcon from './social-icon';

interface Connection {
  id: string;
  provider: string;
  profileUrl?: string | null;
}

interface SocialIconsProps {
  connections: Connection[];
}

export default function SocialIcons({ connections }: SocialIconsProps) {
  if (connections.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      {connections.map((connection) => (
        <a
          key={connection.id}
          href={connection.profileUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          title={connection.provider}
        >
          <SocialIcon provider={connection.provider} />
        </a>
      ))}
    </div>
  );
}