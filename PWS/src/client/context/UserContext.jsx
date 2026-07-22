import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AUTH_TOKEN_KEY } from '../utils/chatApi';
import { decryptData } from '../../utils/security';

const CACHE_KEY = 'pws_cached_user';
const UserContext = createContext();

const ensureDefaults = (u) => {
  if (!u) return u;
  return {
    ...u,
    recipientProfile: {
      careConditions: [],
      servicesNeeded: [],
      emergencyContacts: [],
      allergies: [],
      medications: [],
      homeEnvironment: {},
      pets: [],
      preferredProviderGender: 'No Preference',
      spokenLanguages: ['English'],
      ...(u.recipientProfile || {}),
    },
    physicalStats: u.physicalStats || { height: 50, weight: 120 },
    address: u.address || {},
    notificationPreferences: {
      appointmentReminders: true,
      visitConfirmations: true,
      cancellationAlerts: true,
      newMessages: true,
      readReceipts: false,
      profileUpdates: true,
      paymentNotifications: true,
      securityAlerts: true,
      tipsUpdates: false,
      specialOffers: false,
      ...(u.notificationPreferences || {}),
    },
    courseProgress: u.courseProgress || {},
  };
};

const cacheUser = (u) => {
  if (!u) return;
  try {
    const toCache = { ...u };
    delete toCache.token;
    localStorage.setItem(CACHE_KEY, JSON.stringify(toCache));
  } catch {}
};

const readStoredSessionUser = () => {
  try {
    const sessionStr = localStorage.getItem('user_session');
    const sessionUser = decryptData(sessionStr);
    const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);

    if (sessionUser && typeof sessionUser === 'object') {
      return ensureDefaults({
        ...sessionUser,
        token: savedToken || sessionUser.token,
      });
    }
  } catch {
    // ignore
  }

  return null;
};

const readCachedUser = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) parsed.token = token;
      return ensureDefaults(parsed);
    }
  } catch {}
  return null;
};

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, _setUser] = useState(() => readCachedUser() || readStoredSessionUser());

  const setUser = useCallback((val) => {
    _setUser(prev => {
      const next = ensureDefaults(typeof val === 'function' ? val(prev) : val);
      cacheUser(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const sessionUser = readStoredSessionUser();
        const userId = sessionUser?._id;
        if (userId && savedToken) {
          try {
            const { getUserProfileAPI } = await import('../../utils/api');
            const res = await getUserProfileAPI(userId);
            if (res.success && res.data) {
              setUser(ensureDefaults({ ...res.data, token: savedToken }));
              return;
            }
          } catch {
            // Backend unavailable
          }
        }
        // Fall back to cache or session
        const cached = readCachedUser();
        if (cached) {
          setUser(cached);
        } else if (sessionUser) {
          setUser(sessionUser);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    loadUser();
  }, []);

  const updateUser = (updates) => {
    setUser(prev => {
      const newState = { ...prev };
      if (updates.firstName !== undefined) newState.firstName = updates.firstName;
      if (updates.lastName !== undefined) newState.lastName = updates.lastName;
      if (updates.email !== undefined) newState.email = updates.email;
      if (updates.photoUrl !== undefined) newState.photoUrl = updates.photoUrl;
      if (updates.gender !== undefined) newState.gender = updates.gender;
      if (updates.password !== undefined) newState.password = updates.password;
      if (updates._id !== undefined) newState._id = updates._id;
      if (updates.token !== undefined) {
        newState.token = updates.token;
        try {
          if (updates.token) localStorage.setItem(AUTH_TOKEN_KEY, updates.token);
          else localStorage.removeItem(AUTH_TOKEN_KEY);
        } catch {
          // ignore
        }
      }
      if (updates.physicalStats) newState.physicalStats = { ...prev.physicalStats, ...updates.physicalStats };
      if (updates.recipientProfile) newState.recipientProfile = { ...prev.recipientProfile, ...updates.recipientProfile };
      if (updates.address) newState.address = updates.address;
      return newState;
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
