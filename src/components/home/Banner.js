// src/components/home/Banner.js
import React from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import colors from '../../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

const Banner = ({ banners = [] }) => {
  const slideWidth = screenWidth - 32;

  if (!banners || banners.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <Carousel
        loop
        width={slideWidth}
        height={slideWidth * 0.45}
        autoPlay={true}
        autoPlayInterval={4000}
        data={banners}
        mode="horizontal-stack"
        modeConfig={{ snapDirection: 'left', stackInterval: 18 }}
        style={{ overflow: 'visible' }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={item.image} 
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: colors.background,
  },
  slide: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});

export default Banner;
