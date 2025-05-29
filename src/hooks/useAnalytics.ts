
import { useTrackedConversation } from './useTrackedConversation';

// Hook to easily integrate analytics tracking into chat components
export const useAnalytics = () => {
  const { addMessage, sessionId } = useTrackedConversation();

  const trackUserQuestion = async (
    question: string, 
    language: string = 'en', 
    userCountry?: string
  ) => {
    console.log('Tracking user question:', { question, language, userCountry, sessionId });
    return await addMessage(question, 'user', language, userCountry);
  };

  const trackAssistantResponse = async (
    response: string, 
    language: string = 'en', 
    userCountry?: string
  ) => {
    console.log('Tracking assistant response:', { response, language, userCountry, sessionId });
    return await addMessage(response, 'assistant', language, userCountry);
  };

  return {
    trackUserQuestion,
    trackAssistantResponse,
    sessionId,
  };
};
