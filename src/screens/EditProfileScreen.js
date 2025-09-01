import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import { getProfile, updateProfileUser } from '../utils/api'; 

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [phone_number , setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // Load profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const profile = await getProfile();
      setLoading(false);
      if (profile) {
        setUser(profile);
        setName(profile.name || '');
        setPhone(profile.phone_number || '');
        setAddress(profile.address || '');
        setCity(profile.city || '');
        setState(profile.state || '');
        setCountry(profile.country || '');
        setBio(profile.bio || '');
        setImageUrl(profile.image_url || null);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setLoading(true);

    const data = {
      name,
      phone_number,
      address,
      city,
      state,
      country,
      bio,
      image, 
    };

    try {
      const updated = await updateProfileUser(data);
      setLoading(false);

      if (updated) {
        Alert.alert('Success', 'Profile updated successfully');
        setUser(updated.data.user);
        setName(updated.data.user.name || '');
        setPhone(updated.data.user.phone_number || '');
        setAddress(updated.data.user.address || '');
        setCity(updated.data.user.city || '');
        setState(updated.data.user.state || '');
        setCountry(updated.data.user.country || '');
        setBio(updated.data.user.bio || '');
        setImageUrl(updated.data.user.image_url || null);
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  // Image picker placeholder
  const pickImage = () => {
    Alert.alert('Image Picker', 'Image picker not implemented. Use existing image or implement native module.');
  };

  if (loading && !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.avatar} />
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text>Select Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
      <TextInput style={styles.input} placeholder="State" value={state} onChangeText={setState} />
      <TextInput style={styles.input} placeholder="Country" value={country} onChangeText={setCountry} />
      <TextInput style={styles.input} placeholder="Bio" value={bio} onChangeText={setBio} />

      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Profile</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  avatar: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 20, backgroundColor: '#f0f0f0' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15 },
  button: { backgroundColor: '#3498db', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
