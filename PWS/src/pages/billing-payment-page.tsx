import { useCallback, useEffect, useState } from 'react';

import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import SettingsHeader from '../components/dashboard/settings/settingsHeader/settingsHeader';
import StripePaymentForm from '../components/payment/StripePaymentForm';
import { useUser } from '../context/UserContext';
import { addStripePaymentMethodAPI, getStripeWalletAPI } from '../utils/api';
import { createStripeSetupIntentAPI } from '../utils/api';

interface StripePaymentMethodRecord {
  paymentMethodId: string;
  type: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  cardholderName?: string;
  billingCountry?: string;
  billingPostalCode?: string;
}

interface WalletTransactionRecord {
  transactionType: 'appointment_payment' | 'refund' | 'manual_adjustment';
  direction: 'debit' | 'credit';
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
  sourceType: 'appointment' | 'manual';
  sourceId?: string;
  currency: string;
  amount: number;
  grossAmount: number;
  taxAmount: number;
  platformFeeAmount: number;
  netAmount: number;
  description?: string;
  createdAt: string;
}

interface StripeWallet {
  stripePaymentMethods: StripePaymentMethodRecord[];
  transactions?: WalletTransactionRecord[];
}

const BillingPaymentPage = () => {
  const { rawUser } = useUser();
  const userId = rawUser?._id || rawUser?.id;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [wallet, setWallet] = useState<StripeWallet | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);

  const loadWallet = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await getStripeWalletAPI(userId);
      setWallet(response.data.wallet);
    } catch (error) {
      console.error('Unable to load Stripe wallet', error);
    }
  }, [userId]);

  const loadSetupIntent = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await createStripeSetupIntentAPI(userId);
      setClientSecret(response.data.clientSecret);
      setSetupError(null);
    } catch (error: any) {
      console.error('Unable to initialize Stripe setup intent', error);
      setSetupError(error?.message || 'Failed to initialize Stripe payment form.');
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      void loadWallet();
    }
  }, [userId, loadWallet]);

  useEffect(() => {
    const hasAnyCards = (wallet?.stripePaymentMethods || []).length > 0;
    if ((showAddForm || !hasAnyCards) && userId && !clientSecret) {
      void loadSetupIntent();
    }
  }, [showAddForm, userId, clientSecret, loadSetupIntent, wallet]);

  const savedCards = wallet?.stripePaymentMethods || [];
  const walletTransactions = wallet?.transactions || [];
  const hasCards = savedCards.length > 0;
  const defaultCard = savedCards.find((card) => card.isDefault) || savedCards[0];
  const showForm = showAddForm || !hasCards;
  const formatMoney = (amount: number, currency = 'usd') => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);

  const handleSave = async (paymentMethodId: string) => {
    if (!userId) return;

    setIsSaving(true);
    try {
      await addStripePaymentMethodAPI(userId, {
        paymentMethodId,
        makeDefault: true,
      });
      await loadWallet();
      setShowAddForm(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error) {
      console.error('Failed to save payment method:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-surface-alt font-dm overflow-hidden">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-6 md:p-8 lg:p-12 pb-24">
            <SettingsHeader
              title="Billing & Payment"
              description="Manage your practice's subscription and payment methods with precision."
              breadcrumbs={[
                { label: 'Settings', to: '/settings' },
                { label: 'Billing & Payments' }
              ]}
              backTo="/settings"
            />

            <div className="grid grid-cols-1 xl:grid-cols-[380px_minmax(0,1fr)] gap-12">
              <div className="space-y-6">
                <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-gray-25">
                    <h4 className="text-sm font-bold text-gray-900">Payment Methods</h4>
                  </div>
                  <div className="p-8 space-y-6">
                    {hasCards ? (
                      savedCards.map((card) => (
                        <div key={card.paymentMethodId} className="flex items-center justify-between gap-4 bg-gray-25/60 p-4 rounded-2xl border border-gray-100">
                          <div>
                            <p className="text-xs font-bold text-gray-700">{card.brand.toUpperCase()} **** {card.last4}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Expiration: {String(card.expMonth).padStart(2, '0')}/{String(card.expYear).slice(-2)}</p>
                            {card.cardholderName ? <p className="text-[10px] text-gray-500 mt-1">{card.cardholderName}</p> : null}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-tight text-primary">{card.isDefault ? 'Primary' : 'Saved'}</span>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.5rem] border border-dashed border-gray-200 p-8 text-center">
                        <p className="text-sm font-bold text-gray-900">No saved card found</p>
                        <p className="mt-2 text-xs text-gray-500">Add a card to start accepting Stripe payments securely.</p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowAddForm(true)}
                      className="w-full py-4 border-2 border-dashed border-gray-100 rounded-[1.5rem] flex items-center justify-center gap-3 text-gray-500 hover:border-primary hover:text-primary transition-all font-bold text-xs uppercase tracking-widest"
                    >
                      <span className="text-xl">+</span> {hasCards ? 'Add another payment method' : 'Add payment method'}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-[2.5rem] p-10 md:p-12 border border-gray-50 shadow-sm space-y-12">
                  {showForm && (
                    clientSecret && !setupError ? (
                      <StripePaymentForm
                        clientSecret={clientSecret}
                        onSubmit={handleSave}
                        submitLabel={saveSuccess ? 'Saved' : isSaving ? 'Saving...' : 'Save Payment Method'}
                      />
                    ) : (
                      <div className="rounded-3xl border border-gray-100 p-8 text-center">
                        <p className="text-sm font-medium text-gray-700">Preparing secure Stripe payment form...</p>
                        {setupError ? <p className="text-xs text-red-600 mt-3">{setupError}</p> : null}
                      </div>
                    )
                  )}

                  {!showForm && (
                    <div className="space-y-8 text-center py-16">
                      <h3 className="text-2xl font-bold text-gray-900">Add a new payment method</h3>
                      <p className="text-sm text-gray-500">Your saved card information is encrypted and stored securely in Stripe. Add a new card to update your billing profile.</p>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center justify-center rounded-full border border-primary bg-primary px-8 py-4 text-sm font-bold text-white transition hover:bg-primary-dark"
                      >
                        Add card
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-25 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Payment History</h4>
                    <p className="text-xs text-gray-500 mt-1">Appointment payments, fees, and refunds from the wallet ledger.</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Latest {Math.min(walletTransactions.length, 5)}</span>
                </div>
                <div className="p-8 space-y-4">
                  {walletTransactions.length > 0 ? walletTransactions.slice(0, 5).map((tx) => (
                    <div key={`${tx.sourceId || tx.createdAt}-${tx.createdAt}`} className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 p-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900 capitalize">{tx.transactionType.replace('_', ' ')}</p>
                        <p className="text-xs text-gray-500 mt-1">{tx.description || `${tx.sourceType} payment`} · {tx.status}</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">{tx.sourceType}{tx.sourceId ? ` · ${tx.sourceId.slice(-8)}` : ''}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${tx.direction === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tx.direction === 'credit' ? '+' : '-'}{formatMoney(tx.amount, tx.currency)}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">Tax {formatMoney(tx.taxAmount, tx.currency)} · Fee {formatMoney(tx.platformFeeAmount, tx.currency)}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="rounded-[1.5rem] border border-dashed border-gray-200 p-8 text-center">
                      <p className="text-sm font-bold text-gray-900">No payment history yet</p>
                      <p className="mt-2 text-xs text-gray-500">Appointment payment records will appear here after bookings are paid or refunded.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BillingPaymentPage;
