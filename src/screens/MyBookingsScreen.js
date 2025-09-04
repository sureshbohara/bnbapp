import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { showMessage } from "react-native-flash-message";

import colors from "../constants/colors";
import AppHeader from "../components/common/AppHeader";
import { fetchMyBooking, cancelBooking } from "../services/apiService";

const MyBookingsScreen = () => {
  const navigation = useNavigation();
  const title = "My Bookings";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await fetchMyBooking();
      setBookings(response ?? []);
    } catch (error) {
      showMessage({
        message: "Error",
        description: "Failed to load bookings",
        type: "danger",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
  };

  const handleCancel = async (id) => {
    const originalBookings = [...bookings];

    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: "cancelled" } : b))
    );

    try {
      await cancelBooking(id);
      showMessage({
        message: "Booking Cancelled",
        description: "Your booking has been cancelled successfully",
        type: "success",
      });
    } catch (error) {
      setBookings(originalBookings);
      showMessage({
        message: "Error",
        description: "Failed to cancel booking",
        type: "danger",
      });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{item.listing?.title || "N/A"}</Text>
        <View style={styles.statusContainer}>
          <Ionicons
            name={item.status.toLowerCase() === "confirmed" ? "checkmark-circle" : "close-circle"}
            size={16}
            color={item.status.toLowerCase() === "confirmed" ? "#155724" : "#721c24"}
          />
          <Text
            style={[
              styles.status,
              item.status.toLowerCase() === "confirmed" ? styles.statusConfirmed : styles.statusCancelled,
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Ionicons name="person" size={16} color={colors.textLight} style={{ marginRight: 4 }} />
        <Text style={styles.value}>{item.user?.name || "N/A"}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="home" size={16} color={colors.textLight} style={{ marginRight: 4 }} />
        <Text style={styles.value}>{item.listing?.user?.name || "N/A"}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="calendar" size={16} color={colors.textLight} style={{ marginRight: 4 }} />
        <Text style={styles.value}>{item.check_in?.split("T")[0]} → {item.check_out?.split("T")[0]}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="people" size={16} color={colors.textLight} style={{ marginRight: 4 }} />
        <Text style={styles.value}>
          Adults: {item.adults}, Children: {item.children}, Infants: {item.infants}, Pets: {item.pets}
        </Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="cash" size={16} color={colors.textLight} style={{ marginRight: 4 }} />
        <Text style={styles.value}>${item.total_price}</Text>
      </View>

      {item.status.toLowerCase() !== "cancelled" && (
        <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item.id)}>
          <Ionicons name="close-circle-outline" size={16} color={colors.white} style={{ marginRight: 6 }} />
          <Text style={styles.cancelText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cardBackground} translucent />
      <AppHeader title={title} onBack={() => navigation.goBack()} />

      {bookings.length === 0 ? (
        <Text style={styles.noBookingsText}>No bookings yet.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 16, paddingTop: 8 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  noBookingsText: { textAlign: "center", marginTop: 40, fontSize: 16, color: colors.textLight },
  card: { marginHorizontal: 16, marginVertical: 8, backgroundColor: colors.white, borderRadius: 12, padding: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  title: { fontSize: 16, fontWeight: "bold", color: colors.textDark },
  statusContainer: { flexDirection: "row", alignItems: "center" },
  status: { fontSize: 12, fontWeight: "bold", marginLeft: 4, paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, overflow: "hidden" },
  statusConfirmed: { backgroundColor: "#d4edda", color: "#155724" },
  statusCancelled: { backgroundColor: "#f8d7da", color: "#721c24" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  value: { flex: 1, color: colors.textDark },
  cancelBtn: { marginTop: 12, flexDirection: "row", justifyContent: "center", backgroundColor: colors.primary, paddingVertical: 8, borderRadius: 8, alignItems: "center" },
  cancelText: { color: colors.white, fontWeight: "bold", fontSize: 14 },
});

export default MyBookingsScreen;
