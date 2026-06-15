import React from 'react';

const ClientsHeader = ({ onAdd }) => (
  <div className="mb-12 flex justify-between items-end">
    <div>
      <h2 className="text-5xl font-bold text-gray-900 mb-2 font-serif leading-tight">Users Management</h2>
      <p className="text-gray-400 text-sm font-medium tracking-tight">Overview of all registered users and accounts in the platform database.</p>
    </div>
    <button onClick={onAdd} className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 hover:-translate-y-1 transition-all">Add New User</button>
  </div>
);

export default ClientsHeader;
