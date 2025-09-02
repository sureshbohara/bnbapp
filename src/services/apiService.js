// src/services/apiService.js
import { callApi } from '../utils/apiHelper';
import api from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth
export const loginUser = (data) => callApi(() => api.post('/login', data));
export const registerUser = (data) => callApi(() => api.post('/register', data));

export const logoutUser = async () => {
  try { await callApi(() => api.post('/logout')); } catch {}
  await AsyncStorage.removeItem('access_token');
};

// User
export const getProfile = () => callApi(() => api.get('/profile').then(res => res.data.user ?? null));


export const updateProfileUser = async (data) => {
  return callApi(() => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        if (key === 'image' && data[key]?.uri) {
          formData.append('image', {
            uri: data[key].uri,
            type: data[key].type || 'image/jpeg',
            name: data[key].fileName || 'profile.jpg',
          });
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    return api.post('/profile/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(response => {
      console.log('Raw API Response:', response.data);
      return response.data;
    });
  });
};


export const changePasswordApi = ({ current_password, new_password, new_password_confirmation }) => 
  callApi(() => 
    api.post('/change-password', { current_password, new_password, new_password_confirmation })
      .then(res => res.data)
  );




// Fetch app settings, banners, categories

export const fetchPages = () => callApi(() => api.get('/page'));

export const fetchPageBySlug = (slug) =>
  callApi(() =>
    api.get(`/page/${slug}`).then(res => res.data.datas ?? null)
  );






export const fetchSettings = () => callApi(() => api.get('/settings'));
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

  



// Fetch users available for chat
export const fetchChatUsers = () => 
  callApi(() => api.get('/chat-users').then(res => res.data ?? []));

// Fetch messages with a specific user
export const fetchMessages = (userId) => 
  callApi(() => api.get(`/messages/${userId}`).then(res => res.data ?? []));

// Send a message to a user
export const sendMessageApi = (receiverId, message) => 
  callApi(() => api.post('/messages', { receiver_id: receiverId, message }).then(res => res.data));


// Favorites
export const fetchFavorites = () => callApi(() => api.get('/favorites'));
export const toggleFavorite = (listingId) =>
  callApi(() => api.post('/favorites', { listing_id: listingId }));
