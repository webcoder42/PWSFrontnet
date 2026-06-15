import React, { useMemo, useState } from 'react';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { clsx } from 'clsx';
import { FaLock } from 'react-icons/fa';

interface StripePaymentFormProps {
  clientSecret: string;
  onSubmit: (paymentMethodId: string) => void;
  submitLabel?: string;
}

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : Promise.resolve(null);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#111827',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      fontSize: '16px',
      '::placeholder': {
        color: '#9CA3AF',
      },
    },
    invalid: {
      color: '#DC2626',
    },
  },
  hidePostalCode: true,
};

function StripeCardForm({ clientSecret, onSubmit, submitLabel = 'Save Payment Method' }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState('');
  const [cardComplete, setCardComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again in a moment.');
      return;
    }

    if (!cardComplete) {
      setError('Please complete your card details.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Unable to load card input.');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName || undefined,
          },
        },
      });

      if (result.error) {
        setError(result.error.message || 'Failed to save card.');
        return;
      }

      const paymentMethodId = result.setupIntent?.payment_method;
      if (!paymentMethodId || typeof paymentMethodId !== 'string') {
        setError('Stripe did not return a valid payment method ID.');
        return;
      }

      onSubmit(paymentMethodId);
    } catch (submitError: any) {
      setError(submitError?.message || 'Unable to save your card.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isSubmitEnabled = cardholderName.trim().length > 0 && cardComplete && !isProcessing;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl sm:text-3xl font-bold text-gray-900 font-playfair tracking-tight leading-tight">Add Stripe payment</h3>
        <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed font-dm text-balance">Enter your card details securely through Stripe. Your card number is never stored on our servers.</p>
        <div className="flex items-center gap-2">
          <FaLock className="text-emerald-600 size-4" />
          <span className="text-xs sm:text-sm font-bold text-emerald-700 font-dm tracking-wide">256-bit SSL encrypted • Secured by Stripe</span>
        </div>
      </div>

      <div className="border border-gray-100 rounded-3xl p-6 sm:p-8 bg-white shadow-sm">
        <h4 className="text-lg sm:text-xl font-bold text-gray-900 font-playfair tracking-tight">Card details</h4>
        <div className="space-y-5 mt-6">
          <label className="block text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Cardholder name</label>
          <input
            value={cardholderName}
            onChange={(event) => setCardholderName(event.target.value)}
            placeholder="John Doe"
            className="w-full bg-white border-2 border-primary/10 rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-400 text-sm sm:text-base"
          />
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Card information</label>
            <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
              <CardElement options={CARD_ELEMENT_OPTIONS} onChange={(event) => setCardComplete(Boolean(event.complete))} />
            </div>
          </div>

          {error ? <p className="text-sm text-red-600 font-medium">{error}</p> : null}

          <button
            type="submit"
            disabled={!isSubmitEnabled}
            className={clsx(
              'w-full px-8 py-4 rounded-2xl font-bold text-sm sm:text-base text-white transition-all duration-300',
              isSubmitEnabled ? 'bg-gradient-to-r from-purple-700 to-purple-500 shadow-xl shadow-purple-200 hover:-translate-y-0.5' : 'bg-gray-300 cursor-not-allowed'
            )}
          >
            {isProcessing ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  const showKeyError = !publishableKey;

  const memoizedStripePromise = useMemo(() => stripePromise, []);

  if (showKeyError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-medium">Stripe publishable key is not configured.</p>
        <p className="text-sm text-red-600 mt-2">Set VITE_STRIPE_PUBLISHABLE_KEY in your web environment and restart the app.</p>
      </div>
    );
  }

  return (
    <Elements stripe={memoizedStripePromise}>
      <StripeCardForm {...props} />
    </Elements>
  );
}
