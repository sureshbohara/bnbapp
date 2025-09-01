import React, { createContext, useState, useEffect } from 'react';
import { fetchFavorites, toggleFavorite } from '../services/apiService';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoadingFavorites(true);
    try {
      const response = await fetchFavorites();
      if (response && Array.isArray(response)) {
        const mapped = response
          .filter(item => item.listing)
          .map(item => ({
            id: item.listing.id,
            title: item.listing.title,
            image_url: item.listing.image_url,
            city: item.listing.city,
            address: item.listing.address,
            average_rating: item.listing.average_rating || 4.5,
            new_price: item.listing.new_price,
          }));
        setFavorites(mapped);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setFavorites([]);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const handleFavoriteToggle = async (room) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === room.id);
      if (exists) return prev.filter(f => f.id !== room.id);
      return [...prev, room];
    });

    try {
      await toggleFavorite(room.id);
    } catch (error) {
      loadFavorites(); 
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, loadingFavorites, handleFavoriteToggle, loadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
