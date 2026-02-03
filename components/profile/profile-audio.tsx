'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import MusicPlayer from './music-player';

interface ProfileAudioProps {
  url: string;
  title: string;
  artist?: string;
  autoplay?: boolean;
}

export default function ProfileAudio({ url, title, artist, autoplay }: ProfileAudioProps) {
  const [muted, setMuted] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMuted(prev => !prev)}
        className="fixed top-6 left-6 z-50 inline-flex items-center justify-center rounded-full w-10 h-10 border border-white/10 bg-white/10 hover:bg-white/20 transition"
        style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 20%, transparent)' }}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      <MusicPlayer
        url={url}
        title={title}
        artist={artist}
        autoplay={autoplay}
        muted={muted}
      />
    </>
  );
}
