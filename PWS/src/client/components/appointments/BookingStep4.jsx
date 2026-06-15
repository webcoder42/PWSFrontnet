import React, { useMemo, useState } from 'react';
import { formatReadableDate, formatSlotLabel } from '../../utils/providerAvailability';
import { computeBookingEstimate, formatRate } from '../../../utils/servicePricing';

const BookingStep4 = ({ selectedService, selectedProvider, selectedDate, selectedTime, onBackToDashboard, onNavigateToAppointments, onReschedule, onConfirmBooking, onMessageProvider, isSubmitting, selectedDuration = 60 }) => {
  const providerName = selectedProvider?.fullName || [selectedProvider?.firstName, selectedProvider?.lastName].filter(Boolean).join(' ') || 'Care Provider';
  const providerFirstName = selectedProvider?.firstName || 'Care';
  const providerAvatarUrl = selectedProvider?.photoUrl || '';
  const providerRating = Number(selectedProvider?.rating || 0);
  const providerRatingLabel = Number.isFinite(providerRating) && providerRating > 0 ? providerRating.toFixed(1) : 'New';
  const serviceName = selectedService?.name || 'Respite Care';
  const estimate = useMemo(
    () => computeBookingEstimate(selectedService, selectedDuration),
    [selectedService, selectedDuration]
  );
  const amount = formatRate(estimate.total);
  const durationString = selectedDuration >= 180 ? '3+ hours' : selectedDuration === 120 ? '2 hours' : selectedDuration === 90 ? '1.5 hours' : '1 hour';

  const initials = `${selectedProvider?.firstName?.[0] || 'C'}${selectedProvider?.lastName?.[0] || 'P'}`.toUpperCase();
  const appointmentDate = selectedDate ? formatReadableDate(new Date(selectedDate)) : 'Date pending';
  const appointmentTime = selectedTime ? formatSlotLabel(selectedTime) : 'Time pending';
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleConfirmBooking = async () => {
    if (onConfirmBooking) {
      const success = await onConfirmBooking();
      if (success) {
        setShowSuccessModal(true);
      }
    } else {
      setShowSuccessModal(true);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Appointment Scheduled</h2>
        <p className="text-gray-400 text-sm">Review your appointment details below</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
            <div className="bg-gray-25/50 px-8 py-6 flex justify-between items-center border-b border-gray-50">
              <h3 className="text-xl font-bold">Your Appointment Details</h3>
              <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">Scheduled</span>
            </div>

            <div className="p-8">
              <div className="bg-gray-50/50 p-6 rounded-3xl flex items-center mb-10 border border-gray-50">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-6 shadow-lg shadow-purple-100 overflow-hidden">
                  {providerAvatarUrl ? (
                    <img src={providerAvatarUrl} alt={providerName} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Assigned PSW</p>
                  <h4 className="text-xl font-bold">{providerName}</h4>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <span className="text-orange-400 mr-1">★</span>
                    <span className="text-sm font-bold">{providerRatingLabel}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">Verified Caregiver</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-10 gap-x-12 px-2">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mr-5 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Date</p>
                    <p className="text-sm font-bold text-gray-900">{appointmentDate}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mr-5 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Time</p>
                    <p className="text-sm font-bold text-gray-900">{appointmentTime}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mr-5 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012-2v2M7 7h10"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Service</p>
                    <p className="text-sm font-bold text-gray-900">{serviceName}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mr-5 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Location</p>
                    <p className="text-sm font-bold text-gray-900">123 Queen St.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mr-5 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-sm font-bold text-gray-900">{durationString}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mr-5 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Amount</p>
                    <p className="text-sm font-bold text-gray-900">${amount}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-purple-25 rounded-3xl p-8 border border-purple-50 relative">
                <div className="absolute top-8 left-6 w-1 h-32 bg-purple-100/50 rounded-full"></div>
                <h4 className="text-xs font-bold text-purple-800 uppercase tracking-widest mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  What happens next?
                </h4>
                <div className="space-y-6">
                  {[
                    { id: 1, text: `${providerFirstName} will receive your clinical care notes and prepare for the visit.` },
                    { id: 2, text: 'You will receive a reminder notification 24 hours before the appointment.' },
                    { id: 3, text: `Upon arrival, ${providerFirstName} will check-in through the app to begin the care session.` }
                  ].map(step => (
                    <div key={step.id} className="flex ml-8">
                      <span className="text-purple-600 font-bold mr-4 text-xs shrink-0">{step.id}</span>
                      <p className="text-xs text-purple-900/70 font-medium leading-relaxed">{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <button
                type="button"
                onClick={onMessageProvider}
                className="w-full flex items-center justify-center space-x-3 p-4 bg-purple-50 text-purple-600 rounded-2xl font-bold text-xs ring-1 ring-purple-100 hover:bg-purple-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                <span>Message {providerFirstName}</span>
              </button>
              <button type="button" className="w-full flex items-center p-4 bg-white border border-rose-100 text-rose-500 rounded-2xl font-bold text-[10px] hover:bg-rose-50 transition-colors">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Cancel Appointment</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm relative">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Add to Calendar</h3>
            <div className="flex gap-4">
              <button type="button" className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-25 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 bg-white rounded-xl shadow-xs flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <img src="https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png" className="w-6 h-6" alt="Google" />
                </div>
                <span className="text-[10px] font-bold">Google</span>
              </button>
              <button type="button" className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-25 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 bg-white rounded-xl shadow-xs flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-2xl">
                  
                </div>
                <span className="text-[10px] font-bold">Apple</span>
              </button>
            </div>
          </div>

          <div className="bg-purple-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-purple-100">
            <div className="absolute top-4 right-4 text-white/20">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
            </div>
            <p className="text-white text-xs font-bold mb-2">Need assistance?</p>
            <p className="text-purple-100 text-[10px] mb-4 leading-relaxed">Our administrative team is available 24/7 for scheduling changes.</p>
            <button type="button" className="text-[10px] font-bold underline">Contact Support</button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center mt-8 gap-4">
        <button onClick={onBackToDashboard} className="flex items-center space-x-2 text-gray-400 font-bold text-sm hover:text-purple-600 transition-colors shadow-sm bg-white px-6 py-3 rounded-2xl border border-gray-50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7M21 12H3"/></svg>
          <span>Back to Dashboard</span>
        </button>

        <button
          type="button"
          onClick={handleConfirmBooking}
          disabled={isSubmitting}
          className={`px-8 py-4 rounded-[1.5rem] bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-purple-100 hover:-translate-y-1 transition-all active:scale-[0.98] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
        </button>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-10 shadow-2xl text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-100">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Booking Confirmed!</h3>
            <p className="text-sm leading-6 text-gray-400 mb-8">
              Your appointment has been booked successfully. Your care provider will be notified shortly.
            </p>
            <button
              type="button"
              onClick={onNavigateToAppointments || onBackToDashboard}
              className="w-full rounded-2xl bg-gradient-to-r from-[#5915BD] to-[#7C3AED] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-purple-100 hover:-translate-y-1 transition-all active:scale-[0.98] uppercase tracking-widest"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {isSubmitting && !showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-10 shadow-2xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-700">
              <svg className="h-8 w-8 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
                <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Processing Payment</h3>
            <p className="text-sm leading-6 text-gray-400">
              Please wait while we confirm your appointment and charge the selected card.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStep4;
