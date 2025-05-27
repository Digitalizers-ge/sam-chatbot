
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { Message } from '@/pages/Index';
import { MessageBubble } from './MessageBubble';

interface ConversationBoxProps {
  messages: Message[];
  onSpeak: (text: string) => void;
}

export const ConversationBox = ({ messages, onSpeak }: ConversationBoxProps) => {
  return (
    <div className="sam-glass rounded-2xl p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversation</h2>
      
      <div className="flex-1 space-y-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Start a conversation with SAM
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Ask any question about asylum and legal rights in Europe. SAM is here to help you understand your options with clarity and compassion.
            </p>
          </div>
        ) : (
          // Reverse the messages array to show most recent first
          [...messages].reverse().map((message) => (
            <MessageBubble
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
              onSpeak={!message.isUser ? onSpeak : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
};
