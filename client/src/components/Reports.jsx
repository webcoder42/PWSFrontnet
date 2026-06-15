import React, { useState } from 'react';

const Reports = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('main'); // 'main' or 'export'

  const stats = [
    { label: 'Total Visits', value: '24', sub: 'Completed Records', color: 'bg-purple-600', textColor: 'text-white' },
    { label: 'This Month', value: '08', sub: 'Active Visits', color: 'bg-white', textColor: 'text-gray-900 border border-gray-50 shadow-sm' },
    { label: 'Hours of Care', value: '36', sub: 'Total hours delivered', color: 'bg-white', textColor: 'text-gray-900 border border-gray-50 shadow-sm' },
    { label: 'Assigned PSWs', value: '03', sub: 'Primary Caregivers', color: 'bg-white', textColor: 'text-gray-900 border border-gray-50 shadow-sm' },
  ];

  const renderMainView = () => (
    <div className="animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Reports</h2>
          <p className="text-gray-400 text-sm">Manage and export your clinical visit documentation.</p>
        </div>
        <button 
          onClick={() => setActiveTab('export')}
          className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-2xl font-bold text-sm flex items-center hover:bg-purple-50 transition-all shadow-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Export Records
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.color} p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-between h-44 ${stat.textColor}`}>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70`}>{stat.label}</p>
              <p className="text-4xl font-bold">{stat.value}</p>
            </div>
            <p className="text-[10px] mt-auto font-medium opacity-80">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Visit Log */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
          <div className="p-8 pb-0 flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-900">Visit Log</h3>
            <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
               <button className="text-gray-400 hover:text-gray-600 p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg></button>
               <span className="text-xs font-bold text-gray-700 mx-3">March 2026</span>
               <button className="text-gray-400 hover:text-gray-600 p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg></button>
            </div>
          </div>
          
          <div className="px-8 flex gap-2 mb-8 border-b border-gray-50 pb-6">
            {['All', 'Completed', 'Pending', 'Cancelled'].map(t => (
              <button key={t} className={`px-5 py-2 rounded-xl text-[11px] font-bold transition-all ${
                t === 'All' ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'text-gray-400 hover:bg-gray-50'
              }`}>{t}</button>
            ))}
          </div>

          <div className="space-y-4 px-8 pb-8">
            <div className="bg-purple-25 p-6 rounded-3xl border border-purple-50 flex items-center group cursor-pointer transition-all hover:shadow-md hover:shadow-purple-50">
               <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center text-purple-600 mr-6 shadow-xs group-hover:scale-105 transition-transform">
                  <span className="text-[10px] font-bold uppercase leading-none mb-1">Mar</span>
                  <span className="text-xl font-bold leading-none">16</span>
               </div>
               <div className="flex-1">
                  <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Personal Care · 1 hour session</p>
               </div>
               <div className="text-right">
                  <p className="text-[11px] font-bold text-purple-600 mb-1">11:00 AM – 12:00 PM</p>
                  <span className="bg-purple-50 text-[8px] font-bold px-3 py-1 rounded-full text-purple-600 uppercase">Upcoming</span>
               </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-50 flex items-center group cursor-pointer transition-all hover:bg-gray-25/50 border-dashed">
               <div className="w-14 h-14 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-400 mr-6 group-hover:bg-white transition-colors">
                  <span className="text-[10px] font-bold uppercase leading-none mb-1">Mar</span>
                  <span className="text-xl font-bold leading-none">10</span>
               </div>
               <div className="flex-1">
                  <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Personal Care · 1 hour session</p>
               </div>
               <div className="text-right flex items-center space-x-4">
                  <div>
                    <p className="text-[11px] font-bold text-gray-700 mb-1">11:00 AM – 12:00 PM</p>
                    <span className="bg-emerald-50 text-[8px] font-bold px-3 py-1 rounded-full text-emerald-600 uppercase border border-emerald-100">Completed</span>
                  </div>
                  <button className="text-purple-600 text-[10px] font-bold hover:underline">View Details</button>
               </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-50 flex items-center group cursor-pointer transition-all hover:bg-gray-25/50 border-dashed">
               <div className="w-14 h-14 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-400 mr-6 group-hover:bg-white transition-colors">
                  <span className="text-[10px] font-bold uppercase leading-none mb-1">Mar</span>
                  <span className="text-xl font-bold leading-none">07</span>
               </div>
               <div className="flex-1">
                  <h4 className="font-bold text-gray-900">Michael Chen</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Medication Management · 30 min</p>
               </div>
               <div className="text-right flex items-center space-x-4">
                  <div>
                    <p className="text-[11px] font-bold text-gray-700 mb-1">02:00 PM – 02:30 PM</p>
                    <span className="bg-emerald-50 text-[8px] font-bold px-3 py-1 rounded-full text-emerald-600 uppercase border border-emerald-100">Completed</span>
                  </div>
                  <button className="text-purple-600 text-[10px] font-bold hover:underline">View Details</button>
               </div>
            </div>

            <button onClick={() => onNavigate('Appointments')} className="w-full py-4 text-purple-600 text-xs font-bold flex items-center justify-center gap-2 mt-4 hover:bg-purple-25 rounded-2xl transition-all">
              View Complete Log <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </button>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-gray-900">Documents</h3>
                <button className="bg-purple-50 text-purple-600 text-[10px] font-bold px-3 py-1.5 rounded-xl hover:bg-purple-100 transition-colors uppercase">Upload +</button>
             </div>
             <div className="space-y-6">
                <div className="flex items-center group cursor-pointer">
                  <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mr-4 shadow-xs group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-900">Visit Report Mar 10</h4>
                    <p className="text-[10px] text-gray-400">PDF · 1.2 MB</p>
                  </div>
                  <button className="text-gray-300 hover:text-purple-600 p-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></button>
                </div>

                <div className="flex items-center group cursor-pointer">
                  <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 mr-4 shadow-xs group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-900">Care Plan Q1 2026</h4>
                    <p className="text-[10px] text-gray-400">DOCX · 450 KB</p>
                  </div>
                  <button className="text-gray-300 hover:text-purple-600 p-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></button>
                </div>
             </div>
             <button className="text-purple-600 text-[10px] font-bold flex items-center mt-8 hover:underline uppercase tracking-wide">
               All Documents <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
             </button>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm relative overflow-hidden">
             <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10">Care Summary — March</h3>
             
             <div className="flex items-end justify-between h-32 mb-8 px-4">
                {[
                  { w: 'W1', h: '40%' },
                  { w: 'W2', h: '80%', active: true },
                  { w: 'W3', h: '30%' },
                  { w: 'W4', h: '50%' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                     <div className={`w-3 ${item.active ? 'bg-purple-600' : 'bg-purple-100'} rounded-full transition-all duration-1000`} style={{ height: item.h }}></div>
                     <span className={`text-[8px] font-bold mt-3 ${item.active ? 'text-purple-600' : 'text-gray-300'}`}>{item.w}</span>
                  </div>
                ))}
             </div>

             <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium tracking-tight">Monthly hours</span>
                  <span className="text-sm font-bold text-gray-900">36.5 hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium tracking-tight">Avg visit time</span>
                  <span className="text-sm font-bold text-gray-900">1h 15m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium tracking-tight">Top Provider</span>
                  <span className="text-sm font-bold text-purple-600">S. Johnson</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExportView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2 font-serif">Export Records</h2>
        <p className="text-gray-400 text-sm">Select documents and reports to export for your records.</p>
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
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Document Types</p>
                   <div className="flex flex-wrap gap-3">
                      {[
                        { name: 'Visit Reports', active: true },
                        { name: 'Care Plans', active: true },
                        { name: 'Medication Logs', active: false },
                        { name: 'Clinical Notes', active: false },
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
                <button className="flex items-center text-[10px] font-bold text-purple-600 uppercase tracking-wide bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
                  Select All
                  <div className="ml-3 w-5 h-5 rounded-md border-2 border-purple-600 flex items-center justify-center bg-purple-600">
                     <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                </button>
             </div>

             <div className="space-y-4">
                {[
                  { name: 'Visit Report – Sarah Johnson (Mar 16)', sub: 'Clinical Assessment • 2.4 MB', type: 'Report', color: 'bg-indigo-50 text-indigo-500' },
                  { name: 'Visit Report – Sarah Johnson (Mar 10)', sub: 'Clinical Assessment • 2.1 MB', type: 'Report', color: 'bg-indigo-50 text-indigo-500' },
                  { name: 'Care Plan Q1 2026', sub: 'Patient Strategy • 5.8 MB', type: 'Strategy', color: 'bg-blue-50 text-blue-500' },
                  { name: 'Visit Report – Michael Chen (Mar 7)', sub: 'Clinical Assessment • 1.9 MB', type: 'Report', color: 'bg-indigo-50 text-indigo-500' },
                  { name: 'Medication Schedule (Current)', sub: 'Active Logs • 840 KB', type: 'Log', color: 'bg-orange-50 text-orange-500' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center p-5 rounded-3xl group hover:bg-gray-25/50 border border-transparent hover:border-gray-50 transition-all cursor-pointer">
                     <div className="w-5 h-5 rounded-md border-2 border-purple-600 flex items-center justify-center bg-purple-600 mr-5 shrink-0">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
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

        {/* Export Card Right */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden flex flex-col h-full ring-1 ring-gray-25">
             <div className="bg-purple-600 px-10 py-10 relative overflow-hidden">
                <div className="absolute top-8 right-8 text-white/20">
                   <svg className="w-8 h-8 rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Export Summary</h3>
                <p className="text-purple-100 text-sm font-medium leading-relaxed max-w-[200px]">5 records selected for processing</p>
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
                  <button onClick={() => setActiveTab('main')} className="w-full bg-white text-gray-400 border border-gray-100 py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-gray-50 transition-colors group">
                    Cancel
                  </button>
                </div>

                <div className="mt-8 bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 flex items-start">
                   <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-blue-500 mr-4 shrink-0 shadow-xs ring-1 ring-blue-100">
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                   </div>
                   <p className="text-[9px] text-blue-800/70 leading-relaxed font-medium">Selected reports will be compiled into a single archive. This process may take a few moments depending on document volume.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {activeTab === 'main' ? renderMainView() : renderExportView()}
    </div>
  );
};

export default Reports;
