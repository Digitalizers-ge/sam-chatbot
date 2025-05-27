
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { Message } from '@/pages/Index';

interface ConversationBoxProps {
  messages: Message[];
  onSpeak: (text: string) => void;
}

export const ConversationBox = ({ messages, onSpeak }: ConversationBoxProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="sam-glass rounded-2xl p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversation</h2>
      
      <div className="flex-1 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'}`}>
              <div
                className={`rounded-2xl px-4 py-3 shadow-sm ${
                  message.isUser
                    ? 'bg-gradient-to-br from-purple-400 via-orange-300 to-yellow-400 text-white rounded-br-md'
                    : 'bg-white/70 text-gray-800 rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs ${message.isUser ? 'text-white/80' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                  
                  {!message.isUser && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSpeak(message.text)}
                      className="h-6 w-6 p-0 hover:bg-gray-200 rounded-full"
                    >
                      <Volume2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
