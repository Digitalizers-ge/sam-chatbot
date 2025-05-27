
import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceOrbProps {
  isListening: boolean;
  isProcessing: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
}

export const VoiceOrb = ({ 
  isListening, 
  isProcessing, 
  onStartListening, 
  onStopListening 
}: VoiceOrbProps) => {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const handleClick = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  const getOrbClass = () => {
    let baseClass = "w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer";
    
    if (isProcessing) {
      return `${baseClass} bg-gradient-to-br from-purple-400 to-purple-600 orb-pulse`;
    } else if (isListening) {
      return `${baseClass} bg-gradient-to-br from-blue-400 to-blue-600 orb-listening`;
    } else {
      return `${baseClass} bg-gradient-to-br from-blue-500 to-cyan-500 orb-glow hover:from-blue-400 hover:to-cyan-400`;
    }
  };

  const getStatusText = () => {
    if (isProcessing) return "SAM is thinking...";
    if (isListening) return "Listening...";
    return "Tap to speak with SAM";
  };

  if (!isSupported) {
    return (
      <div className="text-center">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center bg-gray-300 mb-4">
          <MicOff className="w-12 h-12 text-gray-500" />
        </div>
        <p className="text-gray-600 max-w-xs mx-auto">
          Voice input is not supported in your browser. Please try a different browser.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <Button
        onClick={handleClick}
        disabled={isProcessing}
        className={getOrbClass()}
        variant="ghost"
      >
        <Mic className="w-12 h-12 md:w-16 md:h-16 text-white" />
      </Button>
      
      <p className="mt-6 text-lg font-medium text-gray-700 max-w-xs mx-auto">
        {getStatusText()}
      </p>
      
      {isListening && (
        <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto animate-fade-in">
          Speak clearly in your selected language
        </p>
      )}
    </div>
  );
};
