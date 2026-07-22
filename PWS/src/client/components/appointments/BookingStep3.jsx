import React, { useEffect, useMemo, useState } from 'react';
import { getAppointmentsByPswAPI, getUserProfileAPI } from '../../utils/api';
import { computeBookingEstimate, getServiceHourlyRate } from '../../utils/servicePricing';

const dayKeyMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const calendarWeekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const activeStatuses = new Set(['pending', 'confirmed']);

const AVAILABILITY_DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const AVAILABILITY_TIME_LABELS = {
  Morning: '09:00 AM - 12:00 PM',
  Afternoon: '12:00 PM - 06:00 PM',
  Evening: '06:00 PM - 12:00 AM',
};

const SLOT_BY_VALUE = {};
Object.entries(AVAILABILITY_TIME_LABELS).forEach(([key, value]) => {
  SLOT_BY_VALUE[key.toLowerCase()] = key;
  SLOT_BY_VALUE[value.toLowerCase()] = key;
});

const normalizeTimeSlot = (slot) => {
  const normalized = String(slot || '').trim().toLowerCase();
  return SLOT_BY_VALUE[normalized] || String(slot || '').trim();
};

const formatSlotLabel = (slot) => {
  return AVAILABILITY_TIME_LABELS[slot] || slot;
};

const formatDateLabel = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const toLocalDateInput = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDateInputValue = (dateLabel) => {
  if (!dateLabel) return '';
  return toLocalDateInput(dateLabel);
};

const getNormalizedAvailability = (provider) => {
  const availabilitySources = [
    provider?.availability,
    provider?.providerProfile?.availability,
    provider?.providerProfile?.providerProfile?.availability,
  ];

  const mergedAvailability = {};
  AVAILABILITY_DAY_KEYS.forEach((dayKey) => {
    mergedAvailability[dayKey] = [];
  });

  availabilitySources.forEach((availability) => {
    if (!availability || typeof availability !== 'object') return;

    Object.entries(availability).forEach(([dayKey, daySlots]) => {
      const key = String(dayKey || '').trim().toLowerCase();
      if (!AVAILABILITY_DAY_KEYS.includes(key)) return;

      if (!Array.isArray(daySlots)) return;

      const normalizedSlots = daySlots
        .map((slot) => normalizeTimeSlot(slot))
        .filter(Boolean);

      mergedAvailability[key] = [...new Set([...(mergedAvailability[key] || []), ...normalizedSlots])];
    });
  });

  return mergedAvailability;
};

const getNextAvailableDate = (provider) => {
  const today = new Date();
  const availability = getNormalizedAvailability(provider);
  for (let offset = 0; offset < 60; offset += 1) {
    const candidate = new Date(today);
    candidate.setDate(today.getDate() + offset);
    const dayKey = dayKeyMap[candidate.getDay()];
    const slots = Array.isArray(availability?.[dayKey]) ? availability[dayKey] : [];
    if (slots.length > 0) {
      return toLocalDateInput(candidate);
    }
  }
  return toLocalDateInput(today);
};

const getCurrentDayAvailability = (availability, date) => {
  if (!date) return [];
  const dayKey = dayKeyMap[new Date(date).getDay()];
  return availability?.[dayKey] || [];
};

const getWeeklyAvailability = (availability) => {
  const DAY_LABELS = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };
  return AVAILABILITY_DAY_KEYS.map((dayKey) => ({
    dayKey,
    dayLabel: DAY_LABELS[dayKey],
    slots: availability?.[dayKey] || [],
  }));
};

const getBookedSlotsForDate = (appointments = [], dateValue) => {
  if (!dateValue) return [];
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return [];

  const booked = new Set();
  appointments.forEach((appointment) => {
    const status = String(appointment?.status || '').toLowerCase();
    if (!activeStatuses.has(status)) return;

    const appointmentDate = new Date(appointment?.appointmentDate || appointment?.date || appointment?.createdAt || '');
    if (Number.isNaN(appointmentDate.getTime())) return;

    const sameDay = appointmentDate.toDateString() === date.toDateString();
    if (!sameDay) return;

    const normalized = normalizeTimeSlot(appointment?.time || '');
    if (normalized) booked.add(normalized);
  });

  return Array.from(booked);
};

const isPastDate = (date) => {
  if (!date) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);
  return compare < today;
};

const parseDurationToMinutes = (durationString) => {
  if (!durationString) return 60;
  const lower = durationString.toLowerCase();
  if (lower.includes('1.5')) return 90;
  if (lower.includes('2.5')) return 150;
  if (lower.includes('3.5')) return 210;
  if (lower.includes('2')) return 120;
  if (lower.includes('3+') || lower.includes('3')) return 180;
  if (lower.includes('4')) return 240;
  if (lower.includes('hour')) return 60;
  const match = lower.match(/(\d+)/);
  if (match) {
    const val = parseInt(match[1]);
    if (val <= 4) return val * 60;
    return val;
  }
  return 60;
};

const getDurationString = (mins) => {
  if (mins >= 240) return '4 hours';
  if (mins >= 210) return '3.5 hours';
  if (mins >= 180) return '3+ hours';
  if (mins >= 150) return '2.5 hours';
  if (mins >= 120) return '2 hours';
  if (mins >= 90) return '1.5 hours';
  return '1 hour';
};

const parseDurationHours = (durationStr) => {
  if (!durationStr) return 1;
  const lower = durationStr.toLowerCase();
  if (lower.includes('3+')) return 3;
  const match = lower.match(/([\d.]+)/);
  if (match) {
    const val = Number(match[1]) || 1;
    if (lower.includes('min')) {
      return val / 60;
    }
    return val;
  }
  return 1;
};

const BookingStep3 = ({ selectedService, selectedProvider, bookingDetails, onBookingDetailsChange, isSubmitting, onBack, onContinue }) => {
  const providerName = selectedProvider?.fullName || 'Care Provider';
  const serviceName = selectedService?.name || 'Selected service';
  const rate = getServiceHourlyRate(selectedService);
  const [liveAvailability, setLiveAvailability] = useState(null);
  const [providerAppointments, setProviderAppointments] = useState([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [showWeeklyAvailability, setShowWeeklyAvailability] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const providerId = selectedProvider?._id || selectedProvider?.id;

  useEffect(() => {
    let active = true;

    const loadProviderData = async () => {
      if (!providerId) {
        if (active) {
          setLiveAvailability(null);
          setProviderAppointments([]);
        }
        return;
      }

      setIsLoadingAvailability(true);
      try {
        const [profileRes, appointmentsRes] = await Promise.all([
          getUserProfileAPI(providerId),
          getAppointmentsByPswAPI(providerId),
        ]);

        const profileAvailability = profileRes?.data?.availability || profileRes?.data?.providerProfile?.availability || null;
        const appointments = Array.isArray(appointmentsRes?.data) ? appointmentsRes.data : [];

        if (active) {
          setLiveAvailability(profileAvailability && typeof profileAvailability === 'object' ? profileAvailability : null);
          setProviderAppointments(appointments);
        }
      } catch {
        if (active) {
          setLiveAvailability(null);
          setProviderAppointments([]);
        }
      } finally {
        if (active) setIsLoadingAvailability(false);
      }
    };

    loadProviderData();
    return () => {
      active = false;
    };
  }, [providerId]);

  const availability = liveAvailability || getNormalizedAvailability(selectedProvider);
  const selectedDateInput = bookingDetails?.dateInput || getNextAvailableDate(selectedProvider);
  const selectedDate = bookingDetails?.date || formatDateLabel(selectedDateInput);
  const selectedTime = bookingDetails?.time || '';
  const selectedDuration = bookingDetails?.duration || '1 hour';

  const [durationMinutes, setDurationMinutes] = useState(() => parseDurationToMinutes(selectedDuration));

  useEffect(() => {
    if (bookingDetails?.duration) {
      setDurationMinutes(parseDurationToMinutes(bookingDetails.duration));
    }
  }, [bookingDetails?.duration]);

  const durationMinutesForEstimate = useMemo(() => parseDurationToMinutes(selectedDuration), [selectedDuration]);
  const estimate = useMemo(() => computeBookingEstimate(selectedService, durationMinutesForEstimate), [selectedService, durationMinutesForEstimate]);
  const total = Number(estimate.total.toFixed(2));

  useEffect(() => {
    if (!selectedDateInput) return;
    const selected = new Date(selectedDateInput);
    if (!Number.isNaN(selected.getTime())) {
      setVisibleMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
    }
  }, [selectedDateInput]);

  const timeSlots = useMemo(
    () => getCurrentDayAvailability(availability, selectedDateInput),
    [availability, selectedDateInput]
  );

  const bookedSlotsForDate = useMemo(
    () => getBookedSlotsForDate(providerAppointments, selectedDateInput),
    [providerAppointments, selectedDateInput]
  );

  const monthLabel = useMemo(
    () => visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    [visibleMonth]
  );

  const isCurrentMonth = useMemo(() => {
    const now = new Date();
    return visibleMonth.getMonth() === now.getMonth() && visibleMonth.getFullYear() === now.getFullYear();
  }, [visibleMonth]);

  useEffect(() => {
    if (!selectedDateInput) return;

    const selectedSlotStillValid = selectedTime
      && timeSlots.includes(selectedTime)
      && !bookedSlotsForDate.includes(normalizeTimeSlot(selectedTime));

    if (selectedSlotStillValid) {
      setValidationMessage('');
      return;
    }

    const firstOpenSlot = timeSlots.find((slot) => !bookedSlotsForDate.includes(normalizeTimeSlot(slot)));
    if (firstOpenSlot) {
      updateBooking('time', firstOpenSlot);
      setValidationMessage('');
      return;
    }

    updateBooking('time', '');
    setValidationMessage('');
  }, [timeSlots, bookedSlotsForDate, selectedDateInput, selectedTime]);

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day));
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [visibleMonth]);

  const updateBooking = (key, value) => {
    onBookingDetailsChange((prev) => ({ ...(prev || {}), [key]: value }));
  };

  const handleSelectDate = (dateValue) => {
    const nextDateInput = toLocalDateInput(dateValue);
    const nextDateLabel = formatDateLabel(nextDateInput);
    setValidationMessage('');
    onBookingDetailsChange((prev) => ({
      ...(prev || {}),
      date: nextDateLabel,
      dateInput: nextDateInput,
      time: '',
    }));
  };

  const increaseDuration = () => {
    setDurationMinutes((prev) => {
      const next = Math.min(prev + 30, 240);
      updateBooking('duration', getDurationString(next));
      return next;
    });
  };

  const decreaseDuration = () => {
    setDurationMinutes((prev) => {
      const next = Math.max(prev - 30, 60);
      updateBooking('duration', getDurationString(next));
      return next;
    });
  };

  const handleContinue = () => {
    if (!selectedDateInput) {
      setValidationMessage('Please choose an available appointment date before continuing.');
      return;
    }

    if (!selectedTime) {
      setValidationMessage('Please choose an available start time before continuing.');
      return;
    }

    if (bookedSlotsForDate.includes(normalizeTimeSlot(selectedTime))) {
      setValidationMessage('This time slot is already booked. Please choose another start time.');
      return;
    }

    // Persist default date to bookingDetails if user never clicked a calendar date
    if (!bookingDetails?.dateInput) {
      const fallbackDateInput = selectedDateInput;
      const fallbackDateLabel = formatDateLabel(fallbackDateInput);
      onBookingDetailsChange((prev) => ({
        ...(prev || {}),
        date: fallbackDateLabel,
        dateInput: fallbackDateInput,
      }));
    }

    setValidationMessage('');
    onContinue();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-12">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 font-serif tracking-tight">Select Date & Time</h2>
        <div className="flex items-center text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-xl w-fit border border-purple-100">
          Step 03 <span className="mx-2 opacity-30 text-gray-400">·</span> <span className="text-gray-400">Schedule Finalization</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Calendar Section */}
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 block ml-1">Appointment Date</label>
            <div className="rounded-[1.75rem] bg-[#F9F7FF] border border-purple-50 p-4 md:p-6">
              
              {/* Selected date display (similar to mobile card header) */}
              <div className="flex items-center justify-between border-b border-purple-100/50 pb-4 mb-4">
                <div>
                  <p className="text-sm md:text-base font-bold text-gray-900">{selectedDate}</p>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">{providerName} is available for a home visit</p>
                </div>
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-5">
                <button
                  type="button"
                  disabled={isCurrentMonth}
                  onClick={() => setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                  className={`w-10 h-10 rounded-2xl bg-white border border-gray-100 text-gray-500 flex items-center justify-center transition-all ${
                    isCurrentMonth
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:border-purple-200 hover:text-[#5915BD]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <p className="text-sm md:text-base font-bold text-gray-900 font-serif">{monthLabel}</p>
                <button
                  type="button"
                  onClick={() => setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                  className="w-10 h-10 rounded-2xl bg-white border border-gray-100 text-gray-500 flex items-center justify-center hover:border-purple-200 hover:text-[#5915BD] transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-3">
                {calendarWeekDays.map((day) => (
                  <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((dateOption, index) => {
                  if (!dateOption) {
                    return <div key={`empty-${index}`} className="h-12 rounded-2xl bg-transparent" />;
                  }

                  const isSelected = getDateInputValue(selectedDateInput) === getDateInputValue(dateOption);
                  const isPast = isPastDate(dateOption);

                  return (
                    <button
                      key={dateOption.toISOString()}
                      type="button"
                      disabled={isPast}
                      onClick={() => handleSelectDate(dateOption)}
                      className={`h-12 rounded-2xl border text-[10px] font-bold transition-all ${
                        isPast
                          ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed opacity-50'
                          : isSelected
                            ? 'border-purple-600 bg-purple-100 text-purple-700 shadow-md ring-1 ring-purple-300'
                            : 'border-gray-100 bg-white text-gray-700 hover:border-purple-200 hover:text-[#5915BD]'
                      }`}
                    >
                      {dateOption.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Available Start Times Section */}
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100%] opacity-30"></div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Available Start Times</label>
            <p className="text-[10px] text-gray-400 mb-10 font-bold uppercase tracking-widest opacity-50 ml-1">Matching Provider Availability</p>

            {isLoadingAvailability ? (
              <div className="mb-6 rounded-2xl border border-purple-100 bg-purple-50/60 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-purple-700 animate-pulse">
                Checking live provider availability...
              </div>
            ) : null}

            {validationMessage ? (
              <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-rose-600">
                {validationMessage}
              </div>
            ) : null}

            {timeSlots.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                {timeSlots.map((time) => {
                  const isBooked = bookedSlotsForDate.includes(normalizeTimeSlot(time));
                  const isSelected = time === selectedTime;

                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        if (isBooked) return;
                        updateBooking('time', time);
                      }}
                      disabled={isBooked}
                      className={`py-4 px-6 rounded-2xl border text-xs font-bold transition-all duration-300 ${
                        isBooked
                          ? 'bg-gray-100 border-gray-200 text-gray-400 line-through opacity-70 cursor-not-allowed'
                          : isSelected
                            ? 'bg-[#7327C2] border-[#7327C2] text-white shadow-lg shadow-purple-100'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-purple-200 hover:bg-purple-50/10'
                      }`}
                    >
                      <span className="block">{formatSlotLabel(time)}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center">
                <p className="text-sm font-bold text-gray-900 font-serif mb-1">No availability for this day</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Choose another date above to view the provider’s available slots.</p>
              </div>
            )}

            {/* Weekly Availability toggle and table */}
            <div className="mt-8 border-t border-gray-50 pt-6">
              <button
                type="button"
                onClick={() => setShowWeeklyAvailability((prev) => !prev)}
                className="flex items-center gap-2 bg-[#F5F3FF] border border-[#E9D5FF] text-[#6D28D9] rounded-2xl px-4 py-3 font-bold text-xs hover:bg-[#EDE9FE] transition-colors w-full sm:w-auto"
              >
                {showWeeklyAvailability ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                )}
                <span>{showWeeklyAvailability ? 'Hide weekly availability' : 'View weekly availability'}</span>
              </button>

              {showWeeklyAvailability && (
                <div className="mt-4 bg-white border border-gray-200 rounded-[1.5rem] p-4 md:p-6 space-y-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  {getWeeklyAvailability(availability).map((entry) => (
                    <div key={entry.dayKey} className="flex justify-between items-center text-xs pb-2 last:pb-0 last:border-b-0 border-b border-gray-50">
                      <span className="font-bold text-gray-900 w-24">{entry.dayLabel}</span>
                      <span className="text-gray-600 flex-1 text-right font-medium">
                        {entry.slots.length ? entry.slots.map(formatSlotLabel).join(' • ') : 'Unavailable'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Care Duration (+/- style control) */}
            <div className="mt-12 pt-10 border-t border-gray-50">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 block ml-1">Care Duration</label>
              
              <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-200 max-w-sm shadow-sm">
                <button
                  type="button"
                  onClick={decreaseDuration}
                  className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg hover:bg-purple-200 transition-colors"
                >
                  —
                </button>
                <div className="text-center">
                  <p className="text-base font-bold text-gray-900">{durationMinutes} mins</p>
                  <p className="text-[11px] text-gray-500 font-medium">Standard Session</p>
                </div>
                <button
                  type="button"
                  onClick={increaseDuration}
                  className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg hover:bg-purple-200 transition-colors"
                >
                  +
                </button>
              </div>

              <div className="flex items-center mt-6 ml-1 p-4 bg-blue-50 rounded-2xl border border-blue-100/50 w-fit">
                <svg className="w-4 h-4 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p className="text-[9px] font-bold text-blue-700 uppercase tracking-widest leading-none">Clinical standard: Minimum 1 hour booking required</p>
              </div>
            </div>

            {/* Recurring toggle */}
            <div className="mt-12 pt-10 border-t border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#FDFDFF] -mx-6 md:-mx-10 px-6 md:px-10 pb-2 gap-4">
              <div>
                <p className="font-bold text-gray-900 text-sm">Recurring Care Schedule?</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 opacity-60">Set a regular clinical consistency</p>
              </div>
              <button type="button" className="w-14 h-7 bg-gray-200 rounded-full relative transition-all duration-500 shadow-inner group">
                <div className="w-5 h-5 bg-white rounded-full absolute left-1 top-1 shadow-md transition-all group-hover:scale-110"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Summary */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-bl-[100%] opacity-40"></div>
            <h3 className="text-[10px] font-bold text-[#5915BD] uppercase tracking-widest mb-10 pb-2 border-b border-purple-50 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#5915BD] rounded-full"></div>
              Elite Summary
            </h3>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#F9F7FF] rounded-2xl flex items-center justify-center text-[#5915BD] mr-5 shrink-0 shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-1">Assigned PSW</p>
                  <p className="text-sm font-bold text-gray-900 font-serif mb-0.5">{providerName}</p>
                  <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest opacity-80">Primary Caregiver</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#F9F7FF] rounded-2xl flex items-center justify-center text-[#5915BD] mr-5 shrink-0 shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012-2v2M7 7h10"/></svg>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-1">Service Type</p>
                  <p className="text-sm font-bold text-gray-900 font-serif mb-0.5">{serviceName}</p>
                  <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest opacity-80">${rate.toFixed(2)}/HR Clinical Rate</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#F9F7FF] rounded-2xl flex items-center justify-center text-[#5915BD] mr-5 shrink-0 shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-1">Scheduled For</p>
                  <p className="text-sm font-bold text-gray-900 font-serif mb-0.5">{selectedDate}</p>
                  <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest opacity-80">{formatSlotLabel(selectedTime) || 'Select a time'} – {selectedDuration}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#5915BD]/40 to-transparent"></div>
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 text-center">Clinical Estimate</h3>
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedDuration} × ${estimate.hourlyRate.toFixed(2)}/HR</span>
                  <span className="text-sm font-bold text-gray-800">${estimate.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Platform Fee ({(estimate.platformFeePercent || 1.9).toFixed(1)}%)</span>
                  <span className="text-sm font-bold text-gray-800">${estimate.platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Tax ({(estimate.taxPercent || 0).toFixed(0)}%)</span>
                  <span className="text-sm font-bold text-gray-800">${estimate.tax.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-50">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[8px] font-bold text-[#5915BD] uppercase tracking-[0.2em] mb-1">Total Due Estimate</p>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Post-Visit Billing</span>
                </div>
                <span className="text-2xl md:text-4xl font-bold text-[#5915BD] font-serif leading-none tracking-tight">${total.toFixed(2)}</span>
              </div>
              <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest text-center leading-relaxed">Amount may vary based on exact clinical duration verified by system.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
        <button onClick={onBack} className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#5915BD] transition-all group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
          Return to Caregiver
        </button>
        <button onClick={handleContinue} className="px-6 md:px-12 py-4 md:py-5 bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white rounded-[1.5rem] font-bold flex items-center shadow-xl shadow-purple-100 hover:shadow-purple-200 hover:-translate-y-1 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-[11px]">
          Finalize Appointment <svg className="w-4 h-4 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default BookingStep3;
