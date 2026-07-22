import React from 'react';

interface PaymentMethodCardProps {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  cardholderName?: string;
  isDefault?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function PaymentMethodCard({
  brand,
  last4,
  expMonth,
  expYear,
  cardholderName,
  isDefault,
  isSelected,
  onSelect,
}: PaymentMethodCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left transition-all duration-300 rounded-[1.75rem] border-2 p-4 md:p-6 shadow-sm hover:shadow-md ${
        isSelected
          ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-100'
          : 'border-gray-100 bg-white hover:border-purple-200'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0 ${
            isSelected ? 'bg-purple-100' : 'bg-gray-100'
          }`}>
            <svg className={`w-6 h-6 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-gray-400">{brand?.toUpperCase() || 'Card'}</p>
            <p className="mt-2 text-base md:text-lg font-extrabold tracking-[0.08em] text-gray-900">•••• {last4}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-gray-400">Cardholder</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{cardholderName || 'Saved card'}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-gray-400">Expires</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{String(expMonth).padStart(2, '0')}/{String(expYear).slice(-2)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          {isDefault && (
            <span className="rounded-full bg-purple-100 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-purple-700">
              Primary
            </span>
          )}
          {isSelected && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
