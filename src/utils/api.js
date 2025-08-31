import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.API_URL || 'https://api.shakyastorenp.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// Attach token if available
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

// Centralized error handler
export const handleError = async (error, navigation) => {
  let errorMessage = 'An error occurred, please try again later.';

  if (error.response) {
    if (error.response.status === 401) {
      errorMessage = 'Session expired. Please log in again.';
      await AsyncStorage.removeItem('access_token');
      if (navigation) {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    } else {
      errorMessage = error.response.data?.message || errorMessage;
    }
  } else if (error.request) {
    errorMessage = 'Server not responding. Please try again later.';
  } else {
    errorMessage = error.message;
  }

  console.error('API Error:', errorMessage);
  throw new Error(errorMessage);
};

export default api;
