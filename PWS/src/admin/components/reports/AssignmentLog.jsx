import React, { useMemo } from 'react';

const AssignmentLog = ({ appointments = [], activeFilter, setActiveFilter, onNavigate }) => {
  const filtered = useMemo(() => {
    if (activeFilter === 'All') return appointments;
    return appointments.filter(a => a.status === activeFilter);
  }, [appointments, activeFilter]);

  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long' });

  return (
    <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
      <div className="p-8 pb-0 flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-gray-900">Assignment Log</h3>
        <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
           <span className="text-xs font-bold text-gray-700 mx-3">{monthName} {now.getFullYear()}</span>
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
        {filtered.length === 0 && (
          <p className="text-center py-12 text-gray-400 text-sm font-medium">No assignments found.</p>
        )}
        {filtered.slice(0, 5).map((app, idx) => {
          const d = app.appointmentDate ? new Date(app.appointmentDate) : null;
          const day = d ? d.getDate() : '--';
          const shortMonth = d ? d.toLocaleString('default', { month: 'short' }) : monthName.slice(0, 3);
          const isActive = app.status === 'Active' || app.status === 'confirmed';
          const timeStr = app.time || (d ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--');
          return (
            <div key={app._id || idx} className={`${isActive ? 'bg-purple-25 border-purple-50' : 'bg-white border-gray-50'} p-6 rounded-3xl border flex items-center group cursor-pointer transition-all hover:shadow-md`}>
              <div className={`w-14 h-14 ${isActive ? 'bg-white' : 'bg-gray-50'} rounded-2xl flex flex-col items-center justify-center text-purple-600 mr-6 shadow-xs group-hover:scale-105 transition-transform`}>
                <span className="text-[10px] font-bold uppercase leading-none mb-1">{shortMonth}</span>
                <span className="text-xl font-bold leading-none">{day}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{app.client || 'Client'} → {app.psw || 'PSW'}</h4>
                <p className="text-[10px] text-gray-400 font-medium mt-1">{app.type || 'Care Session'} · {app.duration || '1 hour'} session</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-gray-700 mb-1">{timeStr}</p>
                <span className={`${
                  app.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  app.status === 'Active' ? 'bg-purple-50 text-purple-600' :
                  app.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                  'bg-amber-50 text-amber-600 border-amber-100'
                } text-[8px] font-bold px-3 py-1 rounded-full uppercase border`}>{app.status || 'Pending'}</span>
              </div>
            </div>
          );
        })}

        <button onClick={() => onNavigate('Appointments')} className="w-full py-4 text-purple-600 text-xs font-bold flex items-center justify-center gap-2 mt-4 hover:bg-purple-25 rounded-2xl transition-all">
          View All Assignments <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </button>
      </div>
    </div>
  );
};

export default AssignmentLog;
