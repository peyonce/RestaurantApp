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
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // Booking form state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [specialRequests, setSpecialRequests] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  
  // Bookings data
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userBookings = await getUserBookings(user.uid);
      setBookings(userBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!user) {
      Alert.alert('Error', 'Please login to book');
      return;
    }
    
    if (!date || !time || !guests || !restaurantName) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    
    setCreating(true);
    try {
      const bookingData = {
        userId: user.uid,
        restaurantId: 'temp-restaurant-id', // In real app, get from restaurant selection
        restaurantName,
        date,
        time,
        guests: parseInt(guests),
        specialRequests,
      };
      
      await createBooking(bookingData);
      Alert.alert('Success', 'Booking created successfully!');
      setShowBookingModal(false);
      loadBookings(); // Refresh list
      
      // Clear form
      setDate('');
      setTime('');
      setGuests('2');
      setSpecialRequests('');
      setRestaurantName('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking');
    } finally {
      setCreating(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    Alert.alert('Cancel Booking', 'Are you sure?', [
      { text: 'No' },
      { 
        text: 'Yes', 
        onPress: async () => {
          try {
            await cancelBooking(bookingId);
            Alert.alert('Success', 'Booking cancelled');
            loadBookings(); // Refresh list
          } catch (error) {
            Alert.alert('Error', 'Failed to cancel booking');
          }
        }
      }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#F44336';
      default: return '#999';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const upcomingBookings = bookings.filter(b => 
    b.status === 'pending' || b.status === 'confirmed'
  );
  
  const pastBookings = bookings.filter(b => 
    b.status === 'completed' || b.status === 'cancelled'
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <TouchableOpacity 
          style={styles.newBookingButton}
          onPress={() => setShowBookingModal(true)}
        >
          <FontAwesome name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.newBookingText}>New Booking</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => setShowBookingModal(true)}>
            <FontAwesome name="calendar-plus-o" size={24} color="#FFD700" />
            <Text style={styles.quickActionText}>Book Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => setShowHistoryModal(true)}>
            <FontAwesome name="history" size={24} color="#FFD700" />
            <Text style={styles.quickActionText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(tabs)/home')}>
            <FontAwesome name="search" size={24} color="#FFD700" />
            <Text style={styles.quickActionText}>Find</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            <Text style={styles.sectionCount}>{upcomingBookings.length}</Text>
          </View>
          
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.restaurantName}>{booking.restaurantName}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                      {getStatusText(booking.status)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.bookingDetails}>
                  <View style={styles.detailItem}>
                    <FontAwesome name="calendar" size={14} color="#999" />
                    <Text style={styles.detailText}>{booking.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <FontAwesome name="clock-o" size={14} color="#999" />
                    <Text style={styles.detailText}>{booking.time}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <FontAwesome name="users" size={14} color="#999" />
                    <Text style={styles.detailText}>{booking.guests} guests</Text>
                  </View>
                </View>
                
                {booking.specialRequests && (
                  <View style={styles.requestsContainer}>
                    <Text style={styles.requestsLabel}>Special Requests:</Text>
                    <Text style={styles.requestsText}>{booking.specialRequests}</Text>
                  </View>
                )}
                
                <View style={styles.bookingActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Modify</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => booking.id && handleCancelBooking(booking.id)}
                  >
                    <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome name="calendar-times-o" size={50} color="#666" />
              <Text style={styles.emptyStateText}>No upcoming bookings</Text>
              <Text style={styles.emptyStateSubtext}>Tap "New Booking" to make a reservation</Text>
            </View>
          )}
        </View>

        {/* Past Bookings Preview */}
        {pastBookings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent History</Text>
              <TouchableOpacity onPress={() => setShowHistoryModal(true)}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {pastBookings.slice(0, 2).map((booking) => (
              <View key={booking.id} style={styles.historyCard}>
                <View style={styles.historyLeft}>
                  <FontAwesome 
                    name={booking.status === 'completed' ? "check-circle" : "times-circle"} 
                    size={20} 
                    color={booking.status === 'completed' ? "#4CAF50" : "#F44336"} 
                  />
                  <View style={styles.historyDetails}>
                    <Text style={styles.historyRestaurant}>{booking.restaurantName}</Text>
                    <Text style={styles.historyDate}>{booking.date} • {booking.guests} guests</Text>
                  </View>
                </View>
                <FontAwesome name="chevron-right" size={16} color="#999" />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create Booking Modal */}
      <Modal visible={showBookingModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Booking</Text>
              <TouchableOpacity onPress={() => setShowBookingModal(false)}>
                <FontAwesome name="times" size={22} color="#999" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Restaurant Name *</Text>
              <TextInput
                style={styles.input}
                value={restaurantName}
                onChangeText={setRestaurantName}
                placeholder="Enter restaurant name"
                placeholderTextColor="#666"
              />
              
              <Text style={styles.inputLabel}>Date *</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#666"
              />
              
              <Text style={styles.inputLabel}>Time *</Text>
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM (24-hour format)"
                placeholderTextColor="#666"
              />
              
              <Text style={styles.inputLabel}>Number of Guests *</Text>
              <TextInput
                style={styles.input}
                value={guests}
                onChangeText={setGuests}
                placeholder="2"
                keyboardType="numeric"
                placeholderTextColor="#666"
              />
              
              <Text style={styles.inputLabel}>Special Requests</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={specialRequests}
                onChangeText={setSpecialRequests}
                placeholder="Any special requirements?"
                placeholderTextColor="#666"
                multiline
                numberOfLines={3}
              />
              
              <TouchableOpacity 
                style={[styles.bookButton, creating && styles.bookButtonDisabled]} 
                onPress={handleCreateBooking}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator size="small" color="#000000" />
                ) : (
                  <Text style={styles.bookButtonText}>Book Now</Text>
                )}
              </TouchableOpacity>
              
              <Text style={styles.modalNote}>
                * Required fields. You'll receive a confirmation within 24 hours.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Booking History Modal */}
      <Modal visible={showHistoryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Booking History</Text>
              <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
                <FontAwesome name="times" size={22} color="#999" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {pastBookings.length > 0 ? (
                pastBookings.map((booking) => (
                  <View key={booking.id} style={styles.historyItem}>
                    <View style={styles.historyItemLeft}>
                      <FontAwesome 
                        name={booking.status === 'completed' ? "check-circle" : "times-circle"} 
                        size={20} 
                        color={booking.status === 'completed' ? "#4CAF50" : "#F44336"} 
                      />
                      <View style={styles.historyItemDetails}>
                        <Text style={styles.historyItemRestaurant}>{booking.restaurantName}</Text>
                        <Text style={styles.historyItemDate}>{booking.date} at {booking.time}</Text>
                        <Text style={styles.historyItemGuests}>{booking.guests} guests</Text>
                      </View>
                    </View>
                    <View style={[styles.historyStatus, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                      <Text style={[styles.historyStatusText, { color: getStatusColor(booking.status) }]}>
                        {getStatusText(booking.status)}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyHistory}>
                  <FontAwesome name="history" size={40} color="#666" />
                  <Text style={styles.emptyHistoryText}>No booking history yet</Text>
                </View>
              )}
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 15,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2d2d2d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  newBookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  newBookingText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionCount: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  seeAllText: {
    color: '#FFD700',
    fontSize: 14,
  },
  bookingCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingDetails: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    color: '#999',
    fontSize: 14,
  },
  requestsContainer: {
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  requestsLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  requestsText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  actionButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  cancelButtonText: {
    color: '#F44336',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  emptyStateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2d2d2d',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyDetails: {
    marginLeft: 15,
    flex: 1,
  },
  historyRestaurant: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 3,
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#2d2d2d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  bookButton: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  bookButtonDisabled: {
    opacity: 0.7,
  },
  bookButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalNote: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyItemDetails: {
    marginLeft: 15,
    flex: 1,
  },
  historyItemRestaurant: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 3,
  },
  historyItemDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  historyItemGuests: {
    fontSize: 12,
    color: '#999',
  },
  historyStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  historyStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyHistory: {
    alignItems: 'center',
    padding: 40,
  },
  emptyHistoryText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 15,
  },
});
