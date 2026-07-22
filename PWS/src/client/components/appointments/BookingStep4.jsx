import React, { useState, useMemo } from 'react';
import { computeBookingEstimate, getServiceHourlyRate } from '../../utils/servicePricing';

const BookingStep4 = ({ 
  selectedService, 
  selectedProvider, 
  bookingDetails, 
  isSubmitting, 
  paymentMethods = [],
  selectedPaymentMethodId,
  onPaymentMethodChange,
  isLoadingPaymentMethods = false,
  onBack,
  onBackToDashboard, 
  onReschedule, 
  onNavigateToAppointments, 
  onConfirmBooking 
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentState, setPaymentState] = useState(null); // null | 'processing' | 'success' | 'error'
  const [paymentDetails, setPaymentDetails] = useState(null); // { chargeId, amount, timestamp }
  const [paymentError, setPaymentError] = useState(null);
  
  const providerName = selectedProvider?.fullName || 'Care Provider';
  const serviceName = selectedService?.name || 'Selected service';
  const selectedDate = bookingDetails?.date || 'Select a date';
  const selectedTime = bookingDetails?.time || 'Select a time';
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
  const initials = providerName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const selectedCard = paymentMethods.find(m => m.paymentMethodId === selectedPaymentMethodId);

  const handleConfirm = async () => {
    if (!selectedPaymentMethodId) {
      setPaymentState('error');
      setPaymentError('Please select a payment method to proceed with the booking.');
      return;
    }

    if (onConfirmBooking) {
      setPaymentState('processing');
      setPaymentError(null);
      
      try {
        const result = await onConfirmBooking();
        
        // Artificial delay to ensure the processing animation is visible for a premium feel
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (result && result.success) {
          setPaymentState(null);
          setShowSuccess(true);
        } else if (result && result.error) {
          setPaymentState('error');
          setPaymentError(result.error || 'Payment processing failed');
        } else {
          throw new Error('Unknown payment error');
        }
      } catch (error) {
        setPaymentState('error');
        setPaymentError(error.message || 'Payment processing failed');
      }
    }
  };



  // Payment Processing Modal
  if (paymentState === 'processing') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 md:p-12 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 relative overflow-hidden">
              <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 border-r-purple-600 rounded-full animate-spin"></div>
              <svg className="w-10 h-10 text-purple-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Processing Payment</h3>
            <p className="text-gray-500 text-center mb-8">
              Charging <span className="font-bold">${total.toFixed(2)}</span> to card ending in <span className="font-bold">{selectedCard?.last4}</span>
            </p>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-500 h-full animate-pulse"></div>
            </div>
            <p className="text-xs text-gray-400 mt-4">Please wait while we process your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  // Payment Error Modal
  if (paymentState === 'error') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 md:p-12 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4v2m0 0v2m0-2v-2m0-2V9m0 0v2m0-2V9m0 0h2m-2 0H9m6-4h2m-2 0h-2m0 0H9m0 0H7m0 0h2m0 0h2"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Payment Failed</h3>
            <p className="text-gray-500 text-center mb-6">
              {paymentError || 'Your payment could not be processed. Please try again with a different card.'}
            </p>

            <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
              <p className="text-xs text-red-700 font-medium">
                <strong>Amount attempted:</strong> ${total.toFixed(2)}
                <br/>
                <strong>Card:</strong> •••• {selectedCard?.last4}
              </p>
            </div>

            <button 
              onClick={() => setPaymentState(null)}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-[0.98] mb-3"
            >
              Try Another Card
            </button>
            <button 
              onClick={onBackToDashboard}
              className="w-full py-3 bg-gray-50 text-gray-600 rounded-2xl font-bold border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-700 bg-white rounded-3xl p-6 md:p-12 text-center shadow-xl border border-gray-100 max-w-xl mx-auto mt-20">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
        <p className="text-gray-500 mb-10 leading-relaxed">
          Your payment of <span className="font-bold text-gray-900">${total.toFixed(2)}</span> has been processed and your appointment has been confirmed. Your care provider will be notified shortly.
        </p>
        <div className="flex flex-col space-y-4">
          <button onClick={onNavigateToAppointments || onBackToDashboard} className="w-full py-4 bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-[0.98]">
            Back to Dashboard
          </button>
          <button onClick={() => setShowSuccess(false)} className="w-full py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold border border-gray-200 hover:bg-gray-100 transition-colors">
            Continue reviewing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Appointment Scheduled</h2>
        <p className="text-gray-400 text-sm">Review your appointment details below</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
            <div className="bg-gray-25/50 px-8 py-6 flex justify-between items-center border-b border-gray-50">
              <h3 className="text-xl font-bold">Your Appointment Details</h3>
              <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">Scheduled</span>
            </div>

            <div className="p-8">
              <div className="bg-gray-50/50 p-6 rounded-3xl flex items-center mb-10 border border-gray-50">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-6 shadow-lg shadow-purple-100">{initials}</div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Assigned PSW</p>
                  <h4 className="text-xl font-bold">{providerName}</h4>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <span className="text-orange-400 mr-1">★</span>
                    <span className="text-sm font-bold">{Number(selectedProvider?.rating || 4.9).toFixed(1)}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">{Number(selectedProvider?.rating || 4.9) * 25} Reviews</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 px-2">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mr-5 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Date</p>
                    <p className="text-sm font-bold text-gray-900">{selectedDate}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mr-5 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Time</p>
                    <p className="text-sm font-bold text-gray-900">{selectedTime}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mr-5 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012-2v2M7 7h10"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Service</p>
                    <p className="text-sm font-bold text-gray-900">{serviceName}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mr-5 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Location</p>
                    <p className="text-sm font-bold text-gray-900">123 Queen St.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mr-5 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-sm font-bold text-gray-900">{selectedDuration}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mr-5 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Amount</p>
                    <p className="text-sm font-bold text-gray-900">${total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-purple-25 rounded-3xl p-6 md:p-8 border border-purple-50 relative">
                <div className="absolute top-8 left-6 w-1 h-32 bg-purple-100/50 rounded-full"></div>
                <h4 className="text-xs font-bold text-purple-800 uppercase tracking-widest mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  What happens next?
                </h4>
                <div className="space-y-6">
                  {[
                    { id: 1, text: `${providerName} will receive your clinical care notes and prepare for the visit.` },
                    { id: 2, text: 'You will receive a reminder notification 24 hours before the appointment.' },
                    { id: 3, text: `Upon arrival, ${providerName} will check-in through the app to begin the care session.` }
                  ].map((step) => (
                    <div key={step.id} className="flex ml-8">
                      <span className="text-purple-600 font-bold mr-4 text-xs shrink-0">{step.id}</span>
                      <p className="text-xs text-purple-900/70 font-medium leading-relaxed">{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Payment Method Section */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-50 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Method</h3>
            
            {selectedCard ? (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {selectedCard.brand === 'visa' ? 'V' : selectedCard.brand === 'mastercard' ? 'M' : 'C'}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-900">{selectedCard.brand?.toUpperCase() || 'Card'}</p>
                      <p className="text-[10px] text-gray-500">•••• {selectedCard.last4 || '••••'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {selectedCard.isDefault && (
                      <span className="text-[8px] font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded mb-1">Primary</span>
                    )}
                    <p className="text-[10px] text-gray-500">{selectedCard.expMonth}/{selectedCard.expYear}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-rose-500 font-bold">No payment method selected.</p>
            )}
          </div>

          {/* Pricing Summary */}
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

          {/* Quick Actions */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-50 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center space-x-3 p-4 bg-purple-50 text-purple-600 rounded-2xl font-bold text-xs ring-1 ring-purple-100 hover:bg-purple-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                <span>Message {providerName.split(' ')[0]}</span>
              </button>
              <button onClick={onReschedule} className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <span>Reschedule</span>
                </div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </button>
              <button className="w-full flex items-center p-4 bg-white border border-rose-100 text-rose-500 rounded-2xl font-bold text-[10px] hover:bg-rose-50 transition-colors">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Cancel Appointment</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-50 shadow-sm relative">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Add to Calendar</h3>
            <div className="flex gap-4">
              <button className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-25 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 bg-white rounded-xl shadow-xs flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <img src="https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png" className="w-6 h-6" alt="Google" />
                </div>
                <span className="text-[10px] font-bold">Google</span>
              </button>
              <button className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-25 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 bg-white rounded-xl shadow-xs flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-2xl">
                  
                </div>
                <span className="text-[10px] font-bold">Apple</span>
              </button>
            </div>
          </div>

          <div className="bg-purple-600 rounded-[2rem] p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-purple-100">
            <div className="absolute top-4 right-4 text-white/20">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
            </div>
            <p className="text-white text-xs font-bold mb-2">Need assistance?</p>
            <p className="text-purple-100 text-[10px] mb-4 leading-relaxed">Our administrative team is available 24/7 for scheduling changes.</p>
            <button className="text-[10px] font-bold underline">Contact Support</button>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6 border-t border-gray-100 pt-8">
        <button onClick={onBack} className="flex items-center space-x-2 text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors px-4 md:px-6 py-4 rounded-2xl">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7M21 12H3"/></svg>
          <span>Back</span>
        </button>
        <button onClick={handleConfirm} disabled={isSubmitting || !selectedPaymentMethodId} className={`px-6 md:px-10 py-4 font-bold text-white rounded-[1.5rem] flex items-center shadow-lg transition-all active:scale-[0.98] tracking-wider ${isSubmitting || !selectedPaymentMethodId ? 'bg-purple-400 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-[#5915BD] to-[#7C3AED] hover:shadow-purple-200 hover:-translate-y-1'}`}>
          {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
          {!isSubmitting && <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
        </button>
      </div>
    </div>
  );
};

export default BookingStep4;
