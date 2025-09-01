import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, Text } from 'react-native';
import SearchBar from '../components/home/Search';
import Banner from '../components/home/Banner';
import CategoryGrid from '../components/home/CategoryGrid';
import PopularRooms from '../components/home/PopularRooms';
import RecommendedRooms from '../components/home/RecommendedRooms';
import colors from '../constants/colors';
import {
  fetchBanners,
  fetchCategories,
  fetchValleyRooms,
  fetchOutsideValleyRooms,
  searchRooms,
} from '../services/apiService';
import { FavoritesContext } from '../contexts/FavoritesContext';

const HomeScreen = ({ navigation }) => {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [valleyRooms, setValleyRooms] = useState([]);
  const [outsideValleyRooms, setOutsideValleyRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const { favorites, handleFavoriteToggle } = useContext(FavoritesContext);

  useEffect(() => {
    loadInitialData();
  }, [favorites]); 

  const processRooms = (rooms) =>
    rooms.map(r => ({
      ...r,
      is_favorite: favorites.some(f => f.id === r.id),
    }));

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [b, c, v, o] = await Promise.all([
        fetchBanners(),
        fetchCategories(),
        fetchValleyRooms(),
        fetchOutsideValleyRooms(),
      ]);

      setBanners(b);
      setCategories(c);
      setValleyRooms(processRooms(v));
      setOutsideValleyRooms(processRooms(o));
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query) return loadInitialData();
    setLoading(true);
    try {
      const results = await searchRooms(query);
      setValleyRooms(processRooms(results));
      setOutsideValleyRooms([]);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SearchBar onProfilePress={() => navigation.navigate('Profile')} onSearch={handleSearch} />
      {loading && <ActivityIndicator size="large" color={colors.secondary} style={{ marginTop: 20 }} />}
      <Banner banners={banners} />
      <CategoryGrid categories={categories} />
      {valleyRooms.length > 0 ? (
        <PopularRooms rooms={valleyRooms} onSeeAll={() => navigation.navigate('ValleyRooms')} onFavoriteChange={handleFavoriteToggle} />
      ) : (
        <Text style={styles.noDataText}>No rooms found</Text>
      )}
      {outsideValleyRooms.length > 0 && (
        <RecommendedRooms rooms={outsideValleyRooms} onSeeAll={() => navigation.navigate('OutsideRooms')} onFavoriteChange={handleFavoriteToggle} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  noDataText: { textAlign: 'center', marginTop: 20 },
});

export default HomeScreen;
