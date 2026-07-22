import { useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { updateUserProfileAPI } from '../utils/api';

export function getProviderProfile(rawUser: unknown): Record<string, unknown> {
  if (!rawUser || typeof rawUser !== 'object') return {};
  return ((rawUser as Record<string, unknown>).providerProfile || {}) as Record<string, unknown>;
}

export function getUserAddress(rawUser: unknown): Record<string, unknown> {
  if (!rawUser || typeof rawUser !== 'object') return {};
  return ((rawUser as Record<string, unknown>).address || {}) as Record<string, unknown>;
}

export function useProviderPreferences() {
  const { rawUser, setUser } = useUser();
  const userId =
    (typeof rawUser?._id === 'string' && rawUser._id) ||
    (typeof rawUser?.id === 'string' && rawUser.id) ||
    '';

  const providerProfile = getProviderProfile(rawUser);
  const address = getUserAddress(rawUser);

  const saveProfile = useCallback(
    async (payload: Record<string, unknown>) => {
      if (!userId) {
        throw new Error('User session missing. Please login again.');
      }
      const response = await updateUserProfileAPI(userId, payload);
      if (response?.data) {
        setUser(response.data);
      }
      return response;
    },
    [userId, setUser],
  );

  const saveProviderProfile = useCallback(
    async (providerPatch: Record<string, unknown>, topLevel?: Record<string, unknown>) => {
      return saveProfile({
        ...topLevel,
        providerProfile: providerPatch,
      });
    },
    [saveProfile],
  );

  return {
    rawUser,
    userId,
    providerProfile,
    address,
    saveProfile,
    saveProviderProfile,
  };
}

export async function geocodeLocation(query: string): Promise<{
  displayName: string;
  city: string;
  province: string;
  street: string;
  postalCode: string;
  coordinates: [number, number];
} | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(trimmed)}&limit=1`,
  );
  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) return null;

  const hit = data[0] as Record<string, unknown>;
  const address = (hit.address || {}) as Record<string, string>;
  const lat = Number(hit.lat);
  const lon = Number(hit.lon);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;

  return {
    displayName: String(hit.display_name || trimmed),
    street: [address.house_number || '', address.road || address.pedestrian || ''].filter(Boolean).join(' ') || trimmed,
    city: address.city || address.town || address.municipality || '',
    province: address.state || '',
    postalCode: address.postcode || '',
    coordinates: [lon, lat],
  };
}

export function mapGenderPreferenceFromUi(value: string): 'Male' | 'Female' | 'No Preference' {
  if (value === 'male') return 'Male';
  if (value === 'female') return 'Female';
  return 'No Preference';
}

export function mapGenderPreferenceToUi(value: unknown): string {
  if (value === 'Male') return 'male';
  if (value === 'Female') return 'female';
  return 'no-preference';
}
