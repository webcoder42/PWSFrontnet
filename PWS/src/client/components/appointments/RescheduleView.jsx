import React, { useEffect, useMemo, useState } from 'react';
import { getUserProfileAPI, rescheduleAppointmentAPI } from '../../../utils/api';
import { formatSlotLabel, getAvailabilityForDay, getCurrentDayKey } from '../../utils/providerAvailability';
import { canRescheduleAppointment } from '../../../utils/appointmentHelpers';

const TIME_OPTIONS = ['Morning', 'Afternoon', 'Evening'];
const DURATION_OPTIONS = ['1 hour', '1.5 hours', '2 hours', '3+ hours'];

const parseAppointmentDate = (value, fallbackYear) => {
  if (!value) return null;
  const hasExplicitYear = /\b\d{4}\b/.test(String(value));
  if (hasExplicitYear) {
    const direct = new Date(value);
    if (!Number.isNaN(direct.getTime())) return direct;
  }

  const pieces = String(value).split(',').map((part) => part.trim()).filter(Boolean);
  const currentYear = fallbackYear || new Date().getFullYear();
  if (pieces.length >= 2) {
    const withoutWeekday = pieces.slice(1).join(', ');
    const withYear = `${withoutWeekday}, ${currentYear}`;
    const parsed = new Date(withYear);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
};

const toInputDate = (value, fallbackYear) => {
  const parsed = parseAppointmentDate(value, fallbackYear);
  if (!parsed || Number.isNaN(parsed.getTime())) return '';
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, '0');
  const d = String(parsed.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatReadable = (value) => {
  const parsed = new Date(value || '');
  if (Number.isNaN(parsed.getTime())) return value || 'Pending';
  return parsed.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

const getProviderName = (appointment) => {
  if (!appointment?.pswId || typeof appointment.pswId !== 'object') return 'Care Provider';
  return `${appointment.pswId.firstName || ''} ${appointment.pswId.lastName || ''}`.trim() || 'Care Provider';
};

const toDateFromInput = (value) => {
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeToAvailabilitySlot = (timeValue, daySlots) => {
  if (!timeValue) return '';
  if (daySlots.includes(timeValue)) return timeValue;
  const matched = daySlots.find((slot) => formatSlotLabel(slot) === timeValue);
  return matched || timeValue;
};

const RescheduleView = ({ appointment, onBack, onDone }) => {
  const [providerAvailability, setProviderAvailability] = useState(
    appointment?.pswId?.availability || appointment?.pswId?.providerProfile?.availability || {},
  );
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const createdYear = appointment?.createdAt ? new Date(appointment.createdAt).getFullYear() : undefined;
  const safeCreatedYear = Number.isNaN(createdYear) ? undefined : createdYear;
  const initialDateValue = toInputDate(appointment?.date, safeCreatedYear) || toInputDate(new Date(), safeCreatedYear);
  const initialDaySlots = getAvailabilityForDay(
    providerAvailability,
    getCurrentDayKey(toDateFromInput(initialDateValue) || new Date()),
  );
  const [date, setDate] = useState(() => toInputDate(appointment?.date, safeCreatedYear) || toInputDate(new Date(), safeCreatedYear));
  const [time, setTime] = useState(() => normalizeToAvailabilitySlot(appointment?.time || '', initialDaySlots));
  const [duration, setDuration] = useState(() => appointment?.duration || '1 hour');
  const [saving, setSaving] = useState(false);

  const providerName = useMemo(() => getProviderName(appointment), [appointment]);
  const canReschedule = canRescheduleAppointment(appointment?.status);
  const providerId =
    typeof appointment?.pswId === 'object'
      ? appointment?.pswId?._id || appointment?.pswId?.id
      : appointment?.pswId;

  useEffect(() => {
    let active = true;
    const loadProviderAvailability = async () => {
      if (!providerId) return;
      setAvailabilityLoading(true);
      try {
        const response = await getUserProfileAPI(providerId);
        const latestAvailability =
          response?.data?.availability ||
          response?.data?.providerProfile?.availability ||
          response?.availability ||
          response?.providerProfile?.availability ||
          {};
        if (active) {
          setProviderAvailability(latestAvailability);
        }
      } catch {
        // Keep initial availability from appointment payload if live fetch fails.
      } finally {
        if (active) setAvailabilityLoading(false);
      }
    };
    loadProviderAvailability();
    return () => {
      active = false;
    };
  }, [providerId]);

  const selectedDateObj = useMemo(() => toDateFromInput(date), [date]);
  const selectedDaySlots = useMemo(() => {
    if (!selectedDateObj) return [];
    return getAvailabilityForDay(providerAvailability, getCurrentDayKey(selectedDateObj));
  }, [providerAvailability, selectedDateObj]);
  const displayTimeOptions = useMemo(() => {
    const base = selectedDaySlots.length ? selectedDaySlots : TIME_OPTIONS;
    if (!time) return base;
    return base.includes(time) ? base : [time, ...base];
  }, [selectedDaySlots, time]);
  const selectedTimeLabel = useMemo(() => formatSlotLabel(time), [time]);

  if (!appointment?._id) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center">
          <p className="text-gray-500 font-semibold mb-5">Appointment not selected for reschedule.</p>
          <button onClick={onBack} className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold">Back</button>
        </div>
      </div>
    );
  }

  if (!canReschedule) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center">
          <p className="text-gray-500 font-semibold mb-4">Only pending appointments can be rescheduled.</p>
          <button onClick={onBack} className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold">
            Back to Appointment Details
          </button>
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (!date || !time) {
      alert('Please select date and time.');
      return;
    }
    if (!selectedDateObj || !selectedDaySlots.length) {
      alert('No provider availability found for selected day in latest provider schedule. Please choose another date.');
      return;
    }
    if (!selectedDaySlots.includes(time)) {
      alert('Selected time is not available on this day. Please pick an available slot.');
      return;
    }
    setSaving(true);
    try {
      const readableDate = formatReadable(date);
      await rescheduleAppointmentAPI(appointment._id, { date: readableDate, time, duration });
      alert('Appointment rescheduled successfully.');
      onDone?.();
    } catch (error) {
      alert(`Failed to reschedule: ${error.message || 'Server error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-300">
      <button onClick={onBack} className="mb-6 text-purple-600 font-semibold">Back to Appointment Details</button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reschedule Appointment</h2>
          <p className="text-sm text-gray-500 mb-8">Update this visit and save changes.</p>
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Appointment</p>
            <p className="font-semibold text-gray-900">{providerName} - {appointment.service || 'Care Visit'}</p>
            <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 bg-white">
                {DURATION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-6">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Time</label>
            {availabilityLoading ? (
              <p className="mt-2 text-xs text-gray-400">Checking provider availability...</p>
            ) : null}
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
              {displayTimeOptions.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold ${time === slot ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-200'}`}
                >
                  {formatSlotLabel(slot)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 p-6 h-fit">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Summary</p>
          <p className="text-sm text-gray-400">From</p>
          <p className="font-semibold text-gray-700 mb-4">{appointment.date} - {appointment.time}</p>
          <p className="text-sm text-gray-400">To</p>
          <p className="font-semibold text-purple-700">{formatReadable(date)} - {selectedTimeLabel}</p>
          <p className="text-sm text-purple-700 mt-1">{duration}</p>
          <button
            onClick={handleConfirm}
            disabled={saving || !canReschedule}
            className="mt-8 w-full rounded-xl bg-purple-600 text-white py-3 font-semibold disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Confirm Reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleView;
