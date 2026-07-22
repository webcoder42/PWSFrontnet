import React, { useMemo } from 'react';
import { computeBookingEstimate, getServiceHourlyRate } from '../../utils/servicePricing';

const BookingStepPayment = ({
  selectedService,
  bookingDetails,
  paymentMethods = [],
  selectedPaymentMethodId,
  onPaymentMethodChange,
  isLoadingPaymentMethods = false,
  onBack,
  onContinue,
  onNavigate,
}) => {
  const serviceName = selectedService?.name || 'Selected service';
  const selectedDuration = bookingDetails?.duration || '1 hour';
  const durationMinutes = useMemo(() => {
    const lower = selectedDuration.toLowerCase();
    if (lower.includes('1.5')) return 90;
    if (lower.includes('2.5')) return 150;
    if (lower.includes('3.5')) return 210;
    if (lower.includes('3+') || lower.includes('3 ')) return 180;
    if (lower.includes('4')) return 240;
    if (lower.includes('2')) return 120;
    if (lower.includes('hour')) return 60;
    const match = lower.match(/(\d+)/);
    return match ? Number(match[1]) * 60 : 60;
  }, [selectedDuration]);
  const estimate = useMemo(() => computeBookingEstimate(selectedService, durationMinutes), [selectedService, durationMinutes]);
  const total = Number(estimate.total.toFixed(2));

  const handleAddCardClick = () => {
    if (onNavigate) {
      onNavigate('Settings', { state: { view: 'billing' } });
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Method</h2>
        <p className="text-gray-400 text-sm">Choose or add a payment method for your appointment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Left Column: Select / Add Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Your Saved Cards</h3>
              <button
                type="button"
                onClick={handleAddCardClick}
                className="px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-xs font-bold ring-1 ring-purple-100 hover:bg-purple-100 transition-colors"
              >
                + Add New Card
              </button>
            </div>

            {isLoadingPaymentMethods ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="text-sm text-gray-500 mt-2">Loading cards...</p>
              </div>
            ) : paymentMethods.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const isSelected = selectedPaymentMethodId === method.paymentMethodId;
                  return (
                    <div
                      key={method.paymentMethodId}
                      onClick={() => onPaymentMethodChange(method.paymentMethodId)}
                      className={`p-6 rounded-2xl cursor-pointer transition-all border relative flex flex-col justify-between h-40 ${
                        isSelected
                          ? 'bg-gradient-to-br from-purple-50 to-white border-purple-500 ring-2 ring-purple-100 shadow-md shadow-purple-50'
                          : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            {method.brand?.toUpperCase() || 'CARD'}
                          </p>
                          <p className="text-lg font-bold text-gray-900">•••• •••• •••• {method.last4 || '••••'}</p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            ✓
                          </div>
                        )}
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        <div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Expires</p>
                          <p className="text-xs font-bold text-gray-700">
                            {method.expMonth}/{method.expYear}
                          </p>
                        </div>
                        {method.isDefault && (
                          <span className="text-[9px] font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider">
                            Primary
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-gray-800 mb-1">No Saved Cards</h4>
                <p className="text-xs text-gray-400 mb-6 max-w-xs mx-auto">
                  Please add a billing card to continue with your appointment booking.
                </p>
                <button
                  type="button"
                  onClick={handleAddCardClick}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 hover:shadow-lg transition-all"
                >
                  Go to Billing to Add Card
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing Summary */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 md:p-8 rounded-[2rem] border border-purple-100 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Pricing Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Base Care</span>
                <span className="text-sm font-bold text-gray-900">${estimate.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Platform Fee ({(estimate.platformFeePercent || 1.9).toFixed(1)}%)</span>
                <span className="text-sm font-bold text-gray-900">${estimate.platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Tax ({(estimate.taxPercent || 0).toFixed(0)}%)</span>
                <span className="text-sm font-bold text-gray-900">${estimate.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-purple-200 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Total Amount</span>
                <span className="text-lg font-bold text-purple-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-50 shadow-sm">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-4 flex items-center">
              <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure Checkout
            </h4>
            <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
              Your payment information is stored and processed securely via Stripe. We do not store full card numbers on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6 border-t border-gray-100 pt-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors px-4 md:px-6 py-4 rounded-2xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7M21 12H3" />
          </svg>
          <span>Back</span>
        </button>
        <button
          onClick={onContinue}
          disabled={!selectedPaymentMethodId}
          className={`px-6 md:px-10 py-4 font-bold text-white rounded-[1.5rem] flex items-center shadow-lg transition-all active:scale-[0.98] tracking-wider ${
            !selectedPaymentMethodId
              ? 'bg-purple-400 cursor-not-allowed opacity-70'
              : 'bg-gradient-to-r from-[#5915BD] to-[#7C3AED] hover:shadow-purple-200 hover:-translate-y-1'
          }`}
        >
          <span>Continue</span>
          <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M20 12H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BookingStepPayment;
