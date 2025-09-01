import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/colors';
import FavCard from '../components/common/FavCard';
import AppHeader from '../components/common/AppHeader';
import { FavoritesContext } from '../contexts/FavoritesContext';

const FavoritesScreen = () => {
  const { favorites, loadingFavorites, handleFavoriteToggle } = useContext(FavoritesContext);
  const navigation = useNavigation();

  if (loadingFavorites) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Your Favorites" onBack={() => navigation.goBack()} />
      <FlatList
        data={favorites}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <FavCard room={item} onRemove={handleFavoriteToggle} />}
        contentContainerStyle={{ paddingBottom: 16, paddingTop: 16 }}
        ListEmptyComponent={
          <View style={{ marginTop: 50, alignItems: 'center' }}>
            <Text style={{ color: colors.textLight }}>No favorite rooms yet.</Text>
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

export default FavoritesScreen;
