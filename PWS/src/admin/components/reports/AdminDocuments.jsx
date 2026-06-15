import React from 'react';

const AdminDocuments = () => (
  <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm">
     <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-gray-900">Admin Documents</h3>
        <button className="bg-purple-50 text-purple-600 text-[10px] font-bold px-3 py-1.5 rounded-xl hover:bg-purple-100 transition-colors uppercase">Upload +</button>
     </div>
     <div className="space-y-6">
        <div className="flex items-center group cursor-pointer">
          <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mr-4 shadow-xs group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-gray-900">PSW Utilization Report</h4>
            <p className="text-[10px] text-gray-400">PDF · 3.4 MB</p>
          </div>
          <button className="text-gray-300 hover:text-purple-600 p-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></button>
        </div>
        <div className="flex items-center group cursor-pointer">
          <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 mr-4 shadow-xs group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-gray-900">Client Onboarding Q1</h4>
            <p className="text-[10px] text-gray-400">XLSX · 1.8 MB</p>
          </div>
          <button className="text-gray-300 hover:text-purple-600 p-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></button>
        </div>
     </div>
     <button className="text-purple-600 text-[10px] font-bold flex items-center mt-8 hover:underline uppercase tracking-wide">
       All Documents <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
     </button>
  </div>
);

export default AdminDocuments;
