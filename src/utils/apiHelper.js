// utils/apiHelper.js
import api from './api';

/**
 * Wrap API calls to handle errors consistently and optionally return data.
 * Skips logging 401 because the interceptor already handles it.
 */
export const callApi = async (requestFn) => {
  try {
    const response = await requestFn();
    return response.data?.datas ?? response.data ?? response;
  } catch (error) {
    // Skip logging 401 because it's already handled
    if (error.response?.status !== 401) {
      console.error('API call error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};
