import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, Modal, TextInput, ActivityIndicator
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthProvider';
import { 
  createBooking, 
  getUserBookings, 
  cancelBooking, 
  confirmBooking,
  Booking 
} from '../services/bookingService';

export default function BookingsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [newBooking, setNewBooking] = useState({
    date: '',
    time: '',
    guests: '2',
    specialRequests: ''
  });

  // Fetch user bookings on mount
  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const userBookings = await getUserBookings(user!.uid);
      setBookings(userBookings);
    } catch (error) {
      Alert.alert('Error', 'Failed to load your Mzansi Meals bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!newBooking.date || !newBooking.time) {
      Alert.alert('Missing Information', 'Please select date and time for your Mzansi Meals booking');
      return;
    }

    setCreating(true);
    try {
      await createBooking({
        userId: user!.uid,
        userName: user!.displayName || 'Mzansi Customer',
        userEmail: user!.email || '',
        date: newBooking.date,
        time: newBooking.time,
        guests: parseInt(newBooking.guests),
        specialRequests: newBooking.specialRequests,
        status: 'confirmed'
      });
      
      Alert.alert(
        'Booking Confirmed! 🎉',
        `Your table at Mzansi Meals is booked for ${newBooking.date} at ${newBooking.time} for ${newBooking.guests} guests`
      );
      
      setShowBookingModal(false);
      setNewBooking({ date: '', time: '', guests: '2', specialRequests: '' });
      fetchBookings();
    } catch (error: any) {
      Alert.alert('Booking Failed', error.message || 'Could not create booking');
    } finally {
      setCreating(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this Mzansi Meals booking?',
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Cancel Booking',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBooking(bookingId);
              Alert.alert('Booking Cancelled', 'Your Mzansi Meals booking has been cancelled');
              fetchBookings();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FFA000';
      case 'cancelled': return '#F44336';
      case 'completed': return '#2196F3';
      default: return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'check-circle';
      case 'pending': return 'clock-o';
      case 'cancelled': return 'times-circle';
      case 'completed': return 'flag-checkered';
      default: return 'question-circle';
    }
  };

  const upcomingBookings = bookings.filter(b => 
    new Date(b.date) >= new Date() && b.status !== 'cancelled'
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastBookings = bookings.filter(b => 
    new Date(b.date) < new Date() || b.status === 'cancelled'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mzansi Meals Bookings</Text>
        <Text style={styles.headerSubtitle}>Reserve your table for a South African feast</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading your Mzansi bookings...</Text>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Quick Stats */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{upcomingBookings.length}</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pastBookings.length}</Text>
              <Text style={styles.statLabel}>Past</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {bookings.filter(b => b.status === 'confirmed').length}
              </Text>
              <Text style={styles.statLabel}>Confirmed</Text>
            </View>
          </View>

          {/* New Booking Button */}
          <TouchableOpacity 
            style={styles.newBookingButton}
            onPress={() => setShowBookingModal(true)}
          >
            <FontAwesome name="calendar-plus" size={24} color="#1a1a1a" />
            <Text style={styles.newBookingText}>Book a Table at Mzansi Meals</Text>
          </TouchableOpacity>

          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
              {upcomingBookings.map((booking) => (
                <View key={booking.id} style={styles.bookingCard}>
                  <View style={styles.bookingHeader}>
                    <View>
                      <Text style={styles.bookingDate}>{formatDate(booking.date)}</Text>
                      <Text style={styles.bookingTime}>⏰ {booking.time} • 👥 {booking.guests} guests</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                      <FontAwesome 
                        name={getStatusIcon(booking.status)} 
                        size={14} 
                        color={getStatusColor(booking.status)} 
                        style={styles.statusIcon}
                      />
                      <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                        {booking.status}
                      </Text>
                    </View>
                  </View>
                  
                  {booking.specialRequests && (
                    <Text style={styles.specialRequests}>
                      <Text style={styles.specialRequestsLabel}>Special requests: </Text>
                      {booking.specialRequests}
                    </Text>
                  )}
                  
                  <View style={styles.bookingActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => router.push(`/booking-details/${booking.id}`)}
                    >
                      <FontAwesome name="info-circle" size={16} color="#FFD700" />
                      <Text style={styles.actionText}>Details</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => handleCancelBooking(booking.id!)}
                    >
                      <FontAwesome name="times" size={16} color="#FF6B6B" />
                      <Text style={[styles.actionText, styles.cancelText]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.emptySection}>
              <FontAwesome name="calendar" size={60} color="#666" />
              <Text style={styles.emptyTitle}>No upcoming bookings</Text>
              <Text style={styles.emptyText}>
                Book a table at Mzansi Meals for an authentic South African dining experience
              </Text>
            </View>
          )}

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Past Bookings</Text>
              {pastBookings.map((booking) => (
                <View key={booking.id} style={[styles.bookingCard, styles.pastBookingCard]}>
                  <View style={styles.bookingHeader}>
                    <View>
                      <Text style={styles.bookingDate}>{formatDate(booking.date)}</Text>
                      <Text style={styles.bookingTime}>⏰ {booking.time} • 👥 {booking.guests} guests</Text>
                    </View>
                    <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                      {booking.status}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.rebookButton}
                    onPress={() => {
                      setNewBooking({
                        date: booking.date,
                        time: booking.time,
                        guests: booking.guests.toString(),
                        specialRequests: booking.specialRequests || ''
                      });
                      setShowBookingModal(true);
                    }}
                  >
                    <FontAwesome name="repeat" size={16} color="#FFD700" />
                    <Text style={styles.rebookText}>Re-book This</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Table at Mzansi Meals</Text>
              <TouchableOpacity onPress={() => setShowBookingModal(false)}>
                <FontAwesome name="times" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date</Text>
                <TextInput
                  style={styles.input}
                  value={newBooking.date}
                  onChangeText={(text) => setNewBooking({...newBooking, date: text})}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#666"
                />
                <Text style={styles.inputHint}>e.g., 2024-12-25</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Time</Text>
                <TextInput
                  style={styles.input}
                  value={newBooking.time}
                  onChangeText={(text) => setNewBooking({...newBooking, time: text})}
                  placeholder="HH:MM"
                  placeholderTextColor="#666"
                />
                <Text style={styles.inputHint}>e.g., 19:30</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Number of Guests</Text>
                <View style={styles.guestsSelector}>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.guestButton,
                        newBooking.guests === num.toString() && styles.guestButtonSelected
                      ]}
                      onPress={() => setNewBooking({...newBooking, guests: num.toString()})}
                    >
                      <Text style={[
                        styles.guestButtonText,
                        newBooking.guests === num.toString() && styles.guestButtonTextSelected
                      ]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Special Requests (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newBooking.specialRequests}
                  onChangeText={(text) => setNewBooking({...newBooking, specialRequests: text})}
                  placeholder="Birthday celebration, allergies, seating preference..."
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.bookingInfo}>
                <FontAwesome name="info-circle" size={20} color="#FFD700" />
                <Text style={styles.bookingInfoText}>
                  Mzansi Meals operating hours: Mon-Fri 10:00-22:00, Sat 10:00-23:00, Sun 10:00-20:00
                </Text>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowBookingModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleCreateBooking}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator color="#1a1a1a" size="small" />
                ) : (
                  <>
                    <FontAwesome name="calendar-check" size={18} color="#1a1a1a" />
                    <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#999',
    fontSize: 14,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#444',
  },
  newBookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    padding: 18,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  newBookingText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bookingCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  pastBookingCard: {
    opacity: 0.7,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingDate: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookingTime: {
    color: '#999',
    fontSize: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  specialRequests: {
    color: '#999',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  specialRequestsLabel: {
    color: '#FFD700',
    fontWeight: '500',
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    gap: 8,
  },
  actionText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderColor: '#FF6B6B',
  },
  cancelText: {
    color: '#FF6B6B',
  },
  rebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    gap: 8,
  },
  rebookText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  emptySection: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2d2d2d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '60%',
    maxHeight: '90%',
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
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  inputHint: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  guestsSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  guestButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  guestButtonSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  guestButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  guestButtonTextSelected: {
    color: '#1a1a1a',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  bookingInfoText: {
    flex: 1,
    color: '#FFD700',
    fontSize: 14,
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  confirmButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 20,
  },
});
