import React, { useEffect, useMemo, useState } from 'react';
import {
  formatReadableDate,
  formatSlotLabel,
  getBookedSlotsForDate,
  getCurrentDayAvailability,
  getWeeklyAvailability,
  isSlotBooked,
  normalizeTimeSlot,
} from '../../utils/providerAvailability';
import { computeBookingEstimate, formatRate } from '../../../utils/servicePricing';
import { getAppointmentsByPswAPI } from '../../../utils/api';

const SLOT_BOOKED_MESSAGE = 'This time is already booked. Please change your time.';

const BookingStep3 = ({ selectedService, selectedProvider, selectedDate, selectedTime: selectedTimeProp, onBack, onContinue, onDateTimeSelect }) => {
  const providerName = selectedProvider?.fullName || selectedProvider?.firstName || 'Care Provider';
  const serviceName = selectedService?.name || 'Respite Care';

  const [duration, setDuration] = useState(60);
  const increaseDuration = () => setDuration((prev) => Math.min(prev + 30, 240));
  const decreaseDuration = () => setDuration((prev) => Math.max(prev - 30, 30));
  const durationString = duration >= 180 ? '3+ hours' : duration === 120 ? '2 hours' : duration === 90 ? '1.5 hours' : '1 hour';

  const estimate = useMemo(
    () => computeBookingEstimate(selectedService, duration),
    [selectedService, duration]
  );

  const [selectedDateState, setSelectedDateState] = useState(selectedDate || new Date());
  const [selectedTime, setSelectedTime] = useState(selectedTimeProp || '');
  const [showWeeklyAvailability, setShowWeeklyAvailability] = useState(false);
  const [providerAppointments, setProviderAppointments] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [slotConflictMessage, setSlotConflictMessage] = useState('');

  const toInputDate = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    setSelectedDateState(selectedDate || new Date());
  }, [selectedDate]);

  const dateOptions = useMemo(() => {
    const baseDate = new Date(selectedDateState || new Date());
    baseDate.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
      const nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + (index - 2));
      return nextDate;
    });
  }, [selectedDateState]);

  const selectedDateLabel = useMemo(() => formatReadableDate(selectedDateState), [selectedDateState]);
  const availableSlots = useMemo(
    () => getCurrentDayAvailability(selectedProvider?.availability, selectedDateState),
    [selectedProvider?.availability, selectedDateState],
  );

  useEffect(() => {
    const providerId = selectedProvider?._id || selectedProvider?.id;
    if (!providerId) {
      setProviderAppointments([]);
      return undefined;
    }

    let isMounted = true;

    const loadProviderAppointments = async () => {
      setIsLoadingBookings(true);
      try {
        const response = await getAppointmentsByPswAPI(String(providerId));
        if (!isMounted) return;
        setProviderAppointments(Array.isArray(response?.data) ? response.data : []);
      } catch {
        if (isMounted) {
          setProviderAppointments([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingBookings(false);
        }
      }
    };

    loadProviderAppointments();

    return () => {
      isMounted = false;
    };
  }, [selectedProvider?._id, selectedProvider?.id]);

  const bookedSlotsForDate = useMemo(
    () => getBookedSlotsForDate(providerAppointments, selectedDateState),
    [providerAppointments, selectedDateState],
  );

  useEffect(() => {
    setSelectedTime((previous) => {
      if (availableSlots.includes(previous) && !bookedSlotsForDate.includes(normalizeTimeSlot(previous))) {
        return previous;
      }

      const firstOpenSlot = availableSlots.find(
        (slot) => !bookedSlotsForDate.includes(normalizeTimeSlot(slot)),
      );

      return firstOpenSlot || '';
    });
  }, [availableSlots, bookedSlotsForDate]);

  const selectedSlotIsBooked = useMemo(
    () => isSlotBooked(providerAppointments, selectedDateState, selectedTime),
    [providerAppointments, selectedDateState, selectedTime],
  );

  useEffect(() => {
    if (selectedSlotIsBooked) {
      setSlotConflictMessage(SLOT_BOOKED_MESSAGE);
      return;
    }

    setSlotConflictMessage('');
  }, [selectedSlotIsBooked, selectedDateState, selectedTime]);

  useEffect(() => {
    onDateTimeSelect?.({ date: selectedDateState, time: selectedTime || '', duration });
  }, [onDateTimeSelect, selectedDateState, selectedTime, duration]);

  const handleSelectDate = (date) => {
    setSelectedDateState(date);
    setSelectedTime('');
    setSlotConflictMessage('');
  };

  const handleSelectTime = (time) => {
    if (isSlotBooked(providerAppointments, selectedDateState, time)) {
      setSelectedTime(time);
      setSlotConflictMessage(SLOT_BOOKED_MESSAGE);
      return;
    }

    setSelectedTime(time);
    setSlotConflictMessage('');
  };

  const selectedTimeLabel = selectedTime ? formatSlotLabel(selectedTime) : 'No slot selected';
  const canContinue = Boolean(selectedTime) && !selectedSlotIsBooked;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-3 font-serif tracking-tight">Select Date & Time</h2>
        <div className="flex items-center text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-xl w-fit border border-purple-100">
          Step 03 <span className="mx-2 opacity-30 text-gray-400">·</span> <span className="text-gray-400">Schedule Finalization</span>
        </div>
        <p className="mt-4 text-sm text-gray-500">Choose a day for {providerName} and see the provider’s matching availability.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 block ml-1">Appointment Date</label>
            <div className="p-6 bg-[#F9F7FF] border border-purple-50 rounded-[1.75rem]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#5915BD] mr-6">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 font-serif">{selectedDateLabel}</p>
                    <p className="text-[10px] text-[#5915BD] font-bold uppercase tracking-widest mt-1 opacity-70">Selected Clinical Date</p>
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Choose from calendar</label>
                <input
                  type="date"
                  value={toInputDate(selectedDateState)}
                  onChange={(e) => {
                    const next = new Date(`${e.target.value}T00:00:00`);
                    if (!Number.isNaN(next.getTime())) handleSelectDate(next);
                  }}
                  className="w-full rounded-2xl border border-purple-100 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-purple-300"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {dateOptions.map((dateOption) => {
                  const isSelected = dateOption.toDateString() === selectedDateState.toDateString();

                  return (
                    <button
                      key={dateOption.toISOString()}
                      type="button"
                      onClick={() => handleSelectDate(dateOption)}
                      className={`rounded-2xl border px-3 py-3 text-left transition-all ${
                        isSelected
                          ? 'border-[#5915BD] bg-white text-[#5915BD] shadow-lg shadow-purple-100'
                          : 'border-purple-50 bg-white/80 text-gray-700 hover:border-purple-200'
                      }`}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{dateOption.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                      <p className="mt-2 text-lg font-bold">{dateOption.toLocaleDateString('en-US', { day: 'numeric' })}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100%] opacity-30"></div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Available Start Times</label>
            <p className="text-[10px] text-gray-400 mb-10 font-bold uppercase tracking-widest opacity-50 ml-1">Matching Provider Availability</p>

            {availableSlots.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 relative">
                {availableSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  const isBooked = bookedSlotsForDate.includes(normalizeTimeSlot(time));

                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleSelectTime(time)}
                      disabled={isBooked && !isSelected}
                      className={`py-4 rounded-2xl border-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                        isBooked
                          ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400 line-through opacity-70'
                          : isSelected
                            ? 'bg-[#5915BD] border-[#5915BD] text-white shadow-xl shadow-purple-100'
                            : 'bg-white border-gray-50 text-gray-700 hover:border-purple-200 hover:bg-purple-50/30'
                      }`}
                    >
                      {formatSlotLabel(time)}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-amber-100 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                No availability is saved for the selected day. Choose another date above to view the provider’s slots.
              </div>
            )}

            {slotConflictMessage ? (
              <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-900">
                {slotConflictMessage}
              </div>
            ) : null}

            {isLoadingBookings ? (
              <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Checking existing bookings...</p>
            ) : null}

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowWeeklyAvailability((previous) => !previous)}
                className="inline-flex items-center gap-2 rounded-2xl border border-purple-100 bg-[#F9F7FF] px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5915BD]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                {showWeeklyAvailability ? 'Hide weekly availability' : 'View weekly availability'}
              </button>

              {showWeeklyAvailability && (
                <div className="mt-4 grid gap-3">
                  {getWeeklyAvailability(selectedProvider?.availability).map((entry) => (
                    <div key={entry.dayKey} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-700">{entry.dayLabel}</span>
                      <span className="text-[10px] text-gray-500">
                        {entry.slots.length ? entry.slots.map((slot) => formatSlotLabel(slot)).join(' • ') : 'Unavailable'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-12 pt-10 border-t border-gray-50">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 block ml-1">Care Duration</label>
              
              <div className="flex items-center justify-between bg-white border border-gray-100 rounded-3xl p-6 shadow-sm max-w-sm">
                <button 
                  type="button"
                  onClick={decreaseDuration}
                  className="w-12 h-12 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#5915BD] flex items-center justify-center font-bold text-lg transition-all active:scale-[0.95]"
                >
                  —
                </button>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{duration} mins</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1">{durationString}</p>
                </div>
                <button 
                  type="button"
                  onClick={increaseDuration}
                  className="w-12 h-12 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#5915BD] flex items-center justify-center font-bold text-lg transition-all active:scale-[0.95]"
                >
                  ＋
                </button>
              </div>

              <div className="flex items-center mt-6 ml-1 p-4 bg-blue-50 rounded-2xl border border-blue-100/50 w-fit">
                <svg className="w-4 h-4 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p className="text-[9px] font-bold text-blue-700 uppercase tracking-widest leading-none">Clinical standard: Minimum 30 mins booking required</p>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-gray-50 flex items-center justify-between bg-[#FDFDFF] -mx-10 px-10 pb-2">
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

        <div className="lg:col-span-4 min-w-0 space-y-8">
          <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-bl-[100%] opacity-40 pointer-events-none"></div>
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
                  <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest opacity-80">${formatRate(estimate.hourlyRate)}/HR Service Rate</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#F9F7FF] rounded-2xl flex items-center justify-center text-[#5915BD] mr-5 shrink-0 shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-1">Scheduled For</p>
                  <p className="text-sm font-bold text-gray-900 font-serif mb-0.5">{selectedDateLabel}</p>
                  <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest opacity-80">{selectedTimeLabel} ({durationString})</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#5915BD]/40 to-transparent pointer-events-none"></div>
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 text-center">Clinical Estimate</h3>
              <div className="space-y-4 pt-2">
                <div className="flex items-start justify-between gap-3 px-1">
                  <span className="min-w-0 text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">{durationString} × ${formatRate(estimate.hourlyRate)}/HR</span>
                  <span className="shrink-0 text-sm font-bold text-gray-800">${formatRate(estimate.subtotal)}</span>
                </div>
                <div className="flex items-start justify-between gap-3 px-1">
                  <span className="min-w-0 text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Platform Fee ({estimate.platformFeePercent}%)</span>
                  <span className="shrink-0 text-sm font-bold text-gray-800">${formatRate(estimate.platformFee)}</span>
                </div>
                <div className="flex items-start justify-between gap-3 px-1">
                  <span className="min-w-0 text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Tax ({estimate.taxPercent}%)</span>
                  <span className="shrink-0 text-sm font-bold text-gray-800">${formatRate(estimate.tax)}</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-4 border-t border-gray-50">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div className="min-w-0">
                  <p className="text-[8px] font-bold text-[#5915BD] uppercase tracking-[0.2em] mb-1">Total Due Estimate</p>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Post-Visit Billing</span>
                </div>
                <span className="shrink-0 text-2xl lg:text-3xl font-bold text-[#5915BD] font-serif leading-none tracking-tight">${formatRate(estimate.total)}</span>
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
        <button
          type="button"
          onClick={() => {
            if (!canContinue) {
              if (selectedSlotIsBooked) {
                setSlotConflictMessage(SLOT_BOOKED_MESSAGE);
              }
              return;
            }

            onContinue();
          }}
          disabled={!canContinue}
          className={`px-12 py-5 rounded-[1.5rem] font-bold flex items-center shadow-xl uppercase tracking-[0.2em] text-[11px] ${
            canContinue
              ? 'bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white shadow-purple-100 hover:shadow-purple-200 hover:-translate-y-1 transition-all active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Finalize Appointment <svg className="w-4 h-4 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default BookingStep3;
