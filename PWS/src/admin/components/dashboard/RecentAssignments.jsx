import React from 'react';

const formatStatusLabel = (status, date) => {
  const todayIso = new Date().toISOString().split('T')[0];
  const isToday = date === todayIso;
  if (status === 'Active' && isToday) return 'Active — Today';
  if (status === 'Pending') return `Pending — ${date || 'Upcoming'}`;
  return status;
};

const RecentAssignments = ({ appointments = [], onNavigate, onViewAll }) => {
  const recent = appointments.slice(0, 5);

  return (
    <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-bl-[100%] opacity-50"></div>
      <div className="flex justify-between items-center mb-10 relative">
        <h3 className="text-2xl font-bold font-serif">Recent Assignments</h3>
        <button onClick={onViewAll} className="text-purple-600 text-xs font-bold uppercase tracking-widest flex items-center hover:bg-purple-25 px-4 py-2 rounded-xl transition-all border border-purple-50">
          View All
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="space-y-6">
        {recent.length === 0 ? (
          <p className="text-gray-400 text-sm font-medium py-8 text-center">No assignments yet.</p>
        ) : (
          recent.map((app) => (
            <div
              key={app.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center p-8 rounded-[2rem] border gap-6 group transition-all relative overflow-hidden ${
                app.status === 'Active'
                  ? 'border-transparent bg-[#F9F7FF] hover:border-purple-200 hover:shadow-xl hover:shadow-purple-50'
                  : 'border-gray-50 bg-white hover:bg-gray-25/30 border-dashed'
              }`}
            >
              {app.status === 'Active' && <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-600"></div>}
              <img
                src={app.pswPhotoUrl || app.clientPhotoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.psw?.split(' ')[0] || 'PSW'}`}
                className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md shrink-0 group-hover:scale-105 transition-transform"
                alt={app.psw || app.client}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-lg mb-1">{app.psw} → {app.client}</h4>
                <p className="text-purple-600/60 text-[10px] font-bold uppercase tracking-widest">
                  PSW Assigned — {app.type}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col items-end">
                  <p className={`text-[10px] font-bold mb-1 uppercase tracking-wider px-3 py-1 rounded-full ${
                    app.status === 'Active'
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-orange-500 bg-orange-50'
                  }`}>
                    {formatStatusLabel(app.status, app.date)}
                  </p>
                  <span className="text-sm font-bold text-gray-900 leading-none">{app.time}</span>
                </div>
              </div>
            </div>
          ))
        )}

        <button
          onClick={() => onNavigate('Appointments')}
          className="w-full py-6 mt-10 bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white rounded-[2rem] font-bold text-sm shadow-[0_20px_50px_rgba(89,21,189,0.15)] hover:shadow-[0_20px_50px_rgba(89,21,189,0.25)] transition-all hover:-translate-y-1 transform active:scale-[0.98] uppercase tracking-widest"
        >
          Create New Assignment
        </button>
      </div>
    </div>
  );
};

export default RecentAssignments;
