import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import colors from '../constants/colors';
import AppHeader from '../components/common/AppHeader';
import { getProfile } from '../services/apiService';
import { AuthContext } from '../contexts/AuthContext';
import { showMessage } from 'react-native-flash-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({ navigation }) => {
  const { user: authUser, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      return;
    }
    fetchProfile();
    const unsubscribe = navigation.addListener('focus', fetchProfile);
    return unsubscribe;
  }, [authUser, navigation]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getProfile();
      if (data) {
        setProfile(data);
      } else {
        setProfile(null);
        showMessage({ message: 'No profile data found', type: 'warning' });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    showMessage({ message: 'Logout successful', type: 'success' });
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.text }}>Failed to load profile.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <AppHeader title="My Profile" onBack={() => navigation.goBack()} />

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: profile.image_url || 'https://picsum.photos/120/120' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{profile.name || 'Guest User'}</Text>
        <View style={styles.roleBadge}>
          <Ionicons name="person-outline" size={16} color={colors.primary} />
          <Text style={styles.roleText}>{profile.role || 'Guest'}</Text>
        </View>
        <Text style={styles.phone}>{profile.phone_number || '-'}</Text>
        <Text style={styles.joiningDate}>
          Member since {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.secondary }]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#e74c3c' }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Info Sections */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Address</Text>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color={colors.primary} />
          <Text style={styles.infoValue}>{profile.address || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={18} color={colors.primary} />
          <Text style={styles.infoValue}>{profile.city || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="map-outline" size={18} color={colors.primary} />
          <Text style={styles.infoValue}>{profile.state || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="earth-outline" size={18} color={colors.primary} />
          <Text style={styles.infoValue}>{profile.country || '-'}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.infoValue}>{profile.bio || 'No description provided.'}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Profile Card
  profileCard: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 10,
  },
  name: { fontSize: 22, fontWeight: '700', color: colors.text },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 6,
  },
  roleText: { color: colors.primary, fontWeight: '600', marginLeft: 6, fontSize: 13 },
  phone: { fontSize: 15, color: colors.textLight, marginTop: 8 },
  joiningDate: { fontSize: 13, color: colors.textLight, marginTop: 4 },

  // Actions
  actionsRow: {
    flexDirection: 'column',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 6,
    paddingHorizontal: 15,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 15,
  },

  // Info Card
  infoCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 15,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
    flexShrink: 1,
  },
});

export default ProfileScreen;
