import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function BookingsScreen() {
  const [bookings] = useState([
    { id: '1', date: '2024-01-15', time: '19:30', guests: 2 },
    { id: '2', date: '2024-01-16', time: '20:00', guests: 4 },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>Mzansi Meals Restaurant</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <Text style={styles.bookingDate}>{booking.date}</Text>
            <Text style={styles.bookingTime}>{booking.time} • {booking.guests} guests</Text>
            <Text style={styles.restaurantName}>Mzansi Meals</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2d2d2d',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#FFD700',
    fontSize: 14,
    marginTop: 4,
  },
  scrollView: {
    padding: 20,
  },
  bookingCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  bookingDate: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookingTime: {
    color: '#999',
    fontSize: 14,
    marginTop: 4,
  },
  restaurantName: {
    color: '#FFD700',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
});
