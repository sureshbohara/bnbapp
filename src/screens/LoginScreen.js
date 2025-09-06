import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../constants/colors';
import { AuthContext } from '../contexts/AuthContext';
import { SettingsConstants } from '../constants/SettingsConstants'; 

const REMEMBER_ME_KEY = '@remember_me_credentials';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const { settings } = useContext(SettingsConstants);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);

  // Load saved credentials on mount
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const saved = await AsyncStorage.getItem(REMEMBER_ME_KEY);
        if (saved) {
          const { email: savedEmail, password: savedPassword } = JSON.parse(saved);
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (err) {
        console.log('Failed to load saved credentials:', err);
      }
    };
    loadCredentials();
  }, []);

  const validateInputs = () => {
    if (!email) {
      showMessage({ message: 'Email is required', type: 'danger' });
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      showMessage({ message: 'Please enter a valid email', type: 'danger' });
      return false;
    }
    if (!password) {
      showMessage({ message: 'Password is required', type: 'danger' });
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const user = await login(email, password);

      // Save credentials if "Remember Me" is checked
      if (rememberMe) {
        await AsyncStorage.setItem(
          REMEMBER_ME_KEY,
          JSON.stringify({ email, password })
        );
      } else {
        await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      }

      showMessage({ message: `Welcome ${user.name}! 🎉`, type: 'success' });
      // navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch {
      // error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {settings?.logo && (
            <Image
              source={{ uri: settings.logo }}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          <Text style={styles.title}>Find Your Next Stay</Text>
          <Text style={styles.subtitle}>
            Rooms and houses ready for your adventure
          </Text>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={colors.textLight}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current.focus()}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              ref={passwordRef}
              placeholder="Password"
              placeholderTextColor={colors.textLight}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(prev => !prev)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={22}
                color={colors.textLight}
              />
            </TouchableOpacity>
          </View>

          {/* Remember Me + Forgot Password Row */}
          <View style={styles.rememberForgotWrapper}>
            <View style={styles.rememberWrapper}>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                thumbColor={rememberMe ? colors.primary : '#fff'}
                trackColor={{ false: '#ccc', true: colors.primary + '55' }}
              />
              <Text style={styles.rememberText}>Remember Me</Text>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.loginText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerWrapper}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 120, height: 120, marginBottom: 10, borderRadius: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.primary, marginBottom: 10 },
  subtitle: { fontSize: 16, color: colors.textLight, marginBottom: 20 },
  inputWrapper: { width: '100%', marginBottom: 15, position: 'relative' },
  input: {
    backgroundColor: '#fff',
    color: colors.textDark,
    padding: 12,
    paddingRight: 40,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  eyeIcon: { position: 'absolute', right: 10, top: '50%', transform: [{ translateY: -11 }] },
  rememberForgotWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  rememberWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 10,
    color: colors.textDark,
    fontSize: 14,
  },
  forgotText: {
    color: colors.secondary,
    fontSize: 14,
  },
  loginBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: { opacity: 0.7 },
  loginText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  registerWrapper: { flexDirection: 'row', alignItems: 'center' },
  registerText: { color: colors.primary, fontWeight: 'bold' },
});

export default LoginScreen;
