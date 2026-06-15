import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { getStripeWalletAPI } from '../../../utils/api';
import { computeBookingEstimate } from '../../../utils/servicePricing';
import { formatReadableDate, formatSlotLabel } from '../../utils/providerAvailability';
import PaymentMethodCard from '../../../components/payment/PaymentMethodCard';

const BookingStepPayment = ({
  selectedService,
  selectedProvider,
  selectedDate,
  selectedTime,
  selectedDuration,
  selectedPaymentMethodId,
  onPaymentMethodSelect,
  onBack,
  onContinue,
}) => {
  const navigate = useNavigate();
  const { rawUser } = useUser();
  const [wallet, setWallet] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWallet = async () => {
      if (!rawUser?._id && !rawUser?.id) return;
      setIsLoading(true);
      setError(null);
      try {
        const userId = rawUser?._id || rawUser?.id;
        const response = await getStripeWalletAPI(userId);
        setWallet(response.data.wallet);
        const cards = response.data.wallet?.stripePaymentMethods || [];
        if (cards.length > 0) {
          const defaultCard = cards.find((c) => c.isDefault) || cards[0];
          setSelectedCardId(defaultCard.paymentMethodId);
          onPaymentMethodSelect?.(defaultCard.paymentMethodId);
        }
      } catch (loadError) {
        console.error('Unable to load payment wallet', loadError);
        setError(loadError?.message || 'Failed to load saved payment cards.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadWallet();
  }, [rawUser]);

  useEffect(() => {
    if (selectedPaymentMethodId && selectedPaymentMethodId !== selectedCardId) {
      setSelectedCardId(selectedPaymentMethodId);
    }
  }, [selectedPaymentMethodId, selectedCardId]);

  const savedCards = wallet?.stripePaymentMethods || [];
  const hasCards = savedCards.length > 0;
  const selectedCard = savedCards.find((c) => c.paymentMethodId === selectedCardId);
  const providerName = selectedProvider?.fullName || [selectedProvider?.firstName, selectedProvider?.lastName].filter(Boolean).join(' ') || 'Care Provider';
  const amount = useMemo(() => computeBookingEstimate(selectedService, selectedDuration).total, [selectedService, selectedDuration]);
  const appointmentDate = selectedDate ? formatReadableDate(new Date(selectedDate)) : 'Date pending';
  const appointmentTime = selectedTime ? formatSlotLabel(selectedTime) : 'Time pending';

  const handleContinue = () => {
    if (!selectedCard) {
      setError('Please select a payment method.');
      return;
    }
    onPaymentMethodSelect?.(selectedCard.paymentMethodId);
    onContinue();
  };

  return (
    <div className="min-h-screen space-y-8 rounded-2xl bg-gradient-to-b from-gray-50 to-white p-8 lg:p-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-black text-gray-900">Select Payment Method</h1>
        <p className="text-base text-gray-600">Choose a saved card to secure your appointment booking.</p>
      </div>

      {/* Appointment Summary */}
      <div className="grid gap-6 rounded-[1.75rem] border border-gray-100 bg-white p-8 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-gray-400">Provider</p>
            <p className="mt-2 text-lg font-bold text-gray-900">{providerName}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-gray-400">Amount</p>
            <p className="mt-2 text-3xl font-black text-gray-900">${amount.toFixed(2)}</p>
          </div>
        </div>
        <div className="h-px bg-gray-100" />
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-gray-400">Service</p>
            <p className="mt-2 text-lg font-bold text-gray-900">{selectedService?.name || 'Selected Service'}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-gray-400">Date & Time</p>
            <p className="mt-2 text-lg font-bold text-gray-900">{appointmentDate} • {appointmentTime}</p>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900">Saved Cards</h2>
          {hasCards && (
            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
              {savedCards.length} card{savedCards.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-[1.75rem] border-2 border-dashed border-gray-200 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600" />
            <p className="text-sm font-medium text-gray-600">Loading saved cards…</p>
          </div>
        ) : hasCards ? (
          <div className="space-y-3">
            {savedCards.map((card) => (
              <PaymentMethodCard
                key={card.paymentMethodId}
                brand={card.brand || 'Card'}
                last4={card.last4 || '••••'}
                expMonth={card.expMonth || 0}
                expYear={card.expYear || 0}
                cardholderName={card.cardholderName || 'Saved card'}
                isDefault={card.isDefault}
                isSelected={selectedCardId === card.paymentMethodId}
                onSelect={() => {
                  setSelectedCardId(card.paymentMethodId);
                  onPaymentMethodSelect?.(card.paymentMethodId);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border-2 border-dashed border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h3 className="mt-4 text-lg font-bold text-gray-900">No Saved Payment Methods</h3>
            <p className="mt-2 text-sm text-gray-600">Add a Stripe card first to complete your booking.</p>
            <button
              type="button"
              onClick={() => navigate('/settings/billing')}
              className="mt-6 rounded-lg bg-purple-600 px-6 py-3 font-bold text-white transition-all hover:bg-purple-700 active:scale-95"
            >
              Add Payment Method
            </button>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex gap-3 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
            <svg className="h-5 w-5 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={isLoading || !hasCards || !selectedCard}
          className="rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-3 font-bold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default BookingStepPayment;
