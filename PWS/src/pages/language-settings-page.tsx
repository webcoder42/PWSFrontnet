import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiChevronDown,
  HiChevronUp,
  HiCheck,
  HiCheckCircle,
} from 'react-icons/hi';

import { clsx } from 'clsx';

import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import SettingsHeader from '../components/dashboard/settings/settingsHeader/settingsHeader';
import { useProviderPreferences } from '../hooks/useProviderPreferences';

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

const LanguageSettingsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [isAppLangOpen, setIsAppLangOpen] = useState(false);
  const appLangRef = useRef<HTMLDivElement>(null);

  const { rawUser, providerProfile, saveProfile } = useProviderPreferences();
  const [appLanguage, setAppLanguage] = useState('English');
  const [spokenLanguages, setSpokenLanguages] = useState<string[]>(['English']);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (appLangRef.current && !appLangRef.current.contains(event.target as Node)) {
        setIsAppLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSpokenLanguage = (langName: string) => {
    setSpokenLanguages(prev => {
      if (prev.includes(langName)) {
        return prev.filter(l => l !== langName);
      } else {
        return [...prev, langName];
      }
    });
  };

  useEffect(() => {
    if (typeof rawUser?.language === 'string' && rawUser.language.trim()) {
      setAppLanguage(rawUser.language);
    }
    const savedSpoken = providerProfile.spokenLanguages;
    if (Array.isArray(savedSpoken) && savedSpoken.length > 0) {
      setSpokenLanguages(savedSpoken.map((item) => String(item)));
    }
  }, [rawUser, providerProfile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProfile({
        language: appLanguage,
        providerProfile: {
          spokenLanguages,
        },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Could not save language settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-surface-alt font-dm overflow-hidden">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-8 lg:p-12 pb-16 sm:pb-24">
            <SettingsHeader
              title="Language & Communication"
              description="Choose the language you're most comfortable using in the app. Clients will also see which languages you can communicate in."
              breadcrumbs={[
                { label: 'Settings', to: '/settings' },
                { label: 'Preferences', to: '/settings/preferences' },
                { label: 'Language & Communication' }
              ]}
              backTo="/settings/preferences"
              backLabel="Back to Preferences"
            />

            <div className="space-y-8 sm:space-y-12">
              <div className="space-y-3 sm:space-y-4 relative" ref={appLangRef}>
                <label className="text-base font-bold text-gray-900 font-dm uppercase tracking-widest">App Language</label>
                <div
                  onClick={() => setIsAppLangOpen(!isAppLangOpen)}
                  className="w-full bg-white border border-gray-100 text-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center justify-between cursor-pointer shadow-sm hover:border-primary/20 duration-300"
                >
                  <span className="font-bold text-sm sm:text-base md:text-lg font-dm text-gray-700">{appLanguage}</span>
                  {isAppLangOpen ? <HiChevronUp className="size-5 sm:size-6 text-gray-400" /> : <HiChevronDown className="size-5 sm:size-6 text-gray-400" />}
                </div>

                {isAppLangOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100 overflow-y-auto max-h-[300px] z-50 animate-in slide-in-from-top-2 duration-300 no-scrollbar">
                    {LanguagesData.map((lang, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setAppLanguage(lang.name);
                          setIsAppLangOpen(false);
                        }}
                        className={clsx(
                          'flex items-center justify-between p-4 sm:p-5 cursor-pointer duration-300 hover:bg-primary/5',
                          appLanguage === lang.name ? 'bg-primary/5 text-primary' : 'text-gray-600'
                        )}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="text-lg sm:text-xl">{lang.flag}</span>
                          <span className="font-bold text-sm sm:text-base md:text-lg font-dm">{lang.name}</span>
                        </div>
                        {appLanguage === lang.name && <HiCheck className="size-5 sm:size-6" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-base font-bold text-gray-900 font-dm uppercase tracking-widest block">Languages you speak</label>
                  <p className="text-sm text-gray-400 font-medium font-dm mt-1">Add all languages you can communicate in with clients</p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
                  {LanguagesData.map((lang, index) => {
                    const isSelected = spokenLanguages.includes(lang.name);
                    return (
                      <div
                        key={lang.name}
                        onClick={() => toggleSpokenLanguage(lang.name)}
                        className={clsx(
                          "flex items-center justify-between p-4 sm:p-5 md:p-6 cursor-pointer duration-300 group",
                          index !== LanguagesData.length - 1 ? "border-b border-gray-50" : "",
                          isSelected ? "bg-primary/[0.02]" : "hover:bg-gray-50/50"
                        )}
                      >
                        <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                          <span className="text-lg sm:text-xl md:text-2xl">{lang.flag}</span>
                          <span className={clsx(
                            "font-bold text-sm sm:text-base md:text-lg font-dm duration-300",
                            isSelected ? "text-primary" : "text-gray-700 group-hover:text-gray-900"
                          )}>{lang.label || lang.name}</span>
                        </div>
                        <div className={clsx(
                          "size-5 sm:size-7 rounded-full flex items-center justify-center border-2 duration-300 shrink-0",
                          isSelected ? "border-primary bg-primary text-white" : "border-gray-200 group-hover:border-gray-300"
                        )}>
                          {isSelected && <HiCheck className="size-4 sm:size-5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={clsx(
                    "w-full bg-gradient-primary text-white py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]",
                    isSaving && "animate-pulse"
                  )}
                >
                  {isSaving ? 'Saving Changes...' : 'Save'}
                </button>

                {saveSuccess && (
                  <div className="flex items-center justify-center gap-2 text-green-600 animate-in fade-in slide-in-from-top-2 duration-500">
                    <HiCheckCircle className="size-5 sm:size-6" />
                    <span className="text-sm sm:text-base font-bold font-dm">Language settings updated successfully!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LanguageSettingsPage;
