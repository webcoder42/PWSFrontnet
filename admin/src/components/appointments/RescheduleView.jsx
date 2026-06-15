import React from 'react';

const RescheduleView = ({ onBack }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="mb-8">
      <button onClick={onBack} className="text-purple-600 font-bold text-sm flex items-center hover:opacity-70 transition-all mb-4">
         <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
         Back to Appointment Details
      </button>
      <h2 className="text-4xl font-bold text-gray-900 mb-2">Reschedule Appointment</h2>
      <p className="text-gray-400 text-sm">Change the date and time for your upcoming visit</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      <div className="lg:col-span-2 space-y-8">
        {/* Current Booking Header */}
        <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-400"></div>
          <div className="p-8">
             <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Current Booking</p>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full uppercase">Mon, Mar 16</span>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-14 h-14 rounded-2xl object-cover ring-4 ring-gray-25 shadow-sm" alt="Sarah" />
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Post–Operative Care</p>
                  </div>
                </div>
                <div className="bg-orange-50 px-6 py-2 rounded-2xl border border-orange-100/50">
                  <p className="text-orange-600 font-bold text-xs uppercase">11:00 AM – 12:00 PM</p>
                </div>
             </div>
             <div className="mt-8 bg-orange-50/50 p-4 rounded-2xl border border-orange-100/30 flex items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-400 mr-4 shrink-0 shadow-xs ring-1 ring-orange-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <p className="text-[11px] text-orange-600 font-bold">Rescheduling is free up to 24 hours before the visit</p>
             </div>
          </div>
        </div>

        {/* Select New Date & Time */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm">
           <h3 className="text-xl font-bold text-gray-900 mb-8">Select New Date & Time</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <div>
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">New Date</label>
                   <div className="flex items-center justify-between p-4 bg-gray-25 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                         <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                         <span className="font-bold text-gray-700 text-sm">Wednesday, March 18, 2026</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                   </div>
                 </div>

                 <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Selections</p>
                    <div className="flex flex-wrap gap-3">
                       {['TOMORROW', 'THIS WEDNESDAY', 'NEXT WEEK'].map(chip => (
                         <button key={chip} className={`px-5 py-2 rounded-full text-[9px] font-bold tracking-wider transition-all border ${
                           chip === 'THIS WEDNESDAY' ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-100' : 'bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-100'
                         }`}>{chip}</button>
                       ))}
                    </div>
                 </div>
              </div>

              <div>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Available Times (Mar 18)</p>
                 <div className="grid grid-cols-2 gap-3 mb-6">
                    {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:30 PM', '02:30 PM', '03:30 PM', '04:30 PM'].map(time => (
                      <button key={time} className={`py-3 rounded-xl border text-[11px] font-bold transition-all ${
                        time === '10:00 AM' ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-white border-gray-100 text-gray-800 hover:border-purple-200 hover:bg-purple-25'
                      }`}>
                        {time}
                      </button>
                    ))}
                 </div>
                 <div className="bg-gray-50/50 p-4 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Waitlisting for other times is currently unavailable for this patient provider pairing.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Sidebar Summary */}
      <div className="space-y-6">
        <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden flex flex-col h-full">
           <div className="bg-purple-25 px-8 py-6 border-b border-purple-50">
              <h3 className="text-xs font-bold text-purple-900 uppercase tracking-widest flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Summary of Changes
              </h3>
           </div>
           
           <div className="p-8 flex-1">
              <div className="relative pl-10 space-y-12">
                 {/* Timeline connector */}
                 <div className="absolute left-3 top-2 bottom-2 w-0.5 border-l-2 border-dashed border-purple-200"></div>
                 
                 <div className="relative">
                    <div className="absolute -left-10 top-0.5 w-6 h-6 bg-white border-2 border-purple-200 rounded-full flex items-center justify-center">
                       <div className="w-2.5 h-2.5 bg-gray-100 rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">From</p>
                    <p className="text-xs font-bold text-gray-400 line-through">Mar 16, 2026</p>
                    <p className="text-xs font-bold text-gray-400/70 line-through">11:00 AM — 12:00 PM</p>
                 </div>

                 <div className="relative">
                    <div className="absolute -left-10 top-0.5 w-6 h-6 bg-white border-2 border-purple-600 rounded-full flex items-center justify-center">
                       <div className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">To</p>
                    <p className="text-xs font-bold text-gray-900">Mar 18, 2026</p>
                    <p className="text-sm font-bold text-purple-600">10:00 AM — 11:00 AM</p>
                 </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100">
                 <div className="flex items-center text-emerald-600 bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100 text-[10px] font-bold">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    No additional charges
                 </div>
              </div>
           </div>

           <div className="p-8 pt-0 space-y-4">
              <button className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-lg shadow-purple-100 hover:shadow-purple-200 transition-all hover:-translate-y-1">
                 Confirm Reschedule <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </button>
              <button onClick={onBack} className="w-full bg-white text-gray-600 border border-gray-100 py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-gray-50 transition-colors">
                 Keep Original Booking
              </button>
              <p className="text-[9px] text-gray-400 italic text-center px-4 leading-relaxed font-medium">
                “By confirming, the provider will be notified immediately of the schedule change. Your original slot will be released back to the general pool.”
              </p>
           </div>
        </div>
      </div>
    </div>
  </div>
);

export default RescheduleView;
