import React from 'react';

const ReportsStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
    {stats.map((stat, i) => (
      <div key={i} className={`${stat.color} p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-between h-44 ${stat.textColor}`}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">{stat.label}</p>
          <p className="text-4xl font-bold">{stat.value}</p>
        </div>
        <p className="text-[10px] mt-auto font-medium opacity-80">{stat.sub}</p>
      </div>
    ))}
  </div>
);

export default ReportsStats;
