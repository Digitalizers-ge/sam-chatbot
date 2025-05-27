
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'af-ZA', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'sq-AL', name: 'Albanian', flag: '🇦🇱' },
  { code: 'am-ET', name: 'Amharic', flag: '🇪🇹' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hy-AM', name: 'Armenian', flag: '🇦🇲' },
  { code: 'az-AZ', name: 'Azerbaijani', flag: '🇦🇿' },
  { code: 'bn-IN', name: 'Bengali', flag: '🇮🇳' },
  { code: 'bs-BA', name: 'Bosnian', flag: '🇧🇦' },
  { code: 'bg-BG', name: 'Bulgarian', flag: '🇧🇬' },
  { code: 'ca-ES', name: 'Catalan', flag: '🇪🇸' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', flag: '🇹🇼' },
  { code: 'hr-HR', name: 'Croatian', flag: '🇭🇷' },
  { code: 'cs-CZ', name: 'Czech', flag: '🇨🇿' },
  { code: 'da-DK', name: 'Danish', flag: '🇩🇰' },
  { code: 'fa-AF', name: 'Dari', flag: '🇦🇫' },
  { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'et-EE', name: 'Estonian', flag: '🇪🇪' },
  { code: 'fa-IR', name: 'Farsi (Persian)', flag: '🇮🇷' },
  { code: 'tl-PH', name: 'Filipino, Tagalog', flag: '🇵🇭' },
  { code: 'fi-FI', name: 'Finnish', flag: '🇫🇮' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'fr-CA', name: 'French (Canada)', flag: '🇨🇦' },
  { code: 'ka-GE', name: 'Georgian', flag: '🇬🇪' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'el-GR', name: 'Greek', flag: '🇬🇷' },
  { code: 'gu-IN', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'ht-HT', name: 'Haitian Creole', flag: '🇭🇹' },
  { code: 'ha-NG', name: 'Hausa', flag: '🇳🇬' },
  { code: 'he-IL', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'hu-HU', name: 'Hungarian', flag: '🇭🇺' },
  { code: 'is-IS', name: 'Icelandic', flag: '🇮🇸' },
  { code: 'id-ID', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'ga-IE', name: 'Irish', flag: '🇮🇪' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'kn-IN', name: 'Kannada', flag: '🇮🇳' },
  { code: 'kk-KZ', name: 'Kazakh', flag: '🇰🇿' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { code: 'lv-LV', name: 'Latvian', flag: '🇱🇻' },
  { code: 'lt-LT', name: 'Lithuanian', flag: '🇱🇹' },
  { code: 'mk-MK', name: 'Macedonian', flag: '🇲🇰' },
  { code: 'ms-MY', name: 'Malay', flag: '🇲🇾' },
  { code: 'ml-IN', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'mt-MT', name: 'Maltese', flag: '🇲🇹' },
  { code: 'mr-IN', name: 'Marathi', flag: '🇮🇳' },
  { code: 'mn-MN', name: 'Mongolian', flag: '🇲🇳' },
  { code: 'no-NO', name: 'Norwegian (Bokmål)', flag: '🇳🇴' },
  { code: 'ps-AF', name: 'Pashto', flag: '🇦🇫' },
  { code: 'pl-PL', name: 'Polish', flag: '🇵🇱' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', flag: '🇵🇹' },
  { code: 'pa-IN', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'ro-RO', name: 'Romanian', flag: '🇷🇴' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
  { code: 'sr-RS', name: 'Serbian', flag: '🇷🇸' },
  { code: 'si-LK', name: 'Sinhala', flag: '🇱🇰' },
  { code: 'sk-SK', name: 'Slovak', flag: '🇸🇰' },
  { code: 'sl-SI', name: 'Slovenian', flag: '🇸🇮' },
  { code: 'so-SO', name: 'Somali', flag: '🇸🇴' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'es-MX', name: 'Spanish (Mexico)', flag: '🇲🇽' },
  { code: 'sw-KE', name: 'Swahili', flag: '🇰🇪' },
  { code: 'sv-SE', name: 'Swedish', flag: '🇸🇪' },
  { code: 'ta-IN', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', flag: '🇮🇳' },
  { code: 'th-TH', name: 'Thai', flag: '🇹🇭' },
  { code: 'tr-TR', name: 'Turkish', flag: '🇹🇷' },
  { code: 'uk-UA', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'ur-PK', name: 'Urdu', flag: '🇵🇰' },
  { code: 'uz-UZ', name: 'Uzbek', flag: '🇺🇿' },
  { code: 'vi-VN', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'cy-GB', name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
}

export const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages.find(lang => lang.code === 'en-US') || languages[0];

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
        <div className="absolute top-14 left-0 sam-glass rounded-2xl p-2 shadow-xl z-50 max-h-80 overflow-y-auto animate-fade-in w-max min-w-full max-w-xs">
          <div className="grid grid-cols-1 gap-1">
            {languages.map((language) => (
              <Button
                key={language.code}
                variant="ghost"
                onClick={() => {
                  onLanguageChange(language.code);
                  setIsOpen(false);
                }}
                className={`justify-start h-12 rounded-xl transition-all duration-200 whitespace-nowrap ${
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
