import React, { useState } from 'react';
import AppointmentDetailsModal from './AppointmentDetailsModal';

const ListView = ({ appointments, onBookNew, onReschedule, onViewDetails, selectedAppointment, onCloseDetails, onRescheduleFromDetails }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAppointments = appointments.filter(app => {
    const matchesTab = activeTab === 'All' || 
                      (activeTab === 'Active' && (app.status === 'Active' || app.status === 'Pending')) ||
                      app.status === activeTab;
    const matchesSearch = app.psw.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         app.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeAppointments = filteredAppointments.filter(app => app.status !== 'Completed');
  const pastAppointments = filteredAppointments.filter(app => app.status === 'Completed');

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-5xl font-bold text-gray-900 mb-3 font-serif tracking-tight">Assignments</h2>
          <div className="flex items-center text-gray-400 bg-white px-4 py-2 rounded-2xl border border-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] w-fit">
            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span className="text-[11px] font-bold uppercase tracking-widest leading-none">Monday, Mar 16 · All Regions</span>
          </div>
        </div>
        <button onClick={onBookNew} className="bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white px-10 py-5 rounded-[1.5rem] font-bold flex items-center shadow-[0_20px_50px_rgba(89,21,189,0.15)] hover:shadow-[0_20px_50px_rgba(89,21,189,0.25)] hover:-translate-y-1 transition-all active:scale-[0.98] uppercase tracking-widest text-[11px]">
          <span className="text-xl mr-3 font-normal">+</span> Create Assignment
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md p-3 rounded-[2rem] border border-gray-50 mb-10 flex flex-col md:flex-row items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.02)] gap-4">
        <div className="flex bg-gray-50/50 p-1 rounded-2xl w-full md:w-auto">
          {['All', 'Active', 'Completed', 'Cancelled'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-8 py-3 rounded-[1.25rem] text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white text-purple-600 shadow-sm border border-gray-50' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
           <div className="relative flex-1 md:flex-none">
             <span className="absolute inset-y-0 left-0 pl-4 flex items-center pt-0.5 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search PSWs, clients..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-[10px] font-bold tracking-tight w-full md:w-64 focus:ring-1 focus:ring-purple-200 outline-none transition-all" 
              />
           </div>
        </div>
      </div>

      {/* Active Assignments */}
      {(activeTab === 'All' || activeTab === 'Active' || activeTab === 'Cancelled') && activeAppointments.length > 0 && (
        <div className="mb-16">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 ml-1">Active & Upcoming Assignments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeAppointments.map((app) => (
              <div key={app.id} className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:border-purple-200 transition-all cursor-pointer" onClick={() => onViewDetails(app)}>
               <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/30 rounded-bl-[100%]"></div>
               <div className="flex items-center mb-8 relative">
                  <img
                    src={app.pswPhotoUrl || app.clientPhotoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(app.psw || app.client || 'PSW')}`}
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-md shrink-0 group-hover:scale-105 transition-transform"
                    alt={app.psw || app.client}
                  />
                  <div className="ml-5">
                     <h4 className="font-bold text-gray-900 text-lg leading-none mb-1.5">{app.psw}</h4>
                     <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full ${app.color === 'emerald' ? 'bg-emerald-500' : 'bg-purple-500'} mr-2 shadow-[0_0_10px_rgba(0,0,0,0.1)]`}></span>
                        <p className={`${app.color === 'emerald' ? 'text-emerald-600' : 'text-purple-600'} text-[9px] font-bold uppercase tracking-widest`}>PSW — {app.status}</p>
                     </div>
                  </div>
               </div>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Assigned Client: {app.client}</p>
               <div className="space-y-5 mb-10">
                  <div className="flex items-center text-gray-600 bg-gray-50/50 p-3 rounded-2xl border border-gray-25">
                     <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-purple-600 mr-4 shadow-xs"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
                     <span className="text-[11px] font-bold text-gray-700">{app.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 bg-gray-50/50 p-3 rounded-2xl border border-gray-25">
                     <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-purple-600 mr-4 shadow-xs"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                     <span className="text-[11px] font-bold text-gray-700">{app.time}</span>
                  </div>
               </div>
               <div className="flex gap-4">
                 <button onClick={(e) => { e.stopPropagation(); onViewDetails(app); }} className="flex-1 py-4 bg-purple-50 text-purple-600 font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:bg-purple-600 hover:text-white transition-all">Details</button>
                 <button onClick={(e) => { e.stopPropagation(); onReschedule(app); }} className="flex-1 py-4 bg-white border border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all">Reschedule</button>
               </div>
            </div>
            ))}
          </div>
        </div>
      )}
      
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={onCloseDetails}
          onReschedule={() => {
            onCloseDetails();
            onRescheduleFromDetails(selectedAppointment);
          }}
        />
      )}

      {(activeTab === 'All' || activeTab === 'Completed') && pastAppointments.length > 0 && (
        <div>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 ml-1">Completed Assignments</h3>
          <div className="space-y-4 bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-gray-50 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            {pastAppointments.map((past, i) => (
              <div key={i} onClick={() => onViewDetails(past)} className="bg-white p-6 rounded-[1.75rem] border border-gray-50 flex flex-col md:flex-row items-start md:items-center group hover:shadow-lg hover:shadow-gray-200/20 transition-all cursor-pointer gap-6">
                 <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{past.psw} → {past.client} <span className="text-gray-300 mx-2">·</span> <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-sans">{past.type}</span></h4>
                    <p className="text-[10px] text-gray-400 font-medium tracking-tight font-sans">{past.date} @ {past.time}</p>
                 </div>
                 <div className="flex items-center justify-between w-full md:w-auto md:space-x-10">
                    {past.rating != null ? (
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                        <svg className="w-4 h-4 text-orange-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <span>{past.rating.toFixed(1)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3"></div>
                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">COMPLETED</span>
                      </div>
                    )}
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAppointments.length === 0 && pastAppointments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-md rounded-[3rem] border border-gray-50">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
};

export default ListView;
