import { useAuth } from '@/contexts/AuthProvider';
import { useCart } from '@/contexts/CartProvider';
import { createOrder } from '@/services/database';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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

    console.log('=== STARTING ORDER PLACEMENT ===');
    console.log('User:', user?.uid);
    console.log('Items count:', items.length);
    console.log('Order total:', orderTotal);

    setPlacingOrder(true);

    try {
      console.log(' Preparing order data...');
      
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
        })),
        total: orderTotal,
        phone: phone.trim(),
        address: address.trim(),
        paymentMethod: paymentMethod,  
        status: 'pending' as const,  
        deliveryFee: deliveryFee,
        tipAmount: tipValue,
        subtotal: total,
        specialInstructions: specialInstructions.trim(),
         
      };

      console.log('Order data (matches Order interface):', JSON.stringify(orderData, null, 2));
      
      console.log(' Calling createOrder...');
      const order = await createOrder(orderData);
      
      console.log(' Order created successfully! ID:', order.id);
      
       
      console.log(' Clearing cart...');
      await clearCart();
      
      console.log(' Order placement complete!');
      
      Alert.alert(
        'Order Placed Successfully! ',
        `Order #${order.id.substring(0, 8)} has been placed.\n\nTotal: R${orderTotal.toFixed(2)}\n\nYou will receive a confirmation shortly.`,
        [
          {
            text: 'View Orders',
            onPress: () => {
              router.push('/orders');
            }
          },
          {
            text: 'Continue Shopping',
            onPress: () => {
              router.replace('/menu');
            },
            style: 'default'
          }
        ]
      );
    } catch (error: any) {
      console.error(' ERROR in handlePlaceOrder:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      Alert.alert(
        'Order Failed',
        error.message || 'Failed to place order. Please try again.'
      );
    } finally {
      console.log('=== ORDER PLACEMENT FINISHED ===');
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
       
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

       
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <FontAwesome name="file-text" size={20} color="#FFD700" /> Order Summary
        </Text>
        
        {items.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <View style={styles.orderItemInfo}>
              <Text style={styles.orderItemName}>{item.name}</Text>
              <Text style={styles.orderItemQuantity}>× {item.quantity}</Text>
            </View>
            <Text style={styles.orderItemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
          </View>
        ))}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>
            {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tip ({tipAmount}%)</Text>
          <View style={styles.tipButtons}>
            {[0, 5, 10, 15].map((percent) => (
              <TouchableOpacity
                key={percent}
                style={[
                  styles.tipButton,
                  tipAmount === percent && styles.tipButtonActive
                ]}
                onPress={() => setTipAmount(percent)}
              >
                <Text style={[
                  styles.tipButtonText,
                  tipAmount === percent && styles.tipButtonTextActive
                ]}>
                  {percent}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.summaryValue}>{formatCurrency(tipValue)}</Text>
        </View>

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(orderTotal)}</Text>
        </View>
      </View>

       
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <FontAwesome name="map-marker" size={20} color="#FFD700" /> Delivery Details
        </Text>
        
        <View style={styles.inputContainer}>
          <FontAwesome name="map-pin" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Delivery Address"
            placeholderTextColor="#999"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="phone" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="sticky-note" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Special Instructions (optional)"
            placeholderTextColor="#999"
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

       
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <FontAwesome name="credit-card" size={20} color="#FFD700" /> Payment Method
        </Text>
        
        <View style={styles.paymentMethods}>
          <TouchableOpacity
            style={[
              styles.paymentMethod,
              paymentMethod === 'cash' && styles.paymentMethodActive
            ]}
            onPress={() => setPaymentMethod('cash')}
          >
            <FontAwesome 
              name="money" 
              size={24} 
              color={paymentMethod === 'cash' ? '#FFD700' : '#999'} 
            />
            <Text style={[
              styles.paymentMethodText,
              paymentMethod === 'cash' && styles.paymentMethodTextActive
            ]}>
              Cash
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentMethod,
              paymentMethod === 'card' && styles.paymentMethodActive
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <FontAwesome 
              name="credit-card" 
              size={24} 
              color={paymentMethod === 'card' ? '#FFD700' : '#999'} 
            />
            <Text style={[
              styles.paymentMethodText,
              paymentMethod === 'card' && styles.paymentMethodTextActive
            ]}>
              Card
            </Text>
          </TouchableOpacity>
        </View>
      </View>

       
      <View style={styles.placeOrderSection}>
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            (placingOrder || !user) && styles.placeOrderButtonDisabled
          ]}
          onPress={handlePlaceOrder}
          disabled={placingOrder || !user}
        >
          {placingOrder ? (
            <ActivityIndicator color="#1a1a1a" size="small" />
          ) : (
            <>
              <FontAwesome name="check-circle" size={20} color="#1a1a1a" />
              <Text style={styles.placeOrderButtonText}>
                {!user ? 'Login to Place Order' : `Place Order - ${formatCurrency(orderTotal)}`}
              </Text>
            </>
          )}
        </TouchableOpacity>
        
        {!user && (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Login to Checkout</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
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
    color: '#FFD700',
    fontSize: 18,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  section: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  placeOrderSection: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 20,
    marginBottom: 40,
    marginTop: 10,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  orderItemQuantity: {
    color: '#999',
    fontSize: 14,
  },
  orderItemPrice: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 8,
  },
  tipButtons: {
    flexDirection: 'row',
    position: 'absolute',
    left: 100,
    right: 100,
    justifyContent: 'center',
    gap: 10,
  },
  tipButton: {
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#555',
    minWidth: 50,
    alignItems: 'center',
  },
  tipButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  tipButtonText: {
    color: '#ccc',
    fontSize: 14,
  },
  tipButtonTextActive: {
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  summaryLabel: {
    color: '#ccc',
    fontSize: 16,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#555',
    marginTop: 15,
    paddingTop: 15,
  },
  totalLabel: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#3a3a3a',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  inputIcon: {
    marginTop: 5,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 5,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  paymentMethod: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#3a3a3a',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentMethodActive: {
    borderColor: '#FFD700',
  },
  paymentMethodText: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  paymentMethodTextActive: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  placeOrderButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 10,
    marginBottom: 10,
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
  placeOrderButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 10,
  },
  loginButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
});
