import React from 'react';

const BillingDetailModal = ({ invoice, onClose }) => {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-[2rem] p-10 max-w-lg w-full mx-6 shadow-2xl border border-gray-50 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold font-serif text-gray-900">Payment Details</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center pb-4 border-b border-gray-50">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Invoice</span>
            <span className="text-sm font-bold text-gray-900">{invoice.id}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium">Client</span>
            <span className="text-sm font-bold text-gray-900">{invoice.client}</span>
          </div>

          {invoice.psw && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">PSW</span>
              <span className="text-sm font-bold text-gray-900">{invoice.psw}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium">Date</span>
            <span className="text-sm font-bold text-gray-900">{invoice.date || 'N/A'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium">Service</span>
            <span className="text-sm font-bold text-gray-900">{invoice.service || 'N/A'}</span>
          </div>

          {invoice.duration && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">Duration</span>
              <span className="text-sm font-bold text-gray-900">{invoice.duration}</span>
            </div>
          )}

          {invoice.time && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">Time</span>
              <span className="text-sm font-bold text-gray-900">{invoice.time}</span>
            </div>
          )}

          {invoice.location && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">Location</span>
              <span className="text-sm font-bold text-gray-900">{invoice.location}</span>
            </div>
          )}

          <div className="border-t border-gray-50 pt-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500 font-medium">Subtotal</span>
              <span className="text-sm font-bold text-gray-900">${(invoice.grossAmount ?? invoice.amount).toFixed(2)}</span>
            </div>
            {invoice.platformFee > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500 font-medium">Platform Fee</span>
                <span className="text-sm text-gray-600">-${invoice.platformFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-50">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-purple-600">${invoice.amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium">Status</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
              invoice.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
              'bg-amber-50 text-amber-600 border border-amber-100'
            }`}>{invoice.status}</span>
          </div>

          {invoice.paymentIntentId && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">Payment Intent</span>
              <span className="text-[10px] font-mono text-gray-600 truncate max-w-[200px]" title={invoice.paymentIntentId}>{invoice.paymentIntentId}</span>
            </div>
          )}

          {invoice.chargeId && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">Charge ID</span>
              <span className="text-[10px] font-mono text-gray-600 truncate max-w-[200px]" title={invoice.chargeId}>{invoice.chargeId}</span>
            </div>
          )}

          {invoice.paidAt && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">Paid At</span>
              <span className="text-sm font-bold text-gray-900">{new Date(invoice.paidAt).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingDetailModal;
