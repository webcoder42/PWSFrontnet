import React from 'react';

const ClientList = ({ clients, onViewProfile }) => (
  <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-gray-50">
          <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client Name</th>
          <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
          <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sessions</th>
          <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-25">
        {clients.map((client) => (
          <tr key={client.id} className="hover:bg-gray-25/50 transition-colors group">
            <td className="p-8">
              <div className="flex items-center gap-4">
                <img
                  src={client.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.seed}`}
                  className="w-12 h-12 rounded-xl shadow-sm border border-gray-100 object-cover"
                  alt={client.name}
                />
                <div>
                  <p className="font-bold text-gray-900">{client.name}</p>
                  <p className="text-xs text-gray-400">{client.email}</p>
                </div>
              </div>
            </td>
            <td className="p-8">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${
                client.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                client.status === 'Pending' ? 'bg-orange-50 text-orange-500 border-orange-100' :
                'bg-gray-50 text-gray-400 border-gray-100'
              }`}>
                {client.status}
              </span>
            </td>
            <td className="p-8 font-bold text-gray-700">{client.sessions} sessions</td>
            <td className="p-8 text-right">
              <button 
                onClick={() => onViewProfile(client)}
                className="text-purple-600 font-bold text-xs hover:underline"
              >
                View Profile
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ClientList;
