/**
 * API utility functions for the Patient Web Client.
 * Provides appointment booking, Stripe payment, and profile management.
 */

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.mypswplus.com/api';
const cleanUrl = rawBaseUrl.replace(/\/+$/, '');
export const API_BASE_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

export const AUTH_TOKEN_KEY = 'auth_token';

export const readAuthToken = () => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const getAuthHeaders = () => {
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

/**
 * Update appointment status.
 * PATCH /api/appointments/:id/status
 */
export const updateAppointmentStatusAPI = async (appointmentId, status) => {
  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update status');
  }
  return data;
};

/**
 * Fetch user profile from backend.
 * GET /api/auth/profile/:userId
 */
export const getUserProfileAPI = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
  return data;
};

/**
 * Fetch appointments booked with a PSW provider.
 * GET /api/appointments/psw/:pswId
 */
export const getAppointmentsByPswAPI = async (pswId) => {
  const response = await fetch(`${API_BASE_URL}/appointments/psw/${pswId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch PSW appointments');
  return data;
};

/**
 * Update user profile.
 * PATCH /api/auth/profile/:userId
 */
export const updateUserProfileAPI = async (userId, payload) => {
  const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update profile');
  return data;
};

/**
 * Update user physical stats.
 * PATCH /api/auth/profile/:userId/physical-stats
 */
export const updatePhysicalStatsAPI = async (userId, payload) => {
  const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}/physical-stats`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update physical stats');
  return data;
};

/**
 * Fetch all appointments for a user.
 * GET /api/appointments/user/:userId
 */
export const fetchAppointmentsAPI = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/appointments/user/${userId}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch appointments');
  return data;
};
