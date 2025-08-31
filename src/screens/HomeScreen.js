import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { fetchBanners, fetchCategories, fetchRooms } from '../services/apiService';
import SearchBar from '../components/home/Search';
import Banner from '../components/home/Banner';
import CategoryGrid from '../components/home/CategoryGrid';
import PopularRooms from '../components/home/PopularRooms';
import RecommendedRooms from '../components/home/RecommendedRooms';

const HomeScreen = () => {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchBanners().then(setBanners);
    fetchCategories().then(setCategories);
    fetchRooms().then(setRooms);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <SearchBar />
      <Banner banners={banners} />
      <CategoryGrid categories={categories} />
      <PopularRooms rooms={rooms} />
      <RecommendedRooms rooms={rooms} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
});

export default HomeScreen;
