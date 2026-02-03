'use client';

import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface MusicPlayerProps {
  url: string;
  title: string;
  artist?: string;
  autoplay?: boolean;
  muted?: boolean;
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) return '0:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function MusicPlayer({
  url,
  title,
  artist,
  autoplay,
  muted = false,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    audio.load();

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted;
  }, [muted]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(event.target.value);
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handleSkipBack = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const handleSkipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-[#1a1a1a] rounded-xl px-4 py-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center shrink-0 border border-white/10">
          <svg
              className="w-6 h-6 text-white/60"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <p className="text-sm font-medium text-white truncate">{title}</p>
          </div>

          <div className="relative group">
            <div className="flex items-center justify-between text-[10px] text-white/40 mb-1.5">
              <span className="font-mono">{formatTime(currentTime)}</span>
              <span className="font-mono">{formatTime(duration)}</span>
            </div>

            <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-white/80 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />

              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Seek"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSkipBack}
            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white/90 transition-colors"
            aria-label="Skip back 10 seconds"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={togglePlayback}
            className="w-9 h-9 flex items-center justify-center bg-white/90 hover:bg-white rounded-full text-black transition-all"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleSkipForward}
            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white/90 transition-colors"
            aria-label="Skip forward 10 seconds"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={url}
        preload="auto"
        autoPlay={autoplay}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
        onLoadedData={(event) => setDuration(event.currentTarget.duration || 0)}
        onCanPlay={(event) => setDuration(event.currentTarget.duration || 0)}
      />
    </div>
  );
}