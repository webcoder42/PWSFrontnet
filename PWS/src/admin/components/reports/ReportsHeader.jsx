import React from 'react';

const ReportsHeader = ({ onExport, onPswReport }) => (
  <div className="flex justify-between items-end mb-8">
    <div>
      <h2 className="text-4xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
      <p className="text-gray-400 text-sm">Monitor platform performance, PSW utilization, and client data.</p>
    </div>
    <div className="flex items-center gap-3">
      <button onClick={onPswReport} className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-2xl font-bold text-sm flex items-center hover:bg-indigo-50 transition-all shadow-sm">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        PSW Report
      </button>
      <button onClick={onExport} className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-2xl font-bold text-sm flex items-center hover:bg-purple-50 transition-all shadow-sm">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
        Export Reports
      </button>
    </div>
  </div>
);

export default ReportsHeader;
