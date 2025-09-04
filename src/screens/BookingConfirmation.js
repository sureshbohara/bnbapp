import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { showMessage } from 'react-native-flash-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchBookingSubmit } from '../services/apiService';
import colors from '../constants/colors';
import AppHeader from '../components/common/AppHeader';
import { SettingsConstants } from '../constants/SettingsConstants';
const BookingConfirmation = () => {
  const { settings } = useContext(SettingsConstants);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  const {
    listingId,
    checkInDate,
    checkOutDate,
    title,
    price,
    cleaningFee,
    serviceFee,
  } = route.params;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [quote, setQuote] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  const nights = Math.max(
    1,
    Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))
  );

  const totalPrice = Number(price) * nights + Number(cleaningFee || 0) + Number(serviceFee || 0);

  const formatDate = (date) => new Date(date).toISOString().split('T')[0];

  const handlePickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 768,
      quality: 0.7,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        showMessage({
          message: 'Image Picker Error',
          description: response.errorMessage || 'Failed to pick image.',
          type: 'danger',
        });
        return;
      }

      const asset = response.assets[0];
      if (asset.fileSize && asset.fileSize > 2 * 1024 * 1024) {
        showMessage({
          message: 'File Too Large',
          description: 'Payment screenshot must be less than 2MB.',
          type: 'warning',
        });
        return;
      }

      // Ensure URI starts with file:// for iOS
      const uri = asset.uri.startsWith('file://') ? asset.uri : 'file://' + asset.uri;

      setPaymentScreenshot({
        uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || 'screenshot.jpg',
      });
    });
  };

  const handleConfirmBooking = async () => {
    setLoading(true);

    try {
      // Basic validation
      if (!listingId) throw new Error('Listing ID is required');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(checkInDate) < today) throw new Error('Check-in date must be today or later');
      if (new Date(checkOutDate) <= new Date(checkInDate)) throw new Error('Check-out must be after check-in');
      if (!phoneNumber || phoneNumber.length < 8 || phoneNumber.length > 20)
        throw new Error('Phone number must be 8-20 characters');
      if (!paymentScreenshot) throw new Error('Please upload payment screenshot');
      if (adults + children + infants < 1) throw new Error('At least one guest is required');

      // Prepare FormData
      const formData = new FormData();
      formData.append('listing_id', listingId.toString());
      formData.append('check_in', formatDate(checkInDate));
      formData.append('check_out', formatDate(checkOutDate));
      formData.append('adults', adults.toString());
      formData.append('children', children.toString());
      formData.append('infants', infants.toString());
      formData.append('pets', pets.toString());
      formData.append('phone_number', phoneNumber);
      formData.append('special_requests', quote || '');
      formData.append('terms_accepted', '1');
      formData.append('total_price', totalPrice.toString());
      formData.append('payment_screenshot', {
        uri: paymentScreenshot.uri,
        type: paymentScreenshot.type,
        name: paymentScreenshot.name,
      });

      const response = await fetchBookingSubmit(formData);

      if (response.status === 201) {
        showMessage({ message: 'Booking Confirmed', type: 'success' });
         navigation.reset({
         index: 0,
         routes: [{ name: 'MyBook' }],
      });
      } else {
        showMessage({ message: response.data?.message || 'Booking failed', type: 'danger' });
      }
    } catch (error) {
      showMessage({ message: 'Error', description: error.message || 'Booking failed', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const Counter = ({ label, value, setValue }) => (
    <View style={styles.counterRow}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.counter}>
        <TouchableOpacity
          onPress={() => setValue(Math.max(0, value - 1))}
          style={styles.counterBtn}
        >
          <Text style={styles.counterText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.counterValue}>{value}</Text>
        <TouchableOpacity
          onPress={() => setValue(value + 1)}
          style={styles.counterBtn}
        >
          <Text style={styles.counterText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cardBackground} />
      <AppHeader title="Booking Details" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <Text style={styles.title}>{title}</Text>

        {/* Dates */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dates</Text>
          <View style={styles.dateRow}>
            <View>
              <Text style={styles.label}>Check-in</Text>
              <Text style={styles.dateValue}>{checkInDate}</Text>
            </View>
            <View>
              <Text style={styles.label}>Check-out</Text>
              <Text style={styles.dateValue}>{checkOutDate}</Text>
            </View>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact</Text>
          <TextInput
            placeholder="Phone Number"
            keyboardType="phone-pad"
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* Guests */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Guests</Text>
          <Counter label="Adults" value={adults} setValue={setAdults} />
          <Counter label="Children" value={children} setValue={setChildren} />
          <Counter label="Infants" value={infants} setValue={setInfants} />
          <Counter label="Pets" value={pets} setValue={setPets} />
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Special Requests</Text>
          <TextInput
            placeholder="Any notes or requests?"
            style={[styles.input, { height: 80 }]}
            multiline
            value={quote}
            onChangeText={setQuote}
          />
        </View>

        {/* Price */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price</Text>
          <Text style={styles.priceText}>Price per night: NPR {price}</Text>
          {cleaningFee && <Text style={styles.priceText}>Cleaning Fee: NPR {cleaningFee}</Text>}
          {serviceFee && <Text style={styles.priceText}>Service Fee: NPR {serviceFee}</Text>}
          <Text style={[styles.priceText, { fontWeight: '700', marginTop: 8 }]}>
            Total ({nights} night{nights > 1 ? 's' : ''}): NPR {totalPrice}
          </Text>
        </View>

        {/* Payment QR */}
        <View style={styles.card}>
          <Text style={styles.instructionText}>
            Scan this QR to pay. Payment must be completed before sending screenshot.
          </Text>
          {settings?.logo && (
            <Image source={{ uri: settings.logo }} style={styles.qrCode} resizeMode="contain" />
          )}
          <Text style={{ textAlign: 'center', marginTop: 8, color: colors.textLight }}>
            Scan for payment
          </Text>
        </View>

        {/* Upload Screenshot */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upload Payment Screenshot</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={handlePickImage}>
            <Text style={styles.uploadBtnText}>Choose Image</Text>
          </TouchableOpacity>
          {paymentScreenshot && (
            <Image source={{ uri: paymentScreenshot.uri }} style={styles.uploadedImage} />
          )}
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={[styles.fixedButtonContainer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.bookBtnText}> Confirm Booking </Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingConfirmation;

// Styles (unchanged)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 10, marginTop: 10, color: colors.text },
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: colors.text },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 14, color: colors.textLight },
  dateValue: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fdfdfd',
  },
  instructionText: { fontSize: 14, color: colors.textLight, marginBottom: 8, textAlign: 'center' },
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  counter: { flexDirection: 'row', alignItems: 'center' },
  counterBtn: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  counterText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  counterValue: { fontSize: 16, fontWeight: '600', marginHorizontal: 12 },
  priceText: { fontSize: 16, marginBottom: 4 },
  qrCode: { width: 150, height: 150, alignSelf: 'center', marginVertical: 10 },
  uploadBtn: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  uploadBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  uploadedImage: { width: '100%', height: 200, marginTop: 10, borderRadius: 12 },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 5,
    elevation: 10,
  },
  bookBtn: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  bookBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
