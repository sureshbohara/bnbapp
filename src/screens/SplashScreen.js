import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Animated } from 'react-native';
import colors from '../constants/colors';
import { SettingsConstants } from '../constants/SettingsConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SPLASH_DELAY = 2000;

const SplashScreen = ({ navigation }) => {
  const { settings, loading } = useContext(SettingsConstants);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in animation for slogan
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const checkLogin = async () => {
      await new Promise(res => setTimeout(res, SPLASH_DELAY));
      const token = await AsyncStorage.getItem('access_token');
      navigation.replace(token ? 'Home' : 'Login');
    };
    checkLogin();
  }, [navigation]);

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
