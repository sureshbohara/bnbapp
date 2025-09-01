import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import RoomCard from '../common/RoomCard';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const NUM_COLUMNS = 2;
const ITEM_MARGIN = 12;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - ITEM_MARGIN * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

const RecommendedRooms = ({ rooms, onSeeAll, onFavoriteChange }) => (
  <View style={{ marginTop: 16 }}>
    <View style={[styles.headerRow, { paddingHorizontal: HORIZONTAL_PADDING }]}>
      <Text style={styles.title}>Outside Valley</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAll}>See All</Text>
      </TouchableOpacity>
    </View>

    <FlatList
      data={rooms}
      keyExtractor={(item) => item.id.toString()}
      numColumns={NUM_COLUMNS}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <View
          style={{
            width: CARD_WIDTH,
            marginBottom: 16,
            marginRight: (index + 1) % NUM_COLUMNS === 0 ? 0 : ITEM_MARGIN,
          }}
        >
          <RoomCard
            room={item}
            width={CARD_WIDTH}
            initialFavorite={item.is_favorite}
            onFavoriteChange={(fav) => onFavoriteChange(item.id, fav)}
          />
        </View>
      )}
      contentContainerStyle={{ paddingHorizontal: HORIZONTAL_PADDING, paddingBottom: 16 }}
    />
  </View>
);

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.title },
  seeAll: { fontSize: 14, fontWeight: '600', color: colors.primary },
});

export default RecommendedRooms;
