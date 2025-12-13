import { FontAwesome } from '@expo/vector-icons';
import { signOut, updateEmail, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../config/firebase';

export default function ProfileScreen() {
  const [showPayment, setShowPayment] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [userName, setUserName] = useState(auth.currentUser?.displayName || 'John Doe');
  const [userEmail, setUserEmail] = useState(auth.currentUser?.email || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch user data from Firestore
  React.useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setPhoneNumber(data.phoneNumber || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
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
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          notifications: {
            orderUpdates
          }
        });
        Alert.alert('Settings Saved', 'Notification preferences updated');
        setShowNotifications(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to save settings');
      }
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: userName
      });
      
      // Update email if changed
      if (userEmail !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, userEmail);
      }
      
      // Update Firestore user document
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name: userName,
        email: userEmail,
        phoneNumber: phoneNumber,
        updatedAt: new Date().toISOString()
      });
      
      Alert.alert('Success', 'Profile updated successfully');
      setShowEditProfile(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
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
              Alert.alert('Logged Out', 'You have been logged out successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
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
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setShowEditProfile(true)}
            activeOpacity={0.7}
          >
            <FontAwesome name="edit" size={18} color="#FFD700" />
          </TouchableOpacity>
        </View>

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
          onPress={() => setShowPayment(false)}
        >
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
          onPress={() => setShowNotifications(false)}
        >
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
          onPress={() => setShowEditProfile(false)}
        >
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
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleUpdateProfile}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setShowEditProfile(false)}
              activeOpacity={0.7}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
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
  },
  editButton: {
    padding: 10,
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
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2d2d2d',
    padding: 25,
    borderRadius: 15,
    width: '100%',
    maxWidth: 400,
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
