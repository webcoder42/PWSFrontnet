import React, { useState, useEffect } from 'react';
import AppointmentRatingSection from './AppointmentRatingSection';
import { canRescheduleAppointment } from '../../../utils/appointmentHelpers';

const rowBaseClass = 'flex items-start justify-between gap-4 py-3 border-b border-gray-100';

const getProviderName = (appointment) => {
  if (!appointment?.pswId) return 'Care Provider';
  if (typeof appointment.pswId === 'object') {
    return `${appointment.pswId.firstName || ''} ${appointment.pswId.lastName || ''}`.trim() || 'Care Provider';
  }
  return 'Care Provider';
};

const getProviderPhoto = (appointment, providerName) =>
  appointment?.pswId?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${providerName}`;

export default function AppointmentDetailsView({ appointment: initialAppointment, onBack, onReschedule, onRatingSubmitted }) {
  const [appointment, setAppointment] = useState(initialAppointment);

  useEffect(() => {
    setAppointment(initialAppointment);
  }, [initialAppointment]);

  if (!appointment) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center">
          <p className="text-gray-500 font-semibold mb-4">Appointment details not found.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  const providerName = getProviderName(appointment);
  const providerPhoto = getProviderPhoto(appointment, providerName);
  const status = (appointment.status || 'pending').toUpperCase();
  const canReschedule = canRescheduleAppointment(appointment.status);

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-300">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
        >
          Back
        </button>
        <span className="text-xs uppercase tracking-widest text-purple-600 font-bold">Appointment Details</span>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <img src={providerPhoto} alt={providerName} className="w-16 h-16 rounded-2xl object-cover" />
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{providerName}</h3>
            <p className="text-sm text-gray-500">{appointment.service || 'Care Visit'}</p>
          </div>
          <span className="ml-auto px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold tracking-wide">
            {status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
          <div className={rowBaseClass}>
            <span className="text-gray-500 text-sm">Date</span>
            <span className="text-gray-900 font-semibold">{appointment.date || 'Pending'}</span>
          </div>
          <div className={rowBaseClass}>
            <span className="text-gray-500 text-sm">Time</span>
            <span className="text-gray-900 font-semibold">{appointment.time || 'Pending'}</span>
          </div>
          <div className={rowBaseClass}>
            <span className="text-gray-500 text-sm">Duration</span>
            <span className="text-gray-900 font-semibold">{appointment.duration || 'N/A'}</span>
          </div>
          <div className={rowBaseClass}>
            <span className="text-gray-500 text-sm">Service Type</span>
            <span className="text-gray-900 font-semibold">{appointment.service || 'N/A'}</span>
          </div>
          <div className={rowBaseClass}>
            <span className="text-gray-500 text-sm">Location</span>
            <span className="text-gray-900 font-semibold">{appointment.location || 'Home Visit'}</span>
          </div>
          <div className={rowBaseClass}>
            <span className="text-gray-500 text-sm">Appointment ID</span>
            <span className="text-gray-900 font-semibold break-all">{appointment._id || 'N/A'}</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="mt-8 p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
            <p className="text-sm text-gray-600 leading-6">{appointment.notes}</p>
          </div>
        )}

        <AppointmentRatingSection
          appointment={appointment}
          onUpdated={(updated) => {
            setAppointment(updated);
            onRatingSubmitted?.(updated);
          }}
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={onBack}
            className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            Close
          </button>
          {canReschedule ? (
            <button
              onClick={onReschedule}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white font-semibold hover:opacity-95 transition"
            >
              Reschedule Appointment
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="px-5 py-3 rounded-xl bg-gray-100 text-gray-400 font-semibold cursor-not-allowed"
            >
              Reschedule Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
