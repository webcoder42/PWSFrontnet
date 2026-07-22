import React, { useState } from 'react';
import BillingDetailModal from './BillingDetailModal';

const InvoiceTable = ({ invoices }) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  return (
    <>
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-2xl font-bold font-serif">Recent Invoices</h3>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-purple-200">Generate Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-25/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-10 py-6">Invoice ID</th>
                <th className="px-10 py-6">Client</th>
                <th className="px-10 py-6">PSW</th>
                <th className="px-10 py-6">Date</th>
                <th className="px-10 py-6 text-right">Amount</th>
                <th className="px-10 py-6 text-center">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-10 py-16 text-center text-gray-400 text-sm font-medium">No payments found.</td>
                </tr>
              )}
              {invoices.map((inv) => (
                <tr key={inv.id} className="group hover:bg-gray-25/30 transition-colors">
                  <td className="px-10 py-8">
                    <span className="font-bold text-gray-900">{inv.id}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-sm font-medium text-gray-600">{inv.client}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-sm font-medium text-gray-500">{inv.psw || '—'}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-sm font-medium text-gray-400">{inv.date || '—'}</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <span className="text-sm font-bold text-gray-900">${inv.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      inv.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                      'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button onClick={() => setSelectedInvoice(inv)} className="text-purple-600 text-xs font-bold uppercase tracking-widest hover:underline">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedInvoice && (
        <BillingDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
    </>
  );
};

export default InvoiceTable;
