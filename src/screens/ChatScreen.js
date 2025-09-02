import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import colors from '../constants/colors';
import { fetchChatUsers, fetchMessages, sendMessageApi } from '../services/apiService';
import AppHeader from '../components/common/AppHeader';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const flatListRef = useRef();

  // Load users when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchChatUsers();
      setUsers(data);
    };
    loadUsers();
  }, []);

  // Open chat with a user
  const openChat = async (user) => {
    setSelectedUser(user);
    const data = await fetchMessages(user.id);
    setChats(data);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // Send message
  const sendMessage = async () => {
    if (!message.trim() || !selectedUser) return;

    const tempMsg = message.trim();
    setMessage('');

    try {
      const savedMessage = await sendMessageApi(selectedUser.id, tempMsg);
      setChats((prev) => [...prev, savedMessage]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // Render user list if no chat selected
  if (!selectedUser) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.cardBackground} />
        <AppHeader title="User Chats" onBack={() => navigation.goBack()} />
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.userCard} onPress={() => openChat(item)}>
              <Image source={{ uri: item.image_url || 'https://nepalibnb.glaciersafari.com/default/noimage.png' }} style={styles.avatar} />
              <View>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userRole}>{item.role || ''}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    );
  }

  // Render chat messages
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f0f2f5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.cardBackground} />
        <AppHeader
          title={selectedUser.name}
          avatar={selectedUser.image_url || 'https://nepalibnb.glaciersafari.com/default/noimage.png'}
          onBack={() => setSelectedUser(null)}
        />

        <FlatList
          ref={flatListRef}
          data={chats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isMe = item.sender_id === 'me' || item.sender_id === undefined;
            return (
              <View style={[styles.messageRow, isMe ? styles.rightRow : styles.leftRow]}>
                {!isMe && <Image source={{ uri: selectedUser.image_url }} style={styles.messageAvatar} />}
                <View
                  style={[
                    styles.bubble,
                    isMe ? styles.myBubble : styles.otherBubble,
                    isMe ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 },
                  ]}
                >
                  <Text style={[styles.messageText, isMe && { color: '#fff' }]}>{item.message}</Text>
                  <Text style={styles.timestamp}>{item.created_at ? item.created_at.split(' ')[1] : ''}</Text>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          style={styles.input}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  userName: { fontSize: 16, fontWeight: '600', color: '#000' },
  userRole: { fontSize: 12, color: '#555' },
  messageRow: { flexDirection: 'row', marginVertical: 4, maxWidth: '80%' },
  leftRow: { alignSelf: 'flex-start' },
  rightRow: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
  messageAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 6 },
  bubble: { padding: 10, borderRadius: 16, justifyContent: 'flex-end' },
  myBubble: { backgroundColor: '#0084ff' },
  otherBubble: { backgroundColor: '#e5e5ea' },
  messageText: { fontSize: 14, color: '#000' },
  timestamp: { fontSize: 10, color: '#555', alignSelf: 'flex-end', marginTop: 4 },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#0084ff',
    borderRadius: 24,
    padding: 10,
    marginLeft: 8,
  },
});

export default ChatScreen;
