// utils/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const API_BASE_URL = process.env.API_URL || 'https://nepalibnb.glaciersafari.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 15000, // optional timeout
});

// Attach token automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handler
api.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('access_token');
      Alert.alert('Session Expired', 'Please log in again.');
      // Optional: trigger a global navigation reset
      // You can use a navigation ref if needed
    } else if (error.response) {
      Alert.alert('Error', error.response.data?.message || 'Something went wrong.');
    } else if (error.request) {
      Alert.alert('Error', 'Server not responding. Please try again later.');
    } else {
      Alert.alert('Error', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
