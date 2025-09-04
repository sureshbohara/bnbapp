// src/services/apiService.js
import { callApi } from '../utils/apiHelper';
import api from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth
export const loginUser = (data) => callApi(() => api.post('/login', data));


export const registerUser = async (formData) => {
  try {
    const response = await api.post('/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data; 
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw error;
  }
};



export const logoutUser = async () => {
  try { await callApi(() => api.post('/logout')); } catch {}
  await AsyncStorage.removeItem('access_token');
};

// User
export const getProfile = () => callApi(() => api.get('/profile').then(res => res.data.user ?? null));


export const updateProfileUser = async (data) => {
  try {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        // Images
        if (['image', 'image1', 'image2'].includes(key) && data[key]?.uri) {
          formData.append(key, {
            uri: data[key].uri,
            type: data[key].type || 'image/jpeg',
            name: data[key].fileName || `${key}.jpg`,
          });
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    const response = await api.post('/profile/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data; 
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return { status: 500, message: 'Something went wrong' };
  }
};



// ---------------- Change Password ----------------
export const changePasswordApi = async ({ current_password, new_password, new_password_confirmation }) => {
  try {
    const res = await api.post('/change-password', {
      current_password,
      new_password,
      new_password_confirmation,
    });
    return res.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    return { status: 500, message: 'Something went wrong' };
  }
};



// Fetch app settings, banners, categories

export const fetchPages = () => callApi(() => api.get('/page'));

export const fetchPageBySlug = (slug) =>
  callApi(() =>
    api.get(`/page/${slug}`).then(res => res.data.datas ?? null)
  );



// faqs
  export const fetchFaqs = async () => {
  const res = await api.get('/get-faqs');
  return res.data.datas;
};



// ---------------- Settings ----------------
export const fetchSettings = async () => {
  const res = await api.get('/settings');
  return res.data.datas;
};


export const fetchBanners = () => callApi(() => api.get('/banners'));
export const fetchCategories = () => callApi(() => api.get('/home-categories'));

// Rooms
export const fetchAllRooms = () => callApi(() => api.get('/all-listing'));
export const fetchRoomsByCategory = (categoryId) =>
  callApi(() => api.get(`/listings/category/${categoryId}`));
export const fetchValleyRooms = () => callApi(() => api.get('/valley-listing'));
export const fetchOutsideValleyRooms = () => callApi(() => api.get('/outside-valley-listing'));
export const searchRooms = (query) => callApi(() =>
  api.get('/rooms/search', { params: { q: query, per_page: 100 } }).then(res => res.data.datas ?? [])
);


// Listing Details
export const fetchListingDetails = (slug) =>
  callApi(() =>
    api.get(`/listing/${slug}`).then(res => res.data.datas ?? null)
  );

  


// ----------------- My Bookings -----------------
  
export const fetchBookingSubmit = async (formData) => {
  try {
    const response = await api.post("/bookings", formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    return response;
  } catch (error) {
    // Log for debugging
    console.error("Booking submission error:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchMyBooking = () => callApi(() => api.get('/my-bookings')); 


export const cancelBooking = (id) =>
  callApi(() => api.post(`/bookings/${id}/cancel`));




// ----------------- Chat APIs -----------------
export const fetchChatUsers = async () => {
  const res = await api.get('/chat-users');
  return res.data.data ?? [];
};

export const fetchConversations = async () => {
  const res = await api.get('/conversations');
  return res.data.data ?? [];
};

export const fetchMessages = async (userId) => {
  const res = await api.get(`/messages/${userId}`);
  return res.data.data ?? [];
};

export const sendMessageApi = async (receiverId, message) => {
  const res = await api.post('/messages', { receiver_id: receiverId, message });
  return res.data.data ?? null;
};


// ----------------- Favorites -----------------
export const fetchFavorites = () => callApi(() => api.get('/favorites'));
export const toggleFavorite = (listingId) => callApi(() => api.post('/favorites', { listing_id: listingId }));
