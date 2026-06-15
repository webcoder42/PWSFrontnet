import React from 'react';

const ExportPortal = ({ selectedExports, toggleExport, toggleAllExports, onCancel }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
    <div className="mb-8">
      <h2 className="text-4xl font-bold text-gray-900 mb-2 font-serif">Export Reports</h2>
      <p className="text-gray-400 text-sm">Generate and export platform analytics and operational reports.</p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-800">Selection Filters</h3>
              <button className="text-xs font-bold text-rose-500 hover:underline">Reset Filters</button>
           </div>
           <div className="space-y-8">
              <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Date Range</p>
                 <div className="flex items-center justify-between p-4 bg-gray-25 border border-gray-100 rounded-2xl w-full max-w-md cursor-pointer hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center">
                       <svg className="w-5 h-5 text-gray-400 mr-3 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                       <span className="text-sm font-bold text-gray-700">Mar 1 – Mar 31, 2026</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                 </div>
              </div>
              <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Report Types</p>
                 <div className="flex flex-wrap gap-3">
                    {[
                      { name: 'PSW Performance', active: true },
                      { name: 'Client Reports', active: true },
                      { name: 'Billing Summaries', active: false },
                      { name: 'Compliance Logs', active: false },
                    ].map(type => (
                      <button key={type.name} className={`px-5 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${
                        type.active ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-white border-gray-100 text-gray-600 hover:border-purple-200 hover:bg-purple-25'
                      }`}>{type.name}</button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm relative">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-gray-800">Records to Export</h3>
              <button onClick={toggleAllExports} className="flex items-center text-[10px] font-bold text-purple-600 uppercase tracking-wide bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
                {selectedExports.length === 4 ? 'Deselect All' : 'Select All'}
                <div className={`ml-3 w-5 h-5 rounded-md border-2 flex items-center justify-center ${selectedExports.length === 4 ? 'border-purple-600 bg-purple-600' : 'border-gray-300 bg-white'}`}>
                   {selectedExports.length === 4 && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                </div>
              </button>
           </div>
           <div className="space-y-4">
              {[
                { name: 'PSW Utilization – March 2026', sub: 'Performance Report • 3.4 MB', type: 'Report', color: 'bg-indigo-50 text-indigo-500' },
                { name: 'Client Satisfaction Survey Q1', sub: 'Analytics • 2.1 MB', type: 'Survey', color: 'bg-blue-50 text-blue-500' },
                { name: 'Revenue & Billing Summary', sub: 'Financial Report • 5.8 MB', type: 'Finance', color: 'bg-emerald-50 text-emerald-500' },
                { name: 'PSW Compliance Audit Log', sub: 'Compliance • 1.9 MB', type: 'Audit', color: 'bg-orange-50 text-orange-500' },
              ].map((row, i) => (
                <div key={i} onClick={() => toggleExport(i)} className="flex items-center p-5 rounded-3xl group hover:bg-gray-25/50 border border-transparent hover:border-gray-50 transition-all cursor-pointer">
                   <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mr-5 shrink-0 transition-colors ${selectedExports.includes(i) ? 'border-purple-600 bg-purple-600' : 'border-gray-300 bg-white'}`}>
                      {selectedExports.includes(i) && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                   </div>
                   <div className={`w-11 h-11 ${row.color} rounded-xl ml-1 flex items-center justify-center shrink-0 mr-5 shadow-xs`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{row.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-tight">{row.sub}</p>
                   </div>
                   <span className="text-[9px] font-bold text-gray-400 group-hover:text-purple-600 border border-gray-100 px-3 py-1 rounded-full group-hover:border-purple-200 transition-colors uppercase tracking-widest">{row.type}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden flex flex-col h-full ring-1 ring-gray-25">
           <div className="bg-purple-600 px-10 py-10 relative overflow-hidden">
              <div className="absolute top-8 right-8 text-white/20">
                 <svg className="w-8 h-8 rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Export Summary</h3>
              <p className="text-purple-100 text-sm font-medium leading-relaxed max-w-[200px]">{selectedExports.length} report{selectedExports.length !== 1 ? 's' : ''} selected for processing</p>
           </div>
           <div className="p-10 flex-1 space-y-10">
              <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">File Format</p>
                 <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-bold text-gray-700">PDF (Document Format)</span>
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                 </div>
              </div>
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-lg shadow-purple-100 hover:shadow-purple-200 transition-all hover:-translate-y-1 transform active:scale-[0.98]">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                  Generate & Export
                </button>
                <button onClick={onCancel} className="w-full bg-white text-gray-400 border border-gray-100 py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-gray-50 transition-colors group">Cancel</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

export default ExportPortal;
