import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import { fetchFaqs } from '../services/apiService';
import AppHeader from '../components/common/AppHeader';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FaqsScreen = () => {
  const navigation = useNavigation();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchFaqs()
      .then((data) => setFaqs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (faqs.length === 0) {
    return (
      <View style={styles.loader}>
        <Text>No FAQs available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <AppHeader title="FAQs" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}>
        {faqs.map((faq, index) => {
          const isExpanded = expandedId === faq.id;
          return (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.questionRow}
                onPress={() => toggleExpand(faq.id)}
              >
                {/* Number Circle */}
                <View style={styles.numberCircle}>
                  <Text style={styles.numberText}>{index + 1}</Text>
                </View>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.primary}
                  style={{
                    transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
                  }}
                />
              </TouchableOpacity>
              {isExpanded && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  faqItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingVertical: 12,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  numberText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  faqQuestion: { flex: 1, fontSize: 16, fontWeight: '500', color: colors.text },
  faqAnswer: {
    marginTop: 8,
    marginLeft: 40,
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
  },
});

export default FaqsScreen;
