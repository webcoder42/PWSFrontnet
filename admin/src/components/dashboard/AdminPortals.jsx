import React from 'react';

const AdminPortals = ({ onNavigate }) => (
  <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50">
    <h3 className="text-xl font-bold mb-8 font-serif leading-none">Admin Portals</h3>
    <div className="grid grid-cols-2 gap-5">
      <button onClick={() => onNavigate("Appointments")} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#F9F7FF] border border-transparent hover:border-purple-200 transition-all group">
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <span className="text-[9px] font-bold text-center text-purple-900 uppercase tracking-widest">Scheduling</span>
      </button>
      <button onClick={() => onNavigate("Compliance")} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#F9F7FF] border border-transparent hover:border-purple-200 transition-all group">
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
        <span className="text-[9px] font-bold text-center text-purple-900 uppercase tracking-widest">Compliance</span>
      </button>
      <button onClick={() => onNavigate("Billing")} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#F9F7FF] border border-transparent hover:border-purple-200 transition-all group">
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        </div>
        <span className="text-[9px] font-bold text-center text-purple-900 uppercase tracking-widest">Billing</span>
      </button>
      <button onClick={() => onNavigate("Support")} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#F9F7FF] border border-transparent hover:border-purple-200 transition-all group">
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        </div>
        <span className="text-[9px] font-bold text-center text-purple-900 uppercase tracking-widest">Support</span>
      </button>
      <div className="col-span-2">
         <button onClick={() => onNavigate("Reports")} className="w-full flex items-center justify-between p-6 rounded-3xl bg-gray-25/50 border border-transparent hover:border-purple-100 transition-all group">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Reports & Analytics</span>
           </div>
           <svg className="w-4 h-4 text-gray-300 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  </div>
);

export default AdminPortals;
