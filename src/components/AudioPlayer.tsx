import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AudioPlayerProps {
  audioBlob: Blob | null;
  onAudioProcessed?: (originalText: string, translatedText: string) => void;
  selectedLanguage: string;
}

export const AudioPlayer = ({ audioBlob, onAudioProcessed, selectedLanguage }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

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

  const convertToMp3 = async (audioBlob: Blob): Promise<Blob> => {
    // For browser compatibility, we'll return the original blob
    // Most modern browsers can handle WebM/MP4 audio formats
    // In a production environment, you might want to use a library like lamejs for proper MP3 conversion
    return audioBlob;
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64 string
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const sendAudioToAPI = async () => {
    if (!audioBlob) {
      toast({
        title: "No Audio",
        description: "Please record audio first.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    console.log('Starting audio processing...');

    try {
      // Convert to MP3 (for now, using original blob)
      const mp3Blob = await convertToMp3(audioBlob);
      console.log('Audio converted to MP3');

      // Convert to base64
      const base64Audio = await blobToBase64(mp3Blob);
      console.log('Audio converted to base64, length:', base64Audio.length);

      // Send to API
      const response = await fetch('https://c3veuw7me0.execute-api.eu-central-1.amazonaws.com/prod/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_base64: base64Audio,
          language: selectedLanguage.split('-')[0] 
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('API response:', result);

      if (result.message && result.transcript) {
        // Use the transcript from the API response as the user message
        onAudioProcessed?.(result.transcript, result.message);
        toast({
          title: "Audio Processed",
          description: "Your audio has been successfully processed."
        });
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process audio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
    <div className="flex flex-col items-center justify-center p-4 space-y-3">
      <audio
        ref={audioRef}
        src={audioUrl || ''}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        onLoadedData={() => console.log('Audio loaded successfully')}
        onCanPlay={() => console.log('Audio can play')}
        className="hidden"
      />
      
      <div className="flex items-center space-x-3">
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
        
        <Button
          onClick={sendAudioToAPI}
          disabled={isProcessing}
          variant="default"
          size="sm"
          className="flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          {isProcessing ? 'Processing...' : 'Send Audio'}
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 text-center max-w-xs">
        We don't store any personal data - 100% confidential
      </div>
    </div>
  );
};
