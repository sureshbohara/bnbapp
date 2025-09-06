import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Image,
  FlatList,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import { fetchGetUsers } from '../services/apiService';
import AppHeader from '../components/common/AppHeader';

// Reusable UserItem component
const UserItem = ({ user }) => {
  const fullAddress = [user.address, user.city, user.state, user.country]
    .filter(Boolean)
    .join(', ');

  return (
    <View style={styles.userCard}>
      {/* Avatar */}
      {user.image_url ? (
        <Image source={{ uri: user.image_url }} style={styles.userImage} />
      ) : (
        <View style={[styles.userImage, styles.avatarPlaceholder]}>
          <Text style={styles.avatarText}>
            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
      )}

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>{user.role}</Text>

        {/* Email */}
        {user.email && (
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={16} color={colors.textLight} style={styles.icon} />
            <Text style={styles.userText}>{user.email}</Text>
          </View>
        )}

        {/* Phone */}
        {user.phone_number && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color={colors.textLight} style={styles.icon} />
            <Text style={styles.userText}>{user.phone_number}</Text>
          </View>
        )}

        {/* Joined Date */}
        {user.created_at && (
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.textLight} style={styles.icon} />
            <Text style={styles.userText}>{new Date(user.created_at).toLocaleDateString()}</Text>
          </View>
        )}

        {/* Address */}
        {fullAddress && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={colors.textLight} style={styles.icon} />
            <Text style={styles.userText}>{fullAddress}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const UserScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchGetUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [loadUsers])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const hosts = users.filter(u => u.role === 'host');
  const guests = users.filter(u => u.role === 'guest');

  const renderSection = (title, data) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <UserItem user={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cardBackground} translucent />
      <AppHeader title="All Users" onBack={() => navigation.goBack()} />

      <FlatList
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={() => <Text style={styles.emptyText}>No users found</Text>}
        ListHeaderComponent={
          <>
            {hosts.length > 0 && renderSection('Hosts', hosts)}
            {guests.length > 0 && renderSection('Guests', guests)}
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10, color: colors.text },

  userCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  userImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  avatarPlaceholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.grayLight },
  avatarText: { color: colors.white, fontWeight: '700', fontSize: 18 },

  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '600', color: colors.text },
  userRole: { fontSize: 14, color: colors.primary, marginBottom: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  icon: { marginRight: 6 },
  userText: { fontSize: 14, color: colors.textLight, flexShrink: 1 },

  separator: { height: 10 },
  emptyText: { textAlign: 'center', marginTop: 50, color: colors.textLight, fontSize: 16 },
});

export default UserScreen;
