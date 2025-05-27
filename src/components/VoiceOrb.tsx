
import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

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
    let baseClass = "w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer border-none bg-transparent";
    
    if (isProcessing) {
      return `${baseClass} bg-gradient-to-br from-purple-400 via-orange-300 to-yellow-400 orb-pulse`;
    } else if (isListening) {
      return `${baseClass} bg-gradient-to-br from-blue-400 via-purple-400 to-orange-400 orb-listening`;
    } else {
      return `${baseClass} bg-gradient-to-br from-purple-400 via-orange-300 to-yellow-400 orb-glow hover:scale-105`;
    }
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
          <Mic className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>
      </button>
    </div>
  );
};
