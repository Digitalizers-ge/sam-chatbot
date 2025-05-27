
import { useState, useCallback } from 'react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { VoiceOrb } from '@/components/VoiceOrb';
import { ConversationHistory, Message } from '@/components/ConversationHistory';
import { Button } from '@/components/ui/button';
import { Accessibility } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [voiceMode, setVoiceMode] = useState(true);
  const { toast } = useToast();

  // Initialize speech recognition
  const initializeSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice not supported",
        description: "Please use a compatible browser for voice input.",
        variant: "destructive",
      });
      return null;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getLanguageCode(selectedLanguage);

    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      console.log('Speech recognition result:', transcript);
      
      setIsListening(false);
      
      if (transcript.trim()) {
        handleUserMessage(transcript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      toast({
        title: "Voice input error",
        description: "Please try speaking again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };

    return recognition;
  }, [selectedLanguage]);

  const getLanguageCode = (langCode: string): string => {
    const langMap: Record<string, string> = {
      'en': 'en-US',
      'ar': 'ar-SA',
      'fa': 'fa-IR',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'tr': 'tr-TR',
      'so': 'so-SO',
      'uk': 'uk-UA',
      'ru': 'ru-RU',
      'es': 'es-ES',
    };
    return langMap[langCode] || 'en-US';
  };

  const handleUserMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Simulate API call to AWS Gateway
      await simulateAPICall(text, selectedLanguage);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Processing error",
        description: "Please try your question again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateAPICall = async (userText: string, language: string) => {
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate SAM's response
    const responses = [
      "I understand you're seeking information about asylum rights. Let me help you with that. In Europe, you have the right to apply for asylum if you're fleeing persecution in your home country.",
      "Thank you for your question about legal assistance. I'm here to provide clear, trustworthy information. You have the right to legal representation during your asylum process.",
      "I hear your concern, and I want to help. Regarding housing rights for asylum seekers, each EU country has specific regulations that protect your right to accommodation during the application process.",
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    const samMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      isUser: false,
      timestamp: new Date(),
      audioUrl: voiceMode ? '/placeholder-audio.mp3' : undefined, // Would be actual audio URL from API
    };
    
    setMessages(prev => [...prev, samMessage]);
    
    // If voice mode is enabled, speak the response
    if (voiceMode && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.lang = getLanguageCode(language);
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    const newRecognition = initializeSpeechRecognition();
    if (newRecognition) {
      setRecognition(newRecognition);
      setIsListening(true);
      newRecognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const handleReplay = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.audioUrl && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.text);
      utterance.lang = getLanguageCode(selectedLanguage);
      speechSynthesis.speak(utterance);
    }
  };

  const handleRephrase = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      // Find the user message that preceded this SAM response
      const messageIndex = messages.findIndex(m => m.id === messageId);
      if (messageIndex > 0) {
        const userMessage = messages[messageIndex - 1];
        if (userMessage.isUser) {
          handleUserMessage(userMessage.text);
        }
      }
    }
  };

  const handleFeedback = (messageId: string, isPositive: boolean) => {
    console.log(`Feedback for message ${messageId}: ${isPositive ? 'positive' : 'negative'}`);
    toast({
      title: "Thank you",
      description: "Your feedback helps SAM provide better assistance.",
    });
  };

  return (
    <div className="min-h-screen sam-gradient-bg">
      {/* Header */}
      <div className="sticky top-0 z-40 sam-glass border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SAM</h1>
                <p className="text-sm text-gray-600">Legal Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVoiceMode(!voiceMode)}
                className={`rounded-full sam-glass ${voiceMode ? 'bg-blue-100' : ''}`}
              >
                <Accessibility className="w-4 h-4 mr-2" />
                {voiceMode ? 'Voice On' : 'Voice Off'}
              </Button>
              
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-140px)]">
          {/* Voice Interface */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <VoiceOrb
              isListening={isListening}
              isProcessing={isProcessing}
              onStartListening={startListening}
              onStopListening={stopListening}
            />
            
            {messages.length === 0 && (
              <div className="mt-8 text-center max-w-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Welcome to SAM
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  I'm here to help you understand your legal rights and asylum options in Europe. 
                  Speak naturally in your language, and I'll provide clear, compassionate guidance.
                </p>
              </div>
            )}
          </div>

          {/* Conversation History */}
          <div className="lg:col-span-2">
            <div className="sam-glass rounded-2xl p-6 min-h-[500px] max-h-[600px] overflow-y-auto">
              <ConversationHistory
                messages={messages}
                onReplay={handleReplay}
                onRephrase={handleRephrase}
                onFeedback={handleFeedback}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
