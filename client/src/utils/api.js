/**
 * API utility functions for the Patient Web Client.
 * Provides appointment booking and Stripe payment integration.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const AUTH_TOKEN_KEY = 'auth_token';

const readAuthToken = () => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

const getAuthHeaders = () => {
  const token = readAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetch the user's Stripe wallet (saved payment methods).
 * GET /api/auth/stripe/wallet/:userId
 */
export const getStripeWalletAPI = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/auth/stripe/wallet/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch Stripe wallet');
  }
  return data;
};

/**
 * Create a new appointment booking.
 * POST /api/appointments
 */
export const createAppointmentAPI = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create appointment');
  }
  return data;
};

/**
 * Confirm appointment with Stripe payment processing.
 * POST /api/appointments/:id/confirm-with-payment
 *
 * This charges the selected card via Stripe and auto-confirms the appointment.
 */
export const confirmAppointmentWithPaymentAPI = async (
  appointmentId,
  paymentMethodId,
  userId
) => {
  const response = await fetch(
    `${API_BASE_URL}/appointments/${appointmentId}/confirm-with-payment`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        paymentMethodId,
        userId,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Payment processing failed');
  }
  return data;
};
