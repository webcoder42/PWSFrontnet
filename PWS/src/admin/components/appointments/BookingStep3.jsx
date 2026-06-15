import React from 'react';

const BookingStep3 = ({ assignment, onUpdate, onBack, onContinue }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
    <div className="mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-3 font-serif tracking-tight">Select Date & Time</h2>
      <div className="flex items-center text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-xl w-fit border border-purple-100">
         Step 04 <span className="mx-2 opacity-30 text-gray-400">·</span> <span className="text-gray-400">Assignment Scheduling</span>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Selection Column */}
      <div className="lg:col-span-8 space-y-10">
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 block ml-1">Appointment Date</label>
          <input 
            type="date" 
            value={assignment.date}
            onChange={(e) => onUpdate({ date: e.target.value })}
            className="w-full p-6 bg-[#F9F7FF] border border-purple-50 rounded-[1.75rem] text-xl font-bold text-gray-900 font-serif outline-none focus:border-purple-200 transition-all"
          />
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 block ml-1">Select Time Slot</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {['09:00 AM – 10:00 AM', '11:00 AM – 12:00 PM', '02:00 PM – 03:00 PM', '04:00 PM – 05:00 PM'].map(time => (
              <button 
                key={time} 
                onClick={() => onUpdate({ time })}
                className={`py-4 rounded-2xl border-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  assignment.time === time ? 'bg-purple-600 border-purple-600 text-white shadow-xl shadow-purple-100' : 'bg-white border-gray-50 text-gray-700 hover:border-purple-200'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Column */}
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm">
          <h3 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-8 border-b border-gray-50 pb-4">Assignment Review</h3>
          <div className="space-y-6">
            <div>
              <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest mb-1">Client</p>
              <p className="text-sm font-bold text-gray-900">{assignment.client || 'None Selected'}</p>
            </div>
            <div>
              <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest mb-1">PSW</p>
              <p className="text-sm font-bold text-gray-900">{assignment.psw || 'None Selected'}</p>
            </div>
            <div>
              <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest mb-1">Service</p>
              <p className="text-sm font-bold text-gray-900">{assignment.type || 'None Selected'}</p>
            </div>
            <div>
              <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest mb-1">Schedule</p>
              <p className="text-sm font-bold text-gray-900">{assignment.date} @ {assignment.time}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
      <button onClick={onBack} className="text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-purple-600 transition-all">Back</button>
      <button 
        onClick={onContinue} 
        className="px-12 py-5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-[1.5rem] font-bold shadow-xl shadow-purple-100 hover:shadow-purple-200 transition-all uppercase tracking-widest text-[11px]"
      >
        Finalize Assignment
      </button>
    </div>
  </div>
);

export default BookingStep3;
