import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  HiCheckCircle,
} from 'react-icons/hi';

import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import SettingsHeader from '../components/dashboard/settings/settingsHeader/settingsHeader';
import { useProviderPreferences } from '../hooks/useProviderPreferences';
import { getPreferenceCatalogAPI } from '../utils/api';

const EXPERTISE_OPTIONS = [
  "Alzheimer's Care",
  "Cancer Care",
  "Dementia Care",
  "Diabetes Care",
  "Elder Care",
  "Palliative Care",
  "Parkinson's Care",
  "Post-Surgery Care",
  "Senior Care",
  "Stroke Care"
];

const CareExpertisePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { providerProfile, saveProviderProfile } = useProviderPreferences();
  const [expertiseOptions, setExpertiseOptions] = useState<string[]>(EXPERTISE_OPTIONS);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleExpertise = (option: string) => {
    setSelectedExpertise(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  useEffect(() => {
    const saved = providerProfile.specializations;
    if (Array.isArray(saved)) {
      setSelectedExpertise(saved.map((item) => String(item)));
    }
  }, [providerProfile]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getPreferenceCatalogAPI();
        const fromDb = res?.data?.careExpertise;
        if (!cancelled && Array.isArray(fromDb)) {
          const cleaned = fromDb.map((x: any) => String(x).trim()).filter(Boolean);
          if (cleaned.length > 0) setExpertiseOptions(cleaned);
        }
      } catch {
        // keep fallback constants
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProviderProfile({ specializations: selectedExpertise });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Could not save care expertise. Please try again.');
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
          <div className="p-4 sm:p-8 lg:p-12 pb-24">


            <SettingsHeader
              title="Care Expertise"
              description="Please select all the types of care you are able to provide patients. Your expertise helps us match you with the most suitable families."
              breadcrumbs={[
                { label: 'Settings', to: '/settings' },
                { label: 'Preferences', to: '/settings/preferences' },
                { label: 'Care Expertise' }
              ]}
              backTo="/settings/preferences"
              backLabel="Back to Preferences"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mb-12 sm:mb-20">
              {expertiseOptions.map((option) => {
                const isSelected = selectedExpertise.includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => toggleExpertise(option)}
                    className={clsx(
                      "w-full py-4 sm:py-6 px-4 sm:px-8 rounded-xl sm:rounded-full border-2 font-bold font-dm text-center duration-300 text-sm sm:text-base md:text-lg",
                      isSelected
                        ? "bg-primary-extralight border-primary text-primary shadow-lg shadow-primary/5 scale-[1.02]"
                        : "bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600 hover:bg-gray-50/50"
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>


            <div className="sm:mx-0 space-y-6">
              <button
                onClick={handleSave}
                disabled={isSaving || saveSuccess}
                className={clsx(
                  "w-full py-4 sm:py-6 bg-gradient-primary text-white rounded-xl sm:rounded-5xl font-bold text-base sm:text-xl font-dm shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.01] duration-300 active:scale-95 flex items-center justify-center gap-3",
                  (isSaving || saveSuccess) && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSaving ? (
                  <div className="size-5 sm:size-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saveSuccess ? (
                  <HiCheckCircle className="size-6 sm:size-7" />
                ) : null}
                {isSaving ? 'Saving Changes...' : saveSuccess ? 'Changes Saved!' : 'Save Changes'}
              </button>

              {saveSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 sm:p-5 rounded-xl sm:rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <HiCheckCircle className="size-5 sm:size-6 text-emerald-500 shrink-0" />
                  <p className="text-emerald-700 text-xs sm:text-sm font-bold font-dm">Your expertise settings have been updated successfully.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CareExpertisePage;
