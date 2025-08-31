// src/screens/RegisterScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const RegisterScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>User Register</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  text: { fontSize: 20, color: colors.text },
});

export default RegisterScreen;