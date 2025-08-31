// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import RoomListCard from '../components/common/RoomListCard';

const bookingsData = [
  {
    id: 1,
    name: 'Luxury Room',
    city: 'Kathmandu',
    address: 'Thamel',
    price: 120,
    rating: 4.7,
    image: 'https://picsum.photos/200/140?random=1',
  },
  {
    id: 2,
    name: 'Cozy Apartment',
    city: 'Pokhara',
    address: 'Lakeside',
    price: 90,
    rating: 4.5,
    image: 'https://picsum.photos/200/140?random=2',
  },
  {
    id: 3,
    name: 'Modern Suite',
    city: 'Bhaktapur',
    address: 'Durbar Square',
    price: 150,
    rating: 4.8,
    image: 'https://picsum.photos/200/140?random=3',
  },
];

const ProfileScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="create-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Avatar & Basic Info */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: 'https://picsum.photos/120/120?random=10' }} style={styles.avatar} />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.phone}>+977 9876543210</Text>
      </View>

      {/* Address Info */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Address</Text>
        <Text style={styles.infoValue}>123 Main Street</Text>
        <Text style={styles.infoValue}>Kathmandu</Text>
        <Text style={styles.infoValue}>Bagmati Province</Text>
        <Text style={styles.infoValue}>Nepal</Text>
      </View>

      {/* Additional Info */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.infoValue}>
          Hello! I am John, a traveler and booking enthusiast. I love discovering new places and staying at
          unique accommodations. This is my personal profile description.
        </Text>
      </View>

      {/* Booking Section */}
      <View style={{ marginTop: 20 }}>
        <Text style={[styles.sectionTitle, { marginLeft: 16 }]}>My Bookings</Text>
        {bookingsData.map((room) => (
          <RoomListCard key={room.id} room={room} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: { padding: 5 },
  editBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },

  // Profile Info
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  name: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginTop: 10 },
  phone: { fontSize: 16, color: colors.textLight, marginTop: 5 },

  // Info Cards
  infoCard: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: colors.text },
  infoValue: { fontSize: 14, color: colors.textLight, marginBottom: 4 },
});

export default ProfileScreen;
