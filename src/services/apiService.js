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

        return api.put('/profile/update', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(response => {
            console.log('Raw API Response:', response.data); 
            return response.data;
        });
    });
};


// Fetch app settings, banners, categories
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

// Users & Chats (mocked)
export const fetchUsers = () => callApi(async () => [
  { id: '1', name: 'John Doe', role: 'Host', avatar: 'https://picsum.photos/50/50?random=101' },
  { id: '2', name: 'Jane Smith', role: 'Guest', avatar: 'https://picsum.photos/50/50?random=102' },
]);

export const fetchChats = (userId) => callApi(async () => {
  const allChats = [
    { id: '1', userId: '1', user: 'John Doe', message: 'Hello! How are you?', timestamp: '10:30 AM' },
    { id: '2', userId: '2', user: 'Jane Smith', message: 'I’m good, thanks! How about you?', timestamp: '10:32 AM' },
  ];
  return allChats.filter(chat => chat.userId === userId);
});

// Favorites
export const fetchFavorites = () => callApi(() => api.get('/favorites'));
export const toggleFavorite = (listingId) =>
  callApi(() => api.post('/favorites', { listing_id: listingId }));
