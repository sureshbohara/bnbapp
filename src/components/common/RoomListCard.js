import React, { useContext, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; 
import colors from '../../constants/colors';
import { FavoritesContext } from '../../contexts/FavoritesContext';

const { width } = Dimensions.get('window');
const CARD_IMAGE_WIDTH = width * 0.33;
const CARD_HEIGHT = 130;
const scaleFont = (size) => Math.round(size * (width / 375));

const RoomListCard = ({ room }) => {
  const { favorites, handleFavoriteToggle } = useContext(FavoritesContext);
  const isFavorite = favorites.some(f => f.id === room.id);
  const navigation = useNavigation();

  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => navigation.navigate('RoomDetails', { slug: room.slug })}
      >
        <View style={styles.inner}>
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: room.image_url }} style={styles.image} />
            <View style={styles.overlay} />
            <TouchableOpacity
              style={styles.favoriteBtn}
              onPress={() => handleFavoriteToggle(room)}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? colors.danger : colors.white}
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>
              {room.title}
            </Text>
            <Text style={styles.location} numberOfLines={1}>
              {room.city}, {room.address}
            </Text>
            <View style={styles.bottomRow}>
              <View style={styles.rating}>
                <Ionicons name="star" size={14} color="#f5a623" />
                <Text style={styles.ratingText}>
                  {room.average_rating || 4.5}
                </Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>NPR {room.new_price}/person</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: '4%',
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  inner: { flexDirection: 'row', borderRadius: 16, overflow: 'hidden' },
  imageContainer: {
    width: CARD_IMAGE_WIDTH,
    height: CARD_HEIGHT,
    position: 'relative',
  },
  image: { width: '100%', height: '100%', borderRadius: 16 },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderBottomLeftRadius: 16,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    padding: 6,
    elevation: 3,
  },
  content: { flex: 1, padding: 12, justifyContent: 'space-between' },
  title: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: scaleFont(13),
    color: colors.textLight,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf3e6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: scaleFont(12),
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  priceContainer: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  price: {
    fontSize: scaleFont(14),
    fontWeight: '700',
    color: colors.primary,
  },
});

export default RoomListCard;
