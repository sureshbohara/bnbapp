import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, StatusBar, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import colors from '../constants/colors';
import { fetchPageBySlug } from '../services/apiService';
import AppHeader from '../components/common/AppHeader';

const CmsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { slug: routeSlug } = route.params || {};
  const slug = routeSlug || '';

  const { width } = useWindowDimensions();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch CMS page by slug
  const loadPage = useCallback(async () => {
    if (!slug) return setData(null);
    setLoading(true);
    try {
      const pageData = await fetchPageBySlug(slug); // Already returns datas
      console.log('Fetched pageData:', pageData);
      setData(pageData || null);
    } catch (err) {
      console.error('Failed to fetch page:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Load page on focus
  useFocusEffect(
    useCallback(() => {
      loadPage();
    }, [loadPage])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loader}>
        <Text>Page not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cardBackground} translucent />
      <AppHeader title={data.name} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>{data.name}</Text>

        {data.description && (
          <RenderHtml
            contentWidth={width}
            source={{ html: data.description }}
            tagsStyles={{ 
              p: { fontSize: 16, lineHeight: 24, color: colors.text, marginBottom: 10 },
              strong: { fontWeight: 'bold' },
              em: { fontStyle: 'italic' },
              li: { fontSize: 16, marginVertical: 2 },
            }}
          />
        )}

        {data.excerpt && (
          <RenderHtml
            contentWidth={width}
            source={{ html: data.excerpt }}
            tagsStyles={{ p: { fontSize: 16, fontStyle: 'italic', marginVertical: 10, color: colors.textLight } }}
          />
        )}

        {data.feature_list?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            {data.feature_list.map((feature, idx) => (
              <Text key={idx} style={styles.listItem}>• {feature}</Text>
            ))}
          </View>
        )}

        {data.faqs?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FAQs</Text>
            {data.faqs.map((faq, idx) => (
              <View key={idx} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Q: {faq.question}</Text>
                <Text style={styles.faqAnswer}>A: {faq.answer}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  listItem: { fontSize: 16, marginVertical: 2 },
  faqItem: { marginBottom: 12 },
  faqQuestion: { fontWeight: '600', fontSize: 16 },
  faqAnswer: { fontSize: 16, marginLeft: 10, color: colors.text },
});

export default CmsScreen;
