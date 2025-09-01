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
import colors from '../constants/colors';
import api from '../utils/api';
import { showMessage } from 'react-native-flash-message';
import { SettingsConstants } from '../constants/SettingsConstants';

const ResetPasswordScreen = ({ navigation }) => {
  const { settings } = useContext(SettingsConstants);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      showMessage({ message: 'Email is required', type: 'danger' });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/forgot-password', { email });
      if (response.data.status === 200) {
        showMessage({ message: response.data.message, type: 'success' });
        navigation.navigate('NewPassword', { email }); 
      } else {
        showMessage({ message: response.data.message || 'Error', type: 'danger' });
      }
    } catch (error) {
      showMessage({ message: error.response?.data?.message || 'Error', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          {settings?.logo && <Image source={{ uri: settings.logo }} style={styles.logo} resizeMode="contain" />}
          <Text style={styles.title}>{settings?.system_name || 'Reset Password'}</Text>
          <Text style={styles.subtitle}>Enter your email to reset password</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleForgotPassword} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
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
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 25, backgroundColor: colors.background },
  logo: { width: 120, height: 120, marginBottom: 15 },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.title, marginBottom: 5, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.textLight, marginBottom: 20, textAlign: 'center' },
  input: { width: '100%', height: 50, borderColor: '#ddd', borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, color: colors.text },
  button: { width: '100%', height: 50, backgroundColor: colors.primary, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  backText: { color: colors.primary, marginTop: 10, fontSize: 14 },
});

export default ResetPasswordScreen;
