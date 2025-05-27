
import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  audioUrl?: string;
}

interface ConversationHistoryProps {
  messages: Message[];
  onReplay: (messageId: string) => void;
  onRephrase: (messageId: string) => void;
  onFeedback: (messageId: string, isPositive: boolean) => void;
}

export const ConversationHistory = ({ 
  messages, 
  onReplay, 
  onRephrase, 
  onFeedback 
}: ConversationHistoryProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
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
    );
  }

  return (
    <div className="space-y-1 pb-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message.text}
          isUser={message.isUser}
          timestamp={message.timestamp}
          audioUrl={message.audioUrl}
          onReplay={!message.isUser ? () => onReplay(message.id) : undefined}
          onRephrase={!message.isUser ? () => onRephrase(message.id) : undefined}
          onFeedback={!message.isUser ? (isPositive) => onFeedback(message.id, isPositive) : undefined}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
