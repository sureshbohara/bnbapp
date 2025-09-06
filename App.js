// App.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FlashMessage from 'react-native-flash-message';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import FooterTab from './src/components/navigation/FooterTab';
import EditProfileScreen from './src/screens/EditProfileScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import RoomDetailsScreen from './src/screens/RoomDetailsScreen';
import BookingConfirmation from './src/screens/BookingConfirmation';
import MyBookingsScreen from './src/screens/MyBookingsScreen';
import CmsScreen from './src/screens/CmsScreen';
import FaqsScreen from './src/screens/FaqsScreen';
import UserScreen from './src/screens/UserScreen';

import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import { SettingsProvider } from './src/constants/SettingsConstants';
import { FavoritesProvider } from './src/contexts/FavoritesContext';


UserScreen
const Stack = createNativeStackNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </Stack.Navigator>
);

// App Stack (Tabs + other screens)
const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* Main tabs */}
    <Stack.Screen name="MainTabs" component={FooterTab} />

    {/* Screens on top of tabs */}
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen name="RoomDetails" component={RoomDetailsScreen} />
    <Stack.Screen name="BookingConfirmation" component={BookingConfirmation} />
    <Stack.Screen name="MyBook" component={MyBookingsScreen} />
    <Stack.Screen name="CmsScreen" component={CmsScreen} />
    <Stack.Screen name="FaqsScreen" component={FaqsScreen} />
    <Stack.Screen name="UserScreen" component={UserScreen} />
  </Stack.Navigator>
);

// Root Navigator
const RootNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <SplashScreen />;

  return user ? <AppStack /> : <AuthStack />;
};

// Main App
export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <FavoritesProvider>
          <NavigationContainer>
            <RootNavigator />
            <FlashMessage
              position="bottom"
              floating
              duration={3000}
              style={{ marginBottom: 50 }}
            />
          </NavigationContainer>
        </FavoritesProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
