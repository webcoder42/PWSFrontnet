import React from 'react';

const CertificationTable = ({ data }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-50 bg-gray-25/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <th className="px-10 py-6">PSW Name</th>
            <th className="px-10 py-6">Certification</th>
            <th className="px-10 py-6">Issue Date</th>
            <th className="px-10 py-6">Expiry Date</th>
            <th className="px-10 py-6 text-center">Status</th>
            <th className="px-10 py-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((item) => (
            <tr key={item.id} className="group hover:bg-gray-25/30 transition-colors">
              <td className="px-10 py-8">
                <div className="flex items-center gap-4">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.psw}`} className="w-10 h-10 rounded-xl bg-gray-50" alt="" />
                  <span className="font-bold text-gray-900">{item.psw}</span>
                </div>
              </td>
              <td className="px-10 py-8">
                <span className="text-sm font-medium text-gray-600">{item.certificate}</span>
              </td>
              <td className="px-10 py-8">
                <span className="text-sm font-medium text-gray-400">{item.issueDate}</span>
              </td>
              <td className="px-10 py-8">
                <span className={`text-sm font-bold ${item.status === 'Expired' ? 'text-rose-500' : 'text-gray-900'}`}>
                  {item.expiryDate}
                </span>
              </td>
              <td className="px-10 py-8">
                <div className="flex justify-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-${item.color}-50 text-${item.color}-600 border border-${item.color}-100`}>
                    {item.status}
                  </span>
                </div>
              </td>
              <td className="px-10 py-8 text-right">
                <button className="text-purple-600 text-xs font-bold uppercase tracking-widest hover:underline">Renew</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CertificationTable;
