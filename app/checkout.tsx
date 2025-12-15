import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from './contexts/AuthProvider';
import { useCart } from './contexts/CartProvider';

// Try to import Firebase database service, but don't crash if it fails
let createOrder: any = null;

try {
  const databaseModule = require('./services/_database');
  createOrder = databaseModule.createOrder;
} catch (error) {
  console.warn('Database service not available:', error);
}

export default function CheckoutScreen() {
  const { user } = useAuth();
  const cartContext = useCart();
  
  // Debug: Log what cartContext contains
  console.log('Cart Context:', cartContext);
  console.log('Cart Context keys:', Object.keys(cartContext || {}));
  
  // Try different possible properties from CartProvider
  const items = cartContext?.items || cartContext?.cartItems || cartContext?.cart?.items || [];
  const total = cartContext?.total || cartContext?.cartTotal || cartContext?.cart?.total || 0;
  const clearCart = cartContext?.clearCart || cartContext?.clear || (() => {
    console.log('Clear cart function not found');
  });
  
  console.log('Items found:', items);
  console.log('Total found:', total);
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('cash');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [tipAmount, setTipAmount] = useState(5);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load user address if available
  useEffect(() => {
    if (user) {
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [user]);

  // Calculate order totals
  const deliveryFee = total > 200 ? 0 : 25;
  const tipValue = (total * tipAmount) / 100;
  const orderTotal = total + deliveryFee + tipValue;

  // Validate form
  const validateForm = () => {
    console.log('Validating form...');
    console.log('Delivery address:', deliveryAddress);
    console.log('Phone number:', phoneNumber);
    console.log('Items length:', items.length);
    console.log('User:', user?.uid);
    
    if (!deliveryAddress.trim()) {
      Alert.alert('Error', 'Please enter delivery address');
      return false;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return false;
    }
    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return false;
    }
    if (!user) {
      Alert.alert('Error', 'Please login to place an order');
      router.push('/login');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    console.log('=== PLACE ORDER CLICKED ===');
    console.log('Items to order:', items);
    console.log('Total amount:', total);
    
    if (isPlacingOrder || loading) {
      console.log('Already processing order');
      return;
    }
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsPlacingOrder(true);
    setLoading(true);

    try {
      // Prepare order items
      const orderItems = items.map((item: any, index: number) => {
        console.log(`Item ${index}:`, item);
        return {
          menuItemId: item.id || item.menuItemId || `item_${Date.now()}_${index}`,
          name: item.name || item.title || 'Unknown Item',
          quantity: item.quantity || 1,
          price: item.price || 0,
          specialInstructions: item.specialInstructions || item.instructions || '',
          imageUrl: item.image || item.imageUrl || ''
        };
      });

      console.log('Prepared order items:', orderItems);
      
      // Prepare order data
      const orderData = {
        userId: user!.uid,
        userEmail: user!.email || '',
        userName: user!.displayName || 'Customer',
        items: orderItems,
        totalAmount: orderTotal,
        subtotal: total,
        deliveryFee: deliveryFee,
        tipAmount: tipValue,
        status: 'pending' as const,
        deliveryAddress,
        phoneNumber,
        specialInstructions,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'completed' as const,
        notes: `Tip: ${tipAmount}% (R${tipValue.toFixed(2)})`,
        createdAt: new Date().toISOString()
      };

      console.log('Order data to save:', orderData);
      
      // Try to save to Firebase if available
      let orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // First, try to clear cart before saving order (so user sees empty cart immediately)
      console.log('Clearing cart...');
      if (clearCart && typeof clearCart === 'function') {
        clearCart();
        console.log('Cart cleared successfully');
      } else {
        console.warn('Clear cart function not available or not a function');
      }
      
      if (createOrder) {
        try {
          console.log('Attempting to save to Firebase...');
          const order = await createOrder(orderData);
          orderId = order.id;
          console.log('Order saved to Firebase:', orderId);
        } catch (firebaseError) {
          console.warn('Failed to save to Firebase:', firebaseError);
          // Save to local storage as fallback
          try {
            const orders = JSON.parse(localStorage.getItem('localOrders') || '[]');
            orders.push({ id: orderId, ...orderData });
            localStorage.setItem('localOrders', JSON.stringify(orders));
            console.log('Order saved locally:', orderId);
          } catch (e) {
            console.warn('Local storage not available:', e);
          }
        }
      } else {
        // Save to local storage
        try {
          console.log('Saving to local storage...');
          const orders = JSON.parse(localStorage.getItem('localOrders') || '[]');
          orders.push({ id: orderId, ...orderData });
          localStorage.setItem('localOrders', JSON.stringify(orders));
          console.log('Order saved locally:', orderId);
        } catch (e) {
          console.warn('Local storage not available:', e);
        }
      }
      
      // Show success message
      console.log('Showing success alert...');
      Alert.alert(
        'Order Placed Successfully! 🎉',
        `Order #${orderId.substring(0, 8)} has been placed.\n\nTotal: R${orderTotal.toFixed(2)}\n\nYou will receive a confirmation shortly.`,
        [
          {
            text: 'Track Order',
            onPress: () => {
              console.log('Navigating to order details:', orderId);
              router.push(`/order-details/${orderId}`);
            }
          },
          {
            text: 'Continue Shopping',
            onPress: () => {
              console.log('Navigating back to home');
              router.replace('/(tabs)');
            },
            style: 'default'
          }
        ]
      );

    } catch (error: any) {
      console.error('Error placing order:', error);
      Alert.alert(
        'Order Failed',
        error.message || 'Failed to place order. Please try again.'
      );
    } finally {
      setIsPlacingOrder(false);
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `R${amount.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Order Items ({items.length})
            {items.length === 0 && ' - Cart is empty'}
          </Text>
          
          {items.length > 0 ? (
            items.map((item: any, index: number) => (
              <View key={item.id || index} style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {item.name || item.title || `Item ${index + 1}`}
                  </Text>
                  <Text style={styles.itemDetails}>
                    {item.quantity || 1} × {formatCurrency(item.price || 0)}
                    {item.specialInstructions && ` (${item.specialInstructions})`}
                  </Text>
                  <Text style={styles.debugText}>
                    ID: {item.id || 'no-id'} | Type: {typeof item}
                  </Text>
                </View>
                <Text style={styles.itemTotal}>
                  {formatCurrency((item.price || 0) * (item.quantity || 1))}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyCart}>
              <FontAwesome name="shopping-cart" size={40} color="#666" />
              <Text style={styles.emptyCartText}>Your cart is empty</Text>
              <Text style={styles.debugHint}>
                Check console for cart context details
              </Text>
            </View>
          )}
        </View>

        {/* Delivery Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          
          <View style={styles.inputContainer}>
            <FontAwesome name="map-marker" size={20} color="#FFD700" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Delivery Address *"
              placeholderTextColor="#999"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              multiline
              numberOfLines={3}
              editable={!isPlacingOrder}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome name="phone" size={20} color="#FFD700" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number *"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              editable={!isPlacingOrder}
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
              editable={!isPlacingOrder}
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
                disabled={isPlacingOrder}
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
            disabled={isPlacingOrder}
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
            disabled={isPlacingOrder}
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
              <Text style={styles.summaryValue}>
                {items.length > 0 ? formatCurrency(total) : 'R0.00'}
                {items.length === 0 && ' (empty)'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>
                {total > 200 ? 'FREE' : formatCurrency(25)}
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

        {/* Debug info */}
        {__DEV__ && (
          <View style={styles.debugSection}>
            <Text style={styles.debugTitle}>Debug Info</Text>
            <Text style={styles.debugText}>Items in cart: {items.length}</Text>
            <Text style={styles.debugText}>Total: R{total}</Text>
            <Text style={styles.debugText}>User: {user ? user.email : 'Not logged in'}</Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.placeOrderButton, 
            (isPlacingOrder || loading || items.length === 0 || !user) && styles.placeOrderButtonDisabled
          ]} 
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder || loading || items.length === 0 || !user}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isPlacingOrder || loading ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator color="#1a1a1a" size="small" />
              <Text style={styles.placeOrderText}>Processing Order...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.placeOrderText}>
                {items.length === 0 ? 'Cart Empty' : !user ? 'Login Required' : 'Place Order'}
              </Text>
              {items.length > 0 && user && (
                <Text style={styles.orderTotal}>{formatCurrency(orderTotal)}</Text>
              )}
            </>
          )}
        </TouchableOpacity>
        
        {!user && items.length > 0 && (
          <Text style={styles.loginHint}>
            Please login to place an order
          </Text>
        )}
        
        {items.length === 0 && (
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => router.push('/(tabs)/menu')}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  backButton: {
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    borderWidth: 1,
    borderColor: '#333',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 14,
    color: '#999',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  emptyCartText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  debugHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputIcon: {
    marginTop: 12,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
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
    borderWidth: 1,
    borderColor: '#444',
    minWidth: 80,
  },
  tipButtonSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  tipText: {
    fontSize: 16,
    color: '#FFFFFF',
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
    borderWidth: 1,
    borderColor: '#444',
  },
  paymentCardSelected: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 15,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#999',
  },
  summaryCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#999',
  },
  summaryValue: {
    fontSize: 16,
    color: '#FFFFFF',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  debugSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFA000',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1000,
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
    fontStyle: 'italic',
  },
  continueShoppingButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  continueShoppingText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
});
