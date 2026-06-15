import React from 'react';

const PswsHeader = ({ onOnboard }) => (
  <div className="mb-12 flex justify-between items-end">
    <div>
      <h2 className="text-5xl font-bold text-gray-900 mb-2 font-serif leading-tight">PSW Management</h2>
      <p className="text-gray-400 text-sm font-medium tracking-tight">Monitor and manage all support workers on the platform.</p>
    </div>
    <button onClick={onOnboard} className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 hover:-translate-y-1 transition-all">Onboard New PSW</button>
  </div>
);

export default PswsHeader;
