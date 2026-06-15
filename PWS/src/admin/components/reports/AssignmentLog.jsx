import React from 'react';

const AssignmentLog = ({ activeFilter, setActiveFilter, onNavigate }) => (
  <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
    <div className="p-8 pb-0 flex justify-between items-center mb-8">
      <h3 className="text-xl font-bold text-gray-900">Assignment Log</h3>
      <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
         <button className="text-gray-400 hover:text-gray-600 p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg></button>
         <span className="text-xs font-bold text-gray-700 mx-3">March 2026</span>
         <button className="text-gray-400 hover:text-gray-600 p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg></button>
      </div>
    </div>
    
    <div className="px-8 flex gap-2 mb-8 border-b border-gray-50 pb-6">
      {['All', 'Completed', 'Pending', 'Cancelled'].map(t => (
        <button key={t} onClick={() => setActiveFilter(t)} className={`px-5 py-2 rounded-xl text-[11px] font-bold transition-all ${
          activeFilter === t ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'text-gray-400 hover:bg-gray-50'
        }`}>{t}</button>
      ))}
    </div>

    <div className="space-y-4 px-8 pb-8">
      <div className="bg-purple-25 p-6 rounded-3xl border border-purple-50 flex items-center group cursor-pointer transition-all hover:shadow-md hover:shadow-purple-50">
         <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center text-purple-600 mr-6 shadow-xs group-hover:scale-105 transition-transform">
            <span className="text-[10px] font-bold uppercase leading-none mb-1">Mar</span>
            <span className="text-xl font-bold leading-none">16</span>
         </div>
         <div className="flex-1">
            <h4 className="font-bold text-gray-900">Sarah Johnson → Jack Hudson</h4>
            <p className="text-[10px] text-gray-400 font-medium mt-1">Personal Care · 1 hour session</p>
         </div>
         <div className="text-right">
            <p className="text-[11px] font-bold text-purple-600 mb-1">11:00 AM – 12:00 PM</p>
            <span className="bg-purple-50 text-[8px] font-bold px-3 py-1 rounded-full text-purple-600 uppercase">Active</span>
         </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-50 flex items-center group cursor-pointer transition-all hover:bg-gray-25/50 border-dashed">
         <div className="w-14 h-14 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-400 mr-6">
            <span className="text-[10px] font-bold uppercase leading-none mb-1">Mar</span>
            <span className="text-xl font-bold leading-none">10</span>
         </div>
         <div className="flex-1">
            <h4 className="font-bold text-gray-900">Emily Davis → Robert Chen</h4>
            <p className="text-[10px] text-gray-400 font-medium mt-1">Physiotherapy · 1.5 hour session</p>
         </div>
         <div className="text-right flex items-center space-x-4">
            <div>
              <p className="text-[11px] font-bold text-gray-700 mb-1">10:00 AM – 11:30 AM</p>
              <span className="bg-emerald-50 text-[8px] font-bold px-3 py-1 rounded-full text-emerald-600 uppercase border border-emerald-100">Completed</span>
            </div>
            <button className="text-purple-600 text-[10px] font-bold hover:underline">Details</button>
         </div>
      </div>

      <button onClick={() => onNavigate('Appointments')} className="w-full py-4 text-purple-600 text-xs font-bold flex items-center justify-center gap-2 mt-4 hover:bg-purple-25 rounded-2xl transition-all">
        View All Assignments <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
      </button>
    </div>
  </div>
);

export default AssignmentLog;
