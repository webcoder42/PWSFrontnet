import React, { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ProviderProfileFormData, ProfileErrors } from '../../../types/profile';
import { createStripeSetupIntentAPI, addStripePaymentMethodAPI } from '../../../utils/api';
import StripePaymentForm from '../../payment/StripePaymentForm';
import { useUser } from '../../../context/UserContext';


interface ProviderPayoutDetailsProps {
  formData: ProviderProfileFormData;
  setFormData: Dispatch<SetStateAction<ProviderProfileFormData>>;
  errors: ProfileErrors;
  onSkip: () => void;
}

const ProviderPayoutDetails: React.FC<ProviderPayoutDetailsProps> = ({ formData, setFormData, onSkip }) => {
  const { rawUser, profile } = useUser();
  const userId = profile?.id || (rawUser?._id as string) || (rawUser?.id as string) || '';
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      setMessage(null);
      if (!userId) {
        setMessage('Unable to identify user. Please sign in again.');
        setLoadingIntent(false);
        return;
      }
      try {
        setLoadingIntent(true);
        const res = await createStripeSetupIntentAPI(userId);
        setClientSecret(res?.data?.clientSecret || res?.clientSecret || null);
        if (!res?.data?.clientSecret && !res?.clientSecret) {
          setMessage('Unable to initialize payment form. Please try again.');
        }
      } catch (err: any) {
        setMessage(err?.message || 'Failed to initialize payment form.');
      } finally {
        setLoadingIntent(false);
      }
    };

    initializeStripe();
  }, [userId]);

  const handleStripeSubmit = async (paymentMethodId: string) => {
    if (!userId) {
      setMessage('User not found');
      return;
    }
    try {
      setMessage(null);
      await addStripePaymentMethodAPI(userId, { paymentMethodId, makeDefault: true });
      setFormData(prev => ({ ...prev, payoutMethod: 'Stripe', stripePaymentMethodId: paymentMethodId }));
      setMessage('Card saved successfully!');
      // Proceed after a short delay
      setTimeout(() => {
        onSkip();
      }, 800);
    } catch (err: any) {
      setMessage(err?.message || 'Failed to save card');
    }
  };

  if (loadingIntent) {
    return (
      <div className="space-y-10">
        <div className="text-center py-12">
          <p className="text-gray-500 font-medium">Initializing payment form...</p>
        </div>
      </div>
    );
  }

  if (message && (message.includes('Error') || message.includes('Unable'))) {
    return (
      <div className="space-y-10">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
          <p className="font-medium">{message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-xl sm:text-3xl font-bold text-gray-900 font-playfair tracking-tight leading-tight">Add a payment method</h3>
        <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed font-dm text-balance">
          Enter your card details securely. Your card is saved with Stripe and used to receive payments.
        </p>
      </div>

      {clientSecret ? (
        <StripePaymentForm
          clientSecret={clientSecret}
          submitLabel="Save card"
          onSubmit={handleStripeSubmit}
        />
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-yellow-700">
          <p className="font-medium">Unable to load payment form.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg font-bold text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {message && (
        <div className={`text-sm font-medium ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}

      <div className="pt-4">
        <button
          type="button"
          onClick={onSkip}
          className="text-sm sm:text-[15px] font-bold text-primary font-dm hover:text-primary-light duration-300 underline underline-offset-4 cursor-pointer"
        >
          Skip for now ›
        </button>
      </div>
    </div>
  );
};

export default ProviderPayoutDetails;
