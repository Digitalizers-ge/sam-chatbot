
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceOrbProps {
  isListening: boolean;
  isProcessing: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onAudioRecorded?: (audioBlob: Blob) => void;
}

export const VoiceOrb = ({ 
  isListening, 
  isProcessing, 
  onStartListening, 
  onStopListening,
  onAudioRecorded 
}: VoiceOrbProps) => {
  const [isSupported, setIsSupported] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        if (onAudioRecorded) {
          onAudioRecorded(audioBlob);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getOrbClass = () => {
    let baseClass = "w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer border-none bg-transparent";
    
    if (isProcessing) {
      return `${baseClass} bg-gradient-to-br from-purple-400 via-orange-300 to-yellow-400 orb-pulse`;
    } else if (isRecording) {
      return `${baseClass} bg-gradient-to-br from-red-400 via-red-500 to-red-600 orb-listening`;
    } else if (isListening) {
      return `${baseClass} bg-gradient-to-br from-blue-400 via-purple-400 to-orange-400 orb-listening`;
    } else {
      return `${baseClass} bg-gradient-to-br from-purple-400 via-orange-300 to-yellow-400 orb-glow hover:scale-105`;
    }
  };

  const getIcon = () => {
    if (isRecording) {
      return <Square className="w-8 h-8 md:w-10 md:h-10 text-white" />;
    }
    return <Mic className="w-8 h-8 md:w-10 md:h-10 text-white" />;
  };

  if (!isSupported) {
    return (
      <div className="text-center">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center bg-gray-300">
          <MicOff className="w-16 h-16 text-gray-500" />
        </div>
        <p className="text-gray-600 max-w-xs mx-auto mt-4">
          Voice input is not supported in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        onClick={handleClick}
        disabled={isProcessing}
        className={getOrbClass()}
      >
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          {getIcon()}
        </div>
      </button>
      {isRecording && (
        <p className="text-sm text-gray-600 mt-2">Recording... Click to stop</p>
      )}
    </div>
  );
};
