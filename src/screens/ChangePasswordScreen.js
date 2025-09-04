import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../contexts/AuthContext';
import { changePasswordApi } from '../services/apiService';
import colors from '../constants/colors';
import AppHeader from '../components/common/AppHeader';

const ChangePasswordScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Toggle password visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage({ message: 'All fields are required', type: 'warning' });
      return;
    }
    if (newPassword !== confirmPassword) {
      showMessage({ message: 'Passwords do not match', type: 'danger' });
      return;
    }

    setLoading(true);
    try {
      const res = await changePasswordApi({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      if (res.status === 200) {
        showMessage({ message: res.message, type: 'success' });
        navigation.goBack();
      } else {
        showMessage({ message: res.message || 'Failed to change password', type: 'danger' });
      }
    } catch (err) {
      console.error(err);
      showMessage({ message: 'Something went wrong', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordInput = (value, setValue, placeholder, visible, setVisible) => (
    <View style={styles.inputWrapper}>
      <TextInput
        placeholder={placeholder}
        secureTextEntry={!visible}
        style={styles.input}
        value={value}
        onChangeText={setValue}
      />
      <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.eyeIcon}>
        <Ionicons name={visible ? 'eye' : 'eye-off'} size={22} color="#555" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.headerWrapper}>
        <AppHeader title="Change Password" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.instructionTitle}>Please follow these instructions:</Text>
        <View style={styles.instructionList}>
          <Text style={styles.instructionItem}>1. Enter your current password correctly.</Text>
          <Text style={styles.instructionItem}>2. Choose a new password at least 8 characters long.</Text>
          <Text style={styles.instructionItem}>3. Avoid using easily guessable passwords.</Text>
          <Text style={styles.instructionItem}>4. Confirm your new password by entering it again.</Text>
          <Text style={styles.instructionItem}>5. Make sure your new password is different from the old one.</Text>
        </View>

        {renderPasswordInput(currentPassword, setCurrentPassword, 'Current Password', showCurrent, setShowCurrent)}
        {renderPasswordInput(newPassword, setNewPassword, 'New Password', showNew, setShowNew)}
        {renderPasswordInput(confirmPassword, setConfirmPassword, 'Confirm New Password', showConfirm, setShowConfirm)}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Change Password</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    backgroundColor: '#fff',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#f9f9f9',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  instructionList: {
    marginBottom: 20,
  },
  instructionItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    paddingRight: 45,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#222',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default ChangePasswordScreen;
