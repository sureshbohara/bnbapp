// SplashScreen.js
import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Animated } from 'react-native';
import colors from '../constants/colors';
import { SettingsConstants } from '../constants/SettingsConstants';

const SplashScreen = () => {
  const { settings } = useContext(SettingsConstants);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {settings?.logo ? (
        <Image source={{ uri: settings.logo }} style={styles.logo} resizeMode="contain" />
      ) : (
        <ActivityIndicator size="large" color={colors.secondary} />
      )}
      <Text style={styles.appName}>{settings?.system_name || 'Welcome'}</Text>
      <Animated.Text style={[styles.slogan, { opacity: fadeAnim }]}>
        {settings?.slogan || 'Your next stay, your perfect home'}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white },
  logo: { width: 120, height: 120, marginBottom: 20 },
  appName: { fontSize: 28, fontWeight: 'bold', color: colors.primary },
  slogan: { fontSize: 16, color: colors.secondary, marginTop: 8, textAlign: 'center' },
});

export default SplashScreen;
