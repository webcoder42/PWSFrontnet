import React from 'react';

const PswDetail = ({ psw, onBack, onNavigate }) => (
  <div className="animate-in fade-in duration-700">
    <button onClick={onBack} className="mb-8 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-purple-600 flex items-center gap-2">
       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
       Back to List
    </button>
    <div className="bg-white rounded-[3rem] p-12 border border-gray-50 shadow-sm flex flex-col md:flex-row gap-12 items-center md:items-start">
       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${psw?.seed}`} className="w-48 h-48 rounded-[2.5rem] shadow-xl border-4 border-white" alt={psw?.name} />
       <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-2 font-serif">{psw?.name}</h2>
          <p className="text-purple-600 font-bold uppercase tracking-widest text-[10px] mb-6">{psw?.role}</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
             <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <p className="font-bold text-gray-900">{psw?.status}</p>
             </div>
             <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 flex items-center gap-2">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rating</p>
                  <p className="font-bold text-gray-900">{psw?.rating}</p>
                </div>
                <svg className="w-4 h-4 text-orange-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
             </div>
          </div>
          <div className="mt-10 flex gap-4">
             <button onClick={() => onNavigate('Appointments')} className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-purple-100 hover:-translate-y-1 transition-all">Assign Shift</button>
             <button className="bg-gray-100 text-gray-600 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">Performance Review</button>
          </div>
       </div>
    </div>
  </div>
);

export default PswDetail;
