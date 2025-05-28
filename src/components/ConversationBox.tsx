
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Volume2, Send } from 'lucide-react';
import { Message } from '@/pages/Meeting';
import { MessageBubble } from './MessageBubble';

interface ConversationBoxProps {
  messages: Message[];
  onSpeak: (text: string) => void;
  onAddMessage?: (text: string, speaker: 'user1' | 'user2') => void;
}

export const ConversationBox = ({ messages, onSpeak, onAddMessage }: ConversationBoxProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<'user1' | 'user2'>('user1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && onAddMessage) {
      onAddMessage(newMessage.trim(), selectedSpeaker);
      setNewMessage('');
    }
  };

  return (
    <div className="sam-glass rounded-2xl p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversation</h2>
      
      <div className="flex-1 space-y-4 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Start a conversation with SAM
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Begin speaking or type a message to start the translated conversation between users.
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
              speaker={message.speaker}
              onSpeak={!message.isUser ? onSpeak : undefined}
            />
          ))
        )}
      </div>

      {/* Text Input Section */}
      <div className="border-t pt-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2 mb-2">
            <Button
              type="button"
              size="sm"
              variant={selectedSpeaker === 'user1' ? 'default' : 'outline'}
              onClick={() => setSelectedSpeaker('user1')}
              className="text-xs"
            >
              User 1
            </Button>
            <Button
              type="button"
              size="sm"
              variant={selectedSpeaker === 'user2' ? 'default' : 'outline'}
              onClick={() => setSelectedSpeaker('user2')}
              className="text-xs"
            >
              User 2
            </Button>
          </div>
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
