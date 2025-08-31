// src/components/common/RoomListCard.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';

const RoomListCard = ({ room, isFavorite: initialFavorite = false, onFavoriteToggle }) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const scale = new Animated.Value(1);

  useEffect(() => {
    setIsFavorite(initialFavorite); // update favorite if parent prop changes
  }, [initialFavorite]);

  const onPressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const toggleFavorite = () => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    if (onFavoriteToggle) onFavoriteToggle(room.id, newValue); // optional callback
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View style={styles.cardInner}>
          {/* Left Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: room.image }} style={styles.image} />
            <View style={styles.imageOverlay} />
            <TouchableOpacity style={styles.favoriteBtn} onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? colors.danger : colors.white}
              />
            </TouchableOpacity>
          </View>

          {/* Right Content */}
          <View style={styles.content}>
            <Text style={styles.name} numberOfLines={1}>{room.name}</Text>
            <Text style={styles.location} numberOfLines={1}>{room.city}, {room.address}</Text>

            <View style={styles.bottomRow}>
              <View style={styles.rating}>
                <Ionicons name="star" size={14} color="#f5a623" />
                <Text style={styles.ratingText}>{room.rating || 4.5}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>${room.price}</Text>
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
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 5,
    backgroundColor: colors.cardBackground,
  },
  cardInner: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 130,
    height: 130,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
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
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
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
    fontSize: 12,
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
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default RoomListCard;
