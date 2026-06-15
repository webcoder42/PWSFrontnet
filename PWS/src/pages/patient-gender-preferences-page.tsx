import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiChevronRight, HiCheckCircle, HiArrowLeft } from 'react-icons/hi';
import { clsx } from 'clsx';

import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import SettingsHeader from '../components/dashboard/settings/settingsHeader/settingsHeader';
import {
  mapGenderPreferenceFromUi,
  mapGenderPreferenceToUi,
  useProviderPreferences,
} from '../hooks/useProviderPreferences';

const GENDER_OPTIONS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'no-preference', label: 'No Preference' }
];

const PatientGenderPreferencesPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { providerProfile, saveProviderProfile } = useProviderPreferences();
  const [selectedGender, setSelectedGender] = useState('no-preference');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setSelectedGender(mapGenderPreferenceToUi(providerProfile.patientGenderPreference));
  }, [providerProfile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProviderProfile({
        patientGenderPreference: mapGenderPreferenceFromUi(selectedGender),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Could not save gender preference. Please try again.');
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
              title="Patient Gender Preferences"
              description="Please choose your preferred patient gender to ensure a comfortable and respectful caregiving experience."
              breadcrumbs={[
                { label: 'Settings', to: '/settings' },
                { label: 'Preferences', to: '/settings/preferences' },
                { label: 'Patient Gender Preferences' }
              ]}
              backTo="/settings/preferences"
              backLabel="Back to Preferences"
            />

            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8 sm:mb-12 lg:mb-14">
              {GENDER_OPTIONS.map((option, idx) => {
                const isSelected = selectedGender === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedGender(option.id)}
                    className={clsx(
                      "w-full flex items-center justify-between p-5 sm:p-7 md:p-8 hover:bg-gray-50/80 duration-300 group",
                      idx !== GENDER_OPTIONS.length - 1 && "border-b border-gray-50"
                    )}
                  >
                    <span className={clsx(
                      "text-sm sm:text-base md:text-lg font-bold font-dm duration-300",
                      isSelected ? "text-primary" : "text-gray-700 group-hover:text-gray-900"
                    )}>
                      {option.label}
                    </span>
                    <div className={clsx(
                      "size-5 sm:size-6 md:size-7 rounded-full border-2 flex items-center justify-center duration-300",
                      isSelected ? "border-primary bg-primary" : "border-gray-200 group-hover:border-gray-300"
                    )}>
                      {isSelected && <div className="size-2 sm:size-2.5 md:size-3 rounded-full bg-white shadow-sm" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-4 sm:space-y-6">
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
                  <span className="text-sm sm:text-base font-bold font-dm">Preferences updated successfully!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientGenderPreferencesPage;
