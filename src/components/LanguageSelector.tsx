
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
}

export const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="sam-glass rounded-full px-4 py-2 h-12 min-w-[120px] hover:bg-white/90 transition-all duration-300"
      >
        <span className="text-2xl mr-2">{selectedLang.flag}</span>
        <span className="font-medium text-gray-700">{selectedLang.name}</span>
      </Button>
      
      {isOpen && (
        <div className="absolute top-14 left-0 right-0 sam-glass rounded-2xl p-2 shadow-xl z-50 max-h-80 overflow-y-auto animate-fade-in">
          <div className="grid grid-cols-1 gap-1">
            {languages.map((language) => (
              <Button
                key={language.code}
                variant="ghost"
                onClick={() => {
                  onLanguageChange(language.code);
                  setIsOpen(false);
                }}
                className={`justify-start h-12 rounded-xl transition-all duration-200 ${
                  selectedLanguage === language.code 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'hover:bg-white/70'
                }`}
              >
                <span className="text-2xl mr-3">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
