import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import api from '../utils/api';
import { showMessage } from 'react-native-flash-message';
import { SettingsConstants } from '../constants/SettingsConstants';

const NewPasswordScreen = ({ navigation, route }) => {
  const { settings } = useContext(SettingsConstants);
  const { email, token } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      showMessage({ message: 'Both fields are required', type: 'danger' });
      return;
    }
    if (password !== confirmPassword) {
      showMessage({ message: 'Passwords do not match', type: 'danger' });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/reset-password', {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      if (response.data.status === 200) {
        showMessage({ message: 'Password reset successfully', type: 'success' });
        navigation.navigate('Login');
      } else {
        showMessage({ message: response.data.message || 'Failed to reset password', type: 'danger' });
      }
    } catch (error) {
      showMessage({ message: error.response?.data?.message || 'Error resetting password', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          {settings?.logo && <Image source={{ uri: settings.logo }} style={styles.logo} resizeMode="contain" />}
          <Text style={styles.subtitle}>Enter your new password</Text>

          {/* New Password Field */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Field */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Reset Password</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: colors.background,
  },
  logo: { width: 120, height: 120, marginBottom: 15 },
  subtitle: { fontSize: 16, color: colors.textLight, marginBottom: 20, textAlign: 'center' },
  inputWrapper: { width: '100%', marginBottom: 15, position: 'relative' },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: colors.text,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  backText: { color: colors.primary, marginTop: 10, fontSize: 14 },
});

export default NewPasswordScreen;
