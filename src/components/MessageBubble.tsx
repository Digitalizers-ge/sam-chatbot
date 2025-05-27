
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  audioUrl?: string;
  onReplay?: () => void;
  onRephrase?: () => void;
  onFeedback?: (isPositive: boolean) => void;
  onSpeak?: (text: string) => void;
}

export const MessageBubble = ({ 
  message, 
  isUser, 
  timestamp, 
  audioUrl,
  onReplay,
  onRephrase,
  onFeedback,
  onSpeak
}: MessageBubbleProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(null);

  const handleSpeak = () => {
    if (onSpeak) {
      setIsPlaying(true);
      onSpeak(message);
      // Reset playing state after a delay (approximate speech duration)
      setTimeout(() => setIsPlaying(false), Math.max(2000, message.length * 50));
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
          className={`rounded-2xl px-4 py-3 shadow-sm relative ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'sam-glass rounded-bl-md'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-base leading-relaxed whitespace-pre-wrap">{message}</p>
              <p className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                {formatTime(timestamp)}
              </p>
            </div>
            
            {/* Integrated speaker button for assistant messages */}
            {!isUser && onSpeak && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSpeak}
                disabled={isPlaying}
                className="h-10 w-10 rounded-full bg-yellow-400/20 hover:bg-yellow-400/30 text-gray-700 border border-yellow-400/30 flex-shrink-0 mt-1"
              >
                <Play className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
        
        {!isUser && (
          <div className="flex flex-wrap gap-2 mt-3">
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
