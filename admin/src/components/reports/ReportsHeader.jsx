import React from 'react';

const ReportsHeader = ({ onExport }) => (
  <div className="flex justify-between items-end mb-8">
    <div>
      <h2 className="text-4xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
      <p className="text-gray-400 text-sm">Monitor platform performance, PSW utilization, and client data.</p>
    </div>
    <button onClick={onExport} className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-2xl font-bold text-sm flex items-center hover:bg-purple-50 transition-all shadow-sm">
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
      Export Reports
    </button>
  </div>
);

export default ReportsHeader;
