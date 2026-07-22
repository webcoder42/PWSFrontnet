import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { HiChevronRight, HiCheckCircle, HiOutlineCheck, HiArrowLeft } from 'react-icons/hi';
import {
  MdOutlineBathtub,
  MdOutlineVolunteerActivism,
  MdOutlineCheckroom,
  MdOutlineDirectionsRun,
  MdOutlineMedicalServices,
  MdOutlineContentCut,
  MdOutlineHomeWork,
  MdOutlineRestaurant,
  MdOutlineDirectionsCar
} from 'react-icons/md';

import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import SettingsHeader from '../components/dashboard/settings/settingsHeader/settingsHeader';
import { useProviderPreferences } from '../hooks/useProviderPreferences';
import { getPreferenceCatalogAPI } from '../utils/api';

const CARE_SERVICES = [
  { id: 'respite-care', label: 'Respite Care', icon: MdOutlineMedicalServices },
  { id: 'laundry', label: 'Laundry', icon: MdOutlineHomeWork },
  { id: 'light-housekeeping', label: 'Light Housekeeping', icon: MdOutlineHomeWork },
  { id: 'companionship', label: 'Companionship', icon: MdOutlineVolunteerActivism },
  { id: 'transportation', label: 'Transportation Services', icon: MdOutlineDirectionsCar },
  { id: 'mobility-rehab', label: 'Mobility / Rehabilitation Exercises', icon: MdOutlineDirectionsRun },
];

const normalizeKey = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, ' ');

const LEGACY_SERVICE_KEY_TO_ID: Record<string, string> = {
  bathing: 'respite-care',
  dressing: 'respite-care',
  exercise: 'mobility-rehab',
  general: 'respite-care',
  hygiene: 'respite-care',
  housekeeping: 'light-housekeeping',
  meal: 'laundry',
  companion: 'companionship',
  transport: 'transportation',
  'bath ing & toileting': 'respite-care',
  'bathing & toileting': 'respite-care',
  'general care': 'respite-care',
  'hygiene & grooming': 'respite-care',
  'meal preparation': 'laundry',
  'light housekeeping': 'light-housekeeping',
  'transportation services': 'transportation',
  'mobility / rehabilitation exercises': 'mobility-rehab',
};

const resolveServiceId = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const exactMatch = CARE_SERVICES.find((service) => service.id === trimmed);
  if (exactMatch) return exactMatch.id;

  const normalized = normalizeKey(trimmed);
  const labelMatch = CARE_SERVICES.find(
    (service) => normalizeKey(service.label) === normalized,
  );
  if (labelMatch) return labelMatch.id;

  return LEGACY_SERVICE_KEY_TO_ID[normalized] || null;
};

const CareServicesPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { providerProfile, saveProviderProfile } = useProviderPreferences();
  const [serviceOptions, setServiceOptions] = useState(CARE_SERVICES);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    const saved = providerProfile.servicesProvided;
    if (Array.isArray(saved)) {
      const normalized = saved
        .map((item) => resolveServiceId(item))
        .filter((item): item is string => Boolean(item));
      setSelectedServices(Array.from(new Set(normalized)));
    }
  }, [providerProfile]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getPreferenceCatalogAPI();
        const fromDb = res?.data?.careServices;
        if (!cancelled && Array.isArray(fromDb)) {
          const mapped = fromDb
            .map((item: any) => ({
              id: String(item?.id || '').trim(),
              label: String(item?.label || '').trim(),
              icon: CARE_SERVICES.find((s) => s.id === String(item?.id || '').trim())?.icon || MdOutlineMedicalServices,
            }))
            .filter((item) => item.id && item.label);
          if (mapped.length > 0) setServiceOptions(mapped);
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
      await saveProviderProfile({ servicesProvided: selectedServices });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Could not save care services. Please try again.');
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
              title="Care Services"
              description="Please select all the specific type of care needs you provide."
              breadcrumbs={[
                { label: 'Settings', to: '/settings' },
                { label: 'Preferences', to: '/settings/preferences' },
                { label: 'Care Services' }
              ]}
              backTo="/settings/preferences"
              backLabel="Back to Preferences"
            />


            <div className="space-y-2.5 sm:space-y-3 md:space-y-4 mb-10 sm:mb-16">
              {serviceOptions.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={clsx(
                      "w-full group bg-white p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-2 duration-300 flex items-center justify-between outline-none focus:outline-none",
                      isSelected
                        ? "border-primary bg-primary-extralight/30 shadow-md shadow-primary/5"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                    )}
                  >
                    <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                      <div className={clsx(
                        "size-9 sm:size-11 md:size-14 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 duration-300",
                        isSelected ? "bg-white text-primary shadow-sm" : "bg-gray-50 text-gray-400"
                      )}>
                        <service.icon className="size-5 sm:size-6 md:size-8" />
                      </div>
                      <span className={clsx(
                        "text-sm sm:text-base md:text-lg font-bold font-dm duration-300 text-left truncate",
                        isSelected ? "text-primary" : "text-gray-700"
                      )}>
                        {service.label}
                      </span>
                    </div>
                    <div className={clsx(
                      "size-5 sm:size-6 md:size-7 rounded-md sm:rounded-lg border-2 flex items-center justify-center duration-300 shrink-0 ml-3",
                      isSelected
                        ? "bg-primary border-primary text-white scale-100"
                        : "bg-white border-gray-200 scale-90 opacity-40"
                    )}>
                      {isSelected && <HiOutlineCheck className="size-3 sm:size-4 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>


            <div className="space-y-4 sm:space-y-6">
              <button
                onClick={handleSave}
                disabled={isSaving || saveSuccess}
                className={clsx(
                  "w-full py-4 sm:py-5 md:py-6 bg-gradient-primary text-white rounded-xl sm:rounded-full font-bold text-sm sm:text-base md:text-xl font-dm shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.01] duration-300 active:scale-95 flex items-center justify-center gap-2 sm:gap-3",
                  (isSaving || saveSuccess) && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSaving ? (
                  <div className="size-4 sm:size-5 md:size-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saveSuccess ? (
                  <HiCheckCircle className="size-5 sm:size-6 md:size-7" />
                ) : null}
                <span>{isSaving ? 'Saving Changes...' : saveSuccess ? 'Changes Saved!' : 'Save Changes'}</span>
              </button>

              {saveSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                  <HiCheckCircle className="size-4 sm:size-5 md:size-6 text-emerald-500 shrink-0" />
                  <p className="text-emerald-700 text-[11px] sm:text-sm font-bold font-dm">Your care services have been updated successfully.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CareServicesPage;
