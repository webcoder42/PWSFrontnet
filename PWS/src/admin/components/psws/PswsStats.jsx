import React from 'react';

const PswsStats = ({ psws }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
    <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total PSWs</p>
      <h3 className="text-4xl font-bold font-serif text-purple-600">{psws.length}</h3>
    </div>
    <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Currently Working</p>
      <h3 className="text-4xl font-bold font-serif text-emerald-500">{psws.filter(p => p.status === 'On Shift').length}</h3>
    </div>
    <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Avg Platform Rating</p>
      <h3 className="text-4xl font-bold font-serif text-orange-500">
        {psws.length ? (psws.reduce((acc, curr) => acc + (curr.rating || 0), 0) / psws.length).toFixed(1) : '0.0'}
      </h3>
    </div>
  </div>
);

export default PswsStats;
