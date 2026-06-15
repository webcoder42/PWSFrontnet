import React from 'react';

const TicketList = ({ tickets }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'rose';
      case 'Medium': return 'orange';
      case 'Low': return 'emerald';
      default: return 'gray';
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden">
      <div className="p-10 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-2xl font-bold font-serif">Active Tickets</h3>
        <div className="flex gap-2">
          <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-rose-100">2 High Priority</span>
        </div>
      </div>
      <div className="divide-y divide-gray-50">
        {tickets.map((t) => (
          <div key={t.id} className="p-8 hover:bg-gray-25/30 transition-all group flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`w-2 h-12 rounded-full bg-${getPriorityColor(t.priority)}-500 shadow-lg shadow-${getPriorityColor(t.priority)}-100`}></div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.id}</span>
                  <h4 className="font-bold text-gray-900">{t.issue}</h4>
                </div>
                <p className="text-sm text-gray-500 font-medium">{t.user} • <span className="text-gray-400">{t.date}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-100`}>
                {t.status}
              </span>
              <button className="bg-purple-50 text-purple-600 p-2 rounded-xl hover:bg-purple-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketList;
