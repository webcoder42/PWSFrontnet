import React from 'react';
import { getServiceHourlyRate } from '../../utils/servicePricing';

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
const durationOptions = ['1 hour', '1.5 hours', '2 hours', '3+ hours'];

const toHours = (duration) => {
  if (duration === '1.5 hours') return 1.5;
  if (duration === '2 hours') return 2;
  if (duration === '3+ hours') return 3;
  return 1;
};

const BookingStep3 = ({ selectedService, selectedProvider, bookingDetails, onBookingDetailsChange, isSubmitting, onBack, onContinue }) => {
  const providerName = selectedProvider?.fullName || 'Care Provider';
  const serviceName = selectedService?.name || 'Selected service';
  const rate = getServiceHourlyRate(selectedService);
  const selectedTime = bookingDetails?.time || '11:00 AM';
  const selectedDate = bookingDetails?.date || 'Monday, March 16, 2026';
  const selectedDuration = bookingDetails?.duration || '1 hour';
  const durationHours = toHours(selectedDuration);
  const total = Number((rate * durationHours * 1.1).toFixed(2));

  const updateBooking = (key, value) => {
    onBookingDetailsChange((prev) => ({ ...(prev || {}), [key]: value }));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-3 font-serif tracking-tight">Select Date & Time</h2>
        <div className="flex items-center text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-xl w-fit border border-purple-100">
          Step 03 <span className="mx-2 opacity-30 text-gray-400">·</span> <span className="text-gray-400">Schedule Finalization</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 block ml-1">Appointment Date</label>
            <div className="flex items-center justify-between p-6 bg-[#F9F7FF] border border-purple-50 rounded-[1.75rem] cursor-pointer group hover:border-purple-200 hover:shadow-xl hover:shadow-purple-50 transition-all">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#5915BD] mr-6 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 font-serif">{selectedDate}</p>
                  <p className="text-[10px] text-[#5915BD] font-bold uppercase tracking-widest mt-1 opacity-70">Selected Clinical Date</p>
                </div>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-300 group-hover:text-purple-600 transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100%] opacity-30"></div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Available Start Times</label>
            <p className="text-[10px] text-gray-400 mb-10 font-bold uppercase tracking-widest opacity-50 ml-1">Matching Provider Availability</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 relative">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => updateBooking('time', time)}
                  className={`py-4 rounded-2xl border-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                    time === selectedTime ? 'bg-[#5915BD] border-[#5915BD] text-white shadow-xl shadow-purple-100' : 'bg-white border-gray-50 text-gray-700 hover:border-purple-200 hover:bg-purple-50/30'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            <div className="mt-12 pt-10 border-t border-gray-50">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 block ml-1">Care Duration</label>
              <div className="flex flex-wrap gap-4">
                {durationOptions.map((dur) => (
                  <button
                    key={dur}
                    onClick={() => updateBooking('duration', dur)}
                    className={`px-10 py-4 rounded-2xl border-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      dur === selectedDuration ? 'bg-[#5915BD]/5 border-[#5915BD] text-[#5915BD]' : 'bg-white border-gray-50 text-gray-400 hover:border-purple-100'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
              <div className="flex items-center mt-6 ml-1 p-4 bg-blue-50 rounded-2xl border border-blue-100/50 w-fit">
                <svg className="w-4 h-4 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p className="text-[9px] font-bold text-blue-700 uppercase tracking-widest leading-none">Clinical standard: Minimum 1 hour booking required</p>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-gray-50 flex items-center justify-between bg-[#FDFDFF] -mx-10 px-10 pb-2">
              <div>
                <p className="font-bold text-gray-900 text-sm">Recurring Care Schedule?</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 opacity-60">Set a regular clinical consistency</p>
              </div>
              <button className="w-14 h-7 bg-gray-200 rounded-full relative transition-all duration-500 shadow-inner group">
                <div className="w-5 h-5 bg-white rounded-full absolute left-1 top-1 shadow-md transition-all group-hover:scale-110"></div>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden">
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
                  <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest opacity-80">{selectedTime} – {selectedDuration}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-between h-[300px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#5915BD]/40 to-transparent"></div>
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 text-center">Clinical Estimate</h3>
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedDuration} × ${rate.toFixed(2)}/HR</span>
                  <span className="text-sm font-bold text-gray-800">${(rate * durationHours).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Platform Safety Fee (10%)</span>
                  <span className="text-sm font-bold text-gray-800">${(rate * durationHours * 0.1).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-50">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[8px] font-bold text-[#5915BD] uppercase tracking-[0.2em] mb-1">Total Due Estimate</p>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Post-Visit Billing</span>
                </div>
                <span className="text-4xl font-bold text-[#5915BD] font-serif leading-none tracking-tight">${total.toFixed(2)}</span>
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
        <button onClick={onContinue} className="px-12 py-5 bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white rounded-[1.5rem] font-bold flex items-center shadow-xl shadow-purple-100 hover:shadow-purple-200 hover:-translate-y-1 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-[11px]">
          Finalize Appointment <svg className="w-4 h-4 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default BookingStep3;
