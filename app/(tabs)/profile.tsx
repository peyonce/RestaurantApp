import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, TextInput, Switch, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthProvider';

export default function ProfileScreen() {
  const { user, logout } = useAuth(); // Changed from signOut to logout
  
  // Simple state management
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  
  // User data
  const userName = user?.email?.split('@')[0] || 'Guest';
  const userEmail = user?.email || '';
  
  // Payment form
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Notification settings
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(true);

  // Handle logout
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Logout', onPress: () => logout() } // Changed from signOut to logout
    ]);
  };

  // Add payment method
  const addPayment = () => {
    if (cardNumber.length !== 16) {
      Alert.alert('Error', 'Card number must be 16 digits');
      return;
    }
    if (cvv.length !== 3) {
      Alert.alert('Error', 'CVV must be 3 digits');
      return;
    }
    Alert.alert('Success', 'Payment method added!');
    setShowPaymentModal(false);
    setCardNumber('');
    setCvv('');
  };

  // Save notification settings
  const saveNotifications = () => {
    Alert.alert('Success', 'Notification settings saved!');
    setShowNotificationsModal(false);
  };

  // Menu options - FIXED: removed privacy page navigation
  const menuOptions = [
    { icon: 'user', label: 'Personal Info', action: () => Alert.alert('Edit', 'Edit your information') },
    { icon: 'map-marker', label: 'Address', action: () => Alert.alert('Address', 'Manage your address') },
    { icon: 'credit-card', label: 'Payment', action: () => setShowPaymentModal(true) },
    { icon: 'bell', label: 'Notifications', action: () => setShowNotificationsModal(true) },
    { icon: 'shield', label: 'Privacy', action: () => Alert.alert('Privacy', 'Privacy settings') }, // Changed from router.push
    { icon: 'cog', label: 'Settings', action: () => Alert.alert('Settings', 'App settings') }, // Changed from router.push
    { icon: 'question-circle', label: 'Help', action: () => Linking.openURL('mailto:support@restaurant.com') },
  ];

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* User Profile */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' }}
            style={styles.profileImage}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          {menuOptions.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
              <FontAwesome name={item.icon as any} size={20} color="#FFD700" />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <FontAwesome name="chevron-right" size={16} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Quick Settings</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Notifications</Text>
            <Switch value={orderUpdates} onValueChange={setOrderUpdates} />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch value={true} onValueChange={() => {}} />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal visible={showPaymentModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Payment</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <FontAwesome name="times" size={20} color="#999" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(text.replace(/\D/g, '').slice(0, 16))}
                keyboardType="numeric"
                maxLength={16}
                placeholderTextColor="#666"
              />
              
              <TextInput
                style={styles.input}
                placeholder="CVV"
                value={cvv}
                onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 3))}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
                placeholderTextColor="#666"
              />
              
              <TouchableOpacity style={styles.primaryButton} onPress={addPayment}>
                <Text style={styles.buttonText}>Add Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={showNotificationsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotificationsModal(false)}>
                <FontAwesome name="times" size={20} color="#999" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>Order Updates</Text>
                <Switch value={orderUpdates} onValueChange={setOrderUpdates} />
              </View>
              
              <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>Promotions</Text>
                <Switch value={promotions} onValueChange={setPromotions} />
              </View>
              
              <TouchableOpacity style={styles.primaryButton} onPress={saveNotifications}>
                <Text style={styles.buttonText}>Save Settings</Text>
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2d2d2d',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#999',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#2d2d2d',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  menuSection: {
    backgroundColor: '#2d2d2d',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 15,
  },
  settingsSection: {
    backgroundColor: '#2d2d2d',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  logoutButton: {
    backgroundColor: '#FF4444',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2d2d2d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
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
  input: {
    backgroundColor: '#1a1a1a',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    fontSize: 16,
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  notificationText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
