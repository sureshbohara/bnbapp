// SplashScreen.js
import React, { useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import colors from '../constants/colors';
import { SettingsConstants } from '../constants/SettingsConstants';

const SplashScreen = () => {
  const { settings } = useContext(SettingsConstants);

  const appSettings = {
    logo: settings?.logo,
    system_name: settings?.system_name || 'Nepali BNB',
    slogan: settings?.slogan || 'Your next stay, your perfect home',
  };


  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const textSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(textSlide, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {appSettings.logo && (
        <Animated.Image
          source={{ uri: appSettings.logo }}
          style={[
            styles.logo,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
          resizeMode="contain"
        />
      )}
      <Animated.Text
        style={[
          styles.appName,
          {
            opacity: fadeAnim,
            transform: [{ translateY: textSlide }],
          },
        ]}
      >
        {appSettings.system_name}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.slogan,
          {
            opacity: fadeAnim,
            transform: [{ translateY: textSlide }],
          },
        ]}
      >
        {appSettings.slogan}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  slogan: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default SplashScreen;
