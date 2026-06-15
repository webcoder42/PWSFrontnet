import { decryptData, encryptData } from './security';
import type { SessionUser } from '../context/UserContext';

export const SESSION_KEY = 'user_session';
export const AUTH_TOKEN_KEY = 'auth_token';

export function toSlimSession(source: SessionUser): SessionUser {
  return {
    _id: source._id || source.id,
    id: source.id || source._id,
    email: source.email,
    role: source.role,
    token: source.token,
    firstName: source.firstName,
    lastName: source.lastName,
    fullName: source.fullName,
    photoUrl: source.photoUrl,
  };
}

export function readAuthToken(): string | null {
  const direct = localStorage.getItem(AUTH_TOKEN_KEY);
  if (direct) return direct;
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;
  const sessionUser = decryptData(sessionStr) as { token?: string } | null;
  return sessionUser?.token ?? null;
}

export function persistSession(user: SessionUser): SessionUser {
  const slim = toSlimSession(user);
  if (slim.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, slim.token);
  }
  localStorage.setItem(SESSION_KEY, encryptData(slim));
  return slim;
}

export function clearStoredSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
}
