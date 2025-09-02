import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import AppHeader from '../components/common/AppHeader';

const BookingConfirmation = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { slug, checkInDate, checkOutDate, title, price, cleaningFee, serviceFee } = route.params;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [quote, setQuote] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const nights = Math.max(
    1,
    Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))
  );

  const totalPrice =
    Number(price) * nights +
    Number(cleaningFee || 0) +
    Number(serviceFee || 0);

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setPaymentScreenshot(response.assets[0]);
      }
    });
  };

  const handleConfirmBooking = async () => {
    if (!phoneNumber) {
      showMessage({
        message: 'Missing Info',
        description: 'Please provide a phone number.',
        type: 'warning',
        icon: 'warning',
      });
      return;
    }

    if (!paymentScreenshot) {
      showMessage({
        message: 'Payment Required',
        description: 'Please upload payment screenshot.',
        type: 'warning',
        icon: 'warning',
      });
      return;
    }

    const totalGuests = adults + children + infants;
    const maxGuests = 4;
    if (totalGuests > maxGuests) {
      showMessage({
        message: 'Invalid Guests',
        description: `This listing can accommodate up to ${maxGuests} guests.`,
        type: 'danger',
        icon: 'danger',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('slug', slug);
      formData.append('title', title);
      formData.append('checkInDate', checkInDate);
      formData.append('checkOutDate', checkOutDate);
      formData.append('nights', nights);
      formData.append('price', totalPrice);
      formData.append('phoneNumber', phoneNumber);
      formData.append('adults', adults);
      formData.append('children', children);
      formData.append('infants', infants);
      formData.append('pets', pets);
      formData.append('quote', quote);
      formData.append('qrImage', 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BookingDummy');

      formData.append('paymentScreenshot', {
        uri: paymentScreenshot.uri,
        type: paymentScreenshot.type,
        name: paymentScreenshot.fileName,
      });

      const response = await fetch('https://your-backend.com/api/bookings', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = await response.json();

      showMessage({
        message: 'Booking Confirmed',
        description: 'Your booking has been successfully submitted!',
        type: 'success',
        icon: 'success',
      });

      navigation.navigate('Home');
    } catch (error) {
      showMessage({
        message: 'Error',
        description: 'Failed to confirm booking.',
        type: 'danger',
        icon: 'danger',
      });
      console.error(error);
    }
  };

  const Counter = ({ label, value, setValue }) => (
    <View style={styles.counterRow}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.counter}>
        <TouchableOpacity
          onPress={() => setValue(value > 0 ? value - 1 : 0)}
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cardBackground} translucent />
      <AppHeader title="Booking Details" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <Text style={styles.title}>{title}</Text>

        {/* Dates Card */}
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

        {/* Phone */}
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

        {/* Price Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price</Text>
          <Text style={styles.priceText}>Price per night: NPR {price}</Text>
          {cleaningFee && <Text style={styles.priceText}>Cleaning Fee: NPR {cleaningFee}</Text>}
          {serviceFee && <Text style={styles.priceText}>Service Fee: NPR {serviceFee}</Text>}
          <Text style={[styles.priceText, { fontWeight: '700', marginTop: 8 }]}>
            Total ({nights} night{nights > 1 ? 's' : ''}): NPR {totalPrice}
          </Text>
        </View>

        {/* QR Code */}
        <View style={styles.card}>
          <Text style={styles.instructionText}>
            Scan this QR to pay. Payment must be completed before sending screenshot to confirm booking.
          </Text>
          <Image
            source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BookingDummy' }}
            style={styles.qrCode}
            resizeMode="contain"
          />
          <Text style={{ textAlign: 'center', marginTop: 8, color: colors.textLight }}>Scan for payment</Text>
        </View>

        {/* Upload Payment Screenshot */}
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

      {/* Fixed Confirm Button */}
      <View style={[styles.fixedButtonContainer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.bookBtn} onPress={handleConfirmBooking}>
          <Text style={styles.bookBtnText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BookingConfirmation;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
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
  instructionText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
    textAlign: 'center',
  },
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
