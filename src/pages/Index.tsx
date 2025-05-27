
import { useState } from 'react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { VoiceOrb } from '@/components/VoiceOrb';
import { ConversationBox } from '@/components/ConversationBox';
import { SourcesBox } from '@/components/SourcesBox';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [voiceMode, setVoiceMode] = useState(true);
  const { toast } = useToast();

  // Mock conversation data
  const [messages] = useState<Message[]>([
    {
      id: '1',
      text: "What are my rights as an asylum seeker in Europe?",
      isUser: true,
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    },
    {
      id: '2',
      text: "As an asylum seeker in Europe, you have several fundamental rights. You have the right to remain in the country while your application is being processed. You're entitled to basic accommodation, food, and healthcare. You also have the right to legal assistance and an interpreter during your asylum procedure. Additionally, you cannot be returned to a country where you face persecution - this is called the principle of non-refoulement.",
      isUser: false,
      timestamp: new Date(Date.now() - 240000), // 4 minutes ago
    },
    {
      id: '3',
      text: "How long does the asylum process usually take?",
      isUser: true,
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
    },
    {
      id: '4',
      text: "The asylum process duration varies significantly across EU countries. Generally, the first instance decision should be made within 6 months, but this can be extended to 21 months in complex cases. Some countries process applications faster, while others may take longer due to backlogs. During this time, you'll receive regular updates about your case status.",
      isUser: false,
      timestamp: new Date(Date.now() - 60000), // 1 minute ago
    },
  ]);

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

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(selectedLanguage);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        console.log('Speech started');
      };
      
      utterance.onend = () => {
        console.log('Speech ended');
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event.error);
        toast({
          title: "Speech Error",
          description: "Unable to play audio. Please try again.",
          variant: "destructive",
        });
      };
      
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen sam-gradient-bg flex">
      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex">
        {/* Vertical Header */}
        <div className="flex flex-col items-center justify-center mr-8 min-w-[200px]">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">SAM</h1>
            <p className="text-lg text-gray-600 text-center">Ask. Listen. Understand.</p>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setVoiceMode(!voiceMode)}
              className={`rounded-full w-12 h-12 ${voiceMode ? 'bg-blue-100' : 'bg-gray-100'}`}
            >
              <Volume2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
          {/* Voice Orb and Conversation */}
          <div className="lg:col-span-2 flex flex-col space-y-6 h-full">
            <div className="flex justify-center">
              <VoiceOrb
                isListening={false}
                isProcessing={false}
                onStartListening={() => console.log('Start listening')}
                onStopListening={() => console.log('Stop listening')}
              />
            </div>
            
            <div className="flex-1">
              <ConversationBox 
                messages={messages} 
                onSpeak={speakText}
              />
            </div>
          </div>

          {/* Sources and Resources */}
          <div className="lg:col-span-1">
            <SourcesBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
