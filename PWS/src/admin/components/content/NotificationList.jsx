import React from 'react';

const NotificationList = ({ notifications }) => (
  <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden">
    <div className="p-10 border-b border-gray-50 flex justify-between items-center">
      <h3 className="text-2xl font-bold font-serif">System Notifications</h3>
      <button className="bg-purple-600 text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-purple-200">New Broadcast</button>
    </div>
    <div className="divide-y divide-gray-50">
      {notifications.map((n) => (
        <div key={n.id} className="p-8 hover:bg-gray-25/30 transition-all group flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">{n.title}</h4>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded">{n.type}</span>
                <span className="text-xs text-gray-400 font-medium">Target: {n.target}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${n.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'} border`}>
              {n.status}
            </span>
            <button className="text-gray-400 hover:text-purple-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default NotificationList;
