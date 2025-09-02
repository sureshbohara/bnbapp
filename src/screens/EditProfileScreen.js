import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { showMessage } from 'react-native-flash-message';
import colors from '../constants/colors';
import AppHeader from '../components/common/AppHeader';
import { getProfile, updateProfileUser } from '../services/apiService';
import { AuthContext } from '../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user: authUser, setUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

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
        setName(data.name || '');
        setPhone(data.phone_number || '');
        setAddress(data.address || '');
        setCity(data.city || '');
        setStateVal(data.state || '');
        setCountry(data.country || '');
        setBio(data.bio || '');
        setImageUrl(data.image_url || null);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      showMessage({ message: 'Failed to load profile', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        showMessage({ message: response.errorMessage || 'Error selecting image', type: 'danger' });
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      showMessage({ message: 'Name is required', type: 'danger' });
      return;
    }
    setUpdating(true);

    const profileData = {
      name,
      phone_number: phone,
      address,
      city,
      state: stateVal,
      country,
      bio,
      image,
    };

    try {
      const updated = await updateProfileUser(profileData);
      if (updated?.user) {
        showMessage({ message: 'Profile updated successfully', type: 'success' });
        setUser(updated.user);
        setName(updated.user.name || '');
        setPhone(updated.user.phone_number || '');
        setAddress(updated.user.address || '');
        setCity(updated.user.city || '');
        setStateVal(updated.user.state || '');
        setCountry(updated.user.country || '');
        setBio(updated.user.bio || '');
        setImage(null);
        setImageUrl(updated.user.image_url || null);
      } else {
        showMessage({ message: updated?.message || 'Failed to update profile', type: 'danger' });
      }
    } catch (error) {
      console.error('Update error:', error);
      showMessage({ message: 'Something went wrong', type: 'danger' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Full-width Header */}
      <View style={styles.headerWrapper}>
        <AppHeader title="Edit Profile" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.avatar} />
            ) : imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={42} color="#999" />
              </View>
            )}
            <View style={styles.editIcon}>
              <Ionicons name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarText}>Change Photo</Text>
        </View>

        {/* Inputs */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Phone</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <Text style={styles.label}>Address</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} />

          <Text style={styles.label}>City</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} />

          <Text style={styles.label}>State</Text>
          <TextInput style={styles.input} value={stateVal} onChangeText={setStateVal} />

          <Text style={styles.label}>Country</Text>
          <TextInput style={styles.input} value={country} onChangeText={setCountry} />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Button */}
        <TouchableOpacity style={[styles.updateBtn, updating && { opacity: 0.7 }]} onPress={handleUpdateProfile} disabled={updating}>
          {updating ? <ActivityIndicator color="#fff" /> : <Text style={styles.updateText}>Save Changes</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
 
  container: { flex: 1, backgroundColor: '#f9f9f9', paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  avatarSection: { alignItems: 'center', marginVertical: 20 },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: '#eee',
  },
  avatarPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  editIcon: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarText: {
    marginTop: 8,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },

  inputContainer: { marginTop: 5 },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 3,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#222',
  },
  textArea: { height: 80, textAlignVertical: 'top' },

  updateBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  updateText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default EditProfileScreen;
