// src/components/home/PopularRooms.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import RoomCard from '../common/RoomCard';
import colors from '../../constants/colors';

const PopularRooms = ({ rooms, onSeeAll }) => (
  <View style={{ marginTop: 16 }}>
    {/* Header Row */}
    <View style={styles.headerRow}>
      <Text style={styles.title}>Inside Valley</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAll}>See All</Text>
      </TouchableOpacity>
    </View>

    {/* Room List */}
    <FlatList
      data={rooms}
      keyExtractor={(item) => item.id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <RoomCard room={item} />}
      columnWrapperStyle={{
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
      }}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  </View>
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.title,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default PopularRooms;
