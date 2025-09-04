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
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const [imageUrl, setImageUrl] = useState(null);
  const [image1Url, setImage1Url] = useState(null);
  const [image2Url, setImage2Url] = useState(null);

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
        setImage1Url(data.image1_url || null);
        setImage2Url(data.image2_url || null);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      showMessage({ message: 'Failed to load profile', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const pickImage = (setter) => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        showMessage({ message: response.errorMessage || 'Error selecting image', type: 'danger' });
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setter(response.assets[0]);
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
      image1,
      image2,
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
        setImage1(null);
        setImage2(null);

        setImageUrl(updated.user.image_url || null);
        setImage1Url(updated.user.image1_url || null);
        setImage2Url(updated.user.image2_url || null);
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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader title="Edit Profile" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Images Row */}
        <View style={styles.imagesRow}>
          {/* Profile */}
          <View style={styles.imageWrapper}>
            <TouchableOpacity onPress={() => pickImage(setImage)}>
              {image ? (
                <Image source={{ uri: image.uri }} style={styles.avatar} />
              ) : imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]} />
              )}
            </TouchableOpacity>
            <Text style={styles.imageLabel}>Profile</Text>
          </View>

          {/* Citizenship */}
          <View style={styles.imageWrapper}>
            <TouchableOpacity onPress={() => pickImage(setImage1)}>
              {image1 ? (
                <Image source={{ uri: image1.uri }} style={styles.avatar} />
              ) : image1Url ? (
                <Image source={{ uri: image1Url }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]} />
              )}
            </TouchableOpacity>
            <Text style={styles.imageLabel}>Citizenship</Text>
          </View>

          {/* License / Passport */}
          <View style={styles.imageWrapper}>
            <TouchableOpacity onPress={() => pickImage(setImage2)}>
              {image2 ? (
                <Image source={{ uri: image2.uri }} style={styles.avatar} />
              ) : image2Url ? (
                <Image source={{ uri: image2Url }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]} />
              )}
            </TouchableOpacity>
            <Text style={styles.imageLabel}>License / Passport</Text>
          </View>
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

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.updateBtn, updating && { opacity: 0.7 }]}
          onPress={handleUpdateProfile}
          disabled={updating}
        >
          {updating ? <ActivityIndicator color="#fff" /> : <Text style={styles.updateText}>Save Changes</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  imagesRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15 },
  imageWrapper: { alignItems: 'center' },
  imageLabel: { marginTop: 6, fontSize: 12, color: '#555', fontWeight: '500', textAlign: 'center' },

  avatar: { width: 100, height: 100, borderRadius: 60, borderWidth: 3, borderColor: colors.primary, backgroundColor: '#eee' },
  avatarPlaceholder: { justifyContent: 'center', alignItems: 'center' },

  inputContainer: { marginTop: 5 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 3, color: '#444' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 10, backgroundColor: '#fff', fontSize: 15, color: '#222' },
  textArea: { height: 80, textAlignVertical: 'top' },

  updateBtn: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  updateText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default EditProfileScreen;
