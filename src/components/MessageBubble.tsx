
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  audioUrl?: string;
  onReplay?: () => void;
  onRephrase?: () => void;
  onFeedback?: (isPositive: boolean) => void;
}

export const MessageBubble = ({ 
  message, 
  isUser, 
  timestamp, 
  audioUrl,
  onReplay,
  onRephrase,
  onFeedback 
}: MessageBubbleProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(null);

  const playAudio = async () => {
    if (!audioUrl) return;
    
    try {
      setIsPlaying(true);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const handleFeedback = (isPositive: boolean) => {
    setFeedbackGiven(isPositive);
    onFeedback?.(isPositive);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'sam-glass rounded-bl-md'
          }`}
        >
          <p className="text-base leading-relaxed whitespace-pre-wrap">{message}</p>
          <p className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {formatTime(timestamp)}
          </p>
        </div>
        
        {!isUser && (
          <div className="flex flex-wrap gap-2 mt-3">
            {audioUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={playAudio}
                disabled={isPlaying}
                className="text-xs h-8 rounded-full sam-glass"
              >
                {isPlaying ? '🔊 Playing...' : '🔊 Listen'}
              </Button>
            )}
            
            {onReplay && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReplay}
                className="text-xs h-8 rounded-full sam-glass"
              >
                🔄 Replay
              </Button>
            )}
            
            {onRephrase && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRephrase}
                className="text-xs h-8 rounded-full sam-glass"
              >
                ✏️ Rephrase
              </Button>
            )}
            
            {onFeedback && feedbackGiven === null && (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFeedback(true)}
                  className="text-xs h-8 w-8 rounded-full sam-glass p-0"
                >
                  👍
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFeedback(false)}
                  className="text-xs h-8 w-8 rounded-full sam-glass p-0"
                >
                  👎
                </Button>
              </div>
            )}
            
            {feedbackGiven !== null && (
              <span className="text-xs text-gray-500 flex items-center">
                {feedbackGiven ? '👍 Thank you!' : '👎 Thank you for your feedback'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
