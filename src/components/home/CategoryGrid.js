// src/components/home/CategoryGrid.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 4;
const HORIZONTAL_PADDING = 16;
const ITEM_MARGIN = 12;
const ITEM_SIZE = (width - HORIZONTAL_PADDING * 2 - ITEM_MARGIN * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

const CategoryGrid = ({ categories }) => {
  const navigation = useNavigation();

  const handleCategoryPress = (category) => {
    navigation.navigate('List', {
      title: category.name,
      categoryId: category.id,
    });
  };

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      numColumns={NUM_COLUMNS}
      columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: ITEM_MARGIN }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.8}
          onPress={() => handleCategoryPress(item)}
        >
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.image_url }} style={styles.image} />
          </View>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingHorizontal: HORIZONTAL_PADDING, paddingVertical: 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  item: { width: ITEM_SIZE, alignItems: 'center' },
  imageWrapper: {
    width: ITEM_SIZE * 0.8,
    height: ITEM_SIZE * 0.8,
    borderRadius: (ITEM_SIZE * 0.8) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  image: { width: ITEM_SIZE * 0.5, height: ITEM_SIZE * 0.5, borderRadius: (ITEM_SIZE * 0.5) / 2 },
  name: { fontSize: 13, fontWeight: '500', color: colors.text, textAlign: 'center' },
});

export default CategoryGrid;
