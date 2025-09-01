// contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile, loginUser as apiLoginUser, logoutUser as apiLogoutUser } from '../services/apiService';
import { showMessage } from 'react-native-flash-message';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token
  const loadUser = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        const profile = await getProfile();
        setUser(profile ?? null);
      }
    } catch (err) {
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiLoginUser({ email, password });
      // response is already response.data from callApi
      const { token, user } = response;

      if (!token || !user) throw new Error('Invalid server response');

      await AsyncStorage.setItem('access_token', token);
      setUser(user);
      return user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      showMessage({ message: 'Login Failed', description: message, type: 'danger' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await apiLogoutUser();
    } catch {}
    await AsyncStorage.removeItem('access_token');
    setUser(null);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
