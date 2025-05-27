
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'ab-GE', name: 'Abkhaz', flag: '🇬🇪' },
  { code: 'af-ZA', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'ar-AE', name: 'Arabic, Gulf', flag: '🇦🇪' },
  { code: 'ar-SA', name: 'Arabic, Modern Standard', flag: '🇸🇦' },
  { code: 'hy-AM', name: 'Armenian', flag: '🇦🇲' },
  { code: 'ast-ES', name: 'Asturian', flag: '🇪🇸' },
  { code: 'az-AZ', name: 'Azerbaijani', flag: '🇦🇿' },
  { code: 'ba-RU', name: 'Bashkir', flag: '🇷🇺' },
  { code: 'eu-ES', name: 'Basque', flag: '🇪🇸' },
  { code: 'be-BY', name: 'Belarusian', flag: '🇧🇾' },
  { code: 'bn-IN', name: 'Bengali', flag: '🇮🇳' },
  { code: 'bs-BA', name: 'Bosnian', flag: '🇧🇦' },
  { code: 'bg-BG', name: 'Bulgarian', flag: '🇧🇬' },
  { code: 'ca-ES', name: 'Catalan', flag: '🇪🇸' },
  { code: 'ckb-IR', name: 'Central Kurdish (Iran)', flag: '🇮🇷' },
  { code: 'ckb-IQ', name: 'Central Kurdish (Iraq)', flag: '🇮🇶' },
  { code: 'yue-HK', name: 'Chinese, Cantonese', flag: '🇭🇰' },
  { code: 'zh-CN', name: 'Chinese, Simplified', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese, Traditional', flag: '🇹🇼' },
  { code: 'hr-HR', name: 'Croatian', flag: '🇭🇷' },
  { code: 'cs-CZ', name: 'Czech', flag: '🇨🇿' },
  { code: 'da-DK', name: 'Danish', flag: '🇩🇰' },
  { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱' },
  { code: 'en-AU', name: 'English, Australian', flag: '🇦🇺' },
  { code: 'en-GB', name: 'English, British', flag: '🇬🇧' },
  { code: 'en-IN', name: 'English, Indian', flag: '🇮🇳' },
  { code: 'en-IE', name: 'English, Irish', flag: '🇮🇪' },
  { code: 'en-NZ', name: 'English, New Zealand', flag: '🇳🇿' },
  { code: 'en-AB', name: 'English, Scottish', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'en-ZA', name: 'English, South African', flag: '🇿🇦' },
  { code: 'en-US', name: 'English, US', flag: '🇺🇸' },
  { code: 'en-WL', name: 'English, Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'et-ET', name: 'Estonian', flag: '🇪🇪' },
  { code: 'fa-IR', name: 'Farsi', flag: '🇮🇷' },
  { code: 'fi-FI', name: 'Finnish', flag: '🇫🇮' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'fr-CA', name: 'French, Canadian', flag: '🇨🇦' },
  { code: 'gl-ES', name: 'Galician', flag: '🇪🇸' },
  { code: 'ka-GE', name: 'Georgian', flag: '🇬🇪' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'de-CH', name: 'German, Swiss', flag: '🇨🇭' },
  { code: 'el-GR', name: 'Greek', flag: '🇬🇷' },
  { code: 'gu-IN', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'ha-NG', name: 'Hausa', flag: '🇳🇬' },
  { code: 'he-IL', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'hu-HU', name: 'Hungarian', flag: '🇭🇺' },
  { code: 'is-IS', name: 'Icelandic', flag: '🇮🇸' },
  { code: 'id-ID', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'kab-DZ', name: 'Kabyle', flag: '🇩🇿' },
  { code: 'kn-IN', name: 'Kannada', flag: '🇮🇳' },
  { code: 'kk-KZ', name: 'Kazakh', flag: '🇰🇿' },
  { code: 'rw-RW', name: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { code: 'ky-KG', name: 'Kyrgyz', flag: '🇰🇬' },
  { code: 'lv-LV', name: 'Latvian', flag: '🇱🇻' },
  { code: 'lt-LT', name: 'Lithuanian', flag: '🇱🇹' },
  { code: 'lg-IN', name: 'Luganda', flag: '🇮🇳' },
  { code: 'mk-MK', name: 'Macedonian', flag: '🇲🇰' },
  { code: 'ms-MY', name: 'Malay', flag: '🇲🇾' },
  { code: 'ml-IN', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'mt-MT', name: 'Maltese', flag: '🇲🇹' },
  { code: 'mr-IN', name: 'Marathi', flag: '🇮🇳' },
  { code: 'mhr-RU', name: 'Meadow Mari', flag: '🇷🇺' },
  { code: 'mn-MN', name: 'Mongolian', flag: '🇲🇳' },
  { code: 'no-NO', name: 'Norwegian Bokmål', flag: '🇳🇴' },
  { code: 'or-IN', name: 'Odia (Oriya)', flag: '🇮🇳' },
  { code: 'ps-AF', name: 'Pashto', flag: '🇦🇫' },
  { code: 'pl-PL', name: 'Polish', flag: '🇵🇱' },
  { code: 'pt-PT', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'pt-BR', name: 'Portuguese, Brazilian', flag: '🇧🇷' },
  { code: 'pa-IN', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'ro-RO', name: 'Romanian', flag: '🇷🇴' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
  { code: 'sr-RS', name: 'Serbian', flag: '🇷🇸' },
  { code: 'si-LK', name: 'Sinhala', flag: '🇱🇰' },
  { code: 'sk-SK', name: 'Slovak', flag: '🇸🇰' },
  { code: 'sl-SI', name: 'Slovenian', flag: '🇸🇮' },
  { code: 'so-SO', name: 'Somali', flag: '🇸🇴' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'es-US', name: 'Spanish, US', flag: '🇺🇸' },
  { code: 'su-ID', name: 'Sundanese', flag: '🇮🇩' },
  { code: 'sw-KE', name: 'Swahili, Kenya', flag: '🇰🇪' },
  { code: 'sw-BI', name: 'Swahili, Burundi', flag: '🇧🇮' },
  { code: 'sw-RW', name: 'Swahili, Rwanda', flag: '🇷🇼' },
  { code: 'sw-TZ', name: 'Swahili, Tanzania', flag: '🇹🇿' },
  { code: 'sw-UG', name: 'Swahili, Uganda', flag: '🇺🇬' },
  { code: 'sv-SE', name: 'Swedish', flag: '🇸🇪' },
  { code: 'tl-PH', name: 'Tagalog (Filipino)', flag: '🇵🇭' },
  { code: 'ta-IN', name: 'Tamil', flag: '🇮🇳' },
  { code: 'tt-RU', name: 'Tatar', flag: '🇷🇺' },
  { code: 'te-IN', name: 'Telugu', flag: '🇮🇳' },
  { code: 'th-TH', name: 'Thai', flag: '🇹🇭' },
  { code: 'tr-TR', name: 'Turkish', flag: '🇹🇷' },
  { code: 'uk-UA', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'ug-CN', name: 'Uyghur', flag: '🇨🇳' },
  { code: 'uz-UZ', name: 'Uzbek', flag: '🇺🇿' },
  { code: 'vi-VN', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'cy-WL', name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'wo-SN', name: 'Wolof', flag: '🇸🇳' },
  { code: 'zu-ZA', name: 'Zulu', flag: '🇿🇦' },
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
