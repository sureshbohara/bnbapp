import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';

import HomeScreen from '../../screens/HomeScreen';
import ListScreen from '../../screens/ListScreen';
import ChatScreen from '../../screens/ChatScreen';
import FavoritesScreen from '../../screens/FavoritesScreen';
import ProfileScreen from '../../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const FooterTab = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.primary,
          height: Platform.OS === 'ios' ? 70 + insets.bottom : 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 5,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: -3 },
          shadowRadius: 6,
          elevation: 6,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home': iconName = 'home'; break;
            case 'List': iconName = 'list'; break;
            case 'Chat': iconName = 'chatbubble-ellipses'; break;
            case 'Favorites': iconName = 'heart'; break;
            case 'Profile': iconName = 'person'; break;
            default: iconName = 'home';
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="List" component={ListScreen} initialParams={{ title: 'All Rooms' }} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default FooterTab;
