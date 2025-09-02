// utils/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

const API_BASE_URL = process.env.API_URL || 'https://nepalibnb.glaciersafari.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 15000,
});

// Attach token automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Session expired
      await AsyncStorage.removeItem('access_token');
      showMessage({
        message: 'Session Expired',
        description: 'Please log in again.',
        type: 'danger',
      });
    } else if (error.response) {
      showMessage({
        message: 'Error',
        description: error.response.data?.message || 'Something went wrong.',
        type: 'danger',
      });
    } else if (error.request) {
      showMessage({
        message: 'Error',
        description: 'Server not responding. Please try again later.',
        type: 'danger',
      });
    } else {
      showMessage({
        message: 'Error',
        description: error.message,
        type: 'danger',
      });
    }

    return Promise.reject(error);
  }
);

export default api;