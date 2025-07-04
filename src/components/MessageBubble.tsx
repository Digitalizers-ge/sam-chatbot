import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  speaker?: 'user1' | 'user2';
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
  speaker,
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
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div className={`rounded-2xl px-4 py-3 shadow-sm relative ${
          isUser 
            ? 'bg-gradient-to-br from-purple-400 via-orange-300 to-yellow-400 text-white rounded-br-md' 
            : 'sam-glass rounded-bl-md'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              {isUser ? (
                <p className="text-base leading-relaxed whitespace-pre-wrap">{message}</p>
              ) : (
                <div className="text-base leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-em:text-gray-600 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                  <ReactMarkdown>{message}</ReactMarkdown>
                </div>
              )}
              <p className={`text-xs mt-2 ${isUser ? 'text-white/80' : 'text-gray-500'}`}>
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
                className="h-10 w-10 rounded-full bg-yellow-400/20 hover:bg-yellow-400/30 text-gray-700 border border-yellow-400/30 flex-shrink-0 mt-1 text-3xl my-[5px] py-0 mx-[11px]"
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
