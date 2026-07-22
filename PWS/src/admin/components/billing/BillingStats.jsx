import React from 'react';

const colorMap = {
  purple: 'text-purple-600',
  orange: 'text-orange-600',
  emerald: 'text-emerald-600',
  rose: 'text-rose-600',
};

const BillingStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
    {stats.map((stat) => (
      <div key={stat.label} className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] group hover:-translate-y-1 transition-all duration-500">
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6">{stat.label}</p>
        <h2 className={`text-4xl font-bold mb-2 font-serif ${colorMap[stat.color] || 'text-gray-900'}`}>{stat.value}</h2>
        <p className="text-gray-400 text-xs font-semibold tracking-tight">{stat.sub}</p>
      </div>
    ))}
  </div>
);

export default BillingStats;
