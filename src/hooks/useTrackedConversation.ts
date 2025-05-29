
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

  const addMessage = useCallback(async (
    content: string, 
    sender: 'user' | 'assistant',
    language: string = 'en',
    userCountry?: string
  ) => {
    const newMessage: TrackedMessage = {
      id: crypto.randomUUID(),
      content,
      sender,
      timestamp: new Date(),
      language,
      userCountry,
    };

    setMessages(prev => [...prev, newMessage]);

    // Log conversation when we have both user message and assistant response
    if (sender === 'assistant' && messages.length > 0) {
      const lastUserMessage = messages[messages.length - 1];
      if (lastUserMessage.sender === 'user') {
        await logConversation({
          sessionId: currentSessionId,
          userCountry: lastUserMessage.userCountry || userCountry,
          language: lastUserMessage.language || language,
          userMessage: lastUserMessage.content,
          assistantMessage: content,
        });
        
        // Update session activity
        SessionManager.updateSessionActivity();
      }
    }

    return newMessage;
  }, [messages, currentSessionId, logConversation]);

  const clearMessages = useCallback(() => {
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
