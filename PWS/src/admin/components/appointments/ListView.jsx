import React, { useState } from 'react';
import AppointmentDetailsModal from './AppointmentDetailsModal';

const STATUS_COLORS = {
  Active: 'bg-purple-50 text-purple-600 border-purple-100',
  Pending: 'bg-amber-50 text-amber-600 border-amber-100',
  Completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Cancelled: 'bg-rose-50 text-rose-600 border-rose-100',
};

const PAYMENT_COLORS = {
  paid: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  refunded: 'bg-rose-50 text-rose-600 border-rose-100',
  failed: 'bg-red-50 text-red-600 border-red-100',
};

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ListView = ({ appointments, onBookNew, onReschedule, onViewDetails, selectedAppointment, onCloseDetails, onRescheduleFromDetails }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards');

  const filteredAppointments = appointments.filter(app => {
    const matchesTab = activeTab === 'All' || 
                      (activeTab === 'Active' && (app.status === 'Active' || app.status === 'Pending')) ||
                      app.status === activeTab;
    const matchesSearch = !searchQuery || 
                         (app.psw || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (app.client || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (app.type || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeAppointments = filteredAppointments.filter(app => app.status !== 'Completed');
  const pastAppointments = filteredAppointments.filter(app => app.status === 'Completed');

  const getDayName = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return dayNames[d.getDay()] || '';
    } catch { return ''; }
  };

  const renderPaymentBadge = (payment) => {
    if (!payment) return <span className="text-[9px] text-gray-300">—</span>;
    return (
      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${PAYMENT_COLORS[payment.status] || 'bg-gray-50 text-gray-500'}`}>
        {payment.status}
      </span>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-5xl font-bold text-gray-900 mb-3 font-serif tracking-tight">Assignments</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center text-gray-400 bg-white px-4 py-2 rounded-2xl border border-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] w-fit">
              <span className="text-[11px] font-bold uppercase tracking-widest leading-none">
                {appointments.length} Total Assignments
              </span>
            </div>
            <div className="flex bg-gray-50 p-0.5 rounded-xl">
              <button onClick={() => setViewMode('cards')} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${viewMode === 'cards' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              </button>
              <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${viewMode === 'table' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              </button>
            </div>
          </div>
        </div>
        <button onClick={onBookNew} className="bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white px-10 py-5 rounded-[1.5rem] font-bold flex items-center shadow-[0_20px_50px_rgba(89,21,189,0.15)] hover:shadow-[0_20px_50px_rgba(89,21,189,0.25)] hover:-translate-y-1 transition-all active:scale-[0.98] uppercase tracking-widest text-[11px]">
          <span className="text-xl mr-3 font-normal">+</span> Create Assignment
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md p-3 rounded-[2rem] border border-gray-50 mb-8 flex flex-col md:flex-row items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.02)] gap-4">
        <div className="flex bg-gray-50/50 p-1 rounded-2xl w-full md:w-auto">
          {['All', 'Active', 'Completed', 'Cancelled'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-8 py-3 rounded-[1.25rem] text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white text-purple-600 shadow-sm border border-gray-50' : 'text-gray-400 hover:text-gray-600'
              }`}
            >{tab} {tab === 'All' ? `(${appointments.length})` : `(${appointments.filter(a => (tab === 'Active' ? (a.status === 'Active' || a.status === 'Pending') : a.status === tab)).length})`}</button>
          ))}
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pt-0.5 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </span>
            <input type="text" placeholder="Search PSWs, clients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-[10px] font-bold tracking-tight w-full md:w-64 focus:ring-1 focus:ring-purple-200 outline-none transition-all" />
          </div>
        </div>
      </div>

      {/* === TABLE VIEW === */}
      {viewMode === 'table' && filteredAppointments.length > 0 && (
        <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden mb-16">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-purple-600 text-white text-[9px] font-bold uppercase tracking-widest">
                  <th className="px-5 py-4">PSW</th>
                  <th className="px-5 py-4">Client</th>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Time</th>
                  <th className="px-5 py-4">Duration</th>
                  <th className="px-5 py-4 text-right">Amount</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-center">Payment</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAppointments.map((app, i) => (
                  <tr key={app.id || i} className="hover:bg-gray-25/30 transition-colors cursor-pointer" onClick={() => onViewDetails(app)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[10px] font-bold text-purple-600 shrink-0">
                          {(app.psw || 'PS').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-gray-900">{app.psw || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600 font-medium">{app.client || '—'}</td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">{app.type || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs font-bold text-gray-900">{app.date || '—'}</div>
                      <div className="text-[9px] text-gray-400">{getDayName(app.appointmentDate || app.date)}</div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600">{app.time || '—'}</td>
                    <td className="px-5 py-4 text-xs text-gray-600">{app.duration || '—'}</td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-xs font-bold text-gray-900">${(app.payment?.amount ?? app.price ?? 0).toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase border ${STATUS_COLORS[app.status] || 'bg-gray-50 text-gray-500'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {app.payment ? (
                        <div className="flex flex-col items-center gap-1">
                          {renderPaymentBadge(app.payment)}
                          <span className="text-[9px] text-gray-400">${app.payment.amount.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); onViewDetails(app); }} className="text-[10px] font-bold text-purple-600 hover:underline">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === CARDS VIEW === */}
      {viewMode === 'cards' && (
        <>
          {/* Active Assignments */}
          {(activeTab === 'All' || activeTab === 'Active' || activeTab === 'Cancelled') && activeAppointments.length > 0 && (
            <div className="mb-16">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 ml-1">
                Active & Upcoming Assignments ({activeAppointments.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeAppointments.map((app) => (
                  <div key={app.id} className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:border-purple-200 transition-all cursor-pointer" onClick={() => onViewDetails(app)}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/30 rounded-bl-[100%]"></div>
                    <div className="flex items-center mb-8 relative">
                      <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-600 ring-4 ring-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                        {(app.psw || 'PS').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="ml-5">
                        <h4 className="font-bold text-gray-900 text-lg leading-none mb-1.5">{app.psw}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${app.color === 'emerald' ? 'bg-emerald-500' : 'bg-purple-500'} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}></span>
                          <p className={`${app.color === 'emerald' ? 'text-emerald-600' : 'text-purple-600'} text-[9px] font-bold uppercase tracking-widest`}>PSW</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Client: <span className="text-gray-700">{app.client}</span></p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Service: <span className="text-gray-700">{app.type || 'Care Session'}</span></p>
                    <div className="space-y-3 mb-10">
                      <div className="flex items-center text-gray-600 bg-gray-50/50 p-3 rounded-2xl border border-gray-25">
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-purple-600 mr-4 shadow-xs">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-gray-700">{app.date}</span>
                          <span className="text-[10px] text-gray-400 ml-2">{getDayName(app.appointmentDate || app.date)}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 bg-gray-50/50 p-3 rounded-2xl border border-gray-25">
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-purple-600 mr-4 shadow-xs">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-gray-700">{app.time}</span>
                          <span className="text-[10px] text-gray-400 ml-2">· {app.duration || '1 hour'}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 bg-gray-50/50 p-3 rounded-2xl border border-gray-25">
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-purple-600 mr-4 shadow-xs">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-bold text-gray-700">${(app.payment?.amount ?? app.price ?? 0).toFixed(2)}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${STATUS_COLORS[app.status] || 'bg-gray-50 text-gray-500'}`}>
                            {app.status}
                          </span>
                          {app.payment && (
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase border ${PAYMENT_COLORS[app.payment.status] || ''}`}>
                              {app.payment.status}
                            </span>
                          )}
                        </div>
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

          {/* Completed Assignments */}
          {(activeTab === 'All' || activeTab === 'Completed') && pastAppointments.length > 0 && (
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 ml-1">
                Completed Assignments ({pastAppointments.length})
              </h3>
              <div className="space-y-4 bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-gray-50 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
                {pastAppointments.map((past, i) => (
                  <div key={i} onClick={() => onViewDetails(past)} className="bg-white p-6 rounded-[1.75rem] border border-gray-50 flex flex-col md:flex-row items-start md:items-center group hover:shadow-lg hover:shadow-gray-200/20 transition-all cursor-pointer gap-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">
                        {past.psw} → {past.client} 
                        <span className="text-gray-300 mx-2">·</span> 
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{past.type}</span>
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium tracking-tight">
                        {past.date} @ {past.time} · {past.duration || '1 hour'}
                        {past.payment && <span className="ml-2">· ${past.payment.amount.toFixed(2)}</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {past.payment && renderPaymentBadge(past.payment)}
                      {past.rating != null ? (
                        <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                          <svg className="w-4 h-4 text-orange-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          <span>{past.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">COMPLETED</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {filteredAppointments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-md rounded-[3rem] border border-gray-50">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your filters or search query</p>
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
    </div>
  );
};

export default ListView;
