
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ConversationData {
  sessionId: string;
  userCountry?: string;
  language: string;
  userMessage: string;
  assistantMessage?: string;
}

export const useConversationLogger = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const logConversation = async (data: ConversationData) => {
    try {
      setLoading(true);
      console.log('🔍 CONVERSATION_LOGGER: Starting to log conversation:', data);
      
      const { data: result, error } = await supabase.rpc('log_conversation', {
        p_session_id: data.sessionId,
        p_user_country: data.userCountry || null,
        p_language: data.language,
        p_user_message: data.userMessage,
        p_assistant_message: data.assistantMessage || null,
      });

      if (error) {
        console.error('🔍 CONVERSATION_LOGGER: Error logging conversation:', error);
        toast({
          title: "Warning",
          description: "Failed to log conversation data",
          variant: "destructive",
        });
        return null;
      }

      console.log('🔍 CONVERSATION_LOGGER: Conversation logged successfully:', result);
      return result;
    } catch (error) {
      console.error('🔍 CONVERSATION_LOGGER: Exception while logging conversation:', error);
      toast({
        title: "Warning", 
        description: "Failed to log conversation data",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    logConversation,
    loading,
  };
};
