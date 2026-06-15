import React from 'react';

const DashboardStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
    {stats.map((stat, i) => (
      <div key={i} className={`${
        stat.color === 'purple' ? 'bg-gradient-to-br from-[#5915BD] to-[#7C3AED] text-white' : 'bg-white text-gray-900'
      } rounded-[2.5rem] p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] group hover:-translate-y-1 transition-all duration-500 border border-gray-50`}>
        <div className="absolute top-10 right-10 p-3 rounded-2xl backdrop-blur-md shadow-lg border border-white/20">
           {stat.color === 'purple' ? (
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
           ) : stat.color === 'rose' ? (
             <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
           ) : stat.color === 'sky' ? (
             <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m4-4H8m8 8H8m14-11.5L18.5 3M5.5 3 3 5.5m0 10L5.5 21M18.5 21 21 18.5" /></svg>
           ) : (
             <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
           )}
        </div>
        <p className={`${stat.color === 'purple' ? 'text-purple-100/70' : 'text-gray-400'} text-[10px] font-bold uppercase tracking-widest mb-10`}>{stat.label}</p>
        <h2 className="text-4xl font-bold mb-2 font-serif tracking-tight">{stat.value}</h2>
        <p className={`${stat.color === 'purple' ? 'text-purple-100' : 'text-gray-400'} text-xs font-semibold tracking-wide`}>{stat.sub}</p>
      </div>
    ))}
  </div>
);

export default DashboardStats;
