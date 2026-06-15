import React from 'react';

const ClientDetail = ({ client, onBack, onNavigate }) => (
  <div className="animate-in fade-in duration-700">
    <button onClick={onBack} className="mb-8 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-purple-600 flex items-center gap-2">
       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
       Back to Clients
    </button>
    <div className="bg-white rounded-[3rem] p-12 border border-gray-50 shadow-sm flex flex-col md:flex-row gap-12 items-center md:items-start">
       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${client?.seed}`} className="w-48 h-48 rounded-[2.5rem] shadow-xl border-4 border-white" alt={client?.name} />
       <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-2 font-serif">{client?.name}</h2>
          <p className="text-gray-400 font-bold mb-6">{client?.email}</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
             <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <p className="font-bold text-gray-900">{client?.status}</p>
             </div>
             <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Sessions</p>
                <p className="font-bold text-gray-900">{client?.sessions}</p>
             </div>
          </div>
          <div className="mt-10 flex gap-4">
             <button onClick={() => onNavigate('Appointments')} className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-purple-100 hover:-translate-y-1 transition-all">Book Session</button>
             <button className="bg-gray-100 text-gray-600 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">Edit Profile</button>
          </div>
       </div>
    </div>
  </div>
);

export default ClientDetail;
