import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import AppHeader from '../components/common/AppHeader';
import colors from '../constants/colors';
import { fetchListingDetails } from '../services/apiService';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';

const { width } = Dimensions.get('window');

const ListingDetailsScreen = ({ route, navigation }) => {
  const { slug } = route.params;
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);

  useEffect(() => {
    const loadListing = async () => {
      try {
        const data = await fetchListingDetails(slug);
        setRoom(data);
        setMainImage(data.image_url);

        const marks = {};
        const today = new Date();

        // Mark next 365 days as available by default
        for (let i = 0; i < 365; i++) {
          const date = new Date();
          date.setDate(today.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          marks[dateStr] = {
            selected: false,
            color: '#68d391', // Green for available
            disabled: false,
          };
        }

        // Override with API availabilities
        if (data.availabilities && Array.isArray(data.availabilities)) {
          console.log('Availabilities:', data.availabilities); // Debug
          data.availabilities.forEach((slot) => {
            if (!slot.date) {
              console.warn('Missing date in slot:', slot);
              return;
            }
            switch (slot.status?.toLowerCase()) { // Handle case sensitivity
              case 'booked':
                marks[slot.date] = {
                  selected: true,
                  color: '#ff6b6b', // Red for booked
                  disabled: true,
                };
                break;
              case 'blocked':
                marks[slot.date] = {
                  selected: true,
                  color: '#a0aec0', // Gray for blocked
                  disabled: true,
                };
                break;
              case 'available':
              default:
                marks[slot.date] = {
                  selected: false,
                  color: '#68d391', // Green for available
                  disabled: false,
                };
                break;
            }
          });
        } else {
          console.warn('Availabilities is missing or not an array:', data.availabilities);
        }

        // Disable past dates
        Object.keys(marks).forEach((dateStr) => {
          const date = new Date(dateStr);
          if (date < today.setHours(0, 0, 0, 0)) {
            marks[dateStr].disabled = true;
            marks[dateStr].color = '#e0e0e0'; // Gray for past
          }
        });

        setMarkedDates(marks);
      } catch (error) {
        console.error('Error fetching listing:', error);
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [slug]);

  const updateMarkedDates = (checkIn, checkOut) => {
    const newMarkedDates = { ...markedDates };

    // Reset previous selections
    Object.keys(newMarkedDates).forEach((date) => {
      if (!newMarkedDates[date].disabled) {
        newMarkedDates[date] = {
          selected: false,
          color: '#68d391', // Reset to available
          disabled: false,
        };
      }
    });

    if (checkIn) {
      newMarkedDates[checkIn] = {
        selected: true,
        startingDay: true,
        color: colors.primary, // Blue for check-in
        textColor: '#fff',
      };

      if (checkOut) {
        newMarkedDates[checkOut] = {
          selected: true,
          endingDay: true,
          color: '#ff6b6b', // Red for check-out
          textColor: '#fff',
        };

        // Highlight in-between dates
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        let current = new Date(start);
        current.setDate(current.getDate() + 1);

        while (current < end) {
          const dateStr = current.toISOString().split('T')[0];
          if (!newMarkedDates[dateStr].disabled) {
            newMarkedDates[dateStr] = {
              selected: true,
              color: '#b3e0ff', // Light blue for in-between
              textColor: '#000',
            };
          }
          current.setDate(current.getDate() + 1);
        }
      }
    }

    setMarkedDates(newMarkedDates);
  };

  const handleDayPress = (day) => {
    const today = new Date();
    const selected = new Date(day.dateString);
    const slot = room.availabilities?.find((a) => a.date === day.dateString);

    // Prevent selecting past, booked, or blocked dates
    if (
      selected < today.setHours(0, 0, 0, 0) ||
      slot?.status?.toLowerCase() === 'booked' ||
      slot?.status?.toLowerCase() === 'blocked'
    ) {
      setCheckInDate(null);
      setCheckOutDate(null);
      updateMarkedDates(null, null);
      Alert.alert('Unavailable', 'This date is either booked, blocked, or in the past.');
      return;
    }

    if (!checkInDate) {
      // First tap: set check-in
      setCheckInDate(day.dateString);
      setCheckOutDate(null);
      updateMarkedDates(day.dateString, null);
    } else if (!checkOutDate) {
      // Second tap: set check-out if after check-in
      if (day.dateString > checkInDate) {
        setCheckOutDate(day.dateString);
        updateMarkedDates(checkInDate, day.dateString);
      } else {
        Alert.alert('Invalid Date', 'Check-out date must be after check-in date.');
      }
    } else {
      // Reset and start new selection
      setCheckInDate(day.dateString);
      setCheckOutDate(null);
      updateMarkedDates(day.dateString, null);
    }
  };

  const handleBookNow = () => {
    if (!checkInDate || !checkOutDate) {
      Alert.alert('Select Dates', 'Please select both check-in and check-out dates.');
      return;
    }

    // Navigate to BookingConfirmation screen
    navigation.navigate('BookingConfirmation', {
      slug,
      checkInDate,
      checkOutDate,
      title: room.title,
      price: room.new_price,
      cleaningFee: room.cleaning_fee,
      serviceFee: room.service_fee,
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!room) {
    return (
      <View style={styles.center}>
        <Text>Listing not found</Text>
      </View>
    );
  }

  let houseRules = [];
  try {
    houseRules = Array.isArray(room.house_rules)
      ? room.house_rules
      : JSON.parse(room.house_rules || '[]');
  } catch {
    houseRules = [];
  }

  const {
    gallery = [],
    amenities = [],
    accommodate = [],
    category,
    title,
    description,
    new_price,
    cleaning_fee,
    service_fee,
    listing_type,
    minimum_nights,
    cancellation_policy,
    instant_bookable,
    address,
    city,
    province,
    latitude,
    longitude,
  } = room;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <AppHeader title="Listing Details" onBack={() => navigation.goBack()} />

      {/* Main Image */}
      {mainImage && <Image source={{ uri: mainImage }} style={styles.mainImage} />}

      {/* Gallery */}
      {gallery.length > 0 && (
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <FlatList
            data={gallery}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  setMainImage(`https://nepalibnb.glaciersafari.com/storage/${item}`)
                }
              >
                <Image
                  source={{ uri: `https://nepalibnb.glaciersafari.com/storage/${item}` }}
                  style={styles.galleryImageSmall}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Title & Category */}
      <View style={styles.header}>
        {title && <Text style={styles.title}>{title}</Text>}
        {category?.name && <Text style={styles.category}>{category.name}</Text>}
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      {/* Pricing */}
      {(new_price || cleaning_fee || service_fee || minimum_nights) && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          {new_price && <Text style={styles.price}>NPR {new_price} / per night</Text>}
          {cleaning_fee && <Text>Cleaning Fee: NPR {cleaning_fee}</Text>}
          {service_fee && <Text>Service Fee: NPR {service_fee}</Text>}
          {minimum_nights && <Text>Minimum Nights: {minimum_nights}</Text>}
        </View>
      )}

      {/* Details */}
      {(listing_type || cancellation_policy || instant_bookable !== undefined) && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Details</Text>
          {listing_type && <Text>Type: {listing_type}</Text>}
          {cancellation_policy && <Text>Cancellation Policy: {cancellation_policy}</Text>}
          {instant_bookable !== undefined && (
            <Text>Instant Bookable: {instant_bookable ? 'Yes' : 'No'}</Text>
          )}
        </View>
      )}

      {/* Address */}
      {(address || city || province) && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text>{[address, city, province].filter(Boolean).join(', ')}</Text>
        </View>
      )}

      {/* Accommodation */}
      {accommodate.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Accommodation</Text>
          <View style={styles.accommodateRow}>
            {accommodate.map((item, index) => (
              <View key={index} style={styles.accommodateItem}>
                <Text style={styles.accommodateLabel}>{item.label}</Text>
                <Text style={styles.accommodateValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Amenities */}
      {amenities.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <FlatList
            data={amenities}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.amenityItem}>
                {item.image_url && (
                  <Image source={{ uri: item.image_url }} style={styles.amenityImage} />
                )}
                <Text style={styles.amenityText}>{item.name}</Text>
              </View>
            )}
          />
        </View>
      )}

      {/* House Rules */}
      {houseRules.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>House Rules</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {houseRules.map((rule, index) => (
              <View key={index} style={styles.ruleChip}>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Availability Calendar */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Availability Calendar</Text>
        <Calendar
          markingType={'period'} // Enable range highlighting
          markedDates={markedDates}
          onDayPress={handleDayPress}
          theme={{
            selectedDayBackgroundColor: colors.primary,
            todayTextColor: colors.primary,
            arrowColor: colors.primary,
          }}
        />
      </View>

      {/* Map Button */}
      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => {
          if (latitude && longitude) {
            const label = room.title || 'Location';
            let url = '';
            if (Platform.OS === 'ios') {
              url = `maps:0,0?q=${latitude},${longitude}(${label})`;
            } else {
              url = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`;
            }
            Linking.openURL(url).catch((err) => console.error('Error opening map:', err));
          }
        }}
      >
        <Icon name="map" size={16} color="#fff" />
        <Text style={styles.mapButtonText}>View on Map</Text>
      </TouchableOpacity>

      {/* Book Now Button */}
      <TouchableOpacity style={styles.bookNowBtn} onPress={handleBookNow}>
        <Text style={styles.bookNowText}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ListingDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '100%', height: 250, borderRadius: 12, marginBottom: 16 },
  galleryImageSmall: { width: 80, height: 60, marginRight: 8, borderRadius: 8 },
  header: { paddingHorizontal: 16, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 4 },
  category: { fontSize: 16, color: colors.textLight },
  description: { fontSize: 14, color: colors.text, marginTop: 8 },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: colors.text },
  price: { fontSize: 20, fontWeight: '700', marginBottom: 4, color: colors.primary },
  accommodateRow: { flexDirection: 'row', flexWrap: 'wrap' },
  accommodateItem: { width: '50%', marginBottom: 8 },
  accommodateLabel: { color: colors.textLight },
  accommodateValue: { fontWeight: '600', fontSize: 16 },
  amenityItem: {
    alignItems: 'center',
    marginRight: 12,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  amenityText: { fontSize: 12, color: colors.text, marginTop: 4, textAlign: 'center' },
  amenityImage: { width: 50, height: 50, borderRadius: 25 },
  ruleChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  ruleText: { fontSize: 12 },
  bookNowBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookNowText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  mapButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapButtonText: { color: '#fff', marginLeft: 6 },
});