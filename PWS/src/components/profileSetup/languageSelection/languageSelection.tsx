import React, { useState, useRef, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiChevronDown, HiChevronUp, HiCheck } from 'react-icons/hi';
import type { ProfileFormData } from '../../../types/profile';
const LanguagesData = [
  { name: 'English', flag: '🇺🇸' },
  { name: 'Français', flag: '🇫🇷' },
  { name: 'Español', flag: '🇪🇸' },
  { name: 'Urdu', flag: '🇵🇰', label: '(Urdu) اردو' },
  { name: 'Hindi', flag: '🇮🇳', label: 'हिन्दी (Hindi)' },
  { name: 'Punjabi', flag: '🇮🇳' },
  { name: 'Chinese', flag: '🇨🇳', label: '中文 (Chinese)' },
  { name: 'Português', flag: '🇵🇹' }
];

interface LanguageItem {
  name: string;
  flag: string;
  label?: string;
}

interface LanguageSelectionProps {
  formData: ProfileFormData;
  setFormData: Dispatch<SetStateAction<ProfileFormData>>;
  isFamilyMember?: boolean;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ formData, setFormData, isFamilyMember }) => {
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

  const handleLanguageSelect = (lang: LanguageItem) => {
    setFormData({ ...formData, language: lang.name, languageFlag: lang.flag });
    setIsOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-900 font-playfair tracking-tight leading-tight">{isFamilyMember ? "Select Their Language" : "Select Your Language"}</h3>
        <p className="text-gray-400 font-medium text-lg leading-relaxed font-dm">Choose the language {isFamilyMember ? "they're" : "you're"} most comfortable with. This affects {isFamilyMember ? "their" : "your"} entire app experience.</p>
      </div>

      <div className="space-y-3 relative" ref={languageRef}>
        <label className="text-[11px] font-bold text-gray-900 uppercase tracking-widest ml-1 font-dm opacity-60">Language</label>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border-2 border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 flex items-center justify-between cursor-pointer hover:border-primary/20 duration-300 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <span className="text-lg">{formData.languageFlag}</span>
            <span className="font-bold text-gray-900 text-lg font-dm">{formData.language}</span>
          </div>
          {isOpen ? <HiChevronUp className="size-6 text-gray-400" /> : <HiChevronDown className="size-6 text-gray-400" />}
        </div>

        {isOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-xl md:rounded-2xl shadow-logs border border-gray-100 overflow-y-auto max-h-[300px] z-50 animate-in slide-in-from-top-4 duration-500 no-scrollbar">
            {LanguagesData.map((lang, i) => (
              <div
                key={i}
                onClick={() => handleLanguageSelect(lang)}
                className={clsx(
                  'flex items-center justify-between p-5 cursor-pointer duration-300 hover:bg-primary/5',
                  formData.language === lang.name ? 'bg-primary-extralight text-primary' : 'text-gray-600'
                )}
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-bold text-lg font-dm">{lang.label || lang.name}</span>
                </div>
                {formData.language === lang.name && <HiCheck className="size-5" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelection;
