import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';
import { FavoritesContext } from '../../contexts/FavoritesContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.45; 
const IMAGE_HEIGHT = CARD_WIDTH * 0.75;
const scaleFont = (size) => Math.round(size * (width / 375));

const RoomCard = ({ room }) => {
  const { favorites, handleFavoriteToggle } = useContext(FavoritesContext);

  // derive isFavorite from context
  const isFavorite = favorites.some(f => f.id === room.id);

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: room.image_url }} style={styles.image} />
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => handleFavoriteToggle(room)}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={scaleFont(22)}
            color={isFavorite ? colors.danger : colors.white}
          />
        </TouchableOpacity>
        {room.category_name && (
          <View style={styles.categoryBadge}>
            <Text style={[styles.categoryText, { fontSize: scaleFont(11) }]}>
              {room.category_name}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { fontSize: scaleFont(16) }]} numberOfLines={1}>
          {room.title}
        </Text>
        <Text style={[styles.location, { fontSize: scaleFont(13) }]} numberOfLines={1}>
          {room.city}, {room.address}
        </Text>
        <Text style={[styles.price, { fontSize: scaleFont(15) }]}>
          NPR {room.new_price}/person
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { width: CARD_WIDTH, marginBottom: 16, borderRadius: 16, backgroundColor: colors.cardBackground, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6 },
  imageWrapper: { position: 'relative' },
  image: { width: '100%', height: IMAGE_HEIGHT, borderTopLeftRadius: 16, borderTopRightRadius: 16, resizeMode: 'cover' },
  favoriteBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: 6 },
  categoryBadge: { position: 'absolute', bottom: 10, left: 10, backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  categoryText: { color: colors.white, fontWeight: '600' },
  info: { padding: 12 },
  name: { fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  location: { color: colors.textLight, marginBottom: 6 },
  price: { fontWeight: 'bold', color: colors.primary },
});

export default RoomCard;
