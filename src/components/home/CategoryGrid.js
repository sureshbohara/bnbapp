// src/components/home/CategoryGrid.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 64) / 4;

const CategoryGrid = ({ categories }) => (
  <View style={{ marginTop: 16 }}>
    <Text style={styles.title}>Categories</Text>
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      numColumns={4}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.item} activeOpacity={0.8}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </View>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    />
  </View>
);

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold', color: colors.title, marginBottom: 12, paddingHorizontal: 16 },
  item: { width: ITEM_SIZE, alignItems: 'center', marginBottom: 16 },
  imageWrapper: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  image: { width: 40, height: 40, borderRadius: 20 },
  name: { fontSize: 12, textAlign: 'center', color: colors.textLight, marginTop: 6 },
});

export default CategoryGrid;
