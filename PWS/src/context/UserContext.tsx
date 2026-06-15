import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { decryptData } from '../utils/security';
import { getUserProfileAPI } from '../utils/api';
import {
  SESSION_KEY,
  clearStoredSession,
  persistSession,
  readAuthToken,
  toSlimSession,
} from '../utils/sessionStorage';
import { getChatSocket, disconnectChatSocket } from '../utils/chatSocket';

export interface SessionUser {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  photoUrl?: string;
  profilePhoto?: string;
  avatar?: string;
  image?: string;
  token?: string;
  [key: string]: unknown;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  role: string;
  initials: string;
}

interface UserContextValue {
  rawUser: SessionUser | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  /** False until the initial localStorage session read has finished. */
  isHydrated: boolean;
  setUser: (user: SessionUser) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

function getString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function getUserName(user: SessionUser): string {
  const direct = getString(user.name) || getString(user.fullName) || getString(user.displayName);
  if (direct) {
    return direct;
  }
  const firstName = getString(user.firstName);
  const lastName = getString(user.lastName);
  const combined = `${firstName} ${lastName}`.trim();
  return combined || 'User';
}

function getInitials(name: string): string {
  const parts = name.split(' ').map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) {
    return 'U';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

function mapToProfile(user: SessionUser | null): UserProfile | null {
  if (!user) {
    return null;
  }
  const name = getUserName(user);
  return {
    id: getString(user._id) || getString(user.id),
    name,
    email: getString(user.email),
    role: getString(user.role),
    photoUrl:
      getString(user.photoUrl) ||
      getString(user.profilePhoto) ||
      getString(user.avatar) ||
      getString(user.image),
    initials: getInitials(name),
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [rawUser, setRawUser] = useState<SessionUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const refreshFromServer = useCallback(async (sourceUser: SessionUser | null) => {
    const userId =
      (typeof sourceUser?._id === 'string' && sourceUser._id) ||
      (typeof sourceUser?.id === 'string' && sourceUser.id) ||
      '';
    const token = readAuthToken() || sourceUser?.token;
    if (!userId || typeof token !== 'string' || !token) return;

    try {
      const response = await getUserProfileAPI(userId);
      if (response?.data) {
        const latestUser = response.data as SessionUser;
        latestUser.token = token;
        // Persist a slim session to storage but keep the full user in memory
        persistSession(toSlimSession(latestUser));
        setRawUser(latestUser);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (/invalid|expired|token|not active|401/i.test(msg)) {
        clearStoredSession();
        setRawUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    const user = decryptData(sessionStr);
    const token = readAuthToken();
    if (user && typeof user === 'object') {
      const sessionUser = user as SessionUser;
      if (token) sessionUser.token = token;
      setRawUser(sessionUser);
      if (import.meta.env.DEV) {
        // Dev-only debug: show stored session and mapped profile to help trace missing photos
        // eslint-disable-next-line no-console
        console.debug('UserContext: hydrated rawUser from storage', sessionUser);
      }
      void refreshFromServer(sessionUser);
      getChatSocket().catch(() => {});
    } else if (token) {
      clearStoredSession();
    }
    setIsHydrated(true);
  }, [refreshFromServer]);

  useEffect(() => {
    const onFocus = () => {
      void refreshFromServer(rawUser);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        void refreshFromServer(rawUser);
      }
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [rawUser, refreshFromServer]);

  const setUser = useCallback((user: SessionUser) => {
    persistSession(toSlimSession(user));
    setRawUser(user);
    getChatSocket().catch(() => {});
  }, []);

  const clearUser = useCallback(() => {
    clearStoredSession();
    disconnectChatSocket();
    setRawUser(null);
  }, []);

  const profile = useMemo(() => mapToProfile(rawUser), [rawUser]);

  const value = useMemo<UserContextValue>(
    () => ({
      rawUser,
      profile,
      isAuthenticated: !!rawUser && !!(rawUser.token || readAuthToken()),
      isHydrated,
      setUser,
      clearUser,
    }),
    [rawUser, profile, isHydrated, setUser, clearUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
