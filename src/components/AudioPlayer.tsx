
import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  audioBlob: Blob | null;
}

export const AudioPlayer = ({ audioBlob }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    if (!audioBlob || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  if (!audioBlob) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-gray-500 text-sm">No audio recorded yet</p>
      </div>
    );
  }

  const audioUrl = URL.createObjectURL(audioBlob);

  return (
    <div className="flex items-center justify-center p-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={handleAudioEnded}
        className="hidden"
      />
      <Button
        onClick={handlePlayPause}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
        {isPlaying ? 'Pause' : 'Play'} Recording
      </Button>
    </div>
  );
};
