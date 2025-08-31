import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../constants/colors';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Home'); 
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />

      <Text style={styles.appName}>Nepali BNB</Text>

      {/* Info lines */}
      <Text style={styles.info}>Find the best rooms and stays</Text>
      <Text style={styles.info}>Easy and reliable booking experience</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    color: colors.white,
  },
});

export default SplashScreen;
