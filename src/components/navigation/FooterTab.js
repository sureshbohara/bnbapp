import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../../constants/colors";

// Screens
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
          height:80,                
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          elevation: 0,
          shadowOpacity: 0,
          borderTopColor: colors.primary,
        },
        tabBarItemStyle: {
          paddingVertical: 8,       
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          let iconSize = 30;   

          if (route.name === "Home") iconName = "home";
          else if (route.name === "List") iconName = "list";
          else if (route.name === "Chat") iconName = "chatbubble";
          else if (route.name === "Favorites") iconName = "heart";
          else if (route.name === "Profile") iconName = "person";

          if (route.name === "Favorites") {
            return (
              <View style={{ width: 36, height: 36, alignItems: "center" }}>
                <Ionicons name={iconName} size={iconSize} color={color} />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>4</Text>
                </View>
              </View>
            );
          }

          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="List" component={ListScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: colors.danger,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default FooterTab;
