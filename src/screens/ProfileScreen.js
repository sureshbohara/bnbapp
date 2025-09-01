import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, 
  ActivityIndicator, TouchableOpacity, Alert 
} from 'react-native';
import colors from '../constants/colors';
import AppHeader from '../components/common/AppHeader';
import { getProfile, logoutUser } from '../services/apiService';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const data = await getProfile();
    if (data) setUser(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser(); // Use centralized logout function
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Unable to logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.text }}>Failed to load profile.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <AppHeader
        title="Profile"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: user.avatar || 'https://picsum.photos/120/120' }} 
          style={styles.avatar} 
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.phone}>{user.phone}</Text>
        <Text style={styles.joiningDate}>
          Joined: {new Date(user.created_at).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Address</Text>
        <Text style={styles.infoValue}>{user.address}</Text>
        <Text style={styles.infoValue}>{user.city}</Text>
        <Text style={styles.infoValue}>{user.province}</Text>
        <Text style={styles.infoValue}>{user.country}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.infoValue}>{user.about || 'No description provided.'}</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileContainer: { alignItems: 'center', marginTop: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  name: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginTop: 10 },
  phone: { fontSize: 16, color: colors.textLight, marginTop: 5 },
  joiningDate: { fontSize: 14, color: colors.textLight, marginTop: 3 },
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
  logoutBtn: {
    backgroundColor: colors.primary,
    margin: 20,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
});

export default ProfileScreen;
