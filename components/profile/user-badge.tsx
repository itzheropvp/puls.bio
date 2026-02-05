import { Crown, Shield, Star, Zap, Heart, CheckCircle2 } from 'lucide-react';

interface UserBadgeProps {
  badge: string;
}

const badgeConfig: Record<string, { 
  label: string; 
  icon: React.ComponentType<{ className?: string }>; 
  color: string;
  bg: string;
}> = {
  admin: {
    label: 'Admin',
    icon: Shield,
    color: 'text-red-400',
    bg: 'bg-red-500/10'
  },
  moderator: {
    label: 'Moderator',
    icon: Shield,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  verified: {
    label: 'Verified',
    icon: CheckCircle2,
    color: 'text-green-400',
    bg: 'bg-green-500/10'
  },
  premium: {
    label: 'Premium',
    icon: Crown,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10'
  },
  early: {
    label: 'Early Supporter',
    icon: Star,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10'
  },
  developer: {
    label: 'Developer',
    icon: Zap,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10'
  },
  partner: {
    label: 'Partner',
    icon: Heart,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10'
  }
};

export default function UserBadge({ badge }: UserBadgeProps) {
  const config = badgeConfig[badge.toLowerCase()];
  
  if (!config) return null;
  
  const Icon = config.icon;

  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg} ${config.color} text-xs font-medium border border-current/20`}
      title={config.label}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </div>
  );
}
