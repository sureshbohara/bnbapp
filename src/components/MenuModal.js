import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/colors';
import { fetchPages } from '../services/apiService';

const MenuModal = ({ visible, onClose }) => {
  const [menuLinks, setMenuLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (menuLinks.length === 0) {
        setLoading(true);
        fetchPages()
          .then((pages) => {
            const links = pages.map((page) => ({
              name: page.name,
              slug: page.slug ?? page.slug_url ?? page.id,
              screen: 'CmsScreen',
            }));

            // Add a static FAQ link at the end
            links.push({
              name: 'FAQs',
              slug: null,
              screen: 'FaqsScreen',
            });

            setMenuLinks(links);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleLinkPress = (item) => {
    navigation.push(item.screen, { slug: item.slug, name: item.name });
    handleClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[styles.menuContainer, { transform: [{ translateY: slideAnim }] }]}
            >
              <Text style={styles.menuTitle}>Menu</Text>

              {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <FlatList
                  data={menuLinks}
                  keyExtractor={(item, index) => `${item.slug ?? 'faq'}_${index}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => handleLinkPress(item)}
                    >
                      <Text style={styles.menuItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}

              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close Menu</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default MenuModal;
