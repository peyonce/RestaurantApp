import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { CartItemsList } from '../components/checkout/CartItemsList';
import { DeliveryForm } from '../components/checkout/DeliveryForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { PaymentMethod } from '../components/checkout/PaymentMethod';
import { TipSelector } from '../components/checkout/TipSelector';
import { useAuth } from './contexts/AuthProvider';
import { useCart } from './contexts/CartProvider';
import { createOrder } from './services/database';

export default function CheckoutScreen() {
  // Hooks
  const { user } = useAuth();
  const { items, total, clearCart, loading: cartLoading } = useCart();
  
  // State
  const [placingOrder, setPlacingOrder] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    specialInstructions: '',
    tipAmount: 5,
    paymentMethod: 'cash' as 'cash' | 'card'
  });

  // Calculations
  const deliveryFee = total > 200 ? 0 : 25;
  const tipValue = (total * formData.tipAmount) / 100;
  const orderTotal = total + deliveryFee + tipValue;

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    if (!user) return router.push('/login');
    
    setPlacingOrder(true);
    try {
      await createOrderAndClearCart();
      showSuccessAlert();
    } catch (error: any) {
      Alert.alert('Order Failed', error.message || 'Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const validateForm = () => {
    if (!formData.address.trim()) {
      Alert.alert('Missing Address', 'Please enter delivery address');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Missing Phone', 'Please enter phone number');
      return false;
    }
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty');
      return false;
    }
    return true;
  };

  const createOrderAndClearCart = async () => {
    const orderData = {
      userId: user!.uid,
      userEmail: user!.email || '',
      userName: user!.displayName || 'Customer',
      items: items.map(item => ({
        ...item,
        id: item.id || `item_${Date.now()}`,
        menuItemId: item.menuItemId || item.id || '',
        imageUrl: item.imageUrl || item.image || '',
        specialInstructions: item.specialInstructions || ''
      })),
      total: orderTotal,
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      payment: formData.paymentMethod,
      status: 'pending',
      deliveryFee,
      tipAmount: tipValue,
      tipPercentage: formData.tipAmount,
      subtotal: total,
      totalAmount: orderTotal,
      phoneNumber: formData.phone.trim(),
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === 'cash' ? 'pending' : 'completed',
      specialInstructions: formData.specialInstructions.trim(),
      notes: `Tip: ${formData.tipAmount}%`
    };

    const order = await createOrder(orderData);
    await clearCart();
    return order;
  };

  const showSuccessAlert = () => {
    Alert.alert(
      'Order Placed Successfully! 🎉',
      `Your order has been placed.\n\nTotal: R${orderTotal.toFixed(2)}`,
      [
        { text: 'Continue Shopping', onPress: () => router.replace('/') },
        { text: 'Track Order', onPress: () => router.push('/orders') }
      ]
    );
  };

  // Update form fields
  const updateForm = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Loading state
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
      <Header title="Checkout" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cart Items */}
        <Section title={`Order Items (${items.length})`}>
          <CartItemsList items={items} />
        </Section>

        {items.length > 0 && (
          <>
            {/* Delivery Details */}
            <Section title="Delivery Details">
              <DeliveryForm 
                formData={formData} 
                updateForm={updateForm} 
                disabled={placingOrder} 
              />
            </Section>

            {/* Tip Selection */}
            <Section title="Add a Tip">
              <TipSelector 
                tipAmount={formData.tipAmount} 
                onTipChange={(tip) => updateForm('tipAmount', tip)} 
                disabled={placingOrder}
              />
            </Section>

            {/* Payment Method */}
            <Section title="Payment Method">
              <PaymentMethod 
                method={formData.paymentMethod} 
                onMethodChange={(method) => updateForm('paymentMethod', method)} 
                disabled={placingOrder}
              />
            </Section>

            {/* Order Summary */}
            <Section title="Order Summary">
              <OrderSummary 
                items={items}
                total={total}
                deliveryFee={deliveryFee}
                tipAmount={formData.tipAmount}
                tipValue={tipValue}
                orderTotal={orderTotal}
              />
            </Section>
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Place Order Button */}
      {items.length > 0 && (
        <PlaceOrderButton 
          user={user}
          placingOrder={placingOrder}
          orderTotal={orderTotal}
          onPress={handlePlaceOrder}
        />
      )}
    </View>
  );
}

// Mini Components
const Header: React.FC<{ title: string }> = ({ title }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()}>
      <Text style={styles.backButton}>←</Text>
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={{ width: 24 }} />
  </View>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const PlaceOrderButton: React.FC<{
  user: any;
  placingOrder: boolean;
  orderTotal: number;
  onPress: () => void;
}> = ({ user, placingOrder, orderTotal, onPress }) => (
  <View style={styles.footer}>
    <TouchableOpacity 
      style={[styles.placeOrderButton, (!user || placingOrder) && styles.placeOrderButtonDisabled]} 
      onPress={onPress}
      disabled={placingOrder || !user}
    >
      {placingOrder ? (
        <View style={styles.processingContainer}>
          <ActivityIndicator color="#1a1a1a" size="small" />
          <Text style={styles.placeOrderText}>Processing...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.placeOrderText}>
            {!user ? 'Login Required' : 'Place Order'}
          </Text>
          <Text style={styles.orderTotal}>R{orderTotal.toFixed(2)}</Text>
        </>
      )}
    </TouchableOpacity>
    {!user && <Text style={styles.loginHint}>Please login to place an order</Text>}
  </View>
);

// Styles
const styles = {
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' },
  loadingText: { color: '#fff', fontSize: 16, marginTop: 10 },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#2d2d2d' 
  },
  backButton: { fontSize: 24, color: '#FFFFFF' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 140, paddingHorizontal: 20 },
  section: { marginBottom: 25, marginTop: 15 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  bottomSpacer: { height: 20 },
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, backgroundColor: '#2d2d2d', borderTopWidth: 1, borderTopColor: '#444' 
  },
  placeOrderButton: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFD700', paddingHorizontal: 25, paddingVertical: 18, borderRadius: 12 
  },
  placeOrderButtonDisabled: { backgroundColor: '#666' },
  processingContainer: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    width: '100%', gap: 10 
  },
  placeOrderText: { color: '#1a1a1a', fontSize: 18, fontWeight: 'bold' },
  orderTotal: { color: '#1a1a1a', fontSize: 20, fontWeight: 'bold' },
  loginHint: { color: '#FFA000', fontSize: 12, textAlign: 'center', marginTop: 10 },
};