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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import { fetchUsers, fetchChats } from '../services/apiService';

const ChatScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const flatListRef = useRef();

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      if (data) setUsers(data);
    };
    loadUsers();
  }, []);

  const openChat = async (user) => {
    setSelectedUser(user);
    const data = await fetchChats();
    if (data) setChats(data);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg = { id: Date.now().toString(), user: 'You', message, timestamp: 'Now' };
    setChats([...chats, newMsg]);
    setMessage('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  if (!selectedUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Chats</Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.userCard} onPress={() => openChat(item)}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userRole}>{item.role}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f0f2f5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setSelectedUser(null)}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Image source={{ uri: selectedUser.avatar }} style={styles.topAvatar} />
        <Text style={styles.chatHeader}>{selectedUser.name}</Text>
      </View>

      {/* Chat messages */}
      <FlatList
        ref={flatListRef}
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isMe = item.user === 'You';
          return (
            <View style={[styles.messageRow, isMe ? styles.rightRow : styles.leftRow]}>
              {!isMe && <Image source={{ uri: selectedUser.avatar }} style={styles.messageAvatar} />}
              <View
                style={[
                  styles.bubble,
                  isMe ? styles.myBubble : styles.otherBubble,
                  isMe ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 },
                ]}
              >
                <Text style={[styles.messageText, isMe && { color: '#fff' }]}>{item.message}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          style={styles.input}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { fontSize: 22, fontWeight: 'bold', padding: 16, color: '#000' },

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

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  topAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 8 },
  chatHeader: { fontSize: 18, fontWeight: 'bold', color: '#000' },

  messageRow: { flexDirection: 'row', marginVertical: 4, maxWidth: '80%' },
  leftRow: { alignSelf: 'flex-start' },
  rightRow: { alignSelf: 'flex-end', justifyContent: 'flex-end' },

  messageAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 6 },

  bubble: {
    padding: 10,
    borderRadius: 16,
    justifyContent: 'flex-end',
  },
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
