
import { useState, useCallback, useEffect } from 'react';
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

  // Helper functions to manage pending user message in sessionStorage
  const setPendingUserMessage = useCallback((message: TrackedMessage | null) => {
    const key = `pending_user_message_${currentSessionId}`;
    if (message) {
      sessionStorage.setItem(key, JSON.stringify(message));
      console.log('🔍 TRACKED_CONVERSATION: Stored pending user message in sessionStorage:', message.content);
    } else {
      sessionStorage.removeItem(key);
      console.log('🔍 TRACKED_CONVERSATION: Cleared pending user message from sessionStorage');
    }
  }, [currentSessionId]);

  const getPendingUserMessage = useCallback((): TrackedMessage | null => {
    const key = `pending_user_message_${currentSessionId}`;
    const stored = sessionStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('🔍 TRACKED_CONVERSATION: Retrieved pending user message from sessionStorage:', parsed.content);
        return {
          ...parsed,
          timestamp: new Date(parsed.timestamp)
        };
      } catch (error) {
        console.error('🔍 TRACKED_CONVERSATION: Error parsing stored pending user message:', error);
        sessionStorage.removeItem(key);
      }
    }
    return null;
  }, [currentSessionId]);

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
      const pendingUserMessage = getPendingUserMessage();
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
  }, [currentSessionId, logConversation, getPendingUserMessage, setPendingUserMessage]);

  const clearMessages = useCallback(() => {
    console.log('🔍 TRACKED_CONVERSATION: Clearing messages');
    setMessages([]);
    setPendingUserMessage(null);
    SessionManager.clearSession();
  }, [setPendingUserMessage]);

  return {
    messages,
    addMessage,
    clearMessages,
    sessionId: currentSessionId,
  };
};
