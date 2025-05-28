import { useState } from 'react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { VoiceOrb } from '@/components/VoiceOrb';
import { ConversationBox } from '@/components/ConversationBox';
import { SourcesBox } from '@/components/SourcesBox';
import { AudioPlayer } from '@/components/AudioPlayer';
import { NavigationMenu } from '@/components/NavigationMenu';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [voiceMode, setVoiceMode] = useState(true);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [languageError, setLanguageError] = useState(false);
  const { toast } = useToast();

  // Initialize with empty messages array
  const [messages, setMessages] = useState<Message[]>([]);

  // Mock conversation data
  const getLanguageCode = (langCode: string): string => {
    const langMap: Record<string, string> = {
  'af-ZA': 'af',     // Afrikaans
  'sq-AL': 'sq',     // Albanian
  'am-ET': 'am',     // Amharic
  'ar-SA': 'ar',     // Arabic
  'hy-AM': 'hy',     // Armenian
  'az-AZ': 'az',     // Azerbaijani
  'bn-IN': 'bn',     // Bengali
  'bs-BA': 'bs',     // Bosnian
  'bg-BG': 'bg',     // Bulgarian
  'ca-ES': 'ca',     // Catalan
  'zh-CN': 'zh',     // Chinese (Simplified)
  'zh-TW': 'zh-TW',  // Chinese (Traditional)
  'hr-HR': 'hr',     // Croatian
  'cs-CZ': 'cs',     // Czech
  'da-DK': 'da',     // Danish
  'fa-AF': 'fa-AF',  // Dari
  'nl-NL': 'nl',     // Dutch
  'en-US': 'en',     // English
  'et-EE': 'et',     // Estonian
  'fa-IR': 'fa',     // Farsi (Persian)
  'tl-PH': 'tl',     // Filipino, Tagalog
  'fi-FI': 'fi',     // Finnish
  'fr-FR': 'fr',     // French
  'fr-CA': 'fr-CA',  // French (Canada)
  'ka-GE': 'ka',     // Georgian
  'de-DE': 'de',     // German
  'el-GR': 'el',     // Greek
  'gu-IN': 'gu',     // Gujarati
  'ht-HT': 'ht',     // Haitian Creole
  'ha-NG': 'ha',     // Hausa
  'he-IL': 'he',     // Hebrew
  'hi-IN': 'hi',     // Hindi
  'hu-HU': 'hu',     // Hungarian
  'is-IS': 'is',     // Icelandic
  'id-ID': 'id',     // Indonesian
  'ga-IE': 'ga',     // Irish
  'it-IT': 'it',     // Italian
  'ja-JP': 'ja',     // Japanese
  'kn-IN': 'kn',     // Kannada
  'kk-KZ': 'kk',     // Kazakh
  'ko-KR': 'ko',     // Korean
  'lv-LV': 'lv',     // Latvian
  'lt-LT': 'lt',     // Lithuanian
  'mk-MK': 'mk',     // Macedonian
  'ms-MY': 'ms',     // Malay
  'ml-IN': 'ml',     // Malayalam
  'mt-MT': 'mt',     // Maltese
  'mr-IN': 'mr',     // Marathi
  'mn-MN': 'mn',     // Mongolian
  'no-NO': 'no',     // Norwegian (Bokmål)
  'ps-AF': 'ps',     // Pashto
  'pl-PL': 'pl',     // Polish
  'pt-BR': 'pt',     // Portuguese (Brazil)
  'pt-PT': 'pt-PT',  // Portuguese (Portugal)
  'pa-IN': 'pa',     // Punjabi
  'ro-RO': 'ro',     // Romanian
  'ru-RU': 'ru',     // Russian
  'sr-RS': 'sr',     // Serbian
  'si-LK': 'si',     // Sinhala
  'sk-SK': 'sk',     // Slovak
  'sl-SI': 'sl',     // Slovenian
  'so-SO': 'so',     // Somali
  'es-ES': 'es',     // Spanish
  'es-MX': 'es-MX',  // Spanish (Mexico)
  'sw-KE': 'sw',     // Swahili
  'sv-SE': 'sv',     // Swedish
  'ta-IN': 'ta',     // Tamil
  'te-IN': 'te',     // Telugu
  'th-TH': 'th',     // Thai
  'tr-TR': 'tr',     // Turkish
  'uk-UA': 'uk',     // Ukrainian
  'ur-PK': 'ur',     // Urdu
  'uz-UZ': 'uz',     // Uzbek
  'vi-VN': 'vi',     // Vietnamese
  'cy-GB': 'cy'      // Welsh
};

    
    return langMap[langCode] || 'en';
  };

  const speakText = async (text: string) => {
    try {
      console.log('Sending text to Amazon Polly:', text);
      
      const response = await fetch('https://z1eznxs6nb.execute-api.eu-north-1.amazonaws.com/prod/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          lang: 'en'
        })
      });


      if (!response.ok) {
        throw new Error(`Polly API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Polly API response:', result);

      if (result.audio_url) {
        // Create audio element and play the MP3
        const audio = new Audio(result.audio_url);
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          toast({
            title: "Audio Error",
            description: "Unable to play audio. Please try again.",
            variant: "destructive"
          });
        });
      } else {
        throw new Error('No MP3 URL in response');
      }

    } catch (error) {
      console.error('Error with Polly TTS:', error);
      toast({
        title: "Speech Error",
        description: "Unable to generate speech. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleVoiceOrbClick = () => {
    if (!selectedLanguage) {
      setLanguageError(true);
      toast({
        title: "Language Required",
        description: "Please select a language before using the microphone.",
        variant: "destructive"
      });
      // Clear error after 3 seconds
      setTimeout(() => setLanguageError(false), 3000);
      return;
    }
    setLanguageError(false);
    console.log('Voice orb clicked with language:', selectedLanguage);
  };

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setLanguageError(false);
  };

  const handleAudioRecorded = (audioBlob: Blob) => {
    if (!selectedLanguage) {
      setLanguageError(true);
      toast({
        title: "Language Required",
        description: "Please select a language before recording audio.",
        variant: "destructive"
      });
      return;
    }
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
          {/* Navigation Bar */}
          <div className="flex justify-end items-center mb-8">
            <NavigationMenu />
          </div>

          <div className="flex flex-col items-center py-[46px]">
            {/* Logo and subtitle vertically stacked */}
            
            
            {/* Language selector only */}
            <div className="flex items-center">
              <LanguageSelector 
                selectedLanguage={selectedLanguage} 
                onLanguageChange={handleLanguageChange}
                hasError={languageError}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Voice Orb in its own centered row */}
        <div className="flex flex-col items-center mb-8 py-[34px]">
          <VoiceOrb 
            isListening={false} 
            isProcessing={false} 
            onStartListening={handleVoiceOrbClick} 
            onStopListening={() => console.log('Stop listening')} 
            onAudioRecorded={handleAudioRecorded}
            selectedLanguage={selectedLanguage}
          />
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
