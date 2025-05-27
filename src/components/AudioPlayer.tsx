
import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  audioBlob: Blob | null;
}

export const AudioPlayer = ({ audioBlob }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioBlob) {
      // Clean up previous URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      // Create new URL and log blob info
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      console.log('Audio blob size:', audioBlob.size);
      console.log('Audio blob type:', audioBlob.type);
      console.log('Audio URL created:', url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [audioBlob]);

  const handlePlayPause = () => {
    if (!audioBlob || !audioRef.current || !audioUrl) {
      console.log('Cannot play: missing audio data');
      return;
    }

    console.log('Attempting to play audio...');
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      console.log('Audio paused');
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          console.log('Audio playing successfully');
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
        });
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    console.log('Audio playback ended');
  };

  const handleAudioError = (error: any) => {
    console.error('Audio error:', error);
    setIsPlaying(false);
  };

  if (!audioBlob) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-gray-500 text-sm">No audio recorded yet</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <audio
        ref={audioRef}
        src={audioUrl || ''}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        onLoadedData={() => console.log('Audio loaded successfully')}
        onCanPlay={() => console.log('Audio can play')}
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
      <div className="ml-2 text-xs text-gray-500">
        Size: {Math.round(audioBlob.size / 1024)}KB
      </div>
    </div>
  );
};
