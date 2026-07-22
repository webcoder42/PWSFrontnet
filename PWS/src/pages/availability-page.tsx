import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  HiCheck,
  HiOutlineMinus,
  HiOutlineChevronDown,
  HiCheckCircle,
} from 'react-icons/hi';

import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import SettingsHeader from '../components/dashboard/settings/settingsHeader/settingsHeader';
import { useUser } from '../context/UserContext';
import { getUserProfileAPI, updateUserProfileAPI } from '../utils/api';

const DaysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TimeBlocks = [
  { id: 'Morning', time: '6am–12pm' },
  { id: 'Afternoon', time: '12pm–6pm' },
  { id: 'Evening', time: '6pm–12am' }
];

interface BookingSettingsState {
  minimumNoticeHours: number;
  maxBookingAdvanceDays: number;
  autoConfirm: boolean;
}

const defaultAvailability: Record<string, Record<string, boolean>> = {
  Monday: { Morning: true, Afternoon: true, status: true },
  Tuesday: { Morning: true, Afternoon: true, status: true },
  Wednesday: { Morning: true, Afternoon: true, status: true },
  Thursday: { Morning: true, Afternoon: true, status: true },
  Friday: { Morning: true, status: true },
  Saturday: { status: false },
  Sunday: { status: false },
};

const backendDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const slotIds = TimeBlocks.map((block) => block.id);

const toTitleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const formatNoticeLabel = (hours: number) => `${hours} hours${hours === 24 ? ' (Recommended)' : ''}`;
const parseNoticeLabelToHours = (value: string) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 24 : parsed;
};

const mapBackendToUiAvailability = (backendAvailability: any) => {
  const mapped: Record<string, Record<string, boolean>> = { ...defaultAvailability };

  backendDays.forEach((dayKey) => {
    const dayName = toTitleCase(dayKey);
    const slots = Array.isArray(backendAvailability?.[dayKey]) ? backendAvailability[dayKey] : [];
    const normalizedSlots = new Set(slots.map((slot: string) => String(slot).trim()));
    const hasAnySlot = slotIds.some((slotId) => normalizedSlots.has(slotId));

    mapped[dayName] = {
      Morning: normalizedSlots.has('Morning'),
      Afternoon: normalizedSlots.has('Afternoon'),
      Evening: normalizedSlots.has('Evening'),
      status: hasAnySlot
    };
  });

  return mapped;
};

const mapUiToBackendAvailability = (uiAvailability: Record<string, Record<string, boolean>>) => {
  const payload: Record<string, string[]> = {};

  backendDays.forEach((dayKey) => {
    const dayName = toTitleCase(dayKey);
    const dayData = uiAvailability[dayName] || {};
    if (!dayData.status) {
      payload[dayKey] = [];
      return;
    }
    payload[dayKey] = slotIds.filter((slotId) => !!dayData[slotId]);
  });

  return payload;
};

const AvailabilityPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { rawUser, setUser } = useUser();
  const [isRecurring, setIsRecurring] = useState(true);
  const [bookingSettings, setBookingSettings] = useState<BookingSettingsState>({
    minimumNoticeHours: 24,
    maxBookingAdvanceDays: 30,
    autoConfirm: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [minNotice, setMinNotice] = useState(formatNoticeLabel(24));

  const [availability, setAvailability] = useState<Record<string, Record<string, boolean>>>(defaultAvailability);

  const applyProviderProfile = useCallback((providerProfile: any) => {
    const providerAvailability = providerProfile?.availability;
    if (providerAvailability && typeof providerAvailability === 'object') {
      setAvailability(mapBackendToUiAvailability(providerAvailability));
    }

    const settings = providerProfile?.bookingSettings || {};
    const minimumNoticeHours = Number(settings.minimumNoticeHours);
    const maxBookingAdvanceDays = Number(settings.maxBookingAdvanceDays);
    const autoConfirm = typeof settings.autoConfirm === 'boolean' ? settings.autoConfirm : false;
    const nextBookingSettings: BookingSettingsState = {
      minimumNoticeHours: Number.isNaN(minimumNoticeHours) ? 24 : minimumNoticeHours,
      maxBookingAdvanceDays: Number.isNaN(maxBookingAdvanceDays) ? 30 : maxBookingAdvanceDays,
      autoConfirm
    };

    setBookingSettings(nextBookingSettings);
    setMinNotice(formatNoticeLabel(nextBookingSettings.minimumNoticeHours));
  }, []);

  useEffect(() => {
    const providerProfile = (rawUser as any)?.providerProfile;
    if (providerProfile) {
      applyProviderProfile(providerProfile);
    }
  }, [rawUser, applyProviderProfile]);

  useEffect(() => {
    const userId = (rawUser as any)?._id || (rawUser as any)?.id;
    const hasProfile = !!(rawUser as any)?.providerProfile;
    if (!userId || hasProfile) return;

    (async () => {
      try {
        const res = await getUserProfileAPI(userId);
        if (res?.data) {
          const pp = (res.data as any)?.providerProfile;
          if (pp) {
            setUser(res.data as any);
            applyProviderProfile(pp);
          }
        }
      } catch {
        // API fetch failed silently - user will see defaults until refreshFromServer succeeds
      }
    })();
  }, [rawUser, applyProviderProfile, setUser]);

  const activeDays = DaysOfWeek.filter(day => {
    const dayData = availability[day];
    return dayData?.status && TimeBlocks.some(block => dayData[block.id]);
  });

  const getSlotDays = (slotId: string) => {
    return DaysOfWeek
      .filter(day => availability[day]?.status && availability[day]?.[slotId])
      .map(day => day.substring(0, 3))
      .join(', ');
  };

  const calculateHours = () => {
    let total = 0;
    DaysOfWeek.forEach(day => {
      if (availability[day]?.status) {
        if (availability[day]?.Morning) total += 6;
        if (availability[day]?.Afternoon) total += 6;
        if (availability[day]?.Evening) total += 6;
      }
    });
    return total;
  };

  const toggleSlot = (day: string, slot: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: !prev[day]?.[slot]
      }
    }));
  };

  const toggleDayStatus = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        status: !prev[day]?.status
      }
    }));
  };

  const handleSave = async () => {
    const userId = rawUser?._id;
    if (!userId) {
      alert('User session missing. Please login again.');
      return;
    }

    try {
      setIsSaving(true);
      const backendAvailability = mapUiToBackendAvailability(availability);
      const normalizedBookingSettings = {
        minimumNoticeHours: parseNoticeLabelToHours(minNotice),
        maxBookingAdvanceDays: bookingSettings.maxBookingAdvanceDays,
        autoConfirm: bookingSettings.autoConfirm
      };

      const response = await updateUserProfileAPI(userId, {
        providerProfile: {
          availability: backendAvailability,
          bookingSettings: normalizedBookingSettings
        }
      });

      if (response?.data) {
        setUser(response.data);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Save failed:', message);
      alert('Could not save: ' + message);
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
              title="Schedule & Availability"
              description="Set your working hours and booking preferences."
              breadcrumbs={[
                { label: 'Settings', to: '/settings' },
                { label: 'Preferences', to: '/settings/preferences' },
                { label: 'Schedule & Availability' }
              ]}
              backTo="/settings/preferences"
              backLabel="Back to Preferences"
              rightContent={
                <button
                  onClick={handleSave}
                  disabled={isSaving || saveSuccess}
                  className={clsx(
                    "w-full md:w-auto px-8 sm:px-12 py-3.5 sm:py-4 bg-gradient-primary text-white rounded-xl font-bold font-dm shadow-xl shadow-primary/20 hover:shadow-xl hover:scale-[1.02] duration-300 active:scale-95 flex items-center justify-center gap-2",
                    (isSaving || saveSuccess) && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isSaving ? (
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : saveSuccess ? (
                    <HiCheckCircle className="size-6" />
                  ) : (
                    <HiCheck className="size-6" />
                  )}
                  {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Schedule'}
                </button>
              }
            />

            <div className="animate-in fade-in slide-in-from-right-4 duration-500">

              {saveSuccess && (
                <div className="mb-8 bg-emerald-50 border border-emerald-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl flex items-center gap-4 animate-in zoom-in duration-300">
                  <HiCheckCircle className="size-6 sm:size-8 text-emerald-500 shrink-0" />
                  <div>
                    <h4 className="text-emerald-900 font-bold font-dm text-sm sm:text-base">Schedule Updated</h4>
                    <p className="text-emerald-700 text-xs sm:text-sm font-medium font-dm">Your availability preferences have been saved successfully.</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-10">
                <div className="xl:col-span-2 space-y-8">
                  {/* Weekly Schedule Card */}
                  <div className="bg-white rounded-3xl sm:rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-playfair">Weekly Schedule</h3>
                      <div className="flex items-center gap-3 bg-primary/5 px-4 py-2.5 rounded-full self-start sm:self-auto">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium font-dm">Set recurring schedule</span>
                        <button
                          onClick={() => setIsRecurring(!isRecurring)}
                          className={clsx(
                            "w-10 h-5 sm:w-12 sm:h-6 rounded-full relative duration-300",
                            isRecurring ? "bg-primary" : "bg-gray-200"
                          )}
                        >
                          <div className={clsx(
                            "absolute top-0.5 sm:top-1 size-4 bg-white rounded-full duration-300 shadow-sm",
                            isRecurring ? "left-5 sm:left-7" : "left-1"
                          )} />
                        </button>
                      </div>
                    </div>

                    <div className="hidden lg:block p-8 overflow-x-auto custom-scrollbar">
                      <table className="w-full min-w-[700px] border-collapse">
                        <thead>
                          <tr className="bg-primary/5">
                            <th className="py-5 px-6 text-[13px] font-black text-gray-400 uppercase tracking-[0.2em] rounded-l-2xl text-left">Day</th>
                            {TimeBlocks.map(block => (
                              <th key={block.id} className="py-5 px-4 text-center">
                                <p className="text-[13px] font-black text-gray-400 uppercase tracking-[0.2em]">{block.id}</p>
                                <p className="text-[13px] text-primary/40 font-bold mt-1">{block.time}</p>
                              </th>
                            ))}
                            <th className="py-5 px-6 text-[13px] font-black text-gray-400 uppercase tracking-[0.2em] rounded-r-2xl text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {DaysOfWeek.map((day, idx) => {
                            const dayData = availability[day];
                            const isDayOff = !dayData?.status;

                            return (
                              <tr key={idx} className={clsx("duration-300 group", isDayOff ? "opacity-30" : "hover:bg-gray-50/50")}>
                                <td className="py-6 px-6 font-bold text-gray-900 font-dm border-b border-gray-100">{day}</td>
                                {TimeBlocks.map(block => {
                                  const isSelected = dayData?.[block.id];
                                  return (
                                    <td key={block.id} className="py-6 px-4 border-b border-gray-100">
                                      <div className="flex justify-center">
                                        <button
                                          disabled={isDayOff}
                                          onClick={() => toggleSlot(day, block.id)}
                                          className={clsx(
                                            "size-11 rounded-full flex items-center justify-center duration-300 shadow-sm",
                                            isSelected
                                              ? "bg-gradient-primary text-white scale-100"
                                              : "bg-gray-100 text-gray-300 hover:bg-gray-200 hover:scale-105 scale-95"
                                          )}
                                        >
                                          {isSelected ? <HiCheck className="size-6" /> : <HiOutlineMinus className="size-6" />}
                                        </button>
                                      </div>
                                    </td>
                                  );
                                })}
                                <td className="py-6 px-6 border-b border-gray-100">
                                  <div className="flex justify-center">
                                    <button
                                      onClick={() => toggleDayStatus(day)}
                                      className={clsx(
                                        "w-12 h-6 rounded-full relative duration-300 shadow-sm",
                                        dayData?.status ? "bg-primary" : "bg-gray-200"
                                      )}
                                    >
                                      <div className={clsx(
                                        "absolute top-1 size-4 bg-white rounded-full duration-300 shadow-sm",
                                        dayData?.status ? "left-7" : "left-1"
                                      )} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="lg:hidden p-4 sm:p-6 space-y-4">
                      {DaysOfWeek.map((day) => {
                        const dayData = availability[day];
                        const isDayOff = !dayData?.status;
                        return (
                          <div
                            key={day}
                            className={clsx(
                              "p-5 rounded-3xl border border-gray-100 duration-300",
                              isDayOff ? "bg-gray-50/50 opacity-60" : "bg-white shadow-sm"
                            )}
                          >
                            <div className="flex items-center justify-between mb-5">
                              <h4 className="font-bold text-gray-900 font-dm">{day}</h4>
                              <button
                                onClick={() => toggleDayStatus(day)}
                                className={clsx(
                                  "w-10 h-5 rounded-full relative duration-300",
                                  dayData?.status ? "bg-primary" : "bg-gray-200"
                                )}
                              >
                                <div className={clsx(
                                  "absolute top-0.5 size-4 bg-white rounded-full duration-300 shadow-sm",
                                  dayData?.status ? "left-5" : "left-1"
                                )} />
                              </button>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {TimeBlocks.map(block => {
                                const isSelected = dayData?.[block.id];
                                return (
                                  <button
                                    key={block.id}
                                    disabled={isDayOff}
                                    onClick={() => toggleSlot(day, block.id)}
                                    className={clsx(
                                      "flex flex-col items-center gap-2 p-3 rounded-2xl duration-300 border",
                                      isSelected
                                        ? "bg-primary/5 border-primary text-primary"
                                        : "bg-white border-gray-50 text-gray-300"
                                    )}
                                  >
                                    <span className="text-[10px] font-black uppercase tracking-widest">{block.id.substring(0, 3)}</span>
                                    <div className={clsx(
                                      "size-8 rounded-full flex items-center justify-center duration-300",
                                      isSelected ? "bg-primary text-white" : "bg-gray-50"
                                    )}>
                                      {isSelected ? <HiCheck className="size-4" /> : <HiOutlineMinus className="size-4" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                <div className="space-y-8">
                  {/* Summary Card */}
                  <div className="bg-white rounded-3xl sm:rounded-4xl border border-gray-100 shadow-sm p-8">
                    <h3 className="text-xl font-bold text-gray-900 font-playfair mb-8">Availability Summary</h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Available Days</p>
                        <p className="text-sm font-bold text-gray-900 font-dm">{activeDays.length} days/week</p>
                      </div>
                      <div className="flex justify-between items-start">
                        <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Morning Slots</p>
                        <p className="text-sm font-bold text-gray-900 font-dm text-right">{getSlotDays('Morning') || 'None'}</p>
                      </div>
                      <div className="flex justify-between items-start">
                        <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Afternoon Slots</p>
                        <p className="text-sm font-bold text-gray-900 font-dm text-right">{getSlotDays('Afternoon') || 'None'}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Weekly Hours</p>
                        <p className="text-sm font-bold text-gray-900 font-dm">~{calculateHours()} hours</p>
                      </div>
                      <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                        <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Min. Notice</p>
                        <p className="text-sm font-bold text-primary font-dm">{minNotice.split(' ')[0]} {minNotice.split(' ')[1]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Settings Card */}
                  <div className="bg-white rounded-3xl sm:rounded-4xl border border-gray-100 shadow-sm p-8">
                    <h3 className="text-xl font-bold text-gray-900 font-playfair mb-8">Booking Settings</h3>
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Minimum Notice</label>
                        <div className="relative group">
                          <select
                            value={minNotice}
                            onChange={(e) => {
                              const nextValue = e.target.value;
                              const nextHours = parseNoticeLabelToHours(nextValue);
                              setMinNotice(nextValue);
                              setBookingSettings((prev) => ({
                                ...prev,
                                minimumNoticeHours: nextHours
                              }));
                            }}
                            className="w-full h-14 bg-primary/5 border border-transparent rounded-xl px-6 text-sm font-bold text-gray-900 appearance-none outline-none focus:border-primary/20 duration-300"
                          >
                            <option>24 hours (Recommended)</option>
                            <option>12 hours</option>
                            <option>48 hours</option>
                          </select>
                          <HiOutlineChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 size-5 pointer-events-none group-hover:text-primary duration-300" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Max Booking Advance</label>
                        <div className="relative group">
                          <select
                            value={`${bookingSettings.maxBookingAdvanceDays} days`}
                            onChange={(e) => {
                              const parsed = Number.parseInt(e.target.value, 10);
                              setBookingSettings((prev) => ({
                                ...prev,
                                maxBookingAdvanceDays: Number.isNaN(parsed) ? 30 : parsed
                              }));
                            }}
                            className="w-full h-14 bg-primary/5 border border-transparent rounded-xl px-6 text-sm font-bold text-gray-900 appearance-none outline-none focus:border-primary/20 duration-300"
                          >
                            <option>30 days</option>
                            <option>60 days</option>
                            <option>90 days</option>
                          </select>
                          <HiOutlineChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 size-5 pointer-events-none group-hover:text-primary duration-300" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <p className="text-sm font-bold text-gray-900 font-dm">Auto-confirm</p>
                        <button
                          onClick={() =>
                            setBookingSettings((prev) => ({
                              ...prev,
                              autoConfirm: !prev.autoConfirm
                            }))
                          }
                          className={clsx(
                            "w-12 h-6 rounded-full relative duration-300",
                            bookingSettings.autoConfirm ? "bg-primary" : "bg-gray-200"
                          )}
                        >
                          <div className={clsx(
                            "absolute top-1 size-4 bg-white rounded-full duration-300",
                            bookingSettings.autoConfirm ? "left-7" : "left-1"
                          )} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default AvailabilityPage;
