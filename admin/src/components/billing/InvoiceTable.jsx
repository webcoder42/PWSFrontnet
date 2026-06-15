import React from 'react';

const InvoiceTable = ({ invoices }) => (
  <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden">
    <div className="p-10 border-b border-gray-50 flex justify-between items-center">
      <h3 className="text-2xl font-bold font-serif">Recent Invoices</h3>
      <button className="bg-purple-600 text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-purple-200">Generate Report</button>
    </div>
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-gray-50 bg-gray-25/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <th className="px-10 py-6">Invoice ID</th>
          <th className="px-10 py-6">Client</th>
          <th className="px-10 py-6">Date</th>
          <th className="px-10 py-6 text-right">Amount</th>
          <th className="px-10 py-6 text-center">Status</th>
          <th className="px-10 py-6 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {invoices.map((inv) => (
          <tr key={inv.id} className="group hover:bg-gray-25/30 transition-colors">
            <td className="px-10 py-8">
              <span className="font-bold text-gray-900">{inv.id}</span>
            </td>
            <td className="px-10 py-8">
              <span className="text-sm font-medium text-gray-600">{inv.client}</span>
            </td>
            <td className="px-10 py-8">
              <span className="text-sm font-medium text-gray-400">{inv.date}</span>
            </td>
            <td className="px-10 py-8 text-right">
              <span className="text-sm font-bold text-gray-900">${inv.amount.toFixed(2)}</span>
            </td>
            <td className="px-10 py-8 text-center">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-${inv.color}-50 text-${inv.color}-600 border border-${inv.color}-100`}>
                {inv.status}
              </span>
            </td>
            <td className="px-10 py-8 text-right">
              <button className="text-purple-600 text-xs font-bold uppercase tracking-widest hover:underline">View PDF</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default InvoiceTable;
