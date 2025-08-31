import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.floor((width - 16 * 3) / 2);

const RoomCard = ({ room }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85}>
      {/* Room Image */}
      <View>
        <Image source={{ uri: room.image }} style={styles.image} />

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => setIsFavorite(!isFavorite)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? colors.danger : colors.white}
          />
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{room.name}</Text>

        {/* Location */}
        <Text style={styles.location} numberOfLines={1}>
          {room.city}, {room.address}
        </Text>

        {/* Rating + Price */}
        <View style={styles.bottomRow}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#f5a623" />
            <Text style={styles.ratingText}>{room.rating || 4.5}</Text>
          </View>
          <Text style={styles.price}>${room.price}/person</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    width: CARD_WIDTH,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 120,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    padding: 4,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default RoomCard;
