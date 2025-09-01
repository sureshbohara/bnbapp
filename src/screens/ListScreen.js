import React, { useState, useCallback, useContext, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, StatusBar, Text } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import colors from '../constants/colors';
import { fetchAllRooms, fetchRoomsByCategory, searchRooms } from '../services/apiService';
import RoomListCard from '../components/common/RoomListCard';
import AppHeader from '../components/common/AppHeader';
import { FavoritesContext } from '../contexts/FavoritesContext';

const ListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { favorites } = useContext(FavoritesContext);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Default params fallback
  const { title: routeTitle, categoryId: routeCategoryId, query: routeQuery } = route.params || {};
  const title = routeTitle || 'All Rooms';
  const categoryId = routeCategoryId || null;
  const query = routeQuery || '';

  // Load rooms based on current params
  const loadRooms = useCallback(async () => {
    setLoading(true);
    setRooms([]); // clear old rooms
    try {
      let data = [];
      if (query && query.length > 0) {
        data = await searchRooms(query);
        if (categoryId) data = data.filter(room => room.category_id === categoryId);
      } else {
        data = categoryId ? await fetchRoomsByCategory(categoryId) : await fetchAllRooms();
      }

      // Map favorites
      const mapped = data.map(room => ({
        ...room,
        isFavorite: favorites.some(f => f.id === room.id),
      }));

      setRooms(mapped);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, query, favorites]);

  // Reload every time screen is focused
  useFocusEffect(
    useCallback(() => {
      loadRooms();
    }, [loadRooms])
  );

  // Handle tabPress for "All Rooms" to reset params
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      if (route.name === 'List') {
        navigation.setParams({ title: 'All Rooms', categoryId: null, query: '' });
        loadRooms();
      }
    });

    return unsubscribe;
  }, [navigation, loadRooms, route.name]);

  if (loading) return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cardBackground} translucent />
      <AppHeader title={title} onBack={() => navigation.goBack()} />

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <RoomListCard room={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16, paddingTop: 16 }}
        ListEmptyComponent={
          <View style={{ marginTop: 50, alignItems: 'center' }}>
            <Text>No rooms found.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
});

export default ListScreen;
