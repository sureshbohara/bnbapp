import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window'); 

const SearchBar = () => {
  return (
    <View style={styles.container}>
      {/* Search Input Box */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Search rooms..."
          placeholderTextColor={colors.textLight}
        />
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search" size={width * 0.045} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Avatar Icon */}
      <View style={styles.profile}>
        <Image
          source={require('../../assets/images/avatar.png')}
          style={styles.avatar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '4%',
    marginVertical: '2%',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: '4%',
    height: width * 0.12,
    borderWidth: 1.3,
    borderColor: colors.secondary,
  },
  input: {
    flex: 1,
    fontSize: width * 0.04, 
    color: colors.text,
    paddingVertical: 0,
    marginRight: '2%',
  },
  searchBtn: {
    backgroundColor: colors.primary,
    padding: width * 0.025,
    borderRadius: 20,
  },
  profile: {
    marginLeft: '3%',
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1.3,
    borderColor: colors.secondary,
  },
  avatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
  },
});

export default SearchBar;
