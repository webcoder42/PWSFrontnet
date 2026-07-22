import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL, getAuthHeaders } from '../utils/api';

const fetchAppointments = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/appointments/user/${userId}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch appointments');
  }
  const result = await response.json();
  return result.success ? (result.data || []) : [];
};

const fetchProviders = async ({ service, lat, lng, radiusKm }) => {
  const params = new URLSearchParams();
  if (service) params.set('service', service);
  if (lat != null && lng != null) {
    params.set('lat', lat);
    params.set('lng', lng);
    params.set('radiusKm', String(radiusKm));
  }
  const queryStr = params.toString();
  const response = await fetch(`${API_BASE_URL}/auth/providers${queryStr ? `?${queryStr}` : ''}`, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) throw new Error('Failed to fetch providers');
  const payload = await response.json();
  return Array.isArray(payload.data) ? payload.data : [];
};

const fetchStripeWallet = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/auth/stripe/wallet/${userId}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch wallet');
  return data;
};

export const useClientAppointments = (userId) => {
  return useQuery({
    queryKey: ['client-appointments', userId],
    queryFn: () => fetchAppointments(userId),
    enabled: !!userId,
    staleTime: 30_000,
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ appointmentId, status }) => {
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update status');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-appointments'] });
    },
  });
};

export const useProvidersQuery = ({ service, lat, lng, radiusKm }, enabled) => {
  return useQuery({
    queryKey: ['client-providers', service, lat, lng, radiusKm],
    queryFn: () => fetchProviders({ service: service?.name, lat, lng, radiusKm }),
    enabled,
    staleTime: 60_000,
  });
};

export const useStripeWalletQuery = (userId) => {
  return useQuery({
    queryKey: ['client-stripe-wallet', userId],
    queryFn: () => fetchStripeWallet(userId),
    enabled: !!userId,
    staleTime: 0,
  });
};
