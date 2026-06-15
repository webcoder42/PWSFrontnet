import React, { createContext, useContext, useEffect, useState } from 'react';
import { AUTH_TOKEN_KEY } from '../utils/chatApi';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: '5f8d04b3b54764421b7156c0',
    firstName: 'Jack',
    lastName: 'Hudson',
    email: 'jackhudson@gmail.com',
    photoUrl: null,
    password: 'Password@123', // Mock current password - replace with real value from login response
    gender: 'Male',
    physicalStats: {
      height: 50,
      weight: 120
    },
    recipientProfile: {
      servicesNeeded: [],
      careConditions: ['Alzheimer\'s Care']
    }
  });

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (savedToken) {
        setUser((prev) => ({ ...prev, token: savedToken }));
      }
    } catch {
      // ignore
    }
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
      return newState;
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
