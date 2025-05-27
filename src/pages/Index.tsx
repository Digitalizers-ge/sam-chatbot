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
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
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
      'ab-GE': 'ab-GE',
      'af-ZA': 'af-ZA',
      'ar-AE': 'ar-AE',
      'ar-SA': 'ar-SA',
      'hy-AM': 'hy-AM',
      'ast-ES': 'ast-ES',
      'az-AZ': 'az-AZ',
      'ba-RU': 'ba-RU',
      'eu-ES': 'eu-ES',
      'be-BY': 'be-BY',
      'bn-IN': 'bn-IN',
      'bs-BA': 'bs-BA',
      'bg-BG': 'bg-BG',
      'ca-ES': 'ca-ES',
      'ckb-IR': 'ckb-IR',
      'ckb-IQ': 'ckb-IQ',
      'yue-HK': 'yue-HK',
      'zh-CN': 'zh-CN',
      'zh-TW': 'zh-TW',
      'hr-HR': 'hr-HR',
      'cs-CZ': 'cs-CZ',
      'da-DK': 'da-DK',
      'nl-NL': 'nl-NL',
      'en-AU': 'en-AU',
      'en-GB': 'en-GB',
      'en-IN': 'en-IN',
      'en-IE': 'en-IE',
      'en-NZ': 'en-NZ',
      'en-AB': 'en-AB',
      'en-ZA': 'en-ZA',
      'en-US': 'en-US',
      'en-WL': 'en-WL',
      'et-ET': 'et-ET',
      'fa-IR': 'fa-IR',
      'fi-FI': 'fi-FI',
      'fr-FR': 'fr-FR',
      'fr-CA': 'fr-CA',
      'gl-ES': 'gl-ES',
      'ka-GE': 'ka-GE',
      'de-DE': 'de-DE',
      'de-CH': 'de-CH',
      'el-GR': 'el-GR',
      'gu-IN': 'gu-IN',
      'ha-NG': 'ha-NG',
      'he-IL': 'he-IL',
      'hi-IN': 'hi-IN',
      'hu-HU': 'hu-HU',
      'is-IS': 'is-IS',
      'id-ID': 'id-ID',
      'it-IT': 'it-IT',
      'ja-JP': 'ja-JP',
      'kab-DZ': 'kab-DZ',
      'kn-IN': 'kn-IN',
      'kk-KZ': 'kk-KZ',
      'rw-RW': 'rw-RW',
      'ko-KR': 'ko-KR',
      'ky-KG': 'ky-KG',
      'lv-LV': 'lv-LV',
      'lt-LT': 'lt-LT',
      'lg-IN': 'lg-IN',
      'mk-MK': 'mk-MK',
      'ms-MY': 'ms-MY',
      'ml-IN': 'ml-IN',
      'mt-MT': 'mt-MT',
      'mr-IN': 'mr-IN',
      'mhr-RU': 'mhr-RU',
      'mn-MN': 'mn-MN',
      'no-NO': 'no-NO',
      'or-IN': 'or-IN',
      'ps-AF': 'ps-AF',
      'pl-PL': 'pl-PL',
      'pt-PT': 'pt-PT',
      'pt-BR': 'pt-BR',
      'pa-IN': 'pa-IN',
      'ro-RO': 'ro-RO',
      'ru-RU': 'ru-RU',
      'sr-RS': 'sr-RS',
      'si-LK': 'si-LK',
      'sk-SK': 'sk-SK',
      'sl-SI': 'sl-SI',
      'so-SO': 'so-SO',
      'es-ES': 'es-ES',
      'es-US': 'es-US',
      'su-ID': 'su-ID',
      'sw-KE': 'sw-KE',
      'sw-BI': 'sw-BI',
      'sw-RW': 'sw-RW',
      'sw-TZ': 'sw-TZ',
      'sw-UG': 'sw-UG',
      'sv-SE': 'sv-SE',
      'tl-PH': 'tl-PH',
      'ta-IN': 'ta-IN',
      'tt-RU': 'tt-RU',
      'te-IN': 'te-IN',
      'th-TH': 'th-TH',
      'tr-TR': 'tr-TR',
      'uk-UA': 'uk-UA',
      'ug-CN': 'ug-CN',
      'uz-UZ': 'uz-UZ',
      'vi-VN': 'vi-VN',
      'cy-WL': 'cy-WL',
      'wo-SN': 'wo-SN',
      'zu-ZA': 'zu-ZA'
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
