import React, { useState, useRef, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiChevronDown, HiChevronUp, HiCheck, HiCheckCircle } from 'react-icons/hi';
import type { ProviderProfileFormData } from '../../../types/profile';

const LanguagesData = [
  { name: 'English', flag: '🇬🇧' },
  { name: 'Français', flag: '🇫🇷' },
  { name: 'Español', flag: '🇪🇸' },
  { name: 'Punjabi', flag: '🇮🇳' },
  { name: 'Hindi', flag: '🇮🇳', label: 'हिन्दी Hindi' },
  { name: 'Urdu', flag: '🇵🇰', label: 'اردو Urdu' },
  { name: 'Chinese', flag: '🇨🇳', label: '中文 Chinese' },
  { name: 'Português', flag: '🇵🇹' }
];

interface LanguageItem {
  name: string;
  flag: string;
  label?: string;
}

interface ProviderLanguageSelectionProps {
  formData: ProviderProfileFormData;
  setFormData: Dispatch<SetStateAction<ProviderProfileFormData>>;
}

const ProviderLanguageSelection: React.FC<ProviderLanguageSelectionProps> = ({ formData, setFormData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAppLanguageSelect = (lang: LanguageItem) => {
    setFormData({ ...formData, appLanguage: lang.name });
    setIsOpen(false);
  };

  const toggleSpokenLanguage = (langName: string) => {
    setFormData(prev => {
      const isSelected = prev.spokenLanguages.includes(langName);
      if (isSelected) {
        return { ...prev, spokenLanguages: prev.spokenLanguages.filter(l => l !== langName) };
      } else {
        return { ...prev, spokenLanguages: [...prev.spokenLanguages, langName] };
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl md:text-[28px] font-bold text-gray-900 font-playfair tracking-tight leading-tight">Select your language</h3>
        <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed font-dm">Choose the language you're most comfortable using in the app. Clients will also see which languages you can communicate in.</p>
      </div>

      <div className="space-y-2 relative" ref={languageRef}>
        <label className="text-[11px] sm:text-[13px] font-bold text-gray-900 font-dm">App language</label>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-primary text-gray-900 rounded-xl md:rounded-2xl p-3 sm:p-4 flex items-center justify-between cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="font-medium text-sm sm:text-base font-dm">{formData.appLanguage}</span>
          </div>
          {isOpen ? <HiChevronUp className="size-5 sm:size-6 text-gray-400" /> : <HiChevronDown className="size-5 sm:size-6 text-gray-400" />}
        </div>

        {isOpen && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-xl md:rounded-2xl shadow-logs border border-gray-100 overflow-y-auto max-h-[250px] z-50 animate-in slide-in-from-top-2 duration-300 no-scrollbar">
            {LanguagesData.map((lang, i) => (
              <div
                key={i}
                onClick={() => handleAppLanguageSelect(lang)}
                className={clsx(
                  'flex items-center justify-between p-3 sm:p-4 cursor-pointer duration-200 hover:bg-primary/5',
                  formData.appLanguage === lang.name ? 'bg-primary-extralight text-primary' : 'text-gray-600'
                )}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-base sm:text-lg">{lang.flag}</span>
                  <span className="font-medium text-sm sm:text-base font-dm">{lang.name}</span>
                </div>
                {formData.appLanguage === lang.name && <HiCheck className="size-4 sm:size-5" />}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2 pt-2">
        <div>
          <label className="text-[11px] sm:text-[13px] font-bold text-gray-900 font-dm block">Languages you speak</label>
          <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium font-dm block mt-0.5">Add all languages you can communicate in with clients</span>
        </div>
        
        <div className="border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden mt-3">
          {LanguagesData.map((lang, index) => {
            const isSelected = formData.spokenLanguages.includes(lang.name);
            return (
              <div
                key={lang.name}
                onClick={() => toggleSpokenLanguage(lang.name)}
                className={clsx(
                  "flex items-center justify-between p-3 sm:p-4 cursor-pointer duration-200",
                  index !== LanguagesData.length - 1 ? "border-b border-gray-100" : "",
                  isSelected ? "bg-surface-pure" : "bg-white hover:bg-gray-50/50"
                )}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-base sm:text-lg">{lang.flag}</span>
                  <span className="font-medium text-sm sm:text-[15px] text-gray-900 font-dm">{lang.label || lang.name}</span>
                </div>
                <div className={clsx(
                  "size-5 sm:size-6 rounded-full flex items-center justify-center border duration-200 shrink-0",
                  isSelected ? "border-primary text-primary" : "border-gray-300"
                )}>
                  {isSelected && <HiCheckCircle className="size-full text-primary" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProviderLanguageSelection;
