import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RoomCard from '../common/RoomCard';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 250;
const CARD_MARGIN = 12;
const HORIZONTAL_PADDING = 16;
const PopularRooms = ({ rooms, onFavoriteChange }) => {
  const navigation = useNavigation();
  const handleSeeAll = () => {
    navigation.navigate('List', { title: 'All List' }); 
  };
  return (
    <View style={{ marginTop: 16 }}>
      <View style={[styles.headerRow, { paddingHorizontal: HORIZONTAL_PADDING }]}>
        <Text style={styles.title}>Inside Valley</Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: HORIZONTAL_PADDING, paddingVertical: 4 }}
        renderItem={({ item, index }) => (
          <View style={{ marginRight: index === rooms.length - 1 ? HORIZONTAL_PADDING : CARD_MARGIN }}>
            <RoomCard
              room={item}
              width={CARD_WIDTH}
              initialFavorite={item.is_favorite}
              onFavoriteChange={(fav) => onFavoriteChange(item.id, fav)}
            />
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.title },
  seeAll: { fontSize: 14, fontWeight: '600', color: colors.primary },
});
export default PopularRooms;
