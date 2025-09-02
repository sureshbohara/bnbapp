// src/components/navigation/FooterTab.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../../constants/colors";

import HomeScreen from "../../screens/HomeScreen";
import ListScreen from "../../screens/ListScreen";
import ChatScreen from "../../screens/ChatScreen";
import FavoritesScreen from "../../screens/FavoritesScreen";
import ProfileScreen from "../../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const FooterTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          height: 100,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.primary,
        },
        tabBarIcon: ({ color }) => {
          let iconName = "home";
          if (route.name === "Home") iconName = "home";
          else if (route.name === "List") iconName = "list";
          else if (route.name === "Chat") iconName = "chatbubble-ellipses";
          else if (route.name === "Favorites") iconName = "heart";
          else if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={28} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="List" component={ListScreen} initialParams={{ title: "All Rooms" }} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default FooterTab;
