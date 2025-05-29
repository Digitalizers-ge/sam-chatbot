
import { useTrackedConversation } from './useTrackedConversation';

// Hook to easily integrate analytics tracking into chat components
export const useAnalytics = () => {
  const { addMessage, sessionId } = useTrackedConversation();

  const trackUserQuestion = async (
    question: string, 
    language: string = 'en', 
    userCountry?: string
  ) => {
    console.log('🔍 ANALYTICS: Tracking user question:', { question, language, userCountry, sessionId });
    const result = await addMessage(question, 'user', language, userCountry);
    console.log('🔍 ANALYTICS: User question tracked, result:', result);
    return result;
  };

  const trackAssistantResponse = async (
    response: string, 
    language: string = 'en', 
    userCountry?: string
  ) => {
    console.log('🔍 ANALYTICS: Tracking assistant response:', { response, language, userCountry, sessionId });
    const result = await addMessage(response, 'assistant', language, userCountry);
    console.log('🔍 ANALYTICS: Assistant response tracked, result:', result);
    return result;
  };

  return {
    trackUserQuestion,
    trackAssistantResponse,
    sessionId,
  };
};
