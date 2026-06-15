import React, { useMemo, useState } from 'react';
import { rescheduleAppointmentAPI } from '../../../utils/api';

const toInputDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseTimeValue = (value) => {
  if (!value) return '';
  const trimmed = String(value).trim();
  const ampmMatch = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);

  if (ampmMatch) {
    let hour = Number(ampmMatch[1]);
    const minute = ampmMatch[2] ? Number(ampmMatch[2]) : 0;
    const isPm = ampmMatch[3].toUpperCase() === 'PM';
    if (hour === 12 && !isPm) hour = 0;
    if (hour < 12 && isPm) hour += 12;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  const directMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (directMatch) {
    const hours = Number(directMatch[1]);
    const minutes = Number(directMatch[2]);
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
  }

  return '';
};

const formatDisplayTime = (value) => {
  if (!value) return 'TBD';
  const [hours, minutes] = String(value).split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
};

const RescheduleView = ({ appointment, onBack }) => {
  const appointmentId = appointment?._id || appointment?.id;
  const [date, setDate] = useState(toInputDate(appointment?.date || appointment?.appointmentDate));
  const [time, setTime] = useState(parseTimeValue(appointment?.time));
  const [duration, setDuration] = useState(appointment?.duration || '1 hour');
  const [saving, setSaving] = useState(false);

  const providerName = useMemo(() => appointment?.psw || 'Care Provider', [appointment]);
  const clientName = useMemo(() => appointment?.client || 'Client', [appointment]);

  if (!appointmentId) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center">
          <p className="text-gray-500 font-semibold mb-5">No appointment selected for reschedule.</p>
          <button onClick={onBack} className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold">Back</button>
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (!date || !time) {
      alert('Please select both a new date and time.');
      return;
    }

    setSaving(true);
    try {
      await rescheduleAppointmentAPI(appointmentId, { date, time, duration });
      alert('Appointment rescheduled successfully.');
      onBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Server error';
      alert(`Failed to reschedule appointment: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-300">
      <button onClick={onBack} className="mb-6 text-purple-600 font-semibold">Back to appointments</button>
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-6">
        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reschedule Appointment</h2>
          <p className="text-sm text-gray-500 mb-6">Update the selected booking for {providerName} with {clientName}.</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400">New Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-100"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400">New Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-100"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-xs uppercase tracking-widest text-gray-400">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-100"
            >
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="1.5 hours">1.5 hours</option>
              <option value="2 hours">2 hours</option>
              <option value="3 hours">3 hours</option>
            </select>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
              <p className="text-xs uppercase tracking-widest text-gray-400">Current appointment</p>
              <p className="mt-3 text-sm text-gray-700 font-semibold">{appointment?.date || 'TBD'} · {appointment?.time || 'TBD'}</p>
              <p className="text-sm text-gray-500 mt-2">{providerName} with {clientName}</p>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
              <p className="text-xs uppercase tracking-widest text-gray-400">New schedule</p>
              <p className="mt-3 text-sm text-gray-700 font-semibold">{date ? new Date(`${date}T00:00:00`).toLocaleDateString() : 'Not set'}</p>
              <p className="text-sm text-gray-500 mt-2">{time ? formatDisplayTime(time) : 'Not set'} · {duration}</p>
            </div>
          </div>
        </div>

        <aside className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Appointment summary</p>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <p className="font-bold text-gray-900">Provider</p>
              <p>{providerName}</p>
            </div>
            <div>
              <p className="font-bold text-gray-900">Client</p>
              <p>{clientName}</p>
            </div>
            <div>
              <p className="font-bold text-gray-900">Service</p>
              <p>{appointment?.type || 'Care Session'}</p>
            </div>
            <div>
              <p className="font-bold text-gray-900">Location</p>
              <p>{appointment?.location || 'Client home'}</p>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={saving}
            className="mt-8 w-full rounded-3xl bg-purple-600 text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-purple-700 disabled:opacity-60 transition-colors"
          >
            {saving ? 'Saving...' : 'Confirm Reschedule'}
          </button>
        </aside>
      </div>
    </div>
  );
};

export default RescheduleView;
