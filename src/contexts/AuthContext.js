// contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile, loginUser as apiLoginUser, logoutUser as apiLogoutUser } from '../services/apiService';
import { showMessage } from 'react-native-flash-message';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // auth loading state

  // Load user from AsyncStorage token
  const loadUser = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        const profile = await getProfile();
        setUser(profile ?? null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiLoginUser({ email, password });
      const { token, user: profile } = response;

      if (!token || !profile) throw new Error('Invalid server response');

      await AsyncStorage.setItem('access_token', token);
      setUser(profile);

      return profile;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      showMessage({ message: 'Login Failed', description: message, type: 'danger' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiLogoutUser(); // optional, server-side logout
    } catch (err) {
      console.warn('Server logout failed:', err.message);
    }
    await AsyncStorage.removeItem('access_token');
    setUser(null);
  };

  // Update user profile locally
  const updateUser = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };

  // Refresh profile from API
  const refreshProfile = async () => {
    setLoading(true);
    try {
      const profile = await getProfile();
      setUser(profile ?? null);
      return profile;
    } catch (err) {
      console.error('Failed to refresh profile:', err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      setUser: updateUser,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
