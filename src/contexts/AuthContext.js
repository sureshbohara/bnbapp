// contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '../services/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      const profile = await getProfile();
      setUser(profile?.user ?? profile);
    }
    setLoading(false);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('access_token');
    setUser(null);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, loadUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
