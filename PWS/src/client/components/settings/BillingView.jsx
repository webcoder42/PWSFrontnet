import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useUser } from '../../context/UserContext';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';
import { API_BASE_URL } from '../../utils/api';

// Use the valid key matching server configuration
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RYgjMQ4qneyrHeVtWFFCcP0DVUNlAGGBSf5aDQSdRBOq1XCD2SQ9vG4DfuXzyDeCEmgTaKaY8CUeaza6J4lVzJa00ISNmrGOg');

const elementOptions = {
  style: {
    base: {
      fontSize: '14px',
      color: '#374151', // text-gray-700
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      '::placeholder': {
        color: '#9ca3af', // text-gray-400
      },
    },
    invalid: {
      color: '#ef4444',
    },
  },
};

const getBrandLogo = (brand) => {
  const lowercaseBrand = String(brand).toLowerCase();
  switch (lowercaseBrand) {
    case 'visa':
      return 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg';
    case 'mastercard':
      return 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg';
    case 'amex':
      return 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg';
    case 'discover':
      return 'https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg';
    default:
      return null;
  }
};

const BillingFormContent = ({ setView, onNavigate }) => {
  const { user, updateUser } = useUser();
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();
  const location = useLocation();

  const fromBooking = location.state?.fromBooking;

  const handleBack = () => {
    if (fromBooking && onNavigate) {
      onNavigate('Appointments');
    } else {
      setView('main');
    }
  };

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);
  
  // Separate Saving/Status States
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [cardError, setCardError] = useState('');
  const [cardSuccess, setCardSuccess] = useState('');

  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');

  // Billing Address States
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('US');
  const [city, setCity] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Populate address states from user profile context
  useEffect(() => {
    if (user) {
      setFullName(user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Dr. Julian Sterling');
      if (user.address?.country) setCountry(user.address.country);
      if (user.address?.city) setCity(user.address.city);
      if (user.address?.street) setStreetAddress(user.address.street);
      if (user.address?.province) setState(user.address.province);
      if (user.address?.postalCode) setPostalCode(user.address.postalCode);
    }
  }, [user]);

  const fetchPaymentMethods = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    setIsLoadingMethods(true);
    try {
      const token = localStorage.getItem('auth_token') || user?.token;
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${API_BASE_URL}/auth/stripe/wallet/${userId}`, {
        method: 'GET',
        headers,
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setPaymentMethods(data.data.wallet?.stripePaymentMethods || data.data.stripePaymentMethods || []);
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
    } finally {
      setIsLoadingMethods(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [user?._id, user?.id]);

  const handleSaveCard = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setCardError('Stripe has not initialized yet. Please try again.');
      return;
    }

    const userId = user?._id || user?.id;
    if (!userId) {
      setCardError('User details are missing. Please sign in again.');
      return;
    }

    setIsSavingCard(true);
    setCardError('');
    setCardSuccess('');

    try {
      const cardNumberEl = elements.getElement(CardNumberElement);
      if (!cardNumberEl) {
        setCardError('Card input element not found.');
        setIsSavingCard(false);
        return;
      }

      // Create PaymentMethod in Stripe
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberEl,
        billing_details: {
          name: fullName,
          address: {
            line1: streetAddress || undefined,
            city: city || undefined,
            state: state || undefined,
            postal_code: postalCode || undefined,
            country: country || undefined,
          }
        }
      });

      if (stripeError) {
        setCardError(stripeError.message || 'Validation failed.');
        setIsSavingCard(false);
        return;
      }

      const token = localStorage.getItem('auth_token') || user?.token;
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Call Backend to attach the payment method to the user
      const response = await fetch(`${API_BASE_URL}/auth/stripe/payment-method/${userId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          makeDefault: true
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCardSuccess('Card saved successfully!');
        // Clear card fields
        cardNumberEl.clear();
        elements.getElement(CardExpiryElement)?.clear();
        elements.getElement(CardCvcElement)?.clear();
        // Invalidate cache
        queryClient.invalidateQueries({ queryKey: ['client-stripe-wallet', userId] });
        // Refresh cards list
        await fetchPaymentMethods();
      } else {
        setCardError(data.message || 'Failed to link card to account.');
      }
    } catch (err) {
      console.error('Error saving card:', err);
      setCardError('Failed to save card. Please check details and try again.');
    } finally {
      setIsSavingCard(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const userId = user?._id || user?.id;
    if (!userId) {
      setAddressError('User details are missing. Please sign in again.');
      return;
    }

    setIsSavingAddress(true);
    setAddressError('');
    setAddressSuccess('');

    try {
      const token = localStorage.getItem('auth_token') || user?.token;
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          address: {
            street: streetAddress,
            city: city,
            province: state,
            postalCode: postalCode,
            country: country
          }
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAddressSuccess('Billing address updated successfully!');
        if (updateUser) {
          updateUser({
            address: {
              street: streetAddress,
              city: city,
              province: state,
              postalCode: postalCode,
              country: country
            }
          });
        }
      } else {
        setAddressError(data.message || 'Failed to update billing address.');
      }
    } catch (err) {
      console.error('Error saving address:', err);
      setAddressError('Network error. Failed to update billing address.');
    } finally {
      setIsSavingAddress(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20">
      <Breadcrumb current="Billing & Payments" setView={handleBack} />
      <h2 className="text-4xl font-bold text-gray-900 mb-2 font-serif">Billing & Payment</h2>
      <p className="text-xs text-gray-400 mb-12 leading-relaxed max-w-2xl">Manage your practice's subscription, payment methods, and billing information with clinical precision.</p>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column: Payment Methods List */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-25">
              <h4 className="text-sm font-bold text-gray-900">Payment Methods</h4>
            </div>
            
            <div className="p-8 space-y-6">
              {isLoadingMethods ? (
                <div className="text-xs text-gray-400 text-center py-4 font-medium">Loading payment methods...</div>
              ) : paymentMethods.length === 0 ? (
                <div className="text-xs text-gray-400 text-center py-4 font-medium">No saved payment methods.</div>
              ) : (
                paymentMethods.map((method) => {
                  const logoUrl = getBrandLogo(method.brand);
                  return (
                    <div key={method.paymentMethodId} className="flex items-center justify-between bg-gray-25/50 p-4 rounded-2xl border border-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 shadow-sm">
                          {logoUrl ? (
                            <img src={logoUrl} alt={method.brand} className="h-4 object-contain" />
                          ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-700 capitalize">{method.brand} **** {method.last4}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Expiration: {String(method.expMonth).padStart(2, '0')}/{String(method.expYear).slice(-2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.isDefault && (
                          <span className="bg-purple-50 text-purple-600 text-[8px] font-bold px-2 py-0.5 rounded-lg uppercase">Default</span>
                        )}
                        <button type="button" className="text-gray-300 hover:text-gray-500">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
              
              <button type="button" className="w-full py-4 border-2 border-dashed border-gray-100 rounded-[1.5rem] flex items-center justify-center gap-3 text-gray-400 hover:border-purple-200 hover:text-purple-400 transition-all font-bold text-xs uppercase tracking-widest">
                <span className="text-xl">+</span> Add Payment Method
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Card & Address Forms */}
        <div className="flex-1 bg-white rounded-[2.5rem] p-12 border border-gray-50 shadow-sm space-y-12">
          {/* Card Details Section */}
          <div className="pb-10 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Add Card</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Card Number */}
              <div className="md:col-span-4 space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Card Number</label>
                <div className="w-full px-6 py-4 bg-gray-25 border border-transparent rounded-2xl text-sm focus-within:bg-white focus-within:border-purple-200 transition-all">
                  <CardNumberElement options={{ showIcon: true, style: elementOptions.style }} />
                </div>
              </div>
              
              {/* Expiry */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Expiry (MM/YY)</label>
                <div className="w-full px-6 py-4 bg-gray-25 border border-transparent rounded-2xl text-sm focus-within:bg-white focus-within:border-purple-200 transition-all">
                  <CardExpiryElement options={{ style: elementOptions.style }} />
                </div>
              </div>
              
              {/* CVV */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">CVV</label>
                <div className="w-full px-6 py-4 bg-gray-25 border border-transparent rounded-2xl text-sm focus-within:bg-white focus-within:border-purple-200 transition-all">
                  <CardCvcElement options={{ style: elementOptions.style }} />
                </div>
              </div>
            </div>

            {cardError && <div className="mt-4 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold">{cardError}</div>}
            {cardSuccess && <div className="mt-4 p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-bold">{cardSuccess}</div>}

            <div className="flex justify-end pt-6">
              <button 
                type="button" 
                onClick={handleSaveCard} 
                disabled={isSavingCard || !stripe} 
                className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                </svg> 
                {isSavingCard ? 'Saving Card...' : 'Save Card'}
              </button>
            </div>
          </div>

          {/* Billing Address Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-8">Billing Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Full Name */}
              <div className="md:col-span-4 space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-25 border border-transparent rounded-2xl text-sm font-bold text-gray-600 outline-none focus:bg-white focus:border-purple-200 transition-all" 
                />
              </div>
              
              {/* Country */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Country</label>
                <select 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-25 border border-transparent rounded-2xl text-sm font-bold text-gray-600 outline-none focus:bg-white focus:border-purple-200 transition-all appearance-none cursor-pointer"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
              
              {/* City */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-25 border border-transparent rounded-2xl text-sm font-bold text-gray-600 outline-none focus:bg-white focus:border-purple-200 transition-all" 
                />
              </div>
              
              {/* Street Address */}
              <div className="md:col-span-4 space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Street Address</label>
                <input 
                  type="text" 
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-25 border border-transparent rounded-2xl text-sm font-bold text-gray-600 outline-none focus:bg-white focus:border-purple-200 transition-all" 
                />
              </div>
              
              {/* Province / State */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Province / State</label>
                <input 
                  type="text" 
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-25 border border-transparent rounded-2xl text-sm font-bold text-gray-600 outline-none focus:bg-white focus:border-purple-200 transition-all" 
                />
              </div>
              
              {/* Postal Code */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Postal Code</label>
                <input 
                  type="text" 
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-25 border border-transparent rounded-2xl text-sm font-bold text-gray-600 outline-none focus:bg-white focus:border-purple-200 transition-all" 
                />
              </div>
            </div>

            {addressError && <div className="mt-4 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold">{addressError}</div>}
            {addressSuccess && <div className="mt-4 p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-bold">{addressSuccess}</div>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-6 pt-8">
            <button type="button" onClick={handleBack} className="px-10 py-4 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
            <button 
              type="button" 
              onClick={handleSaveAddress} 
              disabled={isSavingAddress} 
              className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
              </svg> 
              {isSavingAddress ? 'Saving Address...' : 'Save Address'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BillingView = ({ setView, onNavigate }) => {
  return (
    <Elements stripe={stripePromise}>
      <BillingFormContent setView={setView} onNavigate={onNavigate} />
    </Elements>
  );
};

export default BillingView;
