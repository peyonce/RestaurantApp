import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useCart } from './contexts/CartProvider';
import { useAuth } from './contexts/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';
// Note: Commented out Firebase imports for now since we're using mock data
// import { createOrder, createUserProfile, updateUserProfile, getUserProfile } from './services/database';

export default function PaymentScreen() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const handlePayment = async () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.name) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Please login to complete your order');
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app with Firebase, you would:
      // 1. Create order data
      // const orderData = {
      //   userId: user.id, // Note: user.id not user.uid
      //   items: items,
      //   total: total + 5.99 + 2.99,
      //   subtotal: total,
      //   deliveryFee: 5.99,
      //   serviceFee: 2.99,
      //   paymentMethod: 'credit_card',
      //   paymentStatus: 'completed',
      //   status: 'preparing',
      //   deliveryAddress: '123 Restaurant Street, Food City, FC 12345',
      //   customerName: cardDetails.name,
      //   customerEmail: user.email,
      //   createdAt: new Date().toISOString(),
      // };
      
      // 2. Save order to Firebase
      // const order = await createOrder(orderData);
      
      // 3. Update user profile
      // const userProfile = await getUserProfile(user.id);
      // if (userProfile) {
      //   await updateUserProfile(user.id, {
      //     ordersCount: (userProfile.ordersCount || 0) + 1,
      //     lastOrder: order.id,
      //   });
      // }

      // For now, just show success
      Alert.alert(
        'Payment Successful!',
        'Your order has been placed successfully.',
        [
          {
            text: 'View Orders',
            onPress: () => {
              clearCart();
              router.push('/(tabs)/orders');
            },
          },
          {
            text: 'Continue Shopping',
            onPress: () => {
              clearCart();
              router.push('/(tabs)/home');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Payment failed:', error);
      Alert.alert('Payment Failed', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    }
    return text;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Order Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        
        <View style={styles.itemsList}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name} x {item.quantity}</Text>
              <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>${(total + 5.99 + 2.99).toFixed(2)}</Text>
        </View>
      </View>

      {/* Payment Form */}
      <View style={styles.paymentForm}>
        <Text style={styles.sectionTitle}>Card Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cardholder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="#999"
            value={cardDetails.name}
            onChangeText={(text) => setCardDetails({...cardDetails, name: text})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="4242 4242 4242 4242"
            placeholderTextColor="#999"
            value={cardDetails.number}
            onChangeText={(text) => setCardDetails({...cardDetails, number: formatCardNumber(text)})}
            keyboardType="numeric"
            maxLength={19}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              placeholderTextColor="#999"
              value={cardDetails.expiry}
              onChangeText={(text) => setCardDetails({...cardDetails, expiry: formatExpiry(text)})}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>CVC</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              placeholderTextColor="#999"
              value={cardDetails.cvc}
              onChangeText={(text) => setCardDetails({...cardDetails, cvc: text.replace(/[^0-9]/g, '')})}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Payment Methods</Text>
        
        <View style={styles.paymentMethods}>
          <TouchableOpacity style={styles.paymentMethod}>
            <FontAwesome name="credit-card" size={24} color="#FFD700" />
            <Text style={styles.paymentMethodText}>Credit Card</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentMethod}>
            <FontAwesome name="paypal" size={24} color="#0070BA" />
            <Text style={styles.paymentMethodText}>PayPal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentMethod}>
            <FontAwesome name="mobile" size={28} color="#4CAF50" />
            <Text style={styles.paymentMethodText}>Mobile Pay</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pay Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.payButtonText}>Pay ${(total + 5.99 + 2.99).toFixed(2)}</Text>
              <FontAwesome name="lock" size={16} color="#FFFFFF" style={{ marginLeft: 10 }} />
            </>
          )}
        </TouchableOpacity>
        
        <Text style={styles.securityText}>
          <FontAwesome name="lock" size={12} color="#999" /> Your payment is secure and encrypted
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerPlaceholder: {
    width: 34,
  },
  summaryCard: {
    backgroundColor: '#2d2d2d',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  itemsList: {
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#999',
  },
  itemPrice: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#999',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  paymentForm: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2d2d2d',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 15,
    color: '#FFFFFF',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  paymentMethod: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    marginHorizontal: 5,
  },
  paymentMethodText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 8,
  },
  footer: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
  },
  payButtonDisabled: {
    backgroundColor: '#666',
  },
  payButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  securityText: {
    color: '#999',
    fontSize: 12,
    marginTop: 15,
  },
});
