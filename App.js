import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import NewPasswordScreen from './src/screens/NewPasswordScreen';
import FooterTab from './src/components/navigation/FooterTab';

import { SettingsProvider } from './src/constants/SettingsConstants';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import { AuthProvider } from './src/contexts/AuthContext'; 
import FlashMessage from 'react-native-flash-message';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <FavoritesProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
              <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
              <Stack.Screen name="Home" component={FooterTab} />
            </Stack.Navigator>
            <FlashMessage position="top" />
          </NavigationContainer>
        </FavoritesProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
