// utils/apiHelper.js
import api from './api';

export const callApi = async (requestFn) => {
  try {
    const response = await requestFn();
    return response.data?.datas ?? response.data ?? response;
  } catch (error) {
    console.error('API call failed:', error.response?.data || error.message);
    return null; 
  }
};
