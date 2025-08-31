// src/services/apiService.js
import api, { handleError } from '../utils/api';


const callApi = async (requestFn, navigation = null) => {
  try {
    const response = await requestFn();
    // Adjust based on your API structure
    return response.data?.datas ?? response.data ?? response;
  } catch (error) {
    await handleError(error, navigation);
    return null;
  }
};


export const fetchBanners = () => callApi(async () => [
  { id: '1', image: require('../assets/images/banner1.jpg') },
  { id: '2', image: require('../assets/images/banner2.jpg') },
]);


export const fetchCategories = () => callApi(async () => [
  { id: '1', name: 'House', image: 'https://nepalibnb.glaciersafari.com/storage/images/ASPYfAxVwhplnySb9Sexqd14HwHQlXxQRxj9qLYA.png', slug: 'house' },
  { id: '2', name: 'Apartment', image: 'https://nepalibnb.glaciersafari.com/storage/images/FDbJLV4rBDqGMw0d9B4anIKb7eL6PJMYkxl9ONEO.png', slug: 'apartment' },
  { id: '3', name: 'Cabin', image: 'https://nepalibnb.glaciersafari.com/storage/images/3XzmR9Oy9FLSC8QOCMhFOKIcl01WCkVLD4OfTLwR.png', slug: 'cabin' },
  { id: '4', name: 'Villa', image: 'https://nepalibnb.glaciersafari.com/storage/images/n3ieeHrigsJFAejY55lBz45AxKKFd7T1H5meEZEt.png', slug: 'villa' },
  { id: '5', name: 'Guesthouse', image: 'https://nepalibnb.glaciersafari.com/storage/images/I7WAZW8CKEPkPNo7hqvkWdI47xumufxKgot6Zc12.png', slug: 'guesthouse' },
  { id: '6', name: 'Cottage', image: 'https://nepalibnb.glaciersafari.com/storage/images/M5jU42ypdenxSGTpe4JmgXWLeAIcxN4elyNSr6uu.png', slug: 'cottage' },
  { id: '7', name: 'Bungalow', image: 'https://img.freepik.com/premium-vector/bungalow-icon-vector-image-can-be-used-type-houses_120816-285173.jpg', slug: 'bungalow' },
  { id: '8', name: 'Farmhouse', image: 'https://static.vecteezy.com/system/resources/previews/036/258/299/non_2x/pastoral-residence-mark-farmers-house-icon-countryside-dwelling-impression-farmhouse-emblem-vector.jpg', slug: 'farmhouse' },
]);


export const fetchRooms = () => callApi(async () => [
  { 
    id: '1', 
    name: 'House Room', 
    price: 120, 
    image: 'https://themewagon.github.io/royal/image/room1.jpg', 
    category_id: '1',
    city: 'Kathmandu',
    address: '123 Main St, Kathmandu'
  },
  { 
    id: '2', 
    name: 'Apartment Room', 
    price: 100, 
    image: 'https://themewagon.github.io/royal/image/room2.jpg', 
    category_id: '2',
    city: 'Pokhara',
    address: '45 Lakeside Rd, Pokhara'
  },
  { 
    id: '3', 
    name: 'Cabin Room', 
    price: 80, 
    image: 'https://themewagon.github.io/royal/image/room3.jpg', 
    category_id: '3',
    city: 'Chitwan',
    address: '78 Jungle Path, Chitwan'
  },
  { 
    id: '4', 
    name: 'Villa Room', 
    price: 150, 
    image: 'https://themewagon.github.io/royal/image/room4.jpg', 
    category_id: '4',
    city: 'Pokhara',
    address: '12 Ocean View Rd, Pokhara'
  },
  { 
    id: '5', 
    name: 'Guesthouse Room', 
    price: 90, 
    image: 'https://dreamstour.dreamstechnologies.com/html/assets/img/hotels/hotel-07.jpg', 
    category_id: '5',
    city: 'Bhaktapur',
    address: '56 Heritage St, Bhaktapur'
  },
  { 
    id: '6', 
    name: 'Cottage Room', 
    price: 200, 
    image: 'https://dreamstour.dreamstechnologies.com/html/assets/img/hotels/hotel-06.jpg', 
    category_id: '6',
    city: 'Lalitpur',
    address: '99 Hilltop Rd, Lalitpur'
  },
]);


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


export const fetchFavorites = () => callApi(async () => [
  { id: '1', name: 'House Room', price: 120, image: 'https://picsum.photos/160/100?random=21', city: 'Kathmandu', address: '123 Main St, Kathmandu', rating: 4.5 },
  { id: '2', name: 'Apartment Room', price: 100, image: 'https://picsum.photos/160/100?random=22', city: 'Pokhara', address: '45 Lakeside Rd, Pokhara', rating: 4.2 },
  { id: '3', name: 'Cabin Room', price: 80, image: 'https://picsum.photos/160/100?random=23', city: 'Chitwan', address: '78 Jungle Path, Chitwan', rating: 4.7 },
  { id: '4', name: 'Villa Room', price: 150, image: 'https://picsum.photos/160/100?random=24', city: 'Pokhara', address: '12 Ocean View Rd, Pokhara', rating: 4.8 },
]);
