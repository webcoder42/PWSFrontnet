import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: 'mock-admin-id-001',
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

  const updateUser = (updates) => {
    setUser(prev => {
      const newState = { ...prev };
      if (updates.gender !== undefined) newState.gender = updates.gender;
      if (updates.password !== undefined) newState.password = updates.password;
      if (updates._id !== undefined) newState._id = updates._id;
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
