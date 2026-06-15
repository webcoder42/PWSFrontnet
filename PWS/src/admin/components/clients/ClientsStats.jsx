import React from 'react';

const ClientsStats = ({ clients }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
    <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Clients</p>
      <h3 className="text-4xl font-bold font-serif text-purple-600">{clients.length}</h3>
    </div>
    <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Active This Month</p>
      <h3 className="text-4xl font-bold font-serif text-emerald-500">{clients.filter(c => c.status === 'Active').length}</h3>
    </div>
    <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Pending Onboarding</p>
      <h3 className="text-4xl font-bold font-serif text-orange-500">{clients.filter(c => c.status === 'Pending').length}</h3>
    </div>
  </div>
);

export default ClientsStats;
