import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import colors from '../../constants/colors';
import { AuthContext } from '../../contexts/AuthContext';
import MenuModal from '../MenuModal';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: query.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [query]);

  const handleSearchSubmit = () => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length > 0) {
      navigation.navigate('List', {
        title: `Search: ${trimmedQuery}`,
        query: trimmedQuery,
      });
    }
  };

  return (
    <View style={styles.headerBackground}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {user?.name ? `Hi, ${user.name}` : 'EXPLORE'}
          </Text>

          {/* Menu Icon */}
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu" size={28} color={colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Floating Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={22}
            color={colors.secondary}
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={styles.input}
            placeholder="Search rooms, houses..."
            placeholderTextColor={colors.textLight}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearchSubmit}
          />
          {query.length > 0 && (
            <Animated.View style={{ opacity: fadeAnim }}>
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textLight} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>

      {/* Menu Modal */}
      <MenuModal visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    paddingBottom: 30,
  },
  safeArea: {
    paddingBottom: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1,
  },
  searchWrapper: {
    marginTop: 0,
    paddingHorizontal: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 0,
  },
});

export default SearchBar;
