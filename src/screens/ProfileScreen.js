import React, { useEffect, useState, useContext } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, 
  ActivityIndicator, TouchableOpacity 
} from 'react-native';
import colors from '../constants/colors';
import AppHeader from '../components/common/AppHeader';
import { getProfile } from '../services/apiService';
import { AuthContext } from '../contexts/AuthContext';
import { showMessage } from 'react-native-flash-message';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchProfile();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile(); // Refresh profile on return from Edit screen
    });
    return unsubscribe;
  }, [navigation]);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      if (data) setUser(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    showMessage({
      message: 'Logout successful',
      type: 'success',
      duration: 3000,
      icon: 'success',
    });
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
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
      <AppHeader title="Profile" onBack={() => navigation.goBack()} />

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: user.image_url || 'https://picsum.photos/120/120' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user.role || 'Guest'}</Text>
        </View>

        <Text style={styles.phone}>{user.phone_number}</Text>
        <Text style={styles.joiningDate}>
          Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
        </Text>
      </View>

        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Address Card */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Address</Text>
        <Text style={styles.infoValue}>{user.address}</Text>
        <Text style={styles.infoValue}>{user.city}</Text>
        <Text style={styles.infoValue}>{user.state}</Text>
        <Text style={styles.infoValue}>{user.country}</Text>
      </View>

      {/* About Me Card */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.infoValue}>{user.bio || 'No description provided.'}</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Profile Header
  profileHeader: {
    backgroundColor: colors.white,
    margin: 15,
    marginTop: 25,
    borderRadius: 20,
    paddingVertical: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: colors.primary },
  name: { fontSize: 24, fontWeight: '700', color: colors.text, marginTop: 15 },
  roleBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginVertical: 5,
  },
  roleText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  phone: { fontSize: 16, color: colors.textLight, marginTop: 5 },
  joiningDate: { fontSize: 13, color: colors.textLight, marginTop: 3 },

  // Edit Button
  editBtn: {
    backgroundColor: colors.secondary,
    marginHorizontal: 20,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 5,
  },
  editText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // Info Cards
  infoCard: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, color: colors.text },
  infoValue: { fontSize: 14, color: colors.textLight, marginBottom: 5 },

  // Logout Button
  logoutBtn: {
    backgroundColor: colors.primary,
    margin: 20,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  logoutText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});

export default ProfileScreen;
