// src/services/apiService.js
import { callApi } from '../utils/apiHelper';
import api from '../utils/api';



// Fetch app settings
export const fetchSettings = async () => {
    return callApi(() => api.get('/settings'));
};

// Fetch banners
export const fetchBanners = async () => {
   return callApi(() => api.get('/banners'));
};

// Fetch categories
export const fetchCategories = async () => {
   return callApi(() => api.get('/home-categories'));
};



export const fetchAllRooms = async () => {
   return callApi(() => api.get('/all-listing'));
};



export const fetchRoomsByCategory = (categoryId) =>
  callApi(() => api.get(`/listings/category/${categoryId}`));



export const fetchValleyRooms = async () => {
   return callApi(() => api.get('/valley-listing'));
};



export const fetchOutsideValleyRooms = async () => {
   return callApi(() => api.get('/outside-valley-listing'));
};



export const searchRooms = async (query) => {
  try {
    const response = await api.get('/rooms/search', {
      params: { q: query, per_page: 100 },
    });
    return response.data.datas; 
  } catch (error) {
    console.error('Search API error:', error);
    return [];
  }
};


export const logoutUser = async () => {
  try {
    await api.post('/logout'); 
  } catch (error) {
    console.log('Logout API error:', error.response ? error.response.data : error.message);
  } finally {
    await AsyncStorage.removeItem('access_token');
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data.user; 
  } catch (error) {
    console.error('Get profile API error:', error);
    return null;
  }
};



export const fetchUsers = () => callApi(async () => [
  { id: '1', name: 'John Doe', role: 'Host', avatar: 'https://picsum.photos/50/50?random=101' },
  { id: '2', name: 'Jane Smith', role: 'Guest', avatar: 'https://picsum.photos/50/50?random=102' },
  { id: '3', name: 'Alice Johnson', role: 'Host', avatar: 'https://picsum.photos/50/50?random=103' },
  { id: '4', name: 'Bob Brown', role: 'Guest', avatar: 'https://picsum.photos/50/50?random=104' },
  { id: '5', name: 'Emma Wilson', role: 'Host', avatar: 'https://picsum.photos/50/50?random=105' },
]);


export const fetchChats = (userId) => callApi(async () => {
  const allChats = [
    { id: '1', userId: '1', user: 'John Doe', message: 'Hello! How are you?', timestamp: '10:30 AM' },
    { id: '2', userId: '2', user: 'Jane Smith', message: 'I’m good, thanks! How about you?', timestamp: '10:32 AM' },
    { id: '3', userId: '1', user: 'John Doe', message: 'Doing great! Ready for the trip?', timestamp: '10:35 AM' },
    { id: '4', userId: '2', user: 'Jane Smith', message: 'Yes, can’t wait!', timestamp: '10:36 AM' },
  ];

  // Return only chats for the selected user
  return allChats.filter(chat => chat.userId === userId);
});



// Favorites
export const fetchFavorites = async () => callApi(() => api.get('/favorites'));

export const toggleFavorite = async (listingId) => {
  try {
    const response = await api.post('/favorites', { listing_id: listingId });
    return response.data;
  } catch (error) {
    console.error('Toggle favorite API error:', error);
    return null;
  }
};
