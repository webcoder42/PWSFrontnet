import { clearStoredSession, readAuthToken } from './sessionStorage';

const parseApiResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      clearStoredSession();
    }
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.mypswplus.com/api';
const cleanUrl = rawBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
const REQUEST_TIMEOUT_MS = 15_000;

const fetchWithTimeout = async (url: string, init?: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err: unknown) {
    if ((err instanceof Error && err.name === 'AbortError') || (err as any)?.name === 'AbortError') {
      throw new Error('Request timed out. Unable to reach the server. Please check your connection.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
};

const getAuthToken = (): string | null => readAuthToken();

const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

const buildJsonHeaders = (extra: Record<string, string> = {}): HeadersInit => {
  return {
    'Content-Type': 'application/json',
    ...extra,
  };
};

/**
 * Sends a registration request to the backend with compiled profile payload.
 * @param payload The complete User registration payload (auth + profile)
 * @returns Response data
 */
export const registerUserAPI = async (payload: any) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    const msg = data.error?.includes?.('validation failed')
      ? data.error
      : data.message || 'Registration failed';
    throw new Error(msg);
  }
  return data;
};

export const getSwitchAccountsAPI = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/switch-accounts/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to load switch accounts');
  }
  return data;
};

export const addSwitchAccountAPI = async (
  userId: string,
  payload: { email: string; password: string },
) => {
  const response = await fetch(`${API_BASE_URL}/auth/switch-accounts/${userId}/add`, {
    method: 'POST',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to add account');
  }
  return data;
};

export const removeSwitchAccountAPI = async (userId: string, linkedAccountId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/switch-accounts/${userId}/${linkedAccountId}`,
    {
      method: 'DELETE',
      headers: buildJsonHeaders(getAuthHeaders()),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to remove account');
  }
  return data;
};

export const verifyLinkedAccountAPI = async (payload: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/accounts/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Account verification failed');
  }
  return data;
};

export const loginUserAPI = async (payload: any) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  if (data.requiresEmailVerification) {
    const error = new Error(data.message || 'Please verify your email first') as any;
    error.requiresEmailVerification = true;
    error.email = data.email;
    throw error;
  }

  if (data.requiresLoginVerification) {
    const error = new Error(data.message || 'Verification code sent to your email') as any;
    error.requiresLoginVerification = true;
    error.email = data.email;
    throw error;
  }

  return data;
};

export const sendVerificationCodeAPI = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/send-verification-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to send verification code');
  }
  return data;
};

export const verifyEmailCodeAPI = async (email: string, code: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Email verification failed');
  }
  return data;
};

export const resendVerificationCodeAPI = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/resend-verification-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to resend verification code');
  }
  return data;
};

export const sendPhoneCodeAPI = async (phone: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/send-phone-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to send verification code');
  }
  return data;
};

export const verifyPhoneCodeAPI = async (phone: string, code: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-phone-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Phone verification failed');
  }
  return data;
};

export const resendPhoneCodeAPI = async (phone: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/resend-phone-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to resend verification code');
  }
  return data;
};

export const verifyLoginCodeAPI = async (email: string, code: string, deviceId?: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-login-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, deviceId }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login verification failed');
  }
  return data;
};

export const verifyLoginTwoFactorAPI = async (email: string, code: string, deviceId?: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-login-two-factor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, deviceId, trustDevice: true }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Authenticator verification failed');
  }
  return data;
};

export const uploadImageAPI = async (imageBase64: string, folder = 'mypsw/users') => {
  const response = await fetch(`${API_BASE_URL}/auth/upload-image`, {
    method: 'POST',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify({ imageBase64, folder }),
  });
  const responseClone = response.clone();

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const fallbackText = await responseClone.text().catch(() => '');
    throw new Error(data?.message || fallbackText || 'Image upload failed');
  }
  return data;
};

export const updateUserProfileAPI = async (userId: string, payload: any) => {
  const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
    method: 'PATCH',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Profile update failed');
  }
  return data;
};

export const changePasswordAPI = async (userId: string, payload: { oldPassword: string; newPassword: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/change-password/${userId}`, {
    method: 'PUT',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to change password');
  }
  return data;
};

export const getTwoFactorAuthStatusAPI = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/two-factor/${userId}`, {
    method: 'GET',
    headers: buildJsonHeaders(getAuthHeaders()),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to load two-factor status');
  }
  return data;
};

export const setupTwoFactorAuthAPI = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/two-factor/setup/${userId}`, {
    method: 'POST',
    headers: buildJsonHeaders(getAuthHeaders()),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to start authenticator setup');
  }
  return data;
};

export const verifyTwoFactorAuthAPI = async (userId: string, code: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/two-factor/verify/${userId}`, {
    method: 'POST',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify({ code }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to verify authenticator code');
  }
  return data;
};

export const disableTwoFactorAuthAPI = async (userId: string, code: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/two-factor/disable/${userId}`, {
    method: 'POST',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify({ code }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to disable authenticator');
  }
  return data;
};

export const getUserProfileAPI = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
    method: 'GET',
    headers: buildJsonHeaders(getAuthHeaders()),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Profile fetch failed');
  }
  return data;
};

export const getStripeWalletAPI = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/stripe/wallet/${userId}`, {
    method: 'GET',
    headers: buildJsonHeaders(getAuthHeaders()),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch Stripe wallet');
  }
  return data;
};

export const addStripePaymentMethodAPI = async (userId: string, payload: any) => {
  const response = await fetch(`${API_BASE_URL}/auth/stripe/payment-method/${userId}`, {
    method: 'POST',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to add Stripe payment method');
  }
  return data;
};

export const createStripeSetupIntentAPI = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/stripe/setup-intent/${userId}`, {
    method: 'POST',
    headers: buildJsonHeaders(getAuthHeaders()),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create Stripe setup intent');
  }
  return data;
};

export const getUserPhysicalStatsAPI = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}/physical-stats`, {
    method: 'GET',
    headers: buildJsonHeaders(getAuthHeaders()),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Physical stats fetch failed');
  }
  return data;
};

export const getCareProvidersAPI = async (
  serviceName?: string | null,
  location?: { lat?: number; lng?: number; radiusKm?: number },
) => {
  const params = new URLSearchParams();
  if (serviceName) params.set('service', serviceName);
  if (location?.lat != null) params.set('lat', String(location.lat));
  if (location?.lng != null) params.set('lng', String(location.lng));
  if (location?.radiusKm != null) params.set('radiusKm', String(location.radiusKm));
  const queryStr = params.toString();
  const url = `${API_BASE_URL}/auth/providers${queryStr ? `?${queryStr}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: buildJsonHeaders(getAuthHeaders()),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to load care providers');
  }

  return data;
};

export const getPreferenceCatalogAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/preferences/catalog`, {
    method: 'GET',
    headers: buildJsonHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Preference catalog fetch failed');
  }
  return data;
};

export const updateUserPhysicalStatsAPI = async (userId: string, payload: any) => {
  const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}/physical-stats`, {
    method: 'PATCH',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify({ physicalStats: payload }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Physical stats update failed');
  }
  return data;
};

export const createAppointmentAPI = async (payload: any) => {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create appointment');
  }
  return data;
};

/**
 * Confirm appointment with payment processing
 * Processes Stripe payment and auto-confirms the appointment
 */
export const confirmAppointmentWithPaymentAPI = async (
  appointmentId: string,
  paymentMethodId: string,
  userId: string
) => {
  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/confirm-with-payment`, {
    method: 'POST',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify({
      paymentMethodId,
      userId,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Payment processing failed');
  }
  return data;
};

/**
 * Cancel appointment and process refund if applicable
 */
export const cancelAppointmentWithRefundAPI = async (appointmentId: string) => {
  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel-with-refund`, {
    method: 'PATCH',
    headers: buildJsonHeaders(getAuthHeaders()),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to cancel appointment');
  }
  return data;
};

export const getAppointmentsByUserAPI = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/appointments/user/${userId}`, {
    method: 'GET',
    headers: buildJsonHeaders(getAuthHeaders()),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch appointments');
  }
  return data;
};

/** Appointments booked with this PSW (provider) — for Care Requests / PSW dashboard */
export const getAppointmentsByPswAPI = async (pswId: string) => {
  const response = await fetch(`${API_BASE_URL}/appointments/psw/${pswId}`, {
    method: 'GET',
    headers: buildJsonHeaders(getAuthHeaders()),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch PSW appointments');
  }
  return data;
};

export const getPswDashboardStatsAPI = async (pswId: string) => {
  const response = await fetch(`${API_BASE_URL}/appointments/psw/${pswId}/dashboard-stats`, {
    method: 'GET',
    headers: buildJsonHeaders(getAuthHeaders()),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch dashboard stats');
  }
  return data;
};

export const updateAppointmentStatusAPI = async (
  appointmentId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
) => {
  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/status`, {
    method: 'PATCH',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify({ status }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update appointment status');
  }
  return data;
};

export const rescheduleAppointmentAPI = async (
  appointmentId: string,
  payload: { date: string; time: string; duration?: string },
) => {
  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/reschedule`, {
    method: 'PATCH',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to reschedule appointment');
  }
  return data;
};

export const submitAppointmentRatingAPI = async (
  appointmentId: string,
  payload: { rating: number; comment?: string },
) => {
  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/rating`, {
    method: 'PATCH',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit rating');
  }
  return data;
};

export const listChatConversationsAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
    method: 'GET',
    headers: buildJsonHeaders(getAuthHeaders()),
  });
  return parseApiResponse(response);
};

export const getOrCreateChatConversationAPI = async (otherUserId: string) => {
  const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
    method: 'POST',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify({ otherUserId }),
  });
  return parseApiResponse(response);
};

export const getChatConversationAPI = async (conversationKey: string) => {
  const response = await fetch(
    `${API_BASE_URL}/chat/conversations/${encodeURIComponent(conversationKey)}`,
    {
      method: 'GET',
      headers: buildJsonHeaders(getAuthHeaders()),
    },
  );
  return parseApiResponse(response);
};

export const sendChatMessageAPI = async (conversationKey: string, text: string) => {
  const response = await fetch(
    `${API_BASE_URL}/chat/conversations/${encodeURIComponent(conversationKey)}/messages`,
    {
      method: 'POST',
      headers: buildJsonHeaders(getAuthHeaders()),
      body: JSON.stringify({ text }),
    },
  );
  return parseApiResponse(response);
};

export const startVoiceCallAPI = async (conversationKey: string) => {
  const response = await fetch(`${API_BASE_URL}/chat/calls/start`, {
    method: 'POST',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify({ conversationKey }),
  });
  return parseApiResponse(response);
};

export const endVoiceCallAPI = async (
  conversationKey: string,
  callId: string,
  status?: 'answered' | 'declined' | 'missed' | 'ended',
) => {
  const response = await fetch(`${API_BASE_URL}/chat/calls/end`, {
    method: 'POST',
    headers: buildJsonHeaders(getAuthHeaders()),
    body: JSON.stringify({ conversationKey, callId, status }),
  });
  return parseApiResponse(response);
};

export const fetchAdminClientsAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/clients`, {
    method: 'GET',
    headers: buildJsonHeaders(getAuthHeaders()),
  });
  return parseApiResponse(response);
};

export const fetchAdminPswsAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/psws`, {
    method: 'GET',
    headers: buildJsonHeaders(getAuthHeaders()),
  });
  return parseApiResponse(response);
};

export const fetchAdminAppointmentsAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/appointments`, {
    method: 'GET',
    headers: buildJsonHeaders(getAuthHeaders()),
  });
  return parseApiResponse(response);
};

export const fetchAdminStatsAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/stats`, {
    method: 'GET',
    headers: buildJsonHeaders(getAuthHeaders()),
  });
  return parseApiResponse(response);
};

export const forgotPasswordAPI = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to send reset email');
  return data;
};

export const resetPasswordAPI = async (email: string, token: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to reset password');
  return data;
};

export const startTwoFactorRecoveryAPI = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/two-factor/recovery-start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to start recovery');
  return data;
};

export const completeTwoFactorRecoveryAPI = async (email: string, code: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/two-factor/recovery-complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to complete recovery');
  return data;
};

export const sendRecoveryEmailCodeAPI = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/two-factor/recovery-send-email-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to send recovery email code');
  return data;
};

export const verifyRecoveryEmailCodeAPI = async (email: string, code: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/two-factor/recovery-verify-email-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to verify recovery email code');
  return data;
};

