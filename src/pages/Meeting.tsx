import { useState } from 'react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { VoiceOrb } from '@/components/VoiceOrb';
import { ConversationBox } from '@/components/ConversationBox';
import { MeetingMinutes } from '@/components/MeetingMinutes';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  speaker?: 'user1' | 'user2';
  originalLanguage?: string;
  translatedText?: string;
}

const Meeting = () => {
  const [user1Language, setUser1Language] = useState('');
  const [user2Language, setUser2Language] = useState('');
  const [user1LanguageError, setUser1LanguageError] = useState(false);
  const [user2LanguageError, setUser2LanguageError] = useState(false);
  const [recordedAudio1, setRecordedAudio1] = useState<Blob | null>(null);
  const [recordedAudio2, setRecordedAudio2] = useState<Blob | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      window.location.href = 'https://sam-bot.site/admin';
    }
  };

  const speakText = async (text: string, language: string = 'en') => {
    try {
      console.log('Sending text to Amazon Polly:', text);
      
      const response = await fetch('https://z1eznxs6nb.execute-api.eu-north-1.amazonaws.com/prod/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          lang: language
        })
      });

      if (!response.ok) {
        throw new Error(`Polly API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Polly API response:', result);

      if (result.audio_url) {
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

  const handleUser1VoiceOrbClick = () => {
    if (!user1Language) {
      setUser1LanguageError(true);
      toast({
        title: "Language Required",
        description: "Please select User 1's language before using the microphone.",
        variant: "destructive"
      });
      setTimeout(() => setUser1LanguageError(false), 3000);
      return;
    }
    setUser1LanguageError(false);
    console.log('User 1 voice orb clicked with language:', user1Language);
  };

  const handleUser2VoiceOrbClick = () => {
    if (!user2Language) {
      setUser2LanguageError(true);
      toast({
        title: "Language Required",
        description: "Please select User 2's language before using the microphone.",
        variant: "destructive"
      });
      setTimeout(() => setUser2LanguageError(false), 3000);
      return;
    }
    setUser2LanguageError(false);
    console.log('User 2 voice orb clicked with language:', user2Language);
  };

  const handleUser1LanguageChange = (languageCode: string) => {
    setUser1Language(languageCode);
    setUser1LanguageError(false);
  };

  const handleUser2LanguageChange = (languageCode: string) => {
    setUser2Language(languageCode);
    setUser2LanguageError(false);
  };

  const handleUser1AudioRecorded = (audioBlob: Blob) => {
    if (!user1Language) {
      setUser1LanguageError(true);
      toast({
        title: "Language Required",
        description: "Please select User 1's language before recording audio.",
        variant: "destructive"
      });
      return;
    }
    setRecordedAudio1(audioBlob);
    console.log('User 1 audio recorded:', audioBlob);
  };

  const handleUser2AudioRecorded = (audioBlob: Blob) => {
    if (!user2Language) {
      setUser2LanguageError(true);
      toast({
        title: "Language Required",
        description: "Please select User 2's language before recording audio.",
        variant: "destructive"
      });
      return;
    }
    setRecordedAudio2(audioBlob);
    console.log('User 2 audio recorded:', audioBlob);
  };

  const handleUser1AudioProcessed = (originalText: string, translatedText: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text: translatedText,
      isUser: true,
      timestamp: new Date(),
      speaker: 'user1',
      originalLanguage: user1Language,
      translatedText: translatedText
    };
    setMessages(prev => [...prev, message]);
  };

  const handleUser2AudioProcessed = (originalText: string, translatedText: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text: translatedText,
      isUser: true,
      timestamp: new Date(),
      speaker: 'user2',
      originalLanguage: user2Language,
      translatedText: translatedText
    };
    setMessages(prev => [...prev, message]);
  };

  const handleAddMessage = (text: string, speaker: 'user1' | 'user2') => {
    const message: Message = {
      id: Date.now().toString(),
      text: text,
      isUser: true,
      timestamp: new Date(),
      speaker: speaker,
      originalLanguage: speaker === 'user1' ? user1Language : user2Language,
      translatedText: text
    };
    setMessages(prev => [...prev, message]);
  };

  return (
    <div className="min-h-screen sam-gradient-bg">
      {/* Header */}
      <div className="w-full px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={handleBackClick}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          <div className="flex flex-col items-center py-[46px]">
            <div className="flex flex-col items-center mb-6">
              <img src="/lovable-uploads/22846939-a307-4be2-b1d0-39a60a6cf0de.png" alt="SAM Logo" className="h-36 w-auto mb-2" />
              <p className="text-lg text-gray-600 text-center">Professional Meeting Translation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Language selectors and Voice Orbs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User 1 Section */}
          <div className="flex flex-col items-center py-[34px]">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">User 1</h3>
            <div className="mb-4">
              <LanguageSelector 
                selectedLanguage={user1Language} 
                onLanguageChange={handleUser1LanguageChange}
                hasError={user1LanguageError}
              />
            </div>
            <VoiceOrb 
              isListening={false} 
              isProcessing={false} 
              onStartListening={handleUser1VoiceOrbClick} 
              onStopListening={() => console.log('User 1 stop listening')} 
              onAudioRecorded={handleUser1AudioRecorded}
              selectedLanguage={user1Language}
            />
            <AudioPlayer 
              audioBlob={recordedAudio1} 
              onAudioProcessed={handleUser1AudioProcessed} 
              selectedLanguage={user1Language} 
            />
          </div>

          {/* User 2 Section */}
          <div className="flex flex-col items-center py-[34px]">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">User 2</h3>
            <div className="mb-4">
              <LanguageSelector 
                selectedLanguage={user2Language} 
                onLanguageChange={handleUser2LanguageChange}
                hasError={user2LanguageError}
              />
            </div>
            <VoiceOrb 
              isListening={false} 
              isProcessing={false} 
              onStartListening={handleUser2VoiceOrbClick} 
              onStopListening={() => console.log('User 2 stop listening')} 
              onAudioRecorded={handleUser2AudioRecorded}
              selectedLanguage={user2Language}
            />
            <AudioPlayer 
              audioBlob={recordedAudio2} 
              onAudioProcessed={handleUser2AudioProcessed} 
              selectedLanguage={user2Language} 
            />
          </div>
        </div>
        
        {/* Conversation and Meeting Minutes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-400px)]">
          {/* Conversation Box */}
          <div className="lg:col-span-2 h-full">
            <ConversationBox 
              messages={messages} 
              onSpeak={speakText}
              onAddMessage={handleAddMessage}
            />
          </div>

          {/* Meeting Minutes */}
          <div className="lg:col-span-1 h-full">
            <MeetingMinutes messages={messages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meeting;
