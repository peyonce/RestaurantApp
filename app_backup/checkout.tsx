import React, { useState, useEffect } from 'react';
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
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from './contexts/AuthProvider';
import { useCart } from './contexts/CartProvider';
import { createOrder } from './services/database';
import { Timestamp } from 'firebase/firestore';

export default function CheckoutScreen() {
  const { user } = useAuth();
  const { items, total, clearCart, loading: cartLoading } = useCart();
  
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [tipAmount, setTipAmount] = useState(5);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    console.log('🛒 Checkout - Items:', items);
    console.log('💰 Checkout - Total:', total);
  }, [items, total]);

  // Calculate totals
  const deliveryFee = total > 200 ? 0 : 25;
  const tipValue = (total * tipAmount) / 100;
  const orderTotal = total + deliveryFee + tipValue;

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to place your Mzansi Meals order');
      router.push('/login');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Missing Address', 'Please enter delivery address');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Missing Phone', 'Please enter phone number');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty');
      return;
    }

    setPlacingOrder(true);
    try {
      console.log('📦 Creating order...');
      
      // Prepare order data EXACTLY matching the Order interface
      // Note: Interface has BOTH 'total' AND 'totalAmount', BOTH 'phone' AND 'phoneNumber'
      // We'll provide all required fields
      const orderData = {
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || "Mzansi Customer",
        items: items.map(item => ({
          id: item.id || `item_${Date.now()}`,
          menuItemId: item.menuItemId || item.id || '',
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '',
          imageUrl: item.imageUrl || item.image || '',
          specialInstructions: item.specialInstructions || ''
        })),
        // Both total fields (interface has both)
        total: orderTotal,
        totalAmount: orderTotal,
        // Both phone fields (interface has both)
        phone: phone.trim(),
        phoneNumber: phone.trim(),
        address: address.trim(),
        payment: paymentMethod, // 'payment' field
        paymentMethod: paymentMethod, // 'paymentMethod' field
        status: 'pending',
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'completed' as 'pending' | 'completed' | 'failed',
        deliveryFee: deliveryFee,
        tipAmount: tipValue,
        tipPercentage: tipAmount,
        subtotal: total,
        specialInstructions: specialInstructions.trim(),
        notes: `Tip: ${tipAmount}%`,
        // createdAt and id will be added by createOrder function
      };

      console.log('📄 Order data:', orderData);
      
      // Call createOrder with the orderData object
      const order = await createOrder(orderData);
      
      console.log('✅ Order saved to Firebase:', order.id);
      
      // Clear cart
      await clearCart();
      
      Alert.alert(
        'Order Placed Successfully! 🎉',
        `Order #${order.id.substring(0, 8)} has been placed.\n\nTotal: R${orderTotal.toFixed(2)}\n\nYou will receive a confirmation shortly.`,
        [
          {
            text: 'Track Order',
            onPress: () => {
              router.push(`/order-details/${order.id}`);
            }
          },
          {
            text: 'Continue Shopping',
            onPress: () => {
              router.replace('/');
            },
            style: 'default'
          }
        ]
      );
    } catch (error: any) {
      console.error('❌ Error placing order:', error);
      Alert.alert(
        'Order Failed',
        error.message || 'Failed to place order. Please try again.'
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `R${amount.toFixed(2)}`;
  };

  if (cartLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Order Items ({items.length})
            {items.length === 0 && ' - Cart is empty'}
          </Text>
          
          {items.length > 0 ? (
            items.map((item, index) => (
              <View key={item.id || index} style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDetails}>
                    {item.quantity} × {formatCurrency(item.price)}
                  </Text>
                </View>
                <Text style={styles.itemTotal}>
                  {formatCurrency(item.price * item.quantity)}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyCart}>
              <FontAwesome name="shopping-cart" size={40} color="#666" />
              <Text style={styles.emptyCartText}>Your cart is empty</Text>
            </View>
          )}
        </View>

        {items.length > 0 && (
          <>
            {/* Delivery Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Details</Text>
              
              <View style={styles.inputContainer}>
                <FontAwesome name="map-marker" size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Delivery Address *"
                  placeholderTextColor="#999"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={3}
                  editable={!placingOrder}
                />
              </View>

              <View style={styles.inputContainer}>
                <FontAwesome name="phone" size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number *"
                  placeholderTextColor="#999"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  editable={!placingOrder}
                />
              </View>

              <View style={styles.inputContainer}>
                <FontAwesome name="sticky-note" size={20} color="#FFD700" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Special Instructions (optional)"
                  placeholderTextColor="#999"
                  value={specialInstructions}
                  onChangeText={setSpecialInstructions}
                  multiline
                  numberOfLines={2}
                  editable={!placingOrder}
                />
              </View>
            </View>

            {/* Tip Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add a Tip</Text>
              <View style={styles.tipContainer}>
                {[0, 5, 10, 15, 20].map((tip) => (
                  <TouchableOpacity
                    key={tip}
                    style={[
                      styles.tipButton,
                      tipAmount === tip && styles.tipButtonSelected,
                    ]}
                    onPress={() => setTipAmount(tip)}
                    activeOpacity={0.7}
                    disabled={placingOrder}
                  >
                    <Text
                      style={[
                        styles.tipText,
                        tipAmount === tip && styles.tipTextSelected,
                      ]}
                    >
                      {tip === 0 ? 'No tip' : `${tip}%`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              
              <TouchableOpacity
                style={[
                  styles.paymentCard,
                  paymentMethod === 'cash' && styles.paymentCardSelected,
                ]}
                onPress={() => setPaymentMethod('cash')}
                activeOpacity={0.7}
                disabled={placingOrder}
              >
                <FontAwesome name="money" size={24} color="#FFD700" />
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentTitle}>Cash on Delivery</Text>
                  <Text style={styles.paymentDescription}>Pay when food arrives</Text>
                </View>
                {paymentMethod === 'cash' && (
                  <FontAwesome name="check-circle" size={24} color="#4CAF50" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentCard,
                  paymentMethod === 'card' && styles.paymentCardSelected,
                ]}
                onPress={() => setPaymentMethod('card')}
                activeOpacity={0.7}
                disabled={placingOrder}
              >
                <FontAwesome name="credit-card" size={24} color="#FFD700" />
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentTitle}>Card Payment</Text>
                  <Text style={styles.paymentDescription}>Pay now with card</Text>
                </View>
                {paymentMethod === 'card' && (
                  <FontAwesome name="check-circle" size={24} color="#4CAF50" />
                )}
              </TouchableOpacity>
            </View>

            {/* Order Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Fee</Text>
                  <Text style={styles.summaryValue}>
                    {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tip ({tipAmount}%)</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(tipValue)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{formatCurrency(orderTotal)}</Text>
                </View>
              </View>
            </View>
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Place Order Button */}
      {items.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.placeOrderButton, 
              (placingOrder || !user) && styles.placeOrderButtonDisabled
            ]} 
            onPress={handlePlaceOrder}
            disabled={placingOrder || !user}
            activeOpacity={0.7}
          >
            {placingOrder ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator color="#1a1a1a" size="small" />
                <Text style={styles.placeOrderText}>Processing Order...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.placeOrderText}>
                  {!user ? 'Login Required' : 'Place Order'}
                </Text>
                <Text style={styles.orderTotal}>{formatCurrency(orderTotal)}</Text>
              </>
            )}
          </TouchableOpacity>
          
          {!user && (
            <Text style={styles.loginHint}>
              Please login to place your Mzansi Meals order
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2d2d2d',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 140,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
    marginTop: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  itemDetails: {
    color: '#999',
    fontSize: 14,
  },
  itemTotal: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyCart: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
  },
  emptyCartText: {
    color: '#999',
    fontSize: 16,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  inputIcon: {
    marginTop: 12,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    minHeight: 40,
  },
  tipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tipButton: {
    backgroundColor: '#2d2d2d',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  tipButtonSelected: {
    backgroundColor: '#FFD700',
  },
  tipText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  tipTextSelected: {
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    padding: 18,
    marginBottom: 10,
  },
  paymentCardSelected: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 15,
  },
  paymentTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  paymentDescription: {
    color: '#999',
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    color: '#999',
    fontSize: 16,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 16,
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
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#2d2d2d',
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  placeOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFD700',
    paddingHorizontal: 25,
    paddingVertical: 18,
    borderRadius: 12,
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#666',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 10,
  },
  placeOrderText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderTotal: {
    color: '#1a1a1a',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loginHint: {
    color: '#FFA000',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
});
