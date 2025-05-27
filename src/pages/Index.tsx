import { useState } from 'react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { VoiceOrb } from '@/components/VoiceOrb';
import { ConversationBox } from '@/components/ConversationBox';
import { SourcesBox } from '@/components/SourcesBox';
import { AudioPlayer } from '@/components/AudioPlayer';
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
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const {
    toast
  } = useToast();

  // Mock conversation data
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: "What are my rights as an asylum seeker in Europe?",
    isUser: true,
    timestamp: new Date(Date.now() - 300000) // 5 minutes ago
  }, {
    id: '2',
    text: "As an asylum seeker in Europe, you have several fundamental rights. You have the right to remain in the country while your application is being processed. You're entitled to basic accommodation, food, and healthcare. You also have the right to legal assistance and an interpreter during your asylum procedure. Additionally, you cannot be returned to a country where you face persecution - this is called the principle of non-refoulement.",
    isUser: false,
    timestamp: new Date(Date.now() - 240000) // 4 minutes ago
  }, {
    id: '3',
    text: "How long does the asylum process usually take?",
    isUser: true,
    timestamp: new Date(Date.now() - 120000) // 2 minutes ago
  }, {
    id: '4',
    text: "The asylum process duration varies significantly across EU countries. Generally, the first instance decision should be made within 6 months, but this can be extended to 21 months in complex cases. Some countries process applications faster, while others may take longer due to backlogs. During this time, you'll receive regular updates about your case status.",
    isUser: false,
    timestamp: new Date(Date.now() - 60000) // 1 minute ago
  }]);
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
      'es': 'es-ES'
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
      utterance.onerror = event => {
        console.error('Speech error:', event.error);
        toast({
          title: "Speech Error",
          description: "Unable to play audio. Please try again.",
          variant: "destructive"
        });
      };
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive"
      });
    }
  };
  const handleAudioRecorded = (audioBlob: Blob) => {
    setRecordedAudio(audioBlob);
    console.log('Audio recorded:', audioBlob);
    toast({
      title: "Recording Complete",
      description: "Your audio has been recorded successfully."
    });
  };
  const handleAudioProcessed = (originalText: string, translatedText: string) => {
    console.log('Audio processed - Original:', originalText, 'Translated:', translatedText);

    // Add user message (original text)
    const userMessage: Message = {
      id: Date.now().toString(),
      text: originalText,
      isUser: true,
      timestamp: new Date()
    };

    // Add assistant response (translated text)
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: translatedText,
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage, assistantMessage]);
  };
  return <div className="min-h-screen sam-gradient-bg">
      {/* Header at the top */}
      <div className="w-full px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center py-[46px]">
            {/* Logo and subtitle vertically stacked */}
            <div className="flex flex-col items-center mb-6">
              <img src="/lovable-uploads/22846939-a307-4be2-b1d0-39a60a6cf0de.png" alt="SAM Logo" className="h-36 w-auto mb-2" />
              <p className="text-lg text-gray-600 text-center">Ask anything about asylum in Europe</p>
            </div>
            
            {/* Language selector only */}
            <div className="flex items-center">
              <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Voice Orb in its own centered row */}
        <div className="flex flex-col items-center mb-8 py-[34px]">
          <VoiceOrb isListening={false} isProcessing={false} onStartListening={() => console.log('Start listening')} onStopListening={() => console.log('Stop listening')} onAudioRecorded={handleAudioRecorded} />
          <AudioPlayer audioBlob={recordedAudio} onAudioProcessed={handleAudioProcessed} selectedLanguage={selectedLanguage} />
        </div>
        
        {/* Conversation and Sources in equal height row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-400px)]">
          {/* Conversation Box */}
          <div className="lg:col-span-2 h-full">
            <ConversationBox messages={messages} onSpeak={speakText} />
          </div>

          {/* Sources Box */}
          <div className="lg:col-span-1 h-full">
            <SourcesBox />
          </div>
        </div>
      </div>
    </div>;
};
export default Index;