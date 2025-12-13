import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  ScrollView, Alert, TextInput, Switch, Modal, Linking
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthProvider';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  
  // User states
  const [name, setName] = useState('Guest');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Modals
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Payment
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Notifications
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(true);
  const [reminders, setReminders] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      setName(user.email.split('@')[0] || 'Guest');
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Logout', onPress: () => signOut() }
    ]);
  };

  const savePersonalInfo = () => {
    Alert.alert('Success', 'Personal info updated!');
    setShowPersonalInfo(false);
  };

  const saveAddress = () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter your address');
      return;
    }
    Alert.alert('Success', 'Address saved!');
    setShowAddress(false);
  };

  const savePayment = () => {
    if (!cardNumber || cardNumber.length !== 16) {
      Alert.alert('Error', 'Enter 16-digit card number');
      return;
    }
    if (!cvv || cvv.length !== 3) {
      Alert.alert('Error', 'CVV must be 3 digits');
      return;
    }
    Alert.alert('Success', 'Card added!');
    setShowPayment(false);
  };

  const menuItems = [
    { 
      icon: 'user', 
      label: 'Personal Information', 
      action: () => setShowPersonalInfo(true)
    },
    { 
      icon: 'map-marker', 
      label: 'Address', 
      action: () => setShowAddress(true)
    },
    { 
      icon: 'credit-card', 
      label: 'Payment Methods', 
      action: () => setShowPayment(true)
    },
    { 
      icon: 'bell', 
      label: 'Notifications', 
      action: () => setShowNotifications(true)
    },
    { 
      icon: 'shield', 
      label: 'Privacy & Security', 
      action: () => router.push('/privacy')
    },
    { 
      icon: 'cog', 
      label: 'Settings', 
      action: () => router.push('/settings')
    },
    { 
      icon: 'question-circle', 
      label: 'Help & Support', 
      action: () => setShowHelp(true)
    },
  ];

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>
          <TouchableOpacity 
            style={styles.editIcon}
            onPress={() => setShowPersonalInfo(true)}
          >
            <FontAwesome name="edit" size={16} color="#FFD700" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <TouchableOpacity style={styles.statItem} onPress={() => router.push('/(tabs)/orders')}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity style={styles.statItem} onPress={() => Alert.alert('Rating', '4.8/5')}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity style={styles.statItem} onPress={() => Alert.alert('Visits', '28 visits')}>
            <Text style={styles.statNumber}>28</Text>
            <Text style={styles.statLabel}>Visits</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem} 
              onPress={item.action}
            >
              <View style={styles.menuItemLeft}>
                <FontAwesome name={item.icon as any} size={20} color="#FFD700" />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>Quick Settings</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <FontAwesome name="bell" size={18} color="#FFD700" />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch 
              value={orderUpdates || promotions || reminders} 
              onValueChange={(value) => {
                setOrderUpdates(value);
                setPromotions(value);
                setReminders(value);
              }}
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <FontAwesome name="moon-o" size={18} color="#FFD700" />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch value={true} onValueChange={() => {}} />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={18} color="#FF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.version}>v1.0.0</Text>
          <TouchableOpacity onPress={() => Alert.alert('Terms', 'View terms')}>
            <Text style={styles.terms}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Personal Info Modal */}
      <Modal visible={showPersonalInfo} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Personal Information</Text>
              <TouchableOpacity onPress={() => setShowPersonalInfo(false)}>
                <FontAwesome name="times" size={22} color="#999" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#666"
              />
              
              <Text style={styles.inputLabel}>Email</Text>
              <Text style={styles.readOnlyText}>{email}</Text>
              
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />
              
              <TouchableOpacity style={styles.saveButton} onPress={savePersonalInfo}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Address Modal */}
      <Modal visible={showAddress} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delivery Address</Text>
              <TouchableOpacity onPress={() => setShowAddress(false)}>
                <FontAwesome name="times" size={22} color="#999" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Your Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter street, city, postal code"
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
              />
              
              <TouchableOpacity style={styles.saveButton} onPress={saveAddress}>
                <Text style={styles.saveButtonText}>Save Address</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal visible={showPayment} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Payment Method</Text>
              <TouchableOpacity onPress={() => setShowPayment(false)}>
                <FontAwesome name="times" size={22} color="#999" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                value={cardName}
                onChangeText={setCardName}
                placeholder="John Doe"
                placeholderTextColor="#666"
              />
              
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                value={cardNumber}
                onChangeText={(text) => setCardNumber(text.replace(/\D/g, '').slice(0, 16))}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
              
              <View style={styles.row}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    value={expiry}
                    onChangeText={(text) => setExpiry(text.replace(/\D/g, '').slice(0, 4))}
                    placeholder="MM/YY"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    value={cvv}
                    onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 3))}
                    placeholder="123"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    secureTextEntry
                  />
                </View>
              </View>
              
              <TouchableOpacity style={styles.saveButton} onPress={savePayment}>
                <Text style={styles.saveButtonText}>Add Payment Method</Text>
              </TouchableOpacity>
              
              <Text style={styles.securityText}>
                <FontAwesome name="lock" size={12} color="#999" /> Secure payment
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={showNotifications} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notification Settings</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <FontAwesome name="times" size={22} color="#999" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.notificationRow}>
                <View>
                  <Text style={styles.notificationTitle}>Order Updates</Text>
                  <Text style={styles.notificationDesc}>Track orders and delivery</Text>
                </View>
                <Switch value={orderUpdates} onValueChange={setOrderUpdates} />
              </View>
              
              <View style={styles.notificationRow}>
                <View>
                  <Text style={styles.notificationTitle}>Promotions & Offers</Text>
                  <Text style={styles.notificationDesc}>Special deals and discounts</Text>
                </View>
                <Switch value={promotions} onValueChange={setPromotions} />
              </View>
              
              <View style={styles.notificationRow}>
                <View>
                  <Text style={styles.notificationTitle}>Reminders</Text>
                  <Text style={styles.notificationDesc}>Cart and order reminders</Text>
                </View>
                <Switch value={reminders} onValueChange={setReminders} />
              </View>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={() => {
                  Alert.alert('Success', 'Notification settings saved!');
                  setShowNotifications(false);
                }}
              >
                <Text style={styles.saveButtonText}>Save Settings</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Help Modal */}
      <Modal visible={showHelp} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Help & Support</Text>
              <TouchableOpacity onPress={() => setShowHelp(false)}>
                <FontAwesome name="times" size={22} color="#999" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <TouchableOpacity style={styles.helpOption} onPress={() => Linking.openURL('tel:+1234567890')}>
                <FontAwesome name="phone" size={22} color="#FFD700" />
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpTitle}>Call Support</Text>
                  <Text style={styles.helpDesc}>+1 (234) 567-8900</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.helpOption} onPress={() => Linking.openURL('mailto:support@restaurant.com')}>
                <FontAwesome name="envelope" size={22} color="#FFD700" />
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpTitle}>Email Support</Text>
                  <Text style={styles.helpDesc}>support@restaurant.com</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.helpOption} onPress={() => Linking.openURL('https://help.restaurant.com')}>
                <FontAwesome name="question-circle" size={22} color="#FFD700" />
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpTitle}>Help Center</Text>
                  <Text style={styles.helpDesc}>FAQs and guides</Text>
                </View>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  userInfo: {
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
  editIcon: {
    padding: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  statsCard: {
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
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#444',
  },
  menuCard: {
    backgroundColor: '#2d2d2d',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 15,
    flex: 1,
  },
  settingsCard: {
    backgroundColor: '#2d2d2d',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF4444',
    gap: 10,
  },
  logoutText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
    gap: 10,
  },
  version: {
    color: '#666',
    fontSize: 12,
  },
  terms: {
    color: '#FFD700',
    fontSize: 12,
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  readOnlyText: {
    color: '#FFFFFF',
    fontSize: 16,
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  inputGroup: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  securityText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  notificationTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  notificationDesc: {
    fontSize: 12,
    color: '#999',
  },
  helpOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
  },
  helpTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  helpDesc: {
    fontSize: 12,
    color: '#999',
  },
});
