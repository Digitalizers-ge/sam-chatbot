
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
  const [pendingUserMessage, setPendingUserMessage] = useState<TrackedMessage | null>(null);
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

    // Update messages state first
    setMessages(prev => {
      console.log('🔍 TRACKED_CONVERSATION: Previous messages count:', prev.length);
      const updated = [...prev, newMessage];
      console.log('🔍 TRACKED_CONVERSATION: Updated messages count:', updated.length);
      return updated;
    });

    // Handle conversation logging logic
    if (sender === 'user') {
      // Store user message for when assistant responds
      console.log('🔍 TRACKED_CONVERSATION: Storing user message for later logging:', content);
      setPendingUserMessage(newMessage);
    } else if (sender === 'assistant') {
      // Check if we have a pending user message to pair with this assistant response
      console.log('🔍 TRACKED_CONVERSATION: Assistant message received, checking for pending user message...');
      console.log('🔍 TRACKED_CONVERSATION: Current pendingUserMessage:', pendingUserMessage);
      
      if (pendingUserMessage) {
        // We have both user message and assistant response, log to database
        console.log('🔍 TRACKED_CONVERSATION: Logging complete conversation to database...');
        console.log('🔍 TRACKED_CONVERSATION: User message:', pendingUserMessage.content);
        console.log('🔍 TRACKED_CONVERSATION: Assistant message:', content);
        
        const logResult = await logConversation({
          sessionId: currentSessionId,
          userCountry: pendingUserMessage.userCountry || userCountry,
          language: pendingUserMessage.language || language,
          userMessage: pendingUserMessage.content,
          assistantMessage: content,
        });
        console.log('🔍 TRACKED_CONVERSATION: Conversation logged, result:', logResult);
        
        // Clear pending user message after successful logging
        setPendingUserMessage(null);
        
        // Update session activity
        SessionManager.updateSessionActivity();
        console.log('🔍 TRACKED_CONVERSATION: Session activity updated');
      } else {
        console.log('🔍 TRACKED_CONVERSATION: No pending user message found, cannot log conversation');
      }
    }

    return newMessage;
  }, [pendingUserMessage, currentSessionId, logConversation]);

  const clearMessages = useCallback(() => {
    console.log('🔍 TRACKED_CONVERSATION: Clearing messages');
    setMessages([]);
    setPendingUserMessage(null);
    SessionManager.clearSession();
  }, []);

  return {
    messages,
    addMessage,
    clearMessages,
    sessionId: currentSessionId,
  };
};
