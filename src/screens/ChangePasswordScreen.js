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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Full-width Header */}
      <View style={styles.headerWrapper}>
        <AppHeader title="Change Password" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Instruction List */}
        <Text style={styles.instructionTitle}>Please follow these instructions:</Text>
        <View style={styles.instructionList}>
          <Text style={styles.instructionItem}>1. Enter your current password correctly.</Text>
          <Text style={styles.instructionItem}>2. Choose a new password at least 8 characters long.</Text>
          <Text style={styles.instructionItem}>3. Avoid using easily guessable passwords.</Text>
          <Text style={styles.instructionItem}>4. Confirm your new password by entering it again.</Text>
          <Text style={styles.instructionItem}>5. Make sure your new password is different from the old one.</Text>
        </View>

        {/* Input fields */}
        <TextInput
          placeholder="Current Password"
          secureTextEntry
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          placeholder="New Password"
          secureTextEntry
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          placeholder="Confirm New Password"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Change Password Button */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Change Password</Text>
          )}
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#222',
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
