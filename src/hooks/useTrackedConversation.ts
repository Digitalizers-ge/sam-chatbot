
import { useState, useCallback } from 'react';
import { useConversationLogger } from './useConversationLogger';
import { SessionManager } from '@/utils/sessionManager';

export interface TrackedMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  language?: string;
  userCountry?: string;
}

export const useTrackedConversation = () => {
  const [messages, setMessages] = useState<TrackedMessage[]>([]);
  const [currentSessionId] = useState(() => SessionManager.getCurrentSessionId());
  const { logConversation } = useConversationLogger();

  console.log('🔍 TRACKED_CONVERSATION: Hook initialized with sessionId:', currentSessionId);

  const addMessage = useCallback(async (
    content: string, 
    sender: 'user' | 'assistant',
    language: string = 'en',
    userCountry?: string
  ) => {
    console.log('🔍 TRACKED_CONVERSATION: Adding message:', { content, sender, language, userCountry, currentSessionId });

    const newMessage: TrackedMessage = {
      id: crypto.randomUUID(),
      content,
      sender,
      timestamp: new Date(),
      language,
      userCountry,
    };

    // Update messages state and get the current messages count
    setMessages(prev => {
      console.log('🔍 TRACKED_CONVERSATION: Previous messages count:', prev.length);
      const updated = [...prev, newMessage];
      console.log('🔍 TRACKED_CONVERSATION: Updated messages count:', updated.length);
      
      // Log conversation when we have both user message and assistant response
      if (sender === 'assistant' && prev.length > 0) {
        const lastUserMessage = prev[prev.length - 1];
        console.log('🔍 TRACKED_CONVERSATION: Last user message:', lastUserMessage);
        
        if (lastUserMessage.sender === 'user') {
          console.log('🔍 TRACKED_CONVERSATION: Logging conversation to database...');
          
          // Use setTimeout to ensure the state update is processed first
          setTimeout(async () => {
            const logResult = await logConversation({
              sessionId: currentSessionId,
              userCountry: lastUserMessage.userCountry || userCountry,
              language: lastUserMessage.language || language,
              userMessage: lastUserMessage.content,
              assistantMessage: content,
            });
            console.log('🔍 TRACKED_CONVERSATION: Conversation logged, result:', logResult);
            
            // Update session activity
            SessionManager.updateSessionActivity();
            console.log('🔍 TRACKED_CONVERSATION: Session activity updated');
          }, 0);
        }
      } else {
        console.log('🔍 TRACKED_CONVERSATION: Not logging - sender:', sender, 'messages length:', prev.length);
      }
      
      return updated;
    });

    return newMessage;
  }, [currentSessionId, logConversation]);

  const clearMessages = useCallback(() => {
    console.log('🔍 TRACKED_CONVERSATION: Clearing messages');
    setMessages([]);
    SessionManager.clearSession();
  }, []);

  return {
    messages,
    addMessage,
    clearMessages,
    sessionId: currentSessionId,
  };
};
