import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../components/common/AppHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUser } from '../services/apiService';
import { AuthContext } from '../contexts/AuthContext';
import { showMessage } from 'react-native-flash-message';
const RegisterScreen = () => {
  const navigation = useNavigation();
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    country: '',
    is_host: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const validateInputs = () => {
    let errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (!form.passwordConfirm) errs.passwordConfirm = 'Confirm Password is required';
    else if (form.password !== form.passwordConfirm)
      errs.passwordConfirm = 'Passwords do not match';
    if (!form.phone_number.trim()) errs.phone_number = 'Phone number is required';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.state.trim()) errs.state = 'State is required';
    if (!form.country.trim()) errs.country = 'Country is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

const handleRegister = async () => {
  if (!validateInputs()) {
    showMessage({ message: 'Please fix the errors in the form', type: 'danger' });
    return;
  }
  setLoading(true);
  try {
    const response = await registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.passwordConfirm,
      phone_number: form.phone_number,
      address: form.address,
      city: form.city,
      state: form.state,
      country: form.country,
      is_host: form.is_host,
    });

    const { token, user } = response.data;
    await AsyncStorage.setItem('access_token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    showMessage({ message: `Welcome ${user.name}! 🎉`, type: 'success' });
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error) {
    if (error.response?.data?.errors) {
      setErrors(error.response.data.errors);
      showMessage({
        message: 'Validation failed. Please check your inputs.',
        type: 'danger',
      });
    } else {
      showMessage({ message: 'Something went wrong. Please try again.', type: 'danger' });
    }
  } finally {
    setLoading(false);
  }
};
  const renderInput = (key, placeholder, secure = false, keyboardType = 'default') => {
    const isPasswordField = key === 'password' || key === 'passwordConfirm';
    const showIcon = key === 'password' ? showPassword : showPasswordConfirm;

    return (
      <View key={key} style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, errors[key] && styles.inputError]}
            placeholder={placeholder}
            placeholderTextColor={colors.textLight}
            secureTextEntry={isPasswordField ? !showIcon : secure}
            keyboardType={keyboardType}
            value={form[key]}
            onChangeText={(text) => handleChange(key, text)}
            editable={!loading}
          />
          {isPasswordField && (
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() =>
                key === 'password'
                  ? setShowPassword(!showPassword)
                  : setShowPasswordConfirm(!showPasswordConfirm)
              }
            >
              <Ionicons
                name={showIcon ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>
          )}
        </View>
        {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <AppHeader title="Register" onBack={() => navigation.goBack()} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {renderInput('name', 'Name')}
          {renderInput('email', 'Email', false, 'email-address')}
          {renderInput('phone_number', 'Phone Number', false, 'phone-pad')}
          {renderInput('address', 'Address')}
          {renderInput('city', 'City')}
          {renderInput('state', 'State')}
          {renderInput('country', 'Country')}
          {renderInput('password', 'Password', true)}
          {renderInput('passwordConfirm', 'Confirm Password', true)}

          <View style={styles.switchContainer}>
            <View>
              <Text style={styles.switchLabel}>Register as Host</Text>
              <Text style={styles.switchSubLabel}>Earn money by hosting travelers</Text>
            </View>
            <Switch
              value={form.is_host}
              onValueChange={(value) => handleChange('is_host', value)}
              thumbColor={form.is_host ? colors.primary : '#f4f3f4'}
              trackColor={{ false: '#767577', true: colors.primary + '80' }}
              disabled={loading}
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            style={[styles.button, loading && styles.buttonDisabled]}
          >
            {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Register</Text>}
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 25 },
  inputContainer: { marginBottom: 15 },
  inputWrapper: { position: 'relative', width: '100%' },
  input: {
    height: 45,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputError: { borderColor: 'red' },
  eyeIcon: { position: 'absolute', right: 10, top: 12 },
  errorText: { color: 'red', fontSize: 12, marginTop: 3 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 20 },
  switchLabel: { fontSize: 16, fontWeight: '500', color: colors.text },
  switchSubLabel: { fontSize: 12, color: colors.textLight },
  button: { width: '100%', height: 50, borderRadius: 12, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
});

export default RegisterScreen;
