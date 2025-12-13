import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, TextInput, Switch, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../../config/firebase';
import { signOut, updateProfile, updateEmail, onAuthStateChanged } from 'firebase/auth';
import { getUserProfile, updateUserProfile, UserProfile } from '../../services/database';

export default function ProfileScreen() {
  const [showPayment, setShowPayment] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [userName, setUserName] = useState('Loading...');
  const [userEmail, setUserEmail] = useState('Loading...');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setUserName(user.displayName || 'User');
        setUserEmail(user.email || 'No email');
        
        // Fetch user profile from Firestore
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setUserData(profile);
          setPhoneNumber(profile.phoneNumber || '');
          setAddress(profile.address || '');
        }
      } else {
        setUser(null);
        setUserData(null);
        setUserName('Guest User');
        setUserEmail('Please sign in');
        setPhoneNumber('');
        setAddress('');
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle payment submission
  const handleAddCard = () => {
    if (cardNumber.length === 16 && cvv.length === 3) {
      Alert.alert('Success', 'Payment method added successfully');
      setCardNumber('');
      setCvv('');
      setShowPayment(false);
    } else {
      Alert.alert('Error', 'Card number must be 16 digits and CVV must be 3 digits');
    }
  };

  // Handle notifications save
  const handleSaveNotifications = async () => {
    if (!user || !userData) {
      Alert.alert('Error', 'Please sign in first');
      return;
    }

    try {
      // Update notifications in user profile
      await updateUserProfile(user.uid, {
        notifications: { orderUpdates }
      });
      Alert.alert('Settings Saved', 'Notification preferences updated');
      setShowNotifications(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
      console.error(error);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in first');
      return;
    }
    
    setLoading(true);
    try {
      // Update Firebase Auth profile
      if (userName !== user.displayName) {
        await updateProfile(user, {
          displayName: userName
        });
      }
      
      // Update email if changed
      if (userEmail !== user.email) {
        await updateEmail(user, userEmail);
      }
      
      // Update Firestore user document
      await updateUserProfile(user.uid, {
        name: userName,
        email: userEmail,
        phoneNumber: phoneNumber,
        address: address
      });
      
      Alert.alert('Success', 'Profile updated successfully');
      setShowEditProfile(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout with Firebase
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  // Handle sign in
  const handleSignIn = () => {
    Alert.alert('Sign In', 'Redirect to login screen', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: () => {
        // Navigate to login screen
        console.log('Navigate to login');
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Profile */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userName}</Text>
            <Text style={styles.email}>{userEmail}</Text>
            {!user && (
              <Text style={styles.guestText}>Guest Mode</Text>
            )}
          </View>
          {user && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setShowEditProfile(true)}
              activeOpacity={0.7}
            >
              <FontAwesome name="edit" size={18} color="#FFD700" />
            </TouchableOpacity>
          )}
        </View>

        {!user ? (
          // Sign In button for guests
          <TouchableOpacity 
            style={styles.signInButton}
            onPress={handleSignIn}
            activeOpacity={0.7}
          >
            <FontAwesome name="sign-in" size={20} color="#FFFFFF" />
            <Text style={styles.signInText}>Sign In to Continue</Text>
          </TouchableOpacity>
        ) : (
          <>
            {/* Menu */}
            <View style={styles.menu}>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => setShowEditProfile(true)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <FontAwesome name="user" size={20} color="#FFD700" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Personal Information</Text>
                </View>
                <FontAwesome name="chevron-right" size={16} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => Alert.alert('Address', 'Address management screen')}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <FontAwesome name="map-marker" size={20} color="#FFD700" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Address</Text>
                </View>
                <FontAwesome name="chevron-right" size={16} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => setShowPayment(true)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <FontAwesome name="credit-card" size={20} color="#FFD700" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Payment Methods</Text>
                </View>
                <FontAwesome name="chevron-right" size={16} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => setShowNotifications(true)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <FontAwesome name="bell" size={20} color="#FFD700" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Notifications</Text>
                </View>
                <FontAwesome name="chevron-right" size={16} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => Alert.alert('Privacy & Security', 'Privacy settings screen')}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <FontAwesome name="shield" size={20} color="#FFD700" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Privacy & Security</Text>
                </View>
                <FontAwesome name="chevron-right" size={16} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => Alert.alert('Settings', 'App settings screen')}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <FontAwesome name="cog" size={20} color="#FFD700" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Settings</Text>
                </View>
                <FontAwesome name="chevron-right" size={16} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => Alert.alert('Help & Support', 'Help center screen')}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <FontAwesome name="question-circle" size={20} color="#FFD700" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Help & Support</Text>
                </View>
                <FontAwesome name="chevron-right" size={16} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Logout */}
            <TouchableOpacity 
              style={styles.logout} 
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <FontAwesome name="sign-out" size={20} color="#FFFFFF" style={styles.logoutIcon} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}

      </ScrollView>

      {/* Payment Modal */}
      <Modal 
        visible={showPayment} 
        transparent
        animationType="slide"
        onRequestClose={() => setShowPayment(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowPayment(false)}
        >
          <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Payment Method</Text>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                placeholderTextColor="#999"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={16}
              />
              <TextInput
                style={styles.input}
                placeholder="CVV"
                placeholderTextColor="#999"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                secureTextEntry
                maxLength={3}
              />
              <TouchableOpacity 
                style={[styles.button, (!cardNumber || !cvv) && styles.buttonDisabled]} 
                onPress={handleAddCard}
                disabled={!cardNumber || !cvv}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Add Card</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setShowPayment(false)}
                activeOpacity={0.7}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Notifications Modal */}
      <Modal 
        visible={showNotifications} 
        transparent
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowNotifications(false)}
        >
          <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Order Updates</Text>
                <Switch 
                  value={orderUpdates} 
                  onValueChange={setOrderUpdates}
                  trackColor={{ false: '#767577', true: '#FFD700' }}
                  thumbColor={orderUpdates ? '#fff' : '#f4f3f4'}
                />
              </View>
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleSaveNotifications}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setShowNotifications(false)}
                activeOpacity={0.7}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal 
        visible={showEditProfile} 
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditProfile(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowEditProfile(false)}
        >
          <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={userName}
                onChangeText={setUserName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={userEmail}
                onChangeText={setUserEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                placeholderTextColor="#999"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleUpdateProfile}
                disabled={loading}
                activeOpacity={0.7}
              >
                {loading ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <Text style={styles.buttonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setShowEditProfile(false)}
                activeOpacity={0.7}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#2d2d2d',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    position: 'relative',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  guestText: {
    fontSize: 12,
    color: '#FFD700',
    fontStyle: 'italic',
  },
  editButton: {
    padding: 10,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 18,
    borderRadius: 15,
    gap: 10,
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menu: {
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
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 30,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4444',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 15,
    gap: 10,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#2d2d2d',
    padding: 25,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: {
    color: '#999',
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  switchText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
