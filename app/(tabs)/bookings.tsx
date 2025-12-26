import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function BookingsScreen() {
  const [bookings, setBookings] = useState([
    { id: '1', date: '2024-12-25', time: '19:30', guests: 2, status: 'confirmed' },
    { id: '2', date: '2024-12-28', time: '20:00', guests: 4, status: 'pending' },
  ]);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newBooking, setNewBooking] = useState({
    date: '',
    time: '',
    guests: '2',
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);

  const handleBookTable = () => {
    if (!newBooking.date || !newBooking.time || !newBooking.guests) {
      Alert.alert('Missing Information', 'Please fill in date, time, and number of guests');
      return;
    }

    const guestsNum = parseInt(newBooking.guests);
    if (guestsNum < 1 || guestsNum > 20) {
      Alert.alert('Invalid Guests', 'Number of guests must be between 1 and 20');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newBookingItem = {
        id: Date.now().toString(),
        date: newBooking.date,
        time: newBooking.time,
        guests: guestsNum,
        status: 'pending' as const,
      };

      setBookings([newBookingItem, ...bookings]);
      setLoading(false);
      setShowBookingForm(false);
      
      // Reset form
      setNewBooking({
        date: '',
        time: '',
        guests: '2',
        specialRequests: '',
      });

      Alert.alert(
        'Booking Request Sent! 🎉',
        `Your table is requested for ${newBooking.date} at ${newBooking.time} for ${guestsNum} guests.\n\nWe will confirm your booking shortly.`,
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#2ecc71';
      case 'pending': return '#f39c12';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>Mzansi Meals Restaurant</Text>
        
        <TouchableOpacity 
          style={styles.newBookingButton}
          onPress={() => setShowBookingForm(true)}
        >
          <FontAwesome name="plus" size={18} color="#1a1a1a" />
          <Text style={styles.newBookingButtonText}>New Booking</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Booking List */}
        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome name="calendar-times-o" size={60} color="#666" />
            <Text style={styles.emptyTitle}>No Bookings Yet</Text>
            <Text style={styles.emptyText}>
              Book your table at Mzansi Meals to experience authentic South African dining
            </Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingDate}>
                  <FontAwesome name="calendar" size={16} color="#FFD700" /> {booking.date}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
                </View>
              </View>
              
              <View style={styles.bookingDetails}>
                <Text style={styles.bookingTime}>
                  <FontAwesome name="clock-o" size={14} color="#ccc" /> {booking.time}
                </Text>
                <Text style={styles.bookingGuests}>
                  <FontAwesome name="users" size={14} color="#ccc" /> {booking.guests} guests
                </Text>
              </View>
              
              <Text style={styles.restaurantName}>
                <FontAwesome name="cutlery" size={14} color="#FFD700" /> Mzansi Meals
              </Text>
            </View>
          ))
        )}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Booking Form Modal */}
      <Modal
        visible={showBookingForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBookingForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book a Table</Text>
              <TouchableOpacity onPress={() => setShowBookingForm(false)}>
                <FontAwesome name="times" size={24} color="#999" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScroll}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD (e.g., 2024-12-31)"
                  placeholderTextColor="#999"
                  value={newBooking.date}
                  onChangeText={(text) => setNewBooking({...newBooking, date: text})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Time</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM (e.g., 19:30)"
                  placeholderTextColor="#999"
                  value={newBooking.time}
                  onChangeText={(text) => setNewBooking({...newBooking, time: text})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Number of Guests</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2"
                  placeholderTextColor="#999"
                  value={newBooking.guests}
                  onChangeText={(text) => setNewBooking({...newBooking, guests: text})}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Special Requests (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Any dietary requirements or special requests..."
                  placeholderTextColor="#999"
                  value={newBooking.specialRequests}
                  onChangeText={(text) => setNewBooking({...newBooking, specialRequests: text})}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleBookTable}
                disabled={loading}
              >
                {loading ? (
                  <Text style={styles.submitButtonText}>Processing...</Text>
                ) : (
                  <>
                    <FontAwesome name="check-circle" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>Confirm Booking</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: '#FFD700',
    fontSize: 16,
    marginBottom: 15,
  },
  newBookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 10,
  },
  newBookingButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 60,
    paddingTop: 100,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  bookingCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookingDate: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
  },
  bookingTime: {
    color: '#ccc',
    fontSize: 14,
  },
  bookingGuests: {
    color: '#ccc',
    fontSize: 14,
  },
  restaurantName: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 100,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2d2d2d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalTitle: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  formScroll: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#3a3a3a',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
